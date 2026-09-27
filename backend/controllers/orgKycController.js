const OrgKyc = require('../models/orgKycModel.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const nodemailer = require('nodemailer');
const { getOtpEmailTemplate, getKycUnderProcessEmailTemplate } = require('../utils/EmailTemplates');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Simple memory store for OTPs
const emailOtpStore = {};

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
};

const verifyPassword = (password, salt, hash) => {
  if (!password || !salt || !hash) return false;
  const candidate = hashPassword(password, salt).hash;
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
};

const verifyStoredPassword = async (password, org) => {
  if (!password || !org?.passwordHash) return false;
  if (org.passwordSalt) return verifyPassword(password, org.passwordSalt, org.passwordHash);
  if (org.passwordHash.startsWith('$2b$') || org.passwordHash.startsWith('$2a$')) {
    return bcrypt.compare(password, org.passwordHash);
  }
  return org.passwordHash === password;
};

const findOrgByIdentity = async ({ id, orgkycId, tenantKey, loginMobileNumber, contactEmail }) => {
  if (id) return OrgKyc.findById(id);
  if (orgkycId) return OrgKyc.findOne({ orgkycId });
  if (tenantKey) return OrgKyc.findOne({ tenantKey });
  if (loginMobileNumber) {
    const mobile = loginMobileNumber.trim();
    // Return ONLY the record belonging to this exact mobile number, or null if it doesn't exist
    return OrgKyc.findOne({ loginMobileNumber: mobile });
  }
  if (contactEmail) return OrgKyc.findOne({ contactEmail });
  return null;
};

const cleanUpdatePayload = (payload, blockedFields = []) => {
  const blocked = new Set(['_id', 'id', 'tenantKey', 'createdAt', 'updatedAt', 'passwordHash', 'passwordSalt', ...blockedFields]);
  return Object.keys(payload || {}).reduce((acc, key) => {
    if (!blocked.has(key) && payload[key] !== undefined) acc[key] = payload[key];
    return acc;
  }, {});
};

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || '';
};

let totalUploadRequests = 0;
const verifyPanDocument = async (req, res) => {
  try {
    totalUploadRequests++;
    console.log(`[Document Upload] Request count: ${totalUploadRequests}`);
    const { userPan, userName, panCardBase64, orgkycId, tenantKey } = req.body;

    if (!panCardBase64) {
      return res.status(400).json({ success: false, message: 'PAN card image data is missing.' });
    }

    if (!userPan || !userName) {
      return res.status(400).json({ success: false, message: 'User PAN and Name are required.' });
    }

    const base64Data = panCardBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };

    const generateContentWithRetry = async (retries = 3, delay = 2000) => {
      try {
        return await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [
            imagePart,
            `Analyze this identification document image strictly and return ONLY a valid JSON object with exact keys:
            - "isPanCard": boolean (true if it is an official Indian PAN card, false if it is an Aadhaar card, Voter ID, Driver's License, or any other document).
            - "isOriginal": boolean (true if it is a genuine original document image, false if it is a black-and-white Xerox copy, grayscale scan, or a photo of a printout).
            - "pan": string (extracted PAN number if present, otherwise empty string).
            - "name": string (extracted full name if present, otherwise empty string).
            - "reason": string (brief explanation if isPanCard or isOriginal is false, otherwise empty string).`
          ],
        });
      } catch (err) {
        if ((err.status === 503 || err.status === 429) && retries > 0) {
          console.warn(`[AI High Demand] Retrying request in ${delay}ms... (${retries} attempts left)`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return generateContentWithRetry(retries - 1, delay * 2);
        }
        throw err;
      }
    };

    const response = await generateContentWithRetry();
    const textResponse = response.text.trim();
    const cleanedJson = textResponse.replace(/^```json\s*|\s*```$/g, '');
    const extractedData = JSON.parse(cleanedJson);

    if (extractedData.isPanCard === false) {
      return res.status(400).json({
        success: false,
        message: extractedData.reason || 'Invalid document type. Please upload an official PAN card.',
        panVerified: false
      });
    }

    if (extractedData.isOriginal === false) {
      return res.status(400).json({
        success: false,
        message: extractedData.reason || 'Photocopies and black-and-white Xerox copies are not accepted. Please upload an original color image.',
        panVerified: false
      });
    }

    const inputPan = userPan.trim().toUpperCase();
    const scannedPan = extractedData.pan ? extractedData.pan.trim().toUpperCase() : '';
    const inputName = userName.trim().toLowerCase();
    const scannedName = extractedData.name ? extractedData.name.trim().toLowerCase() : '';

    const isPanMatch = inputPan === scannedPan;
    const isNameMatch = scannedName.includes(inputName) || inputName.includes(scannedName);
    const isMatch = isPanMatch && isNameMatch;

    let query = {};
    if (orgkycId) query.orgkycId = orgkycId;
    else if (tenantKey) query.tenantKey = tenantKey;
    else query.panNumber = inputPan;

    const org = await OrgKyc.findOne(query);

    if (org) {
      org.panVerified = isMatch;
      if (isMatch) {
        org.panCardDocument = panCardBase64;
      }
      await org.save();
    }

    if (isMatch) {
      return res.status(200).json({
        success: true,
        message: 'PAN card verified successfully!',
        panVerified: true
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Original PAN card uploaded, but details do not match form input.',
        panVerified: false,
        extracted: { pan: scannedPan, name: scannedName }
      });
    }

  } catch (error) {
    console.error('PAN Verification Error:', error);
    if (error.status === 429 || error.status === 503 || (error.message && (error.message.includes('Resource exhausted') || error.message.includes('high demand')))) {
      return res.status(503).json({
        success: false,
        message: 'AI verification service is temporarily experiencing high demand. Please try uploading again in a few moments.',
        panVerified: false
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error verifying PAN card image',
      error: error.message
    });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '7d'
  });
};

