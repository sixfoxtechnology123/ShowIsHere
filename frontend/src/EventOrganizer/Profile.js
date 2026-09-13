import React, { useState } from 'react';
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

const Profile = () => {
  const profileImage = Logo || ''; 
  const [showPopup, setShowPopup] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form state tracking all fields for the edit view
  const [formData, setFormData] = useState({
    orgName: "Suvo Roy's organization",
    websiteUrl: 'https://yourorganization.com',
    address1: '',
    address2: '',
    country: '',
    state: '',
    city: '',
    contactNumber: '+91 92466 80015',
    email: 'sbrta.roy@gmail.com',
    about: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={dashLayoutWrapper}>
      
      {/* 1. FIXED TOP NAVBAR HEADER */}
      <EventOrgHeader />

      <div className={dashBodyFlexContainer}>
        
        {/* 2. FIXED LEFT SIDEBAR */}
        <EventOrgLefSidebar />

        {/* 3. MIDDLE SCROLLABLE CONTENT AREA */}
        <main className={dashMainContentArea}>
          <div className={`${dashScrollableBody} px-10 sm:px-12 lg:px-16 py-6 space-y-6`}>
            
            {!isEditing ? (
              /* ================= VIEW MODE (Original Profile Section) ================= */
              <div className="space-y-6">
                
                {/* Top Header Section with Circular Avatar, Info, and Edit Button */}
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="shrink-0 mx-auto md:mx-0">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Alexa Rawles"
                        className="w-20 h-20 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
                        AR
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
                      <div>
                        <h1 className="text-xl font-bold text-slate-950">Alexa Rawles</h1>
                        <p className="text-sm text-slate-500 mt-1">
                          alexarawles@gmail.com <span className="mx-2">•</span> +91 92466 80015
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Basic Details Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8 text-sm py-2">
                      <div>
                        <p className="text-slate-400 font-normal">Website</p>
                        <p className="text-slate-600 italic mt-1">{formData.websiteUrl || 'Not set'}</p>
                      </div>

                      <div className="sm:col-span-2"></div>

                      <div>
                        <p className="text-slate-400 font-normal">Country</p>
                        <p className="text-slate-600 italic mt-1">{formData.country || 'Not set'}</p>
                      </div>

                      <div>
                        <p className="text-slate-400 font-normal">State / Province</p>
                        <p className="text-slate-600 italic mt-1">{formData.state || 'Not set'}</p>
                      </div>

                      <div>
                        <p className="text-slate-400 font-normal">City</p>
                        <p className="text-slate-600 italic mt-1">{formData.city || 'Not set'}</p>
                      </div>

                      <div className="sm:col-span-3 pt-2">
                        <p className="text-slate-400 font-normal">About</p>
                        <p className="text-slate-600 italic mt-1">{formData.about || 'Not set'}</p>
                      </div>
                    </div>

                    {/* Social Links Section */}
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="text-sm font-bold text-slate-900 mb-6">Social Links</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-16 text-sm">
                        <div>
                          <p className="text-slate-400 font-normal">Instagram</p>
                          <p className="text-slate-600 italic mt-1">{formData.instagram || 'Not set'}</p>
                        </div>

                        <div>
                          <p className="text-slate-400 font-normal">Facebook</p>
                          <p className="text-slate-600 italic mt-1">{formData.facebook || 'Not set'}</p>
                        </div>

                        <div>
                          <p className="text-slate-400 font-normal">X / Twitter</p>
                          <p className="text-slate-600 italic mt-1">{formData.twitter || 'Not set'}</p>
                        </div>

                        <div>
                          <p className="text-slate-400 font-normal">LinkedIn</p>
                          <p className="text-slate-600 italic mt-1">{formData.linkedin || 'Not set'}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              /* ================= EDIT MODE (Form View from Screenshot) ================= */
              <div className="space-y-6">
                
                {/* Top Page Title & Subtitle */}
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Profile</h1>
                  <p className="text-sm text-slate-500 mt-0.5">Update your organization's public profile</p>
                </div>

                {/* Organization/Individual Logo Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Organization/Individual Logo</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-24 h-24 rounded-full border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer overflow-hidden shrink-0 hover:bg-slate-100 transition">
                      {profileImage ? (
                        <img src={profileImage} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          <span className="text-[10px] font-medium uppercase">UPLOAD LOGO</span>
                        </>
                      )}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-[11px] text-slate-500">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mr-2 align-middle"></span>
                      Min 200×200 px for square, PNG or JPG, max 5MB
                    </div>
                  </div>
                </div>

                {/* Row 1: Name & Website */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Organization/Individual Name *</label>
                    <input 
                      type="text" 
                      name="orgName"
                      value={formData.orgName}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website URL</label>
                    <input 
                      type="text" 
                      name="websiteUrl"
                      placeholder="https://yourorganization.com"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Row 2: Address 1 & Address 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address 1</label>
                    <input 
                      type="text" 
                      name="address1"
                      placeholder="Street address, P.O. box"
                      value={formData.address1}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address 2</label>
                    <input 
                      type="text" 
                      name="address2"
                      placeholder="Apartment, suite, unit, etc."
                      value={formData.address2}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Row 3: Country, State, City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">City *</label>
                    <select 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select city</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Los Angeles">Los Angeles</option>
                    </select>
                  </div>
                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">State / Province *</label>
                    <select 
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select state</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="California">California</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Country *</label>
                    <select 
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select country</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>
                 
                 
                </div>

                {/* Row 4: Contact Number & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Number</label>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <div className="flex items-center px-3 bg-slate-50 border-r border-slate-200 space-x-1.5 text-sm text-slate-700">
                        <span>🇮🇳</span>
                        <span>⌄</span>
                      </div>
                      <input 
                        type="text" 
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 text-sm text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5  items-center">
                          <span>Email Address *</span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth="1.5" 
                            stroke="currentColor" 
                            className="w-3.5 h-3.5 ml-1.5 text-slate-500 inline-block"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                        </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="email" 
                        disabled={true}
                        value={formData.email}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-500"
                      />
                      <span className="shrink-0 inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-lg border border-emerald-200">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Email address cannot be changed</p>
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">About</label>
                  <div className="relative">
                    <textarea 
                      name="about"
                      rows="4"
                      maxLength={200}
                      placeholder="Tell people about your organization..."
                      value={formData.about}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 pb-6 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                    <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 pointer-events-none">
                      {formData.about.length}/200
                    </span>
                  </div>
                </div>

                {/* Social Links Header & Grid */}
                <div className="pt-2 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Instagram</label>
                      <input 
                        type="text" 
                        name="instagram"
                        placeholder="https://instagram.com/yourpage"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Facebook</label>
                      <input 
                        type="text" 
                        name="facebook"
                        placeholder="https://facebook.com/yourpage"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">X / Twitter</label>
                      <input 
                        type="text" 
                        name="twitter"
                        placeholder="https://twitter.com/yourpage"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">LinkedIn</label>
                      <input 
                        type="text" 
                        name="linkedin"
                        placeholder="https://linkedin.com/company/yourcompany"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Help Note and Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-[11px] text-slate-600 w-full sm:w-auto">
                    If you need to make any changes or have queries, please contact us on <span className="text-blue-600 font-medium">info@showishere.com</span>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancle
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
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

      {/* Yellow KYC Popup Notice */}
      {showPopup && (
        <div className="fixed bottom-20 right-8 z-50 w-64 bg-[#FACC15] border border-yellow-400 rounded-lg shadow-xl p-4 flex items-start space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-slate-900 shrink-0 mt-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <div className="flex-1 text-sm text-slate-900 font-medium leading-relaxed">
            Your KYC Verification is in progress.
          </div>
          <button 
            onClick={() => setShowPopup(false)} 
            className="text-slate-900 hover:text-black font-bold text-sm shrink-0 leading-none cursor-pointer"
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      {/* 5. FIXED FOOTER */}
      <EventOrgFooter />

    </div>
  );
};

export default Profile;