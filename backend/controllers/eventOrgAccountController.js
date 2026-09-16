const EventOrgAccount = require('../models/eventOrgAccountModel.js');
const jwt = require('jsonwebtoken');
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const nodemailer = require('nodemailer');
const { getOtpEmailTemplate,getKycUnderProcessEmailTemplate } = require('../utils/EmailTemplates');

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
    const { userPan, userName, panCardBase64, orgId, tenantKey } = req.body;

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

    // Helper function to retry API calls on 503 / high demand errors
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
          return generateContentWithRetry(retries - 1, delay * 2); // Double the wait time each retry
        }
        throw err;
      }
    };

    const response = await generateContentWithRetry();

    const textResponse = response.text.trim();
    const cleanedJson = textResponse.replace(/^```json\s*|\s*```$/g, '');
    const extractedData = JSON.parse(cleanedJson);

    // 1. Enforce Document Type Check
    if (extractedData.isPanCard === false) {
      return res.status(400).json({
        success: false,
        message: extractedData.reason || 'Invalid document type. Please upload an official PAN card.',
        panVerified: false
      });
    }

    // 2. Enforce Document Originality Check
    if (extractedData.isOriginal === false) {
      return res.status(400).json({
        success: false,
        message: extractedData.reason || 'Photocopies and black-and-white Xerox copies are not accepted. Please upload an original color image.',
        panVerified: false
      });
    }

    // 3. Accurate Match Verification Check
    const inputPan = userPan.trim().toUpperCase();
    const scannedPan = extractedData.pan ? extractedData.pan.trim().toUpperCase() : '';

    const inputName = userName.trim().toLowerCase();
    const scannedName = extractedData.name ? extractedData.name.trim().toLowerCase() : '';

    const isPanMatch = inputPan === scannedPan;
    const isNameMatch = scannedName.includes(inputName) || inputName.includes(scannedName);
    const isMatch = isPanMatch && isNameMatch;

    let query = {};
    if (orgId) query.orgId = orgId;
    else if (tenantKey) query.tenantKey = tenantKey;
    else query.panNumber = inputPan;

    const org = await EventOrgAccount.findOne(query);

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

const generateToken = (id, orgId) => {
  return jwt.sign({ id, orgId }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '7d'
  });
};

const generateNextOrgId = async () => {
  const lastOrg = await EventOrgAccount.findOne({}, {}, { sort: { createdAt: -1 } });
  if (!lastOrg || !lastOrg.orgId) {
    return 'ORG1';
  }
  const numericPart = parseInt(lastOrg.orgId.replace('ORG', ''), 10) || 0;
  return `ORG${numericPart + 1}`;
};

const generateTenantKey = async (orgName) => {
  const cleanName = (orgName || 'org').replace(/[^a-zA-Z]/g, '').toLowerCase();
  const prefix = cleanName.length >= 3 ? cleanName.substring(0, 3) : (cleanName + 'xyz').substring(0, 3);
  
  const count = await EventOrgAccount.countDocuments({ tenantKey: new RegExp(`^${prefix}`) });
  const suffix = String(count + 1).padStart(3, '0');
  return `${prefix}${suffix}`;
};

