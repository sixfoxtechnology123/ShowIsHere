import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Logo from '../assets/Logo.jpeg';
import GSTDeclaration from '../utils/GSTDeclaration';
import SignAgrement from '../utils/SignAgrement';
import panSampleImg from '../assets/panSample.png';
import API from '../utils/api';
import {
  mainContainer,
  inputFieldStyle,
  accountHeaderInner,
  accountLogoContainer,
  accountLogoImg,
  accountBrandText,
  accountStepsBar,
  accountStepItemActive,
  accountStepItemInactive,
  accountStepBadgeActive,
  accountStepBadgeInactive,
  accountUserIconBox,
  accountMainContainer,
  accountTitleSection,
  accountMainTitle,
  accountMainSubTitle,
  accountFormCard,
  accountSectionHeading,
  accountThreeColGrid,
  accountLabelStyle,
  accountRadioGroup,
  accountRadioLabel,
  accountCheckboxWrapper,
  accountNoticeBox,
  accountFooterInner,
  accountSecondaryBtn,
  accountPrimaryBtn,
  accountUploadStepWrapper,
  accountUploadGrid,
  accountUploadContainer,
  accountUploadIconBox,
  accountUploadBtn,
  accountUploadOrText,
  accountUploadSubtext,
  accountPreviewBox,
  accountPreviewList,
  accountPreviewListItem,
  accountPreviewBullet,
  accountPreviewFooter,
  accountSampleCardWrapper,
  accountSampleCardTitle,
  accountSampleCardBox,
  gstModalOverlay,
  gstModalCard,
  gstModalHeader,
  gstModalTitle,
  gstModalBody,
  gstModalFooter,
  gstModalProceedBtn,
  sigModalOverlay,
  sigModalCard,
  sigModalHeader,
  sigModalTitle,
  sigModalSubTitle,
  sigCanvasBox,
  sigNoticeBox,
  sigModalFooter,
  sigCancelBtn,
  sigClearBtn,
  sigSaveBtn,
  imgModalOverlay,
  imgModalCard,
  imgModalHeader,
  imgModalTitle,
  imgModalCloseBtn,
  imgModalBody,
  imgModalImage
} from '../styles/MasterCSSClass';

const EventOrgAccount = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [signedTimestamp, setSignedTimestamp] = useState('');
  const [signedIpAddress, setSignedIpAddress] = useState('192.168.1.1'); 
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [fileType, setFileType] = useState('');
  const [panCardBase64, setPanCardBase64] = useState(null);

  const [isGstModalOpen, setIsGstModalOpen] = useState(false);
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
const [isPanVerified, setIsPanVerified] = useState(false);
  // History states for keyboard Undo/Redo tracking
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
const [isDataSaved, setIsDataSaved] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  // Form Data State initialized completely blank with default empty values
  const [formData, setFormData] = useState({
    orgName: '',
    orgAddress: '',
    panLinkedAadhaar: '',
    panNumber: '',
    gstinNumber: '',
    gstDeclaration: false,
    state: '',
    contactFullName: '',
    contactEmail: '',
    contactMobile: '',
    accountNumber: '',
    bankIfsc: '',
    bankName: ''
  });

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const updatedHistory = history.slice(0, historyStep + 1);
    setHistory([...updatedHistory, dataUrl]);
    setHistoryStep(updatedHistory.length);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveToHistory();
  };

  const restoreCanvasState = (dataUrl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      restoreCanvasState(history[newStep]);
    } else if (historyStep === 0) {
      setHistoryStep(-1);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      restoreCanvasState(history[newStep]);
    }
  };

  const handleSecondaryAction = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      handleSaveDetails();
    }
  };
const clearSignature = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    
    // Generate current live date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    setSignedTimestamp(`${formattedDate}, ${formattedTime}`);
    setSignedIpAddress('192.168.1.1'); // Or fetch your live IP if you have a service for it
    setSignatureImage(dataUrl);
    setIsSigModalOpen(false);
    toast.success('Signature applied successfully!');
  };

  const handleOpenGstModal = () => {
    if (!formData.gstDeclaration) {
      setModalCheckboxChecked(false);
      setHasScrolledToBottom(false);
      setIsGstModalOpen(true);
    }
  };

  const handleModalScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      setHasScrolledToBottom(true);
    }
  };

  const handleConfirmGstModal = () => {
    setFormData({ ...formData, gstDeclaration: true });
    setIsGstModalOpen(false);
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size should not exceed 2 MB.');
        return;
      }
      setUploadedDoc(file.name);
      setFileType(file.type);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocPreview(reader.result);
        setPanCardBase64({
          fileName: file.name,
          fileType: file.type,
          base64Data: reader.result
        });
        toast.success('Document uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      processUploadedFile(file);
    }
  };

