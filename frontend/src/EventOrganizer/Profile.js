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
  state: '',
  city: '',
  contactMobile: '',
  contactEmail: '',
  verifiedEmail: false,
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

  const loadProfile = async () => {
    // 2. Add this check at the very beginning of loadProfile
    if (routerLocation.state?.updatedOrgData) {
      const u = routerLocation.state.updatedOrgData;
      setFormData({
        id: u.id || u._id || '',
        orgName: u.orgName || '',
        websiteUrl: u.websiteUrl || '',
        address1: u.address1 || u.orgAddress || '',
        address2: u.address2 || '',
        country: u.country || 'India',
        state: u.state || '',
        city: u.city || '',
        contactMobile: u.contactMobile || u.loginMobileNumber || '',
        contactEmail: u.contactEmail || '',
        verifiedEmail: Boolean(u.verifiedEmail),
        about: u.about || '',
        instagram: u.instagram || '',
        facebook: u.facebook || '',
        twitter: u.twitter || '',
        linkedin: u.linkedin || '',
        profilePhoto: u.profilePhoto || '',
        approvalStatus: u.approvalStatus || 'pending'
      });
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem('orgUserData') || '{}');
    const userId = savedUser._id || savedUser.id;
    const mobile = savedUser.loginMobileNumber || savedUser.contactMobile;
    if (!userId && !mobile) return;

    const query = userId ? `id=${userId}` : `loginMobileNumber=${mobile}`;
    const resData = await API.get(`/org/get-profile?${query}`);
    if (resData.success && resData.data) {
      const u = resData.data;
      localStorage.setItem('orgUserData', JSON.stringify(u));
      setFormData({
        id: u._id || u.id || '',
        orgName: u.orgName || '',
        websiteUrl: u.websiteUrl || '',
        address1: u.address1 || u.orgAddress || '',
        address2: u.address2 || '',
        country: u.country || 'India',
        state: u.state || '',
        city: u.city || '',
        contactMobile: u.contactMobile || u.loginMobileNumber || '',
        contactEmail: u.contactEmail || '',
        verifiedEmail: Boolean(u.verifiedEmail),
        about: u.about || '',
        instagram: u.instagram || '',
        facebook: u.facebook || '',
        twitter: u.twitter || '',
        linkedin: u.linkedin || '',
        profilePhoto: u.profilePhoto || '',
        approvalStatus: u.approvalStatus || 'pending'
      });
    }
  };

  useEffect(() => {
    loadProfile().catch((error) => console.error('Error fetching profile:', error));
  }, [routerLocation]); // 3. Must depend on routerLocation here
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        id: formData.id,
        orgName: formData.orgName,
        websiteUrl: formData.websiteUrl,
        address1: formData.address1,
        address2: formData.address2,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        contactMobile: formData.contactMobile,
        about: formData.about,
        instagram: formData.instagram,
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        profilePhoto: formData.profilePhoto
      };
      const resData = await API.put('/org/update-profile', payload);
      if (resData.success) {
        toast.success('Profile updated successfully!', { id: 'profile-toast' });
        localStorage.setItem('orgUserData', JSON.stringify(resData.data));
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
                      <p className="text-sm text-slate-500 mt-1">
                        {formData.contactEmail || 'No email'} <span className="mx-2">•</span> {formData.contactMobile || 'No mobile'}
                      </p>
                    </div>
                    <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer">
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8 text-sm py-2">
                    <div className="sm:col-span-3">
                      <p className="text-slate-400 font-normal">Website</p>
                      <p className="text-slate-700 mt-1">{linkValue(formData.websiteUrl)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-normal">Country</p>
                      <p className="text-slate-700 mt-1">{formData.country || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-normal">State</p>
                      <p className="text-slate-700 mt-1">{formData.state || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-normal">City</p>
                      <p className="text-slate-700 mt-1">{formData.city || 'N/A'}</p>
                    </div>
                    <div className="sm:col-span-3">
                      <p className="text-slate-400 font-normal">About</p>
                      <p className="text-slate-700 mt-1">{formData.about || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
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
                  <p className="text-sm text-slate-500 mt-0.5">Update your organization's public profile</p>
                </div>

                {/* Organization Logo Upload Section with Drag & Drop */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Organization/Individual Logo</label>
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
                    ['orgName', 'Organization/Individual Name *'],
                    ['websiteUrl', 'Website URL'],
                    ['address1', 'Address 1'],
                    ['address2', 'Address 2'],
                    ['city', 'City *'],
                    ['state', 'State *'],
                    ['country', 'Country *'],
                    ['contactMobile', 'Contact Mobile']
                  ].map(([name, label]) => (
                    <div key={name}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                      <input name={name} value={formData[name]} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                    <div className="flex items-center gap-2">
                      <input type="email" disabled value={formData.contactEmail} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-500" />
                      <span className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border ${formData.verifiedEmail ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                        {formData.verifiedEmail ? 'Verified' : 'Not verified'}
                      </span>
                    </div>
                  </div>
                </div>

                <textarea name="about" rows="4" maxLength={200} placeholder="Tell people about your organization..." value={formData.about} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
                
                <div className="pt-2 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Social Links</h3>
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
                          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom action buttons: Right-aligned */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                  <button type="button" onClick={handleSaveProfile} className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer">Save Change</button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {showPopup && isPending && (
        <div className="fixed bottom-20 right-8 z-50 w-64 bg-[#FACC15] border border-yellow-400 rounded-lg shadow-xl p-4 flex items-start space-x-3">
          <div className="flex-1 text-sm text-slate-900 font-medium leading-relaxed">Your KYC Verification is in progress.</div>
          <button onClick={() => setShowPopup(false)} className="text-slate-900 hover:text-black font-bold text-sm shrink-0 leading-none cursor-pointer" type="button">x</button>
        </div>
      )}
      <EventOrgFooter />
    </div>
  );
};

export default Profile;