const generateNextOrgKycId = async () => {
  const records = await OrgKyc.find({ orgkycId: /^OK\d+$/ }, { orgkycId: 1 }).lean();
  const highest = records.reduce((max, record) => Math.max(max, Number(record.orgkycId.slice(2)) || 0), 0);
  return `OK${highest + 1}`;
};

const generateTenantKey = async (orgName) => {
  const cleanName = (orgName || 'org').replace(/[^a-zA-Z]/g, '').toLowerCase();
  const prefix = cleanName.length >= 3 ? cleanName.substring(0, 3) : (cleanName + 'xyz').substring(0, 3);
  
  const count = await OrgKyc.countDocuments({ tenantKey: new RegExp(`^${prefix}`) });
  const suffix = String(count + 1).padStart(3, '0');
  return `${prefix}${suffix}`;
};

const registerOrgAccount = async (req, res) => {
  try {
    const {
      tenantKey,
      orgName,
      orgAddress,
      panLinkedAadhaar,
      panNumber,
      gstinNumber,
      gstDeclaration,
      state,
      contactFullName,
      contactEmail,
      loginMobileNumber,
      accountNumber,
      bankIfsc,
      bankName,
      panCardDocument,
      signatureImage,
      signinAgreement
    } = req.body;

    let existingOrg = null;
    
    if (tenantKey) {
      existingOrg = await OrgKyc.findOne({ tenantKey, signinAgreement: false });
    } else if (panNumber) {
      existingOrg = await OrgKyc.findOne({ panNumber: panNumber.toUpperCase(), signinAgreement: false });
    } else if (loginMobileNumber) {
      existingOrg = await OrgKyc.findOne({ loginMobileNumber, signinAgreement: false });
    }

    if (existingOrg) {
      if (orgName) existingOrg.orgName = orgName;
      if (orgAddress !== undefined) existingOrg.orgAddress = orgAddress;
      if (panLinkedAadhaar) existingOrg.panLinkedAadhaar = panLinkedAadhaar;
      if (panNumber) existingOrg.panNumber = panNumber.toUpperCase();
      if (gstinNumber) existingOrg.gstinNumber = gstinNumber.toUpperCase();
      if (gstDeclaration !== undefined) existingOrg.gstDeclaration = gstDeclaration === 'true' || gstDeclaration === true;
      if (state) existingOrg.state = state;
      if (contactFullName) existingOrg.contactFullName = contactFullName;
      if (contactEmail) existingOrg.contactEmail = contactEmail;
      if (loginMobileNumber) existingOrg.loginMobileNumber = loginMobileNumber;
      if (accountNumber) existingOrg.accountNumber = accountNumber;
      if (bankIfsc) existingOrg.bankIfsc = bankIfsc.toUpperCase();
      if (bankName) existingOrg.bankName = bankName;
      if (panCardDocument) existingOrg.panCardDocument = panCardDocument;
      if (signatureImage) existingOrg.signatureImage = signatureImage;

      if (signinAgreement === true || signinAgreement === 'true') {
        existingOrg.signinAgreement = true;
        existingOrg.signingAt = new Date();
        existingOrg.signingIp = getClientIp(req);
      }

      await existingOrg.save();

      const token = generateToken(existingOrg._id);

      return res.status(200).json({
        success: true,
        message: signinAgreement ? 'Agreement signed and final submission complete!' : 'Progress updated in database successfully!',
        token,
        data: {
          orgkycId: existingOrg.orgkycId,
          tenantKey: existingOrg.tenantKey,
          orgName: existingOrg.orgName,
          approvalStatus: existingOrg.approvalStatus,
          contactEmail: existingOrg.contactEmail,
          loginMobileNumber: existingOrg.loginMobileNumber,
          signinAgreement: existingOrg.signinAgreement
        }
      });
    }

    const newTenantKey = await generateTenantKey(orgName);
    const isSigningFinal = signinAgreement === true || signinAgreement === 'true';

    const newOrg = await OrgKyc.create({
      orgkycId: await generateNextOrgKycId(),
      tenantKey: newTenantKey,
      orgName: orgName || 'Pending Name',
      orgAddress,
      panLinkedAadhaar,
      panNumber: panNumber ? panNumber.toUpperCase() : 'TEMP_PAN',
      gstinNumber: gstinNumber ? gstinNumber.toUpperCase() : null,
      gstDeclaration: gstDeclaration === 'true' || gstDeclaration === true,
      state,
      contactFullName,
      contactEmail: contactEmail || 'pending@domain.com',
      loginMobileNumber,
      accountNumber,
      bankIfsc: bankIfsc ? bankIfsc.toUpperCase() : '',
      bankName,
      panCardDocument: panCardDocument || null,
      approvalStatus: 'pending',
      signatureImage: signatureImage || null,
      signinAgreement: isSigningFinal,
      signingAt: isSigningFinal ? new Date() : null,
      signingIp: isSigningFinal ? getClientIp(req) : null
    });

    const token = generateToken(newOrg._id);

    return res.status(201).json({
      success: true,
      message: 'Organization account registered successfully!',
      token,
      data: {
        orgkycId: newOrg.orgkycId,
        tenantKey: newOrg.tenantKey,
        orgName: newOrg.orgName,
        approvalStatus: newOrg.approvalStatus,
        contactEmail: newOrg.contactEmail,
        loginMobileNumber: newOrg.loginMobileNumber,
        signinAgreement: newOrg.signinAgreement
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'Field';
      const formattedFieldNames = {
        panNumber: 'PAN number',
        contactEmail: 'Email address',
        loginMobileNumber: 'Mobile number',
        accountNumber: 'Bank account number'
      };
      const fieldName = formattedFieldNames[field] || field;
      return res.status(400).json({
        success: false,
        message: `${fieldName} already exists!`
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server Error during account creation',
      error: error.message
    });
  }
};

const getOrgAccount = async (req, res) => {
  try {
    const { identifier } = req.params;
    const query = identifier.startsWith('OK') ? { orgkycId: identifier } : { tenantKey: identifier };
    
    const org = await OrgKyc.findOne(query);
    if (!org) {
      return res.status(404).json({
        success: false,
        message: 'Organization account not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: org
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const saveOrgStep = async (req, res) => {
  try { 
    const { orgkycId, tenantKey, panNumber, panLinkedAadhaar, contactEmail, loginMobileNumber, mobileVerified,verifiedEmail, accountHolderName, accountType, accountNumber, signinAgreement, ...stepData } = req.body;

    let org = null;
    if (orgkycId) {
      org = await OrgKyc.findOne({ orgkycId });
    }
    if (!org && tenantKey) {
      org = await OrgKyc.findOne({ tenantKey });
    }
    if (!org && contactEmail) {
      org = await OrgKyc.findOne({ contactEmail });
    }
    if (!org && loginMobileNumber) {
      org = await OrgKyc.findOne({ loginMobileNumber });
    }
    if (!org && panNumber) {
      org = await OrgKyc.findOne({ panNumber: panNumber.toUpperCase() });
    }

    const conditions = [];
    if (panNumber) conditions.push({ panNumber: panNumber.toUpperCase() });
    if (contactEmail) conditions.push({ contactEmail });
    if (loginMobileNumber) conditions.push({ loginMobileNumber });
    if (accountNumber) conditions.push({ accountNumber });

    if (conditions.length > 0) {
      const conflictQuery = { $or: conditions };
      if (org) {
        conflictQuery._id = { $ne: org._id };
        
      }

      const existingConflict = await OrgKyc.findOne(conflictQuery);
      if (existingConflict) {
        let conflictMsg = 'Record already exists!';
        if (panNumber && existingConflict.panNumber === panNumber.toUpperCase()) conflictMsg = 'PAN number already exists in another account!';
        else if (contactEmail && existingConflict.contactEmail === contactEmail) conflictMsg = 'Email address already exists in another account!';
        else if (loginMobileNumber && existingConflict.loginMobileNumber === loginMobileNumber) conflictMsg = 'Mobile number already exists in another account!';
        else if (accountNumber && existingConflict.accountNumber === accountNumber) conflictMsg = 'Bank account number already exists in another account!';

        return res.status(400).json({
          success: false,
          message: conflictMsg
        });
      }
    }

    if (org) {
      Object.assign(org, stepData, { contactEmail, mobileVerified, loginMobileNumber, accountNumber, accountHolderName, accountType });
      if (loginMobileNumber !== undefined) org.loginMobileNumber = loginMobileNumber;
      if (mobileVerified !== undefined) org.mobileVerified = mobileVerified;
      if (panLinkedAadhaar !== undefined) org.panLinkedAadhaar = panLinkedAadhaar;
      if (accountHolderName !== undefined) org.accountHolderName = accountHolderName;
      if (accountType !== undefined) org.accountType = accountType;
      if (panNumber) org.panNumber = panNumber.toUpperCase();
      if (org.bankIfsc) org.bankIfsc = org.bankIfsc.toUpperCase();
      if (org.gstinNumber) org.gstinNumber = org.gstinNumber.toUpperCase();

      if (signinAgreement === true || signinAgreement === 'true') {
        org.signinAgreement = true;
        org.signingAt = new Date();
        org.signingIp = getClientIp(req);
      }
      
      await org.save();
    } else {
      const newTenantKey = await generateTenantKey(stepData.orgName || 'org');
      const isSigningFinal = signinAgreement === true || signinAgreement === 'true';

      org = await OrgKyc.create({
        orgkycId: await generateNextOrgKycId(),
        tenantKey: newTenantKey,
        panLinkedAadhaar,
        panNumber: panNumber ? panNumber.toUpperCase() : 'TEMP_PAN',
        contactEmail,
        loginMobileNumber,
        verifiedEmail: verifiedEmail || false,
        mobileVerified: mobileVerified || false,
        accountNumber,
        accountHolderName, 
        accountType,
        signinAgreement: isSigningFinal,
        signingAt: isSigningFinal ? new Date() : null,
        signingIp: isSigningFinal ? getClientIp(req) : null,
        ...stepData
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Progress saved to database successfully!',
      data: {
        _id: org._id,
        orgkycId: org.orgkycId,
        tenantKey: org.tenantKey,
        loginMobileNumber: org.loginMobileNumber,
        contactEmail: org.contactEmail,
        panNumber: org.panNumber,
        signinAgreement: org.signinAgreement
      }
    });

  } catch (error) {
    console.error('Save Step Error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'Field';
      const formattedFieldNames = {
        panNumber: 'PAN number',
        contactEmail: 'Email address',
        loginMobileNumber: 'Mobile number',
        accountNumber: 'Bank account number'
      };
      return res.status(400).json({
        success: false,
        message: `${formattedFieldNames[field] || field} already exists in another account!`
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server Error while saving progress',
      error: error.message
    });
  }
};

const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    emailOtpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    const template = getOtpEmailTemplate(otp);

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully to your email!' 
    });

    transporter.sendMail({
      from: `"ShowIsHere" <${process.env.SMTP_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    }).catch(err => {
      console.error('Background Email Sending Error:', err);
    });

  } catch (error) {
    console.error('Send Email OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email OTP.' });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = emailOtpStore[email];

    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    delete emailOtpStore[email];
    await OrgKyc.findOneAndUpdate(
      { contactEmail: email },
      { verifiedEmail: true }
    );
    return res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error while verifying OTP' });
  }
};

const submitAgreement = async (req, res) => {
  try {
    const { email, userName, signature } = req.body;
    
    if (!email || !signature) {
      return res.status(400).json({ success: false, message: 'Email and signature are required.' });
    }

    const updatedOrg = await OrgKyc.findOneAndUpdate(
      { contactEmail: email },
      { 
        signatureImage: signature,
        signinAgreement: true, 
        kycStatus: 'Under Process',
        signingAt: new Date(),
        signingIp: getClientIp(req),
        ...(userName && { contactFullName: userName })
      },
      { new: true }
    );

    if (!updatedOrg) {
      return res.status(404).json({ success: false, message: 'Organization account not found for this email.' });
    }

    const template = getKycUnderProcessEmailTemplate(userName || updatedOrg.contactFullName || 'User');

    res.status(200).json({ 
      success: true, 
      message: 'Agreement submitted successfully!' 
    });

    transporter.sendMail({
      from: `"ShowIsHere" <${process.env.SMTP_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    }).catch(err => {
      console.error('Background KYC Email Sending Error:', err);
    });

  } catch (error) {
    console.error('Submit Agreement Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit agreement.' });
  }
};

const getKycDetails = async (req, res) => {
  try {
    const orgAccount = await findOrgByIdentity(req.query);
    if (!orgAccount) {
      return res.status(404).json({ success: false, message: 'KYC record not found.' });
    }

    return res.status(200).json({ success: true, data: orgAccount });
  } catch (error) {
    console.error('Fetch KYC Error:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching KYC.' });
  }
};

const updateKycDetails = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Organization ID is required.' });
    }

    const account = await OrgKyc.findById(id);
    if (!account) return res.status(404).json({ success: false, message: 'Profile not found.' });

    // Normalize frontend keys to match backend database schema fields
    if (updateData.gstNumber && !updateData.gstinNumber) {
      updateData.gstinNumber = updateData.gstNumber;
    }

    const allowedData = cleanUpdatePayload(updateData, [
      'approvalStatus', 'rejectionReason', 'approvalHistory', 'rekyc', 'reKycFields',
      'reKycHistory', 'signinAgreement', 'signatureImage', 'signingAt', 'signingIp', 'orgkycId'
    ]);

    if (account.rekyc) {
      const groupFields = {
        accountHolderName: ['accountHolderName'],
        accountNumber: ['accountNumber'],
        accountType: ['accountType'],
        bankName: ['bankName'],
        bankIfsc: ['bankIfsc', 'ifscCode'],
        panNumber: ['panNumber'],
        gstinNumber: ['gstinNumber', 'gstNumber'],
        uploadPanDocuments: ['panCardDocument'],
        panCardDocument: ['panCardDocument']
      };
      
      const permitted = new Set((account.reKycFields || []).flatMap((field) => groupFields[field] || [field]));
      Object.keys(allowedData).forEach((field) => { 
        if (!permitted.has(field)) delete allowedData[field]; 
      });
    }

    allowedData.approvalStatus = 'pending';
    allowedData.rejectionReason = '';
    allowedData.rekyc = false;
    allowedData.reKycFields = [];

    const updatedAccount = await OrgKyc.findByIdAndUpdate(
      id,
      {
        $set: allowedData,
        $push: { approvalHistory: { status: 'pending', reason: 'KYC details updated by organizer' } }
      },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'KYC details updated and saved to database successfully!',
      data: updatedAccount
    });
  } catch (error) {
    console.error('Update KYC Error:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating KYC.' });
  }
};

