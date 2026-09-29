import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useLocation } from 'react-router-dom';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';
import EventOrgLefSidebar from './EventOrgLefSidebar';
import Logo from '../assets/Logo.jpeg';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody
} from '../styles/MasterCSSClass';

const initialForm = {
  id: '',
  orgName: '',
  websiteUrl: '',
  address1: '',
  address2: '',
  country: '',
  pincode: '',
  state: '',
  city: '',
  contactMobile: '',
  contactEmail: '',
  verifiedEmail: false,
  mobileVerified: false,
  about: '',
  instagram: '',
  facebook: '',
  twitter: '',
  linkedin: '',
  profilePhoto: '',
  approvalStatus: 'pending'
};

const linkValue = (value) => {
  if (!value) return 'N/A';
  const href = value.startsWith('http') ? value : `https://${value}`;
  return <a className="text-blue-600 hover:underline break-all" href={href} target="_blank" rel="noreferrer">{value}</a>;
};

const Profile = () => {
  const routerLocation = useLocation(); // 1. Must be here at the top level of the component
  const [showPopup, setShowPopup] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [initialData, setInitialData] = useState(initialForm);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpType, setOtpType] = useState(''); // 'email' or 'mobile'
  const [enteredOtp, setEnteredOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);


  const [isEditingMobile, setIsEditingMobile] = useState(false);
const [isEditingEmail, setIsEditingEmail] = useState(false);