const registerOrgAccount = async (req, res) => {
  try {
    const {
      orgId,
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
      contactMobile,
      accountNumber,
      bankIfsc,
      bankName,
      panCardDocument,
      signatureImage,
      signinAgreement
    } = req.body;

    let existingOrg = null;
    
    if (orgId) {
      existingOrg = await EventOrgAccount.findOne({ orgId, signinAgreement: false });
    } else if (tenantKey) {
      existingOrg = await EventOrgAccount.findOne({ tenantKey, signinAgreement: false });
    } else if (panNumber) {
      existingOrg = await EventOrgAccount.findOne({ panNumber: panNumber.toUpperCase(), signinAgreement: false });
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
      if (contactMobile) existingOrg.contactMobile = contactMobile;
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

      const token = generateToken(existingOrg._id, existingOrg.orgId);

      return res.status(200).json({
        success: true,
        message: signinAgreement ? 'Agreement signed and final submission complete!' : 'Progress updated in database successfully!',
        token,
        data: {
          orgId: existingOrg.orgId,
          tenantKey: existingOrg.tenantKey,
          orgName: existingOrg.orgName,
          approvalStatus: existingOrg.approvalStatus,
          contactEmail: existingOrg.contactEmail,
          signinAgreement: existingOrg.signinAgreement
        }
      });
    }

    const newOrgId = await generateNextOrgId();
    const newTenantKey = await generateTenantKey(orgName);
    const isSigningFinal = signinAgreement === true || signinAgreement === 'true';

    const newOrg = await EventOrgAccount.create({
      orgId: newOrgId,
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
      contactMobile,
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

    const token = generateToken(newOrg._id, newOrg.orgId);

    return res.status(201).json({
      success: true,
      message: 'Organization account registered successfully!',
      token,
      data: {
        orgId: newOrg.orgId,
        tenantKey: newOrg.tenantKey,
        orgName: newOrg.orgName,
        approvalStatus: newOrg.approvalStatus,
        contactEmail: newOrg.contactEmail,
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
        contactMobile: 'Mobile number',
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
    const query = identifier.startsWith('ORG') ? { orgId: identifier } : { tenantKey: identifier };
    
    const org = await EventOrgAccount.findOne(query);
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
    const { orgId, tenantKey, panNumber, panLinkedAadhaar, contactEmail, loginMobileNumber,verifiedEmail,contactMobile, accountHolderName, accountType, accountNumber, signinAgreement, ...stepData } = req.body;

    // 🛡️ BULLETPROOF AUTO-RECOVERY LOOKUP:
    // Even if the frontend forgets the orgId, find the existing draft automatically 
    // by checking orgId, tenantKey, email, mobile, or PAN!
    let org = null;
    if (orgId) {
      org = await EventOrgAccount.findOne({ orgId });
    }
    if (!org && tenantKey) {
      org = await EventOrgAccount.findOne({ tenantKey });
    }
    if (!org && contactEmail) {
      org = await EventOrgAccount.findOne({ contactEmail });
    }
    if (!org && contactMobile) {
      org = await EventOrgAccount.findOne({ contactMobile });
    }
    if (!org && panNumber) {
      org = await EventOrgAccount.findOne({ panNumber: panNumber.toUpperCase() });
    }

    // 2. Conflict check across OTHER accounts (excluding our own found record's ID)
    const conditions = [];
    if (panNumber) conditions.push({ panNumber: panNumber.toUpperCase() });
    if (contactEmail) conditions.push({ contactEmail });
    if (contactMobile) conditions.push({ contactMobile });
    if (accountNumber) conditions.push({ accountNumber });

    if (conditions.length > 0) {
      const conflictQuery = { $or: conditions };
      if (org) {
        conflictQuery._id = { $ne: org._id }; // <--- Ignores our own record so we never block ourselves!
      }

      const existingConflict = await EventOrgAccount.findOne(conflictQuery);
      if (existingConflict) {
        let conflictMsg = 'Record already exists!';
        if (panNumber && existingConflict.panNumber === panNumber.toUpperCase()) conflictMsg = 'PAN number already exists in another account!';
        else if (contactEmail && existingConflict.contactEmail === contactEmail) conflictMsg = 'Email address already exists in another account!';
        else if (contactMobile && existingConflict.contactMobile === contactMobile) conflictMsg = 'Mobile number already exists in another account!';
        else if (accountNumber && existingConflict.accountNumber === accountNumber) conflictMsg = 'Bank account number already exists in another account!';

        return res.status(400).json({
          success: false,
          message: conflictMsg
        });
      }
    }

    // 3. Update or Create
    if (org) {
      if (org.signinAgreement === true) {
        return res.status(400).json({
          success: false,
          message: 'Account is already signed and locked. Changes are no longer allowed.'
        });
      }

      Object.assign(org, stepData, { contactEmail,loginMobileNumber, contactMobile, accountNumber, accountHolderName, accountType });
      if (loginMobileNumber !== undefined) org.loginMobileNumber = loginMobileNumber;
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
      const newOrgId = await generateNextOrgId();
      const newTenantKey = await generateTenantKey(stepData.orgName || 'org');
      const isSigningFinal = signinAgreement === true || signinAgreement === 'true';

      org = await EventOrgAccount.create({
        orgId: newOrgId,
        tenantKey: newTenantKey,
        panLinkedAadhaar,
        panNumber: panNumber ? panNumber.toUpperCase() : 'TEMP_PAN',
        contactEmail,
        contactMobile,
        loginMobileNumber: loginMobileNumber || contactMobile, // <--- Save mobile here
        verifiedEmail: verifiedEmail || false,
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
        orgId: org.orgId,
        tenantKey: org.tenantKey,
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
        contactMobile: 'Mobile number',
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

    // 🚀 SPEED FIX: Respond to frontend immediately, send email in background
    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully to your email!' 
    });

    // Send email asynchronously in the background so the UI doesn't hang
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

// 3. Function to handle verifying the user's entered OTP
const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = emailOtpStore[email];

    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // Clear record on successful match
    delete emailOtpStore[email];
    await EventOrgAccount.findOneAndUpdate(
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

    //  ADD THIS: Update database record by contactEmail
    const updatedOrg = await EventOrgAccount.findOneAndUpdate(
      { contactEmail: email },
      { 
        signatureImage: signature,
        signinAgreement: true,     // <--- CHANGES FLAG FROM FALSE TO TRUE
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

    // 🚀 SPEED FIX: Respond to frontend immediately, send email in background
    res.status(200).json({ 
      success: true, 
      message: 'Agreement submitted successfully!' 
    });

    // Send email asynchronously in the background so the UI doesn't hang
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

const getProfile = async (req, res) => {
  try {
    const orgId = req.query.id;
    if (!orgId) {
      return res.status(400).json({ success: false, message: 'Organization ID is required.' });
    }

    const orgAccount = await EventOrgAccount.findById(orgId);
    if (!orgAccount) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    return res.status(200).json({ success: true, data: orgAccount });
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Organization ID is required for update.' });
    }

    const updatedAccount = await EventOrgAccount.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: updatedAccount
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating profile.' });
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
  updateProfile,
  getProfile
};