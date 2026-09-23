import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link,useNavigate ,useLocation} from 'react-router-dom';
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
  dashSidebarHeaderTitle,
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
  imgModalImage,
  accountFormCardtext,
  dashBrandLogo,
  dashBrandTitle
} from '../styles/MasterCSSClass';

const EventOrgAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(1);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [signedTimestamp, setSignedTimestamp] = useState('');
  const [signedIpAddress, setSignedIpAddress] = useState(''); 
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [fileType, setFileType] = useState('');
  const [panCardBase64, setPanCardBase64] = useState(null);
const [showPopup, setShowPopup] = useState(true);
  const [isGstModalOpen, setIsGstModalOpen] = useState(false);
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
const [isPanVerified, setIsPanVerified] = useState(false);
 // Add this with your other state declarations (e.g., near activeStep, isDataSaved, etc.)
const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
const [isDataSaved, setIsDataSaved] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [isImageModalOpen, setIsImageModalOpen] = useState(false);
const [isEmailVerified, setIsEmailVerified] = useState(false);
const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
const [enteredOtp, setEnteredOtp] = useState('');
const [hasSigned, setHasSigned] = useState(false);
const [resendTimer, setResendTimer] = useState(60);
const [canResend, setCanResend] = useState(false);
const savedUser = JSON.parse(localStorage.getItem('orgUserData') || '{}');
const initialMobile = location.state?.prefilledMobile || 
                        JSON.parse(localStorage.getItem('orgUserData') || '{}').loginMobileNumber || 
                        JSON.parse(localStorage.getItem('orgUserData') || '{}').contactMobile || 
                        localStorage.getItem('loginMobileNumber') || '';
  // Form Data State initialized completely blank with default empty values
  const [formData, setFormData] = useState({
    orgId: '',       // <--- ADD THIS
    tenantKey: '',
    orgName: '',
    orgAddress: '',
    panLinkedAadhaar: '',
    panNumber: '',
    gstinNumber: '',
    gstDeclaration: false,
    state: '',
    contactFullName: '',
    contactEmail: '',
   contactMobile: initialMobile,
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
    setHasSigned(true);
  };


  useEffect(() => {
  let interval = null;
  if (isOtpModalOpen && resendTimer > 0) {
    interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
  } else if (resendTimer === 0) {
    setCanResend(true);
  }
  return () => clearInterval(interval);
}, [isOtpModalOpen, resendTimer]);

// Reset timer when opening the modal fresh
const handleOpenOtpModal = () => {
  setResendTimer(60);
  setCanResend(false);
  setIsOtpModalOpen(true);
};

  const handleAutoVerifyEmailOtp = async (otpCode) => {
    try {
      const response = await API.post('/org/verify-email-otp', {
        email: formData.contactEmail,
        otp: otpCode
      });

      const resData = response.data || response;

      if (resData && resData.success) {
        setIsEmailVerified(true);
        setIsOtpModalOpen(false);
        setEnteredOtp('');
        toast.success('Email verified successfully!', { id: 'otp-success-toast' });
      } else {
        toast.error(resData.message || 'Invalid OTP code. Please try again.', { id: 'otp-error-toast' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid OTP code. Please try again.';
      toast.error(errorMsg, { id: 'otp-error-toast' });
    }
  };


const handleSendEmailOtp = async () => {
    if (!formData.contactEmail.trim()) {
      toast.error('Please enter an email address first.', { id: 'email-error-toast' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      toast.error('Please enter a valid email address.', { id: 'email-error-toast' });
      return;
    }

    try {
      setIsVerifyingEmail(true);
      await API.post('/org/send-email-otp', { email: formData.contactEmail });
      setIsVerifyingEmail(false);
      setIsOtpModalOpen(true);
      toast.success('OTP sent to your email.', { id: 'email-success-toast' });
    } catch (error) {
      setIsVerifyingEmail(false);
      const errorMsg = error.response?.data?.message || 'Failed to send OTP email. Please try again.';
      toast.error(errorMsg, { id: 'email-error-toast' });
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.', { id: 'otp-error-toast' });
      return;
    }

    try {
      // 🚀 Calls your backend to check if the OTP matches the real email code
      const response = await API.post('/org/verify-email-otp', {
        email: formData.contactEmail,
        otp: enteredOtp
      });

      const resData = response.data || response;

      if (resData && resData.success) {
        setIsEmailVerified(true);
        setIsOtpModalOpen(false);
        setEnteredOtp('');
        toast.success('Email verified successfully!', { id: 'otp-success-toast' });
      } else {
        toast.error(resData.message || 'Invalid OTP code. Please try again.', { id: 'otp-error-toast' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid OTP code. Please try again.';
      toast.error(errorMsg, { id: 'otp-error-toast' });
    }
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

const handleSecondaryAction = async (e) => {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  // Normal draft save only
  const saved = await saveToDatabase();
  if (saved) {
    setIsDataSaved(true);
    toast.dismiss();
    toast.success('Details saved successfully as draft!', { id: 'save-draft' });
  }
};

const clearSignature = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setHasSigned(false);
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
    setSignedIpAddress(''); 
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
const handleBackStep = () => {
  setActiveStep((prev) => Math.max(prev - 1, 1));
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
      
      try {
        setIsVerifyingPan(true);
        setIsPanVerified(false); // Immediately reset verification state on new upload

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
          toast.success('PAN card verified & matched successfully!');
        } else {
          setIsPanVerified(false); // Explicitly set to false on failure
          toast.error(resData.message || 'PAN card details did not match your form input.');
        }
      } catch (error) {
        setIsVerifyingPan(false);
        setIsPanVerified(false); // Explicitly set to false on server/quota error
        const errorMsg = error.response?.data?.message || error.message;
        toast.error(errorMsg || 'Verification failed. Please try again.');
      }
    };
    reader.readAsDataURL(file);
  };
useEffect(() => {
  if (activeStep === 3) {
    setShowPopup(true);
  }
}, [activeStep]);

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

  // Helper to compress image before base64 conversion
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Compress to JPEG with 0.7 quality
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });
};

const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setIsDataSaved(false);
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
    if (!formData.panLinkedAadhaar) {
      toast.error('Please select whether your PAN is linked with Aadhaar.', { id: 'form-error-toast' });
      return false;
    }
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
    if (!isEmailVerified) {
      toast.error('Please verify your email address using OTP before proceeding.', { id: 'form-error-toast' });
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
      loginMobileNumber: formData.contactMobile, // Explicitly send mobile number
      verifiedEmail: isEmailVerified,            // Explicitly send email verification status
      panNumber: formData.panNumber,
      panCardDocument: panCardBase64,
      signatureImage: signatureImage,
      signinAgreement: false                     // Ensures this is a draft save, not final submit
    };

    const response = await API.post('/org/save-step', payload);
    setIsSaving(false);

    const resData = response.data || response;
    
    if (resData && resData.success === false) {
      toast.dismiss();
      toast.error(resData.message || 'Failed to save data.', { id: 'unique-save-toast' });
      return false;
    }

    setIsDataSaved(true);
    toast.dismiss();
    toast.success('Successfully Saved !', { id: 'unique-save-toast' });
    return true;

  } catch (error) {
    setIsSaving(false);
    toast.dismiss();
    
    // This safely extracts the exact error message from your backend response
    const errorMessage = error.response?.data?.message || error.message || 'Server Error while saving progress';
    
    toast.error(errorMessage, { id: 'unique-save-toast' });
    return false;
  }
};

useEffect(() => {
    const fetchDraftData = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('orgUserData') || '{}');
        const userId = savedUser._id || savedUser.id;
        const mobile = savedUser.loginMobileNumber || savedUser.contactMobile;
        
        if (!userId && !mobile) return;

        const query = userId ? `id=${userId}` : `loginMobileNumber=${mobile}`;
        const response = await API.get(`/org/get-profile?${query}`);
        const resData = response.data || response;

        if (resData.success && resData.data) {
          const u = resData.data;
          setFormData((prev) => ({
            ...prev,
            orgId: u.orgId || '',
            tenantKey: u.tenantKey || '',
            orgName: u.orgName || '',
            orgAddress: u.orgAddress || u.address1 || '',
            panLinkedAadhaar: u.panLinkedAadhaar || '',
            panNumber: u.panNumber || '',
            gstinNumber: u.gstinNumber || '',
            gstDeclaration: Boolean(u.gstDeclaration),
            state: u.state || '',
            contactFullName: u.contactFullName || '',
            contactEmail: u.contactEmail || '',
            contactMobile: u.loginMobileNumber || u.contactMobile || mobile || '',
            accountNumber: u.accountNumber || '',
            bankIfsc: u.bankIfsc || '',
            bankName: u.bankName || '',
            accountHolderName: u.accountHolderName || '',
            accountType: u.accountType || ''
          }));
          if (u.verifiedEmail) {
            setIsEmailVerified(true);
          }
        } else if (mobile) {
          setFormData((prev) => ({ ...prev, contactMobile: mobile }));
        }
      } catch (err) {
        console.error('Error fetching draft:', err);
      }
    };

    fetchDraftData();
  }, []);

const handleSaveDetails = async () => {
    if (activeStep === 1) {
      if (!validateStep1()) return;
    }
    const success = await saveToDatabase();
    if (success) {
      setIsDataSaved(true);
    }
  };
const handleProceed = async () => {
  if (activeStep === 1) {
    if (!validateStep1()) return;
  }

  if (activeStep === 2) {
    if (!uploadedDoc || !isPanVerified) {
      toast.error('Please ensure your PAN card is uploaded and verified successfully.', { id: 'pan-error' });
      return;
    }
  }

  // For steps 1 & 2, proceed normally
  if (activeStep < 3) {
    const saved = await saveToDatabase();
    if (!saved) return; 

    setActiveStep(activeStep + 1);
    setIsDataSaved(false);
    toast.dismiss();
    toast.success('Successfully Saved !', { id: 'proceed-success' });
  } 
  
  // For Step 3: FINAL SUBMIT ("Sign Agreement")
  else {
    if (!signatureImage) {
      toast.dismiss();
      toast.error('Please create and apply your signature before signing the agreement.', { id: 'sig-error' });
      return;
    }
    
    try {
      // 🚀 Final submit + triggers email on backend
      await API.post('/org/submit-agreement', { 
        email: formData.contactEmail,     
        userName: formData.contactFullName,   
        signature: signatureImage 
      });
      
      toast.dismiss();
      
      // 🌟 Opens the success popup
      setIsSuccessModalOpen(true);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to submit agreement. Please try again.', { id: 'submit-error' });
    }
  }
};

  return (
    <div className={mainContainer}>
        <header className={"bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs w-full h-14  flex items-center"}>
        <div className={accountHeaderInner}>
            <Link to="/" className="flex items-center space-x-2 cursor-pointer no-underline">
            <img src={Logo} alt="Logo" className={dashBrandLogo} />
            <span className={dashBrandTitle}>let's do it</span>
          </Link>
          

          <div className={accountStepsBar}>
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              return (
                <div
                  key={step.id}
                  // onClick={() => setActiveStep(step.id)}
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
        {activeStep == 1 && (
         <div className={`${accountTitleSection} py-4`}>
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
                <h3 className={dashSidebarHeaderTitle}>Organisation Details</h3>
                
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

                  <div>
                    <label className={accountLabelStyle}>
                      If you are an Individual PAN holder 
                    </label>
                    <div className={accountRadioGroup}>
                      {['Yes', 'No'].map((option) => (
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
                  </div>

                  <div>
                    <label className={accountLabelStyle}>Organisation/Individual PAN card number</label>
                    <input
                        type="text"
                        name="panNumber"
                        maxLength={10}
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
                <h3 className={dashSidebarHeaderTitle}>Contact Person Details</h3>
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
  {/* Label */}
  <div className="flex items-center justify-between">
    <label className={`${accountLabelStyle}`}>Email address</label>
  </div>

  {/* Input Field */}
  <input
    type="email"
    name="contactEmail"
    placeholder="Enter email address"
    value={formData.contactEmail}
    onChange={(e) => {
      handleInputChange(e);
      setIsEmailVerified(false);
    }}
    disabled={isEmailVerified}
    className={`${inputFieldStyle} ${isEmailVerified ? 'bg-slate-100 text-slate-500' : ''}`}
  />

  {/* Verification Button / Status moved to bottom right */}
  <div className="flex justify-end mt-1">
    {isEmailVerified ? (
      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
        ✓ Verified
      </span>
    ) : (
      <button
        type="button"
        onClick={handleSendEmailOtp}
        disabled={isVerifyingEmail}
        className="text-blue-600 hover:text-blue-700 text-xs font-bold cursor-pointer  bg-transparent shrink-0"
      >
        {isVerifyingEmail ? 'Sending...' : 'Verify'}
      </button>
    )}
  </div>
</div>
                 <div>
                    <label className={accountLabelStyle}>Mobile Number</label>
                    <input
                      type="text"
                      name="contactMobile"
                      value={formData.contactMobile}
                      disabled={true}
                      className={`${inputFieldStyle} bg-slate-100 text-slate-500 cursor-not-allowed`}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className={dashSidebarHeaderTitle}>Bank details</h3>
                <div className={accountThreeColGrid + " pt-4"}>
                  <div>
                    <label className={accountLabelStyle}>Account Holder Name</label>
                    <input
                      type="text"
                      name="accountHolderName"
                      placeholder="Enter account holder name"
                      value={formData.accountHolderName || ''}
                      onChange={handleInputChange}
                      className={inputFieldStyle}
                    />
                  </div>

                  {/* 3. Account Type Dropdown (NEW) */}
                  <div>
                    <label className={accountLabelStyle}>Type of Account</label>
                    <select
                      name="accountType"
                      value={formData.accountType || ''}
                      onChange={handleInputChange}
                      className={inputFieldStyle}
                    >
                      <option value="">Select account type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                 <div>
                    <label className={accountLabelStyle}>Account Number</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        name="accountNumber"
                        placeholder="Enter account number"
                        value={formData.accountNumber}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, accountNumber: numericValue });
                        }}
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
              <h3 className={dashSidebarHeaderTitle}>
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
            <div className="w-full flex flex-col items-center">
              <p className="text-[11px] font-bold text-blue-600 mb-1 text-center">Uploaded Preview (Click to view):</p>
              
              <div className="w-fit">
                <img 
                  src={docPreview} 
                  alt="Preview" 
                  onClick={() => setIsImageModalOpen(true)}
                  className="w-full max-h-36 rounded-xl object-contain shadow-xs cursor-pointer hover:opacity-95 transition" 
                />

                <div className="flex items-center justify-start pt-2.5">
                  {isVerifyingPan ? (
                    <div className="flex items-center space-x-2 text-slate-700 text-xs font-medium">
                      <svg className="w-4 h-4 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Verifying PAN card...</span>
                    </div>
                  ) : isPanVerified === true ? (
                    <div className="flex items-center space-x-1.5 text-emerald-600 text-xs font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-500 bg-white rounded-full">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                      </svg>
                      <span>Verified</span>
                    </div>
                  ) : isPanVerified === false ? (
                    <div className="flex items-center space-x-1.5 text-red-600 text-xs font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
                        <path fill="#EF4444" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 8.7070312 7.2929688 L 7.2929688 8.7070312 L 10.585938 12 L 7.2929688 15.292969 L 8.7070312 16.707031 L 12 13.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13.414062 12 L 16.707031 8.7070312 L 15.292969 7.2929688 L 12 10.585938 L 8.7070312 7.2929688 z"></path>
                      </svg>
                      <span>Not Verified</span>
                    </div>
                  ) : null}
                </div>
              </div>

            </div>
          ) : (
            <div className="w-full text-center">
              <div className="w-full mb-2">
                <img src={panSampleImg} alt="PAN Sample" className="w-full max-h-32 mx-auto object-contain rounded-md shadow-xs" />
              </div>
              <div className="inline-flex items-center gvalueap-1.5 px-3 py-1 bg-blue-100/70 text-blue-700 rounded-full text-xs font-semibold">
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
              <div >
                <SignAgrement 
                  signingDate={new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  organizerName={formData.orgName}
                  organizerLocation={`${formData.orgAddress}`}
                  organizerPan={formData.panNumber}
                  organizerGst={formData.gstinNumber}
                  isPanLinkedWithAadhaar={formData.panLinkedAadhaar || "NA"} 
                  bankAccountName={formData.accountHolderName || formData.orgName}
                  bankName={formData.bankName}                   // Must match state
                  bankAccountNumber={formData.accountNumber}
                  accountType={formData.accountType}             // <--- Added missing prop
                 accountHolderName={formData.accountHolderName}
                  bankIfsc={formData.bankIfsc}
                  signatoryEmail={formData.contactEmail}
                  contactMobile={formData.contactMobile}
                  contactPersonName={formData.contactFullName}
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
<footer className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-40 shadow-lg w-full h-14 flex items-center">
  <div className={`${accountFooterInner} flex items-center justify-between w-full px-6`}>
    
    {/* Far Left: Back Button (Only shows when step > 1) */}
    <div className="flex items-center w-28">
      {activeStep > 1 && (
        <button
          type="button"
          onClick={handleBackStep}
          className={accountSecondaryBtn}
        >
          Back
        </button>
      )}
    </div>

    {/* Middle: Both Save Details and Proceed Buttons Grouped Together */}
    <div className="flex items-center space-x-3 justify-center flex-1">
      
    {/* Save Details Button */}
<button
  type="button"
  onClick={handleSecondaryAction}
  disabled={
    (activeStep === 1 && !Object.values(formData).some(val => val && val.toString().trim() !== '')) || 
    (activeStep === 2 && (!uploadedDoc || !isPanVerified)) || // <--- Added PAN verification check
    (activeStep === 3 && !signatureImage) ||
    isDataSaved
  }
  className={`${accountSecondaryBtn} ${
    (
      (activeStep === 1 && !Object.values(formData).some(val => val && val.toString().trim() !== '')) || 
      (activeStep === 2 && (!uploadedDoc || !isPanVerified)) || 
      (activeStep === 3 && !signatureImage) ||
      isDataSaved
    ) 
      ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400' 
      : ''
  }`}
>
  {isDataSaved ? 'Saved' : 'Save details'}
</button>

{/* Proceed / Sign Agreement Button */}
<button
  type="button"
  onClick={handleProceed}
  disabled={
    (activeStep === 1 && (!isDataSaved || !Object.values(formData).some(val => val && val.toString().trim() !== ''))) ||
    (activeStep === 2 && (!isDataSaved || !uploadedDoc || !isPanVerified)) || // <--- Added PAN verification check
    (activeStep === 3 && !signatureImage)
  }
  className={`${accountPrimaryBtn} ${
    (
      (activeStep === 1 && (!isDataSaved || !Object.values(formData).some(val => val && val.toString().trim() !== ''))) ||
      (activeStep === 2 && (!isDataSaved || !uploadedDoc || !isPanVerified)) ||
      (activeStep === 3 && !signatureImage)
    ) 
      ? 'bg-slate-300 text-slate-500 border-slate-300 cursor-not-allowed shadow-none hover:bg-slate-300' 
      : ''
  }`}
>
  <span>{activeStep === 3 ? "Sign Agreement" : "Proceed"}</span>
</button>

    </div>

    {/* Right Side Spacer: Balances the left side so the middle buttons stay perfectly centered */}
    <div className="w-28" />

  </div>

  {activeStep === 3 && (
    <div className="absolute right-6 text-xs text-slate-500 font-normal">
      ShowIsHere © 2026 — All rights reserved
    </div>
  )}
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

{isOtpModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
    <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all scale-100">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Verify Email Address</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Enter the security code sent to your inbox</p>
        </div>
        <button 
          type="button"
          onClick={() => setIsOtpModalOpen(false)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer text-xs font-bold"
        >
          ✕
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5 space-y-4">
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-600">
            OTP sent to: <span className="font-bold text-blue-600 block truncate mt-0.5">{formData.contactEmail}</span>
          </p>
        </div>

        {/* OTP Input Field with Auto-Verify */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 block text-center uppercase tracking-wider">Enter 6-Digit OTP</label>
          <input
            type="text"
            maxLength="6"
            placeholder="••••••"
            value={enteredOtp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setEnteredOtp(val);

              // Auto-verify upon typing 6 digits
              if (val.length === 6) {
                handleAutoVerifyEmailOtp(val);
              }
            }}
            autoFocus
            className={`${inputFieldStyle} text-center tracking-[0.75em] font-extrabold text-lg py-2.5 rounded-xl border-slate-200 focus:border-blue-500`}
          />
        </div>

        {/* Dynamic Resend Timer / Button */}
        <div className="text-right">
          {canResend ? (
            <button
              type="button"
              onClick={() => {
                setResendTimer(60);
                setCanResend(false);
                handleSendEmailOtp(); // Triggers sending OTP again
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer bg-transparent border-none p-0"
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              Resend in {resendTimer}s
            </span>
          )}
        </div>
      </div>
      
    </div>
  </div>
)}

{isSuccessModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center space-y-4 shadow-2xl border border-slate-100">
      
      {/* Success Icon / Graphic */}
      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
        ✓
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-800">Agreement Submitted!</h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          Your agreement has been successfully submitted and your application is currently under process.
        </p>
      </div>

      {/* OK Button with Profile Redirect */}
     <button
  type="button"
  onClick={() => {
    setIsSuccessModalOpen(false);
    navigate('/profile', { 
      state: { 
        updatedOrgData: {
          ...formData,
          verifiedEmail: true,
          panCardDocument: panCardBase64,
          signatureImage: signatureImage
        } 
      } 
    });
  }}
  className="w-full py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
>
  OK
</button>

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
                  disabled={!hasSigned}
                  className={`${sigClearBtn} ${
                    !hasSigned ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 hover:bg-slate-100' : ''
                  }`}
                >
                  Clear
                </button>
               <button
                  type="button"
                  onClick={saveSignature}
                  disabled={!hasSigned}
                  className={`${sigSaveBtn} ${
                    !hasSigned ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-500 hover:bg-slate-300' : ''
                  }`}
                >
                  Save and Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
{/* Render popup only on Step 3 and if showPopup is true */}
{activeStep === 3 && showPopup && (
  <div className="fixed bottom-20 right-8 z-50 w-64 bg-[#FACC15] border border-yellow-400 rounded-lg shadow-xl p-4 flex items-start space-x-3">
    {/* SVG Icon */}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-slate-900 shrink-0 mt-0.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>

    {/* Message Content */}
    <div className="flex-1 text-xs text-slate-900 font-medium leading-relaxed">
      Go through the agreement and check all your details before submitting.
    </div>

    {/* Close Cross Button */}
    <button 
      onClick={() => setShowPopup(false)} 
      className="text-slate-900 hover:text-black font-bold text-sm shrink-0 leading-none"
      type="button"
    >
      ✕
    </button>
  </div>
)}
    </div>
  );
};

export default EventOrgAccount;