const processUploadedFile = async (file) => {
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    toast.error('Only JPG, JPEG, and PNG image formats are allowed.', { id: 'file-type-error' });
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    toast.error('File size should not exceed 2 MB.', { id: 'file-size-error' });
    return;
  }
  
  setUploadedDoc(file.name);
  setFileType(file.type);
  
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Result = reader.result;
    setDocPreview(base64Result);
    setPanCardBase64({
      fileName: file.name,
      fileType: file.type,
      base64Data: base64Result
    });
    
    // Automatically trigger backend verification right after upload
    try {
      setIsVerifyingPan(true);
      toast.loading('Verifying PAN card with AI...', { id: 'pan-verify-toast' });

      const response = await API.post('/org/verify-pan', {
        orgId: formData.orgId,
        tenantKey: formData.tenantKey,
        userPan: formData.panNumber,
        userName: formData.orgName,
        panCardBase64: base64Result
      });

      setIsVerifyingPan(false);
      const resData = response.data || response;

    if (resData && resData.success) {
        setIsPanVerified(true);
        toast.success('PAN card verified & matched successfully!', { id: 'pan-verify-toast' });
      } else {
        setIsPanVerified(false);
        toast.error(resData.message || 'PAN card details did not match your form input.', { id: 'pan-verify-toast' });
      }
    } catch (error) {
      setIsVerifyingPan(false);
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg || 'Verification failed. Please upload a clearer image.', { id: 'pan-verify-toast' });
    }
  };
  reader.readAsDataURL(file);
};

  useEffect(() => {
    if (isGstModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isGstModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
const validateStep1 = () => {
    if (!formData.orgName.trim()) {
      toast.error('Please enter the Organisation or Individual Name.', { id: 'form-error-toast' });
      return false;
    }
    if (!formData.orgAddress.trim()) {
      toast.error('Please enter the Organisation or Individual Address.', { id: 'form-error-toast' });
      return false;
    }
    // if (!formData.panLinkedAadhaar) {
    //   toast.error('Please select whether your PAN is linked with Aadhaar.', { id: 'form-error-toast' });
    //   return false;
    // }
    if (!formData.panNumber.trim()) {
      toast.error('Please enter the PAN card number.', { id: 'form-error-toast' });
      return false;
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber.toUpperCase())) {
      toast.error('Please enter a valid PAN number format (e.g. ABCDE1234F).', { id: 'form-error-toast' });
      return false;
    }
    if (!formData.gstDeclaration) {
      toast.error('Please accept the GST Declaration undertaking.', { id: 'form-error-toast' });
      return false;
    }
    if (!formData.state.trim()) {
      toast.error('Please select or enter your State.', { id: 'form-error-toast' });
      return false;
    }
    if (!formData.contactFullName.trim()) {
      toast.error('Please enter the Contact Person Full Name.', { id: 'form-error-toast' });
      return false;
    }
    if (!formData.contactEmail.trim()) {
      toast.error('Please enter an email address.', { id: 'form-error-toast' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      toast.error('Please enter a valid email address.', { id: 'form-error-toast' });
      return false;
    }
    if (!formData.contactMobile.trim()) {
      toast.error('Please enter a mobile number.', { id: 'form-error-toast' });
      return false;
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.contactMobile)) {
      toast.error('Mobile number must be exactly 10 digits and numbers only.', { id: 'form-error-toast' });
      return false;
    }
    if (!formData.accountNumber.trim()) {
      toast.error('Please enter the Bank Account Number.', { id: 'form-error-toast' });
      return false;
    }
    if (!formData.bankIfsc.trim()) {
      toast.error('Please enter the Bank IFSC code.', { id: 'form-error-toast' });
      return false;
    }
    if (!formData.bankName.trim()) {
      toast.error('Please enter the Bank Name.', { id: 'form-error-toast' });
      return false;
    }
    return true;
  };

  const steps = [
    { id: 1, label: 'Create profile' },
    { id: 2, label: 'Upload document' },
    { id: 3, label: 'Sign Agreement' }
  ];

const saveToDatabase = async () => {
    if (isSaving) return false;
    setIsSaving(true);
    
    try {
      const payload = {
        ...formData,
        panNumber: formData.panNumber,
        panCardDocument: panCardBase64,
        signatureImage: signatureImage,
        signinAgreement: activeStep === 3
      };

      const response = await API.post('/org/save-step', payload);
      setIsSaving(false);

      // Check if response indicates failure (supports both direct response and axios response.data)
      const resData = response.data || response;
      if (resData && resData.success === false) {
        toast.dismiss();
        toast.error(resData.message || 'Failed to save data.', { id: 'unique-save-toast' });
        return false;
      }

      setIsDataSaved(true);
      
      if (activeStep === 3) {
        setFormData({
          orgName: '',
          orgAddress: '',
          panLinkedAadhaar: '',
          panNumber: '',
          gstinNumber: '',
          gstDeclaration: false,
          state: '',
          contactFullName: '',
          contactEmail: '',
          contactMobile: '',
          accountNumber: '',
          bankIfsc: '',
          bankName: ''
        });
        setUploadedDoc(null);
        setDocPreview(null);
        setPanCardBase64(null);
        setSignatureImage(null);
        setSignedTimestamp('');
        setIsDataSaved(false);
        setActiveStep(1);
      }

      toast.dismiss();
      toast.success(activeStep === 3 ? 'Agreement signed successfully! Form reset.' : 'Successfully Saved !', { id: 'unique-save-toast' });
      return true;

    } catch (error) {
      setIsSaving(false);
      console.error('Submission Error:', error);
      
      // Extract the backend error message properly from Axios error response
      const serverMsg = error.response?.data?.message || error.message;
      
      toast.dismiss();
      toast.error(serverMsg || 'Server Error while saving progress', { id: 'unique-save-toast' });
      return false;
    }
  };

const handleSaveDetails = async () => {
    if (activeStep === 1) {
      if (!validateStep1()) return;
    }
    await saveToDatabase();
  };

// Clicking "Proceed" / "Sign Agreement" saves to MongoDB and advances step
  const handleProceed = async () => {
    if (activeStep === 1) {
      if (!validateStep1()) return;
    }

    if (activeStep === 2) {
      if (!uploadedDoc) {
        toast.error('Please upload your PAN card document.', { id: 'pan-error' });
        return;
      }
      if (!isPanVerified) {
        toast.error('Please wait for PAN verification to complete successfully before proceeding.', { id: 'pan-error' });
        return;
      }
    }

    const saved = await saveToDatabase();
    if (!saved) return; 

    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
      toast.dismiss();
      toast.success('Successfully Saved !', { id: 'proceed-success' });
    } else {
      if (!signatureImage) {
        toast.dismiss();
        toast.error('Please create and apply your signature before signing the agreement.', { id: 'sig-error' });
        return;
      }
      toast.dismiss();
      toast.success('Registration completed and agreement signed successfully!', { id: 'complete-success' });
    }
  };

  return (
    <div className={mainContainer}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs w-full">
        <div className={accountHeaderInner}>
          <div className={accountLogoContainer}>
            <img src={Logo} alt="Logo" className={accountLogoImg} />
            <span className={accountBrandText}>let's do it</span>
          </div>

          <div className={accountStepsBar}>
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={isActive ? accountStepItemActive : accountStepItemInactive}
                >
                  <span className={isActive ? accountStepBadgeActive : accountStepBadgeInactive}>
                    {isCompleted ? '✓' : `0${step.id}`}
                  </span>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>

          <div className={accountUserIconBox}>
            <span>👤</span>
          </div>
        </div>
      </header>

      <main className={accountMainContainer}>
        {activeStep !== 3 && (
          <div className={accountTitleSection}>
            <h1 className={accountMainTitle}>Account Setup</h1>
            <p className={accountMainSubTitle}>
              Please fill in the below details so that we can setup an account for your organisation in our system and give you access to the Do-It-Yourself portal for listing your event.
            </p>
          </div>
        )}

        <div className={accountFormCard}>
          {activeStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className={accountSectionHeading}>Organisation Details</h3>
                
                <div className="space-y-5  pt-2">
                  <div>
                    <label className={accountLabelStyle}>Organisation/Individual Name</label>
                    <input
                      type="text"
                      name="orgName"
                      placeholder="Enter organisation or individual name"
                      value={formData.orgName}
                      onChange={handleInputChange}
                      className={inputFieldStyle}
                    />
                  </div>

                  <div>
                    <label className={accountLabelStyle}>Organisation/Individual Address</label>
                    <textarea
                      name="orgAddress"
                      rows="2"
                      placeholder="Enter address"
                      value={formData.orgAddress}
                      onChange={handleInputChange}
                      className={inputFieldStyle + " resize-none"}
                    />
                  </div>
{/* 
                  <div>
                    <label className={accountLabelStyle}>
                      If you are an Individual PAN holder, please specify whether your PAN is linked with Aadhaar?
                    </label>
                    <div className={accountRadioGroup}>
                      {['Yes', 'No', 'NA'].map((option) => (
                        <label key={option} className={accountRadioLabel}>
                          <input
                            type="radio"
                            name="panLinkedAadhaar"
                            value={option}
                            checked={formData.panLinkedAadhaar === option}
                            onChange={handleInputChange}
                            className="text-blue-600  focus:ring-blue-500"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div> */}

                  <div>
                    <label className={accountLabelStyle}>Organisation/Individual PAN card number</label>
                    <input
                        type="text"
                        name="panNumber"
                        placeholder="e.g. ABCDE1234F"
                        value={formData.panNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, panNumber: e.target.value.toUpperCase() });
                        }}
                        className={inputFieldStyle}
                      />
                    <p className="text-[11px] text-slate-400 mt-1">PAN will be used to retrieve GSTINs (if available).</p>
                  </div>

                  <div>
                    <label className={accountLabelStyle}>GST Declaration</label>
                    <p className="text-xs text-slate-500 mb-2">As no GSTs found for the PAN number provided, please accept the GST declaration undertaking.</p>
                    <label className={accountCheckboxWrapper}>
                      <input
                        type="checkbox"
                        name="gstDeclaration"
                        checked={formData.gstDeclaration}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleOpenGstModal();
                          } else {
                            setFormData({ ...formData, gstDeclaration: false });
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-700">
                        I have read and accept the{' '}
                        <span 
                          onClick={handleOpenGstModal}
                          className="text-blue-600 underline cursor-pointer font-bold"
                        >
                          GST Declaration undertaking
                        </span>.
                      </span>
                    </label>
                  </div>

                  <div className={accountNoticeBox}>
                    ** Please Note: If your business's annual revenue exceeds ₹20 lakhs, you are required to provide your GSTIN details.
                  </div>

                 <div className="relative max-w-xs" ref={dropdownRef}>
                    <label className={accountLabelStyle}>State</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="Select or search state..."
                        value={formData.state}
                        onChange={(e) => {
                          setFormData({ ...formData, state: e.target.value });
                          setIsStateOpen(true);
                        }}
                        onClick={() => setIsStateOpen(true)}
                        className={inputFieldStyle + " pr-12 cursor-pointer"}
                      />
                      <div className="absolute right-0 flex items-center h-full pr-3 pointer-events-none">
                        <div className="h-5 border-l border-slate-200 mr-3"></div>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {isStateOpen && (
                      <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                        <div
                          onClick={() => {
                            setFormData({ ...formData, state: '' });
                            setIsStateOpen(false);
                          }}
                          className="px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                        >
                          Select State
                        </div>
                        {(() => {
                          const filteredStates = [
                            "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
                          ].filter((st) => st.toLowerCase().includes((formData.state || '').toLowerCase()));

                          if (filteredStates.length === 0) {
                            return (
                              <div className="px-3 py-3 text-xs text-slate-400 text-center font-medium">
                                No state found
                              </div>
                            );
                          }

                          return filteredStates.map((st) => (
                            <div
                              key={st}
                              onClick={() => {
                                setFormData({ ...formData, state: st });
                                setIsStateOpen(false);
                              }}
                              className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition"
                            >
                              {st}
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className={accountSectionHeading}>Contact Person Details</h3>
                <div className={accountThreeColGrid + " pt-4"}>
                  <div>
                    <label className={accountLabelStyle}>Full Name</label>
                    <input
                      type="text"
                      name="contactFullName"
                      placeholder="Enter full name"
                      value={formData.contactFullName}
                      onChange={handleInputChange}
                      className={inputFieldStyle}
                    />
                  </div>
                  <div>
                    <label className={accountLabelStyle}>Email address</label>
                    <input
                      type="email"
                      name="contactEmail"
                      placeholder="Enter email address"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className={inputFieldStyle}
                    />
                  </div>
                  <div>
                    <label className={accountLabelStyle}>Mobile Number</label>
                    <input
                      type="text"
                      name="contactMobile"
                      maxLength="10"
                      placeholder="10-digit mobile number"
                      value={formData.contactMobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); // Allow numbers only
                        if (val.length <= 10) {
                          setFormData({ ...formData, contactMobile: val });
                        }
                      }}
                      className={inputFieldStyle}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className={accountSectionHeading}>Bank details</h3>
                <div className={accountThreeColGrid + " pt-4"}>
                  <div>
                    <label className={accountLabelStyle}>Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      placeholder="Enter account number"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className={inputFieldStyle}
                    />
                  </div>
                  <div>
                    <label className={accountLabelStyle}>Bank IFSC</label>
                    <input
                      type="text"
                      name="bankIfsc"
                      placeholder="Enter IFSC code"
                      value={formData.bankIfsc}
                      onChange={handleInputChange}
                      className={inputFieldStyle}
                    />
                  </div>
                  <div>
                    <label className={accountLabelStyle}>Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      placeholder="Enter bank name"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className={inputFieldStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

    {activeStep === 2 && (
            <div className={accountUploadStepWrapper}>
              <h3 className={accountSectionHeading}>
                Upload PAN card {formData.panNumber ? `(${formData.panNumber})` : ''}
              </h3>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div 
                  className={accountUploadContainer + " h-full min-h-[260px] flex flex-col justify-center"}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files[0];
                    if (file) processUploadedFile(file);
                  }}
                >
                  <div className={accountUploadIconBox}>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">
                    {uploadedDoc ? uploadedDoc : "Drag & drop your PAN card here"}
                  </h4>
                  <p className={accountUploadOrText}>or</p>
                  
                  <label className={accountUploadBtn}>
                    <span>Choose file</span>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) processUploadedFile(file);
                      }} 
                      className="hidden" 
                    />
                  </label>
                  <p className={accountUploadSubtext}>JPG or PNG only | Image size not more than 2 MB</p>
                </div>

                <div className={accountPreviewBox + " h-full min-h-[260px] flex flex-col justify-between"}>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-blue-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg> */}
                      Please make sure that:
                    </h4>
                    <ul className={accountPreviewList}>
                      <li className={accountPreviewListItem}>
                        <span className={accountPreviewBullet}></span>
                        <span>Upload a clear image in .jpg or .png format only.</span>
                      </li>
                      <li className={accountPreviewListItem}>
                        <span className={accountPreviewBullet}></span>
                        <span>Image size should not be more than 2 MB.</span>
                      </li>
                    </ul>
                  </div>

              <div className={accountPreviewFooter}>
                    {docPreview ? (
                      <div className="w-full text-center">
                        <p className="text-[11px] font-bold text-blue-600 mb-1">Uploaded Preview (Click to view):</p>
                        <img 
                          src={docPreview} 
                          alt="Preview" 
                          onClick={() => setIsImageModalOpen(true)}
                          className="w-full max-h-36 mx-auto rounded-xl object-contain shadow-xs cursor-pointer hover:opacity-95 transition" 
                        />
                      </div>
                    ) : (
                      <div className="w-full text-center">
                        <div className="w-full mb-2">
                          <img src={panSampleImg} alt="PAN Sample" className="w-full max-h-32 mx-auto object-contain rounded-md shadow-xs" />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/70 text-blue-700 rounded-full text-xs font-semibold">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                          </svg>
                          Example of PAN card
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

 {activeStep === 3 && (
            <div >
              <div className="bg-white py-1 px-14 max-h-full overflow-y-auto">
                <SignAgrement 
                  signingDate={new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  organizerName={formData.orgName}
                  organizerLocation={`${formData.orgAddress}`}
                  organizerPan={formData.panNumber}
                  organizerGst={formData.gstinNumber}
                  signatoryEmail={formData.contactEmail}
                  signedDateTime={signedTimestamp}
                  signedIp={signedIpAddress}
                  signatureImage={signatureImage}
                  onCreateSignature={() => setIsSigModalOpen(true)}
                  onDeleteSignature={() => {
                    setSignatureImage(null);
                    setSignedTimestamp('');
                    setSignedIpAddress('');
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>

<footer className="bg-white border-t border-slate-200 py-4 fixed bottom-0 left-0 right-0 z-40 shadow-lg w-full">
        <div className={accountFooterInner}>
          <button
            type="button"
            onClick={handleSecondaryAction}
            disabled={activeStep === 1 && isDataSaved}
            className={`${accountSecondaryBtn} ${(activeStep === 1 && isDataSaved) ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400' : ''}`}
          >
            {activeStep > 1 ? 'Back' : (isDataSaved ? 'Saved' : 'Save details')}
          </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={activeStep === 3 && !signatureImage}
          className={accountPrimaryBtn + (activeStep === 3 && !signatureImage ? ' bg-slate-300 text-slate-500 border-slate-300 cursor-not-allowed shadow-none hover:bg-slate-300' : '')}
        >
          <span>{activeStep === 3 ? "Sign Agreement" : "Proceed"}</span>
        </button>
        </div>
      </footer>

        {isImageModalOpen && docPreview && (
          <div 
            onClick={() => setIsImageModalOpen(false)}
            className={imgModalOverlay}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className={imgModalCard}
            >
              <div className={imgModalHeader}>
                <h3 className={imgModalTitle}>PAN Card Preview</h3>
                <button 
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className={imgModalCloseBtn}
                >
                  ✕
                </button>
              </div>
              <div className={imgModalBody}>
                <img 
                  src={docPreview} 
                  alt="Full Preview" 
                  className={imgModalImage} 
                />
              </div>
            </div>
          </div>
        )}
      {isGstModalOpen && (
        <div className={gstModalOverlay}>
          <div className={gstModalCard}>
            <div className={gstModalHeader}>
              <h3 className={gstModalTitle}>GST Declaration</h3>
              <div className={accountLogoContainer}>
                <img src={Logo} alt="Logo" className={accountLogoImg} />
                <span className={accountBrandText}>showishere</span>
              </div>
            </div>

            <div className={gstModalBody} onScroll={handleModalScroll}>
              <GSTDeclaration />
            </div>

            <div className={gstModalFooter}>
              <label className={`flex items-start gap-2.5 ${!hasScrolledToBottom ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  disabled={!hasScrolledToBottom}
                  checked={modalCheckboxChecked}
                  onChange={(e) => setModalCheckboxChecked(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 mt-0.5 w-4 h-4 cursor-pointer shrink-0 disabled:cursor-not-allowed"
                />
                <span className="text-xs font-medium text-slate-700 leading-snug">
                  {hasScrolledToBottom 
                    ? 'I confirm that I have read and understood the "GST Declaration" and accept the undertaking.' 
                    : 'Please scroll down to read the entire declaration to enable the checkbox.'}
                </span>
              </label>

              <button
                type="button"
                disabled={!modalCheckboxChecked}
                onClick={handleConfirmGstModal}
                className={gstModalProceedBtn}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {isSigModalOpen && (
        <div className={sigModalOverlay}>
          <div className={sigModalCard}>
            <div className={sigModalHeader}>
              <h3 className={sigModalTitle}>Create your signature</h3>
              <p className={sigModalSubTitle}>Your digital signature is a one-time setup and can be reused for signing future agreements.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Please draw your signature in the space below</label>
              <canvas
                ref={canvasRef}
                width={590}
                height={192}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className={sigCanvasBox}
              />
            </div>

            <div className={sigNoticeBox}>
              <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg></span>
              <span>All information provided will be used to create your digital signature on ShowIsHere and will be associated with your ShowIsHere account.</span>
            </div>

            <div className={sigModalFooter}>
              <button
                type="button"
                onClick={() => setIsSigModalOpen(false)}
                className={sigCancelBtn}
              >
                Cancel
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={clearSignature}
                  className={sigClearBtn}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={saveSignature}
                  className={sigSaveBtn}
                >
                  Save and Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventOrgAccount;