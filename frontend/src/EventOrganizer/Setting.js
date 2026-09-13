import React, { useState } from 'react';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';
import EventOrgLefSidebar from './EventOrgLefSidebar';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody
} from '../styles/MasterCSSClass';

const Setting = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSetPassword = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle password update logic here
    alert("Password updated successfully!");
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
          <div className={`${dashScrollableBody} px-10 sm:px-12 lg:px-16 py-8`}>
            
            <div className="max-w-2xl space-y-8">
              
              {/* Header Title & Subtitle */}
              <div>
                <h1 className="text-xl font-bold text-slate-900">Create your password</h1>
                <p className="text-xs text-slate-500 mt-0.5">You can set your password here</p>
              </div>

              {/* Password Form */}
              <form onSubmit={handleSetPassword} className="space-y-6">
                
                {/* New Password Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">New password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Confirm New Password Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Confirm new password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Action Button aligned to the right */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
                  >
                    Set Password
                  </button>
                </div>

              </form>

            </div>

          </div>
        </main>

      </div>

      {/* 5. FIXED FOOTER */}
      <EventOrgFooter />

    </div>
  );
};

export default Setting;