const loadProfile = async () => {
  const savedUser = JSON.parse(localStorage.getItem('orgUserData') || '{}');
  const mobile = savedUser.loginMobileNumber || savedUser.contactMobile;
  if (!mobile) return;

  const query = new URLSearchParams({ loginMobileNumber: mobile });
  const resData = await API.get(`/profile?${query.toString()}`);
  if (resData.success && resData.data) {
    const u = resData.data;
    
    // 1. Define loadedForm first
    const loadedForm = {
      id: u._id || u.id || '',
      orgName: u.orgName || '',
      websiteUrl: u.websiteUrl || '',
      address1: u.address1 || u.orgAddress || '',
      address2: u.address2 || '',
      pincode: u.pincode || '',
      country: u.country || 'India',
      state: u.state || '',
      city: u.city || '',
      contactMobile: u.contactMobile || u.loginMobileNumber || '',
      contactEmail: u.contactEmail || '',
      verifiedEmail: Boolean(u.verifiedEmail),
      mobileVerified: Boolean(u.mobileVerified),
      about: u.about || '',
      instagram: u.instagram || '',
      facebook: u.facebook || '',
      twitter: u.twitter || '',
      linkedin: u.linkedin || '',
      profilePhoto: u.profilePhoto || '',
      approvalStatus: u.approvalStatus || 'pending'
    };
    
    // 2. Pass loadedForm into both states
    setFormData(loadedForm);
    setInitialData(loadedForm);
    setIsEmailVerified(Boolean(u.verifiedEmail));
    setIsMobileVerified(Boolean(u.mobileVerified));
  }
};

 
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  // ⏱️ Add this useEffect to make the Resend timer count down every second
  useEffect(() => {
    let interval = null;
    if (isOtpModalOpen && !canResend && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen, canResend, resendTimer]);


useEffect(() => {
  // Always fetch the latest data from the backend database immediately when landing on this page
  loadProfile().catch((error) => console.error('Error fetching profile:', error));
}, [routerLocation]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      toast.error('PIN code must be exactly 6 digits.', { id: 'profile-toast' });
      return;
    }

    // Social Links Validation (Only validates if the user entered a link)
    if (formData.instagram && !formData.instagram.toLowerCase().includes('instagram.com')) {
      toast.error('Please enter a valid Instagram link containing instagram.com', { id: 'profile-toast' });
      return;
    }
    if (formData.facebook && !formData.facebook.toLowerCase().includes('facebook.com')) {
      toast.error('Please enter a valid Facebook link containing facebook.com', { id: 'profile-toast' });
      return;
    }
    if (formData.twitter && !formData.twitter.toLowerCase().includes('twitter.com') && !formData.twitter.toLowerCase().includes('x.com')) {
      toast.error('Please enter a valid X / Twitter link', { id: 'profile-toast' });
      return;
    }
    if (formData.linkedin && !formData.linkedin.toLowerCase().includes('linkedin.com')) {
      toast.error('Please enter a valid LinkedIn link containing linkedin.com', { id: 'profile-toast' });
      return;
    }

    try {
      const payload = {
        id: formData.id,
        loginMobileNumber: JSON.parse(localStorage.getItem('orgUserData') || '{}').loginMobileNumber || formData.contactMobile,
        orgName: formData.orgName,
        websiteUrl: formData.websiteUrl,
        address1: formData.address1,
        address2: formData.address2,
        pincode: formData.pincode,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        contactMobile: formData.contactMobile,
        contactEmail: formData.contactEmail,
        verifiedEmail: formData.verifiedEmail,
        mobileVerified: formData.mobileVerified,
        about: formData.about,
        instagram: formData.instagram,
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        profilePhoto: formData.profilePhoto
      };
    const resData = await API.put('/profile', payload);
if (resData.success) {
  if (resData.mobileChanged) {
    toast.success('Mobile number changed! Logging out...', { id: 'profile-toast' });
    localStorage.clear();
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
    return;
  }
  toast.success('Profile updated successfully!', { id: 'profile-toast' });
  setIsEditing(false);
  loadProfile();
}
    } catch (error) {
      toast.error(error.message || 'Server error while saving profile.', { id: 'profile-toast' });
    }
  };

  const processFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const photo = formData.profilePhoto || Logo;
  const isApproved = formData.approvalStatus === 'approved';
  const isPending = formData.approvalStatus === 'pending';

  return (
    <div className={dashLayoutWrapper}>
      <EventOrgHeader />
      <div className={dashBodyFlexContainer}>
        <EventOrgLefSidebar />
        <main className={dashMainContentArea}>
          <div className={`${dashScrollableBody} px-10 sm:px-12 lg:px-16 py-6 space-y-6`}>
            
            {/* TOGGLE: Show top header ONLY when NOT editing */}
            {!isEditing ? (
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="shrink-0 mx-auto md:mx-0">
                  <img src={photo} alt="Organization" className="w-24 h-24 rounded-full object-cover border border-slate-200" />
                </div>

                <div className="flex-1 w-full space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-slate-950">{formData.orgName || 'Organization Name'}</h1>
                        <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isApproved ? 'bg-emerald-500' : 'bg-amber-400'}`} title={isApproved ? 'Live' : 'Pending'} />
                      </div>
                      <p className="text-[13px] text-slate-500 mt-1">
                        {formData.contactEmail || 'No email'} <span className="mx-2">•</span> {formData.contactMobile || 'No mobile'}
                      </p>
                    </div>
                    <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer">
                      Edit
                    </button>
                  </div>

                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8 text-[13px] py-2">
                  <div className="sm:col-span-3">
                    <p className="text-slate-400 font-normal">Website</p>
                    <p className="text-slate-700 mt-1">{linkValue(formData.websiteUrl)}</p>
                  </div>

                  {/* Combined Address Line separated by commas */}
                  <div className="sm:col-span-3">
                    <p className="text-slate-400 font-normal">Address</p>
                    <p className="text-slate-700 mt-1">
                      {[
                        formData.address1,
                        formData.address2,
                        formData.city,
                        formData.state,
                        formData.pincode
                      ].filter(Boolean).join(', ') || 'N/A'}
                    </p>
                  </div>

                  {/* <div>
                    <p className="text-slate-400 font-normal">Country</p>
                    <p className="text-slate-700 mt-1">{formData.country || 'N/A'}</p>
                  </div> */}

                 <div className="sm:col-span-3">
                      <p className="text-slate-400 font-normal">About</p>
                      <p className="text-slate-700 mt-1 break-words whitespace-pre-wrap">
                        {formData.about || 'N/A'}
                      </p>
                    </div>
                </div>
                  <div className="border-t border-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-[13px]">
                    {[
                      ['Instagram', linkValue(formData.instagram)],
                      ['Facebook', linkValue(formData.facebook)],
                      ['X / Twitter', linkValue(formData.twitter)],
                      ['LinkedIn', linkValue(formData.linkedin)]
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-slate-400">{label}</p>
                        <p className="mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* EDIT MODE: Top header hidden, showing form fields with right-aligned action buttons */
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Profile</h1>
                  <p className="text-[13px] text-slate-500 mt-0.5">Update your organization's public profile</p>
                </div>

                {/* Organization Logo Upload Section with Drag & Drop */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-slate-700">Organization/Individual Logo</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-32">
                    <label 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="w-24 h-24 rounded-full border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer overflow-hidden shrink-0 hover:bg-slate-100 transition"
                    >
                      {formData.profilePhoto ? (
                        <img src={formData.profilePhoto} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <span className="text-[10px] font-medium uppercase">UPLOAD LOGO</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-[11px] text-slate-500">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mr-2 align-middle"></span>
                      Min 200×200 px for square, PNG or JPG, max 5MB
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        ['orgName', 'Organization/Individual Name'],
                        ['websiteUrl', 'Website URL'],
                        ['address1', 'Address 1'],
                        ['address2', 'Address 2'],
                        ['city', 'City'],
                        ['state', 'State']
                      ].map(([name, label]) => {
                        const isDisabled = name === 'orgName' || name === 'state';
                        return (
                          <div key={name}>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">{label}</label>
                            <input 
                              name={name} 
                              value={formData[name]} 
                              onChange={handleChange} 
                              disabled={isDisabled}
                              className={`w-full border border-slate-200 rounded-lg px-3.5 py-2 text-[13px] focus:outline-none ${
                                isDisabled 
                                  ? 'bg-slate-100 text-slate-500 cursor-not-allowed select-none' 
                                  : 'bg-white text-slate-800 focus:ring-1 focus:ring-blue-500'
                              }`} 
                            />
                          </div>
                        );
                      })}

                      {/* PIN Code Field with 6-digit Restriction */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Pin Code</label>
                        <input 
                          type="text"
                          name="pincode"
                          maxLength="6"
                          placeholder="Enter 6-digit pin code"
                          value={formData.pincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setFormData(prev => ({ ...prev, pincode: val }));
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-[13px] bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                       <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Contact Mobile *</label>
                  {(formData.mobileVerified && !isEditingMobile) && (
                    <button
                      type="button"
                      onClick={() => setIsEditingMobile(true)}
                      className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-none"
                      title="Edit mobile"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                      </svg>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="contactMobile"
                  maxLength="10" // <-- Restricts typing to max 10 characters
                  placeholder="Enter 10-digit mobile number"
                  value={formData.contactMobile}
                  onChange={(e) => {
                    // Strips out non-digits and limits to 10 characters immediately
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData(prev => ({ ...prev, contactMobile: val }));
                    setIsMobileVerified(false);
                    setFormData(prev => ({ ...prev, mobileVerified: false }));
                  }}
                  disabled={(formData.mobileVerified && !isEditingMobile)}
                  className={`w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none ${
                    (formData.mobileVerified && !isEditingMobile) ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-800 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                <div className="flex justify-end mt-1">
                  {(formData.mobileVerified && !isEditingMobile) ? (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">✓ Verified</span>
                  ) : (
                    /* Show Verify button ONLY if it is exactly 10 digits AND different from original */
                    (/^\d{10}$/.test(formData.contactMobile) && formData.contactMobile !== initialData.contactMobile) && (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpType('mobile');
                          setIsVerifyingMobile(true);
                          setTimeout(() => {
                            setIsVerifyingMobile(false);
                            setIsOtpModalOpen(true);
                            setEnteredOtp('');
                          }, 500);
                        }}
                        disabled={isVerifyingMobile}
                        className="text-blue-600 hover:text-blue-700 text-xs font-bold cursor-pointer bg-transparent shrink-0"
                      >
                        {isVerifyingMobile ? 'Sending...' : 'Verify'}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Email Address *</label>
                  {(formData.verifiedEmail && !isEditingEmail) && (
                    <button
                      type="button"
                      onClick={() => setIsEditingEmail(true)}
                      className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-none"
                      title="Edit email"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                      </svg>
                    </button>
                  )}
                </div>
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="Enter email address"
                  value={formData.contactEmail}
                  onChange={(e) => {
                    handleChange(e);
                    setIsEmailVerified(false);
                    setFormData(prev => ({ ...prev, verifiedEmail: false }));
                  }}
                  disabled={(formData.verifiedEmail && !isEditingEmail)}
                  className={`w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none ${
                    (formData.verifiedEmail && !isEditingEmail) ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-800 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
              <div className="flex justify-end mt-1">
                  {(formData.verifiedEmail && !isEditingEmail) ? (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">✓ Verified</span>
                  ) : (
                    /* Only show Verify if it's a valid email AND it is different from their initial/saved email */
                    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail) && formData.contactEmail !== initialData.contactEmail) && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setOtpType('email');
                            setIsVerifyingEmail(true);
                            const resData = await API.post('/profile/send-email-otp', { email: formData.contactEmail });
                            if (resData.success) {
                              toast.success('OTP sent to your email!');
                              setIsOtpModalOpen(true);
                              setEnteredOtp('');
                              setResendTimer(60);
                              setCanResend(false);
                            }
                          } catch (error) {
                            toast.error(error.response?.data?.message || 'Failed to send OTP.');
                          } finally {
                            setIsVerifyingEmail(false);
                          }
                        }}
                        disabled={isVerifyingEmail}
                        className="text-blue-600 hover:text-blue-700 text-xs font-bold cursor-pointer bg-transparent shrink-0"
                      >
                        {isVerifyingEmail ? 'Sending...' : 'Verify'}
                      </button>
                    )
                  )}
                </div>
              </div>
             

                    </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1">
                    About
                  </label>
                  <textarea 
                    name="about" 
                    rows="4" 
                    maxLength={200} 
                    placeholder="Tell people about your organization..." 
                    value={formData.about} 
                    onChange={handleChange} 
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-[13px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" 
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-[13px] font-medium ${formData.about.length >= 200 ? 'text-red-500' : 'text-slate-400'}`}>
                      {formData.about.length}/200
                    </span>
                  </div>
                </div>
                
                <div >
                  <h3 className="text-[13px] font-bold text-slate-800 mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourpage' },
                      { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
                      { key: 'twitter', label: 'X / Twitter', placeholder: 'https://twitter.com/yourpage' },
                      { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany' }
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">{label}</label>
                        <input 
                          type="text" 
                          name={key}
                          placeholder={placeholder}
                          value={formData[key]}
                          onChange={handleChange}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-[13px] text-slate-800 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              <div className="flex items-center justify-between pt-2">
                {/* Left side: Help / Contact note with direct Gmail link */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-[13px] text-slate-600 flex items-center gap-1.5">
                  <span>If you need to make any changes or have queries, please contact us on</span>
                  <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=showishereofficial@gmail.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    showishereofficial@gmail.com
                  </a>
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="px-5 py-2 border border-slate-300 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={handleSaveProfile} 
                    disabled={!hasChanges}
                    className={`px-6 py-2 text-[13px] font-semibold rounded-lg transition shadow-sm ${
                      hasChanges 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                    }`}
                  >
                    Save Change
                  </button>
                </div>
              </div>
              </div>
            )}

          </div>
        </main>
      </div>
      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">
                  {otpType === 'email' ? 'Verify Email Address' : 'Verify Mobile Number'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {otpType === 'email' ? 'Enter the security code sent to your inbox' : 'Enter dummy code (Hint: 1234)'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer text-[13px] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-center">
                <p className="text-[13px] text-slate-600">
                  OTP sent to: <span className="font-bold text-blue-600 block truncate mt-0.5">
                    {otpType === 'email' ? formData.contactEmail : formData.contactMobile}
                  </span>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block text-center uppercase tracking-wider">
                  {otpType === 'email' ? 'Enter 6-Digit OTP' : 'Enter 4-Digit OTP (1234)'}
                </label>
                <input
                  type="text"
                  maxLength={otpType === 'email' ? "6" : "4"}
                  placeholder={otpType === 'email' ? "••••••" : "••••"}
                  value={enteredOtp}
                  onChange={async (e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setEnteredOtp(val);

                    // 1. If it's Email, verify against backend API when 6 digits are reached
                    if (otpType === 'email' && val.length === 6) {
                      try {
                        const resData = await API.post('/profile/verify-email-otp', {
                          email: formData.contactEmail,
                          otp: val
                        });

                      
                        if (resData.success) {
                          setIsEmailVerified(true);
                          setFormData(prev => ({ ...prev, verifiedEmail: true })); // <-- Add this line
                          setIsEditingEmail(false); // <-- Add this line to lock input back up
                          setIsOtpModalOpen(false);
                          toast.success('Email verified successfully!');
                        }
                      } catch (error) {
                        toast.error(error.response?.data?.message || 'Invalid or expired OTP.');
                        setEnteredOtp(''); // Clear input on wrong OTP
                      }
                    } 
                    // 2. If it's Mobile, validate against dummy code "1234" when 4 digits are reached
                    else if (otpType === 'mobile') {
                      if (val.length === 4) {
                      // Inside your mobile OTP check (val.length === 4)
                        if (val === '1234') {
                          setIsMobileVerified(true);
                          setFormData(prev => ({ ...prev, mobileVerified: true })); // <-- Add this line
                          setIsEditingMobile(false); // <-- Add this line to lock input back up
                          setIsOtpModalOpen(false);
                          toast.success('Mobile verified successfully!');
                        } else {
                          toast.error('Invalid OTP. Please enter 1234.');
                          setEnteredOtp(''); // Clear input on wrong OTP
                        }
                      }
                    }
                  }}
                  autoFocus
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-center tracking-[0.75em] font-extrabold text-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="text-right">
                {canResend ? (
                  <button
                    type="button"
                    onClick={() => {
                      setResendTimer(60);
                      setCanResend(false);
                    }}
                    className="text-[13px] font-bold text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-[13px] text-slate-400 font-medium">Resend in {resendTimer}s</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup && isPending && (
        <div className="fixed bottom-20 right-8 z-50 w-64 bg-[#FACC15] border border-yellow-400 rounded-lg shadow-xl p-4 flex items-start space-x-3">
          <div className="flex-1 text-[13px] text-slate-900 font-medium leading-relaxed">Your KYC Verification is in progress.</div>
          <button onClick={() => setShowPopup(false)} className="text-slate-900 hover:text-black font-bold text-[13px] shrink-0 leading-none cursor-pointer" type="button">x</button>
        </div>
      )}
      <EventOrgFooter />
    </div>
  );
};

export default Profile;