const getPasswordStatus = async (req, res) => {
  try {
    const org = await findOrgByIdentity(req.query);
    if (!org) return res.status(404).json({ success: false, message: 'Account not found.' });
    return res.status(200).json({ success: true, hasPassword: Boolean(org.passwordHash), email: org.contactEmail });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while checking password.' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required.' });
    }

    let org = null;
    if (id) {
      org = await OrgKyc.findById(id);
    }
    
    if (!org && req.body.email) {
      org = await OrgKyc.findOne({ contactEmail: req.body.email });
    }

    if (!org) {
      return res.status(404).json({ success: false, message: 'Account not found. Please log in again.' });
    }

    if (org.passwordHash && oldPassword) {
      const isMatch = await verifyStoredPassword(oldPassword, org);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Old password is incorrect.' });
      }
    }

    const { salt, hash } = hashPassword(newPassword);

    // Use updateOne to bypass schema validation errors on unrelated old fields
    await OrgKyc.updateOne(
      { _id: org._id },
      {
        $set: {
          passwordSalt: salt,
          passwordHash: hash,
          passwordUpdatedAt: new Date()
        }
      }
    );

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Update Password Error:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating password.' });
  }
};

const sendPasswordResetOtp = async (req, res) => {
  try {
    const { id, email } = req.body;
    const org = await findOrgByIdentity({ id, contactEmail: email });
    if (!org || !org.contactEmail) return res.status(404).json({ success: false, message: 'Registered email not found.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    emailOtpStore[`password:${org.contactEmail}`] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
    const template = getOtpEmailTemplate(otp);

    res.status(200).json({ success: true, message: 'OTP sent to registered email.' });
    transporter.sendMail({
      from: `"ShowIsHere" <${process.env.SMTP_USER}>`,
      to: org.contactEmail,
      subject: template.subject,
      html: template.html,
    }).catch(err => console.error('Background Password OTP Email Error:', err));
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send password OTP.' });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { id, email, otp, newPassword } = req.body;
    const org = await findOrgByIdentity({ id, contactEmail: email });
    if (!org) return res.status(404).json({ success: false, message: 'Account not found.' });

    const key = `password:${org.contactEmail}`;
    const record = emailOtpStore[key];
    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    const { salt, hash } = hashPassword(newPassword);
    org.passwordSalt = salt;
    org.passwordHash = hash;
    org.passwordUpdatedAt = new Date();
    await org.save();
    delete emailOtpStore[key];
    return res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while resetting password.' });
  }
};

const listOrgAccounts = async (req, res) => {
  try {
    const accounts = await OrgKyc.find().sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while fetching accounts.' });
  }
};

const adminUpdateOrgAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = cleanUpdatePayload(req.body);
    const updated = await OrgKyc.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Account not found.' });
    return res.status(200).json({ success: true, message: 'Account updated successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while updating account.' });
  }
};

const updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus: requestedApprovalStatus, status, reason = '' } = req.body;
    const approvalStatus = requestedApprovalStatus || status;
    if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid approval status.' });
    }

    if (approvalStatus === 'rejected') {
      const deletedAccount = await OrgKyc.findByIdAndDelete(id);
      if (!deletedAccount) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }
      return res.status(200).json({ 
        success: true, 
        message: 'Account rejected and deleted successfully.', 
        deletedId: id 
      });
    }
    const updated = await OrgKyc.findByIdAndUpdate(
      id,
      {
        $set: {
          approvalStatus,
          rejectionReason: approvalStatus === 'rejected' ? reason : ''
        },
        $push: { approvalHistory: { status: approvalStatus, reason } }
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Account not found.' });
    return res.status(200).json({ success: true, message: 'Approval status updated.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while updating approval.' });
  }
};

const requestReKyc = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields, reason = '' } = req.body;
    const validFields = [
      'accountHolderName', 
      'accountNumber', 
      'accountType', 
      'bankName', 
      'bankIfsc', 
      'panNumber', 
      'gstinNumber', 
      'uploadPanDocuments'
    ];
    const selectedFields = [...new Set((Array.isArray(fields) ? fields : []).filter((field) => validFields.includes(field)))];
    if (!selectedFields.length) return res.status(400).json({ success: false, message: 'Select at least one Re-KYC field.' });
    const updated = await OrgKyc.findByIdAndUpdate(
      id,
      {
        $set: { rekyc: true, reKycFields: selectedFields, approvalStatus: 'pending', rejectionReason: '' },
        $push: { reKycHistory: { fields: selectedFields, reason, requestedAt: new Date(), requestedBy: 'admin' } }
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Account not found.' });
    return res.json({ success: true, message: 'Re-KYC requested.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to request Re-KYC.' });
  }
};



module.exports = {
  registerOrgAccount,
  getOrgAccount,
  saveOrgStep,
  verifyPanDocument,
  sendEmailOtp,
  verifyEmailOtp,
  submitAgreement,
  getKycDetails,
  updateKycDetails,
  getPasswordStatus,
  updatePassword,
  sendPasswordResetOtp,
  resetPasswordWithOtp,
  listOrgAccounts,
  adminUpdateOrgAccount,
  updateApprovalStatus,
  requestReKyc,

};