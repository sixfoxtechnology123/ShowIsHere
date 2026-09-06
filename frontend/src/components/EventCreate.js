import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Logo from '../assets/Logo.jpeg';
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
  gstModalCancelBtn,
  gstModalBrandRight,
  gstModalLogo
} from '../styles/MasterCSSClass';

const EventCreate = () => {
const [activeStep, setActiveStep] = useState(1);
const [isStateOpen, setIsStateOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const dropdownRef = useRef(null);
const [uploadedDoc, setUploadedDoc] = useState(null);
const [docPreview, setDocPreview] = useState(null);
const [fileType, setFileType] = useState('');
const [isGstModalOpen, setIsGstModalOpen] = useState(false);
const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

const handleOpenGstModal = () => {
    // Open modal only if the checkbox is not already checked
    if (!formData.gstDeclaration) {
      setModalCheckboxChecked(false);
      setHasScrolledToBottom(false); // Reset scroll status every time it opens
      setIsGstModalOpen(true);
    }
  };
const handleModalScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Check if scrolled within 5 pixels of the bottom
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
      setUploadedDoc(file.name);
      setDocPreview(URL.createObjectURL(file));
      setFileType(file.type); // Save file type (e.g., 'application/pdf' or 'image/jpeg')
      toast.success('Document uploaded successfully!');
    }
  };

  // Lock background scroll when GST modal is open
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

  // Form Data State initialized completely blank by default
  const [formData, setFormData] = useState({
    orgName: '',
    orgAddress: '',
    panLinkedAadhaar: '',
    panNumber: '',
    gstDeclaration: false,
    state: '',
    contactFullName: '',
    contactEmail: '',
    contactMobile: '',
    accountNumber: '',
    bankIfsc: '',
    bankName: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const steps = [
    { id: 1, label: 'Create profile' },
    { id: 2, label: 'Upload document' },
    { id: 3, label: 'Sign Agreement' }
  ];

  const handleSaveDetails = () => {
    toast.success('Account details saved successfully!');
  };

  const handleProceed = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      toast.success('Registration completed successfully!');
    }
  };

  return (
    <div className={mainContainer}>
      {/* Header aligned strictly to the same width container bounds */}
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

      {/* Main Account Setup Content Area */}
      <main className={accountMainContainer}>
        <div className={accountTitleSection}>
          <h1 className={accountMainTitle}>Account Setup</h1>
          <p className={accountMainSubTitle}>
            Please fill in the below details so that we can setup an account for your organisation in our system and give you access to the Do-It-Yourself portal for listing your event.
          </p>
        </div>

        <div className={accountFormCard}>
          {activeStep === 1 && (
            <div className="space-y-4">
              {/* 1. Organisation Details */}
              <div>
                <h3 className={accountSectionHeading}>Organisation Details</h3>
                
                <div className="space-y-4 pt-2">
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
                            className="text-blue-600 focus:ring-blue-500"
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
                      placeholder="e.g. ABCDE1234F"
                      value={formData.panNumber}
                      onChange={handleInputChange}
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
                <input
                  type="text"
                  placeholder="Select or search state..."
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                    setIsStateOpen(true);
                  }}
                  onClick={() => setIsStateOpen(true)}
                  className={inputFieldStyle}
                />

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
                        "Andaman and Nicobar Islands",
                        "Andhra Pradesh",
                        "Arunachal Pradesh",
                        "Assam",
                        "Bihar",
                        "Chandigarh",
                        "Chhattisgarh",
                        "Dadra and Nagar Haveli and Daman and Diu",
                        "Delhi",
                        "Goa",
                        "Gujarat",
                        "Haryana",
                        "Himachal Pradesh",
                        "Jammu and Kashmir",
                        "Jharkhand",
                        "Karnataka",
                        "Kerala",
                        "Ladakh",
                        "Lakshadweep",
                        "Madhya Pradesh",
                        "Maharashtra",
                        "Manipur",
                        "Meghalaya",
                        "Mizoram",
                        "Nagaland",
                        "Odisha",
                        "Puducherry",
                        "Punjab",
                        "Rajasthan",
                        "Sikkim",
                        "Tamil Nadu",
                        "Telangana",
                        "Tripura",
                        "Uttar Pradesh",
                        "Uttarakhand",
                        "West Bengal"
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

              {/* 2. Contact Person Details */}
              <div className="pt-4 border-t border-slate-100">
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
                      placeholder="Enter mobile number"
                      value={formData.contactMobile}
                      onChange={handleInputChange}
                      className={inputFieldStyle}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Bank Details */}
              <div className="pt-4 border-t border-slate-100">
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

    <div className={accountUploadGrid}>
      {/* Left Side: Upload Dropzone */}
      <div className={accountUploadContainer}>
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
            accept=".jpg,.jpeg,.png,.pdf" 
            onChange={handleDocumentUpload} 
            className="hidden" 
          />
        </label>
        <p className={accountUploadSubtext}>JPG, PNG or PDF | Image size not more than 2 MB</p>
      </div>

      {/* Right Side: Example/Preview Box */}
      <div className={accountPreviewBox}>
        <div>
          <h4 className="text-xs font-bold text-slate-800 mb-3">Please make sure that:</h4>
          <ul className={accountPreviewList}>
            <li className={accountPreviewListItem}>
              <span className={accountPreviewBullet}></span>
              <span>Upload a clear image in .jpg or .pdf format only.</span>
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
                        <p className="text-[11px] font-bold text-blue-600 mb-1">Uploaded Preview:</p>
                        
                        {fileType === 'application/pdf' ? (
                          /* PDF Document Card Preview */
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center space-x-2 mx-auto max-w-[220px]">
                            <span className="text-lg">📄</span>
                            <span className="text-xs font-bold text-slate-700 truncate">{uploadedDoc}</span>
                          </div>
                        ) : (
                          /* Image Preview for JPG/PNG */
                          <img src={docPreview} alt="Preview" className="max-h-28 mx-auto rounded-lg border border-slate-200 object-contain shadow-xs" />
                        )}
                      </div>
                    ) : (
                      <div className="w-full text-center">
                        <div className={accountSampleCardWrapper}>
                          <div className={accountSampleCardTitle}>Example of PAN card</div>
                          <div className={accountSampleCardBox}>
                            [ Sample Card ]
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
      </div>
    </div>
  </div>
)}

          {activeStep === 3 && (
            <div className="py-12 text-center space-y-4">
              <h3 className="text-xl font-bold text-slate-800">Sign Agreement</h3>
              <p className="text-xs text-slate-500">Review terms and digitally sign the agreement to complete your setup.</p>
            </div>
          )}
        </div>


        
      </main>

     {/* Footer bar with fixed positioning at the bottom */}
      <footer className="bg-white border-t border-slate-200 py-4 fixed bottom-0 left-0 right-0 z-40 shadow-lg w-full">
        <div className={accountFooterInner}>
          <button
            type="button"
            onClick={handleSaveDetails}
            className={accountSecondaryBtn}
          >
            Save details
          </button>

          <button
            type="button"
            onClick={handleProceed}
            className={accountPrimaryBtn}
          >
            <span>Proceed</span>
            <span>&rarr;</span>
          </button>
        </div>
      </footer>
{/* GST Declaration Modal Popup */}
      {isGstModalOpen && (
        <div className={gstModalOverlay}>
          <div className={gstModalCard}>
            {/* Header */}
            <div className={gstModalHeader}>
              <h3 className={gstModalTitle}>
                GST Declaration
              </h3>
              <div className="flex items-center space-x-2">
                <img src={Logo} alt="Logo" className={gstModalLogo} />
                <span className="text-xs font-extrabold text-slate-700 tracking-tight">let's do it</span>
              </div>
            </div>

            {/* Scrollable Text Content Box with Scroll Listener */}
            <div className={gstModalBody} onScroll={handleModalScroll}>
              <p>
                I/We, Organizer, do confirm and acknowledge that I/Am/We are a supplier providing services through an e-commerce platform as per Section 24(1X) of the Central Goods and Services Tax under the prevalent GST regime ("GST Laws") and confirm that I/We are not registered under the GST Act, since our annual turnover is below the threshold limit of Rs. 20 Lakhs (supplier supply only services).
              </p>
              <p>
                I/We confirm that any applicable taxes collected on the Tickets booked through Bigtree Entertainment Pvt. Ltd.'s platform i.e. www.bookmyshow.com and/or its mobile application and/or other sales channels is our liability and the same shall be duly discharged by us.
              </p>
              <p>
                I/We acknowledge that information furnished above are true to the best of my/our knowledge and that we shall be bound by the acts of duly constituted attorney. In case any of the above information is found to be incorrect at a later date, my membership with your platform shall stand cancelled and any payment or unprocessed bill shall be withheld by you on the basis of the statements.
              </p>
            </div>

            {/* Fixed Footer */}
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
    </div>
  );
};

export default EventCreate;