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

const KYCDetails = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Form state for editing KYC details
  const [formData, setFormData] = useState({
    accountHolderName: 'Bimal Maity',
    accountNumber: '1630015222554',
    accountType: 'Savings',
    bankName: 'State Bank of India',
    branch: 'Naihati',
    ifscCode: 'SBIN0014048',
    panNumber: 'BSUPP2654A',
    gstNumber: '198AASA125D5SF'
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
          <div className={`${dashScrollableBody} px-10 sm:px-12 lg:px-16 py-8 space-y-6`}>
            
            {!isEditing ? (
              /* ================= VIEW MODE ================= */
              <div className="space-y-6">
                
                {/* Top Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h1 className="text-xl font-bold text-slate-900">KYC Info</h1>
                     
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                        ⊙ In-progress
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Trust starts with being verified.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-12 text-xs pt-2">
                  <div>
                    <p className="text-slate-400 font-normal">Account Holder Name</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.accountHolderName}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">Account Number</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.accountNumber}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">Account Type</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.accountType}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">Bank Name</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.bankName}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">Branch</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.branch}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">IFSC Code</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.ifscCode}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">PAN Number</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.panNumber}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">GST Number</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.gstNumber}</p>
                  </div>
                </div>

                {/* Document Thumbnail Section */}
                <div className="pt-4">
                  <div className="w-20 border border-slate-200 rounded-lg p-1.5 bg-white shadow-xs cursor-pointer hover:border-blue-400 transition text-center">
                    <div className="h-12 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-500 font-bold mb-1">
                      📄 DOC
                    </div>
                    <span className="text-[10px] text-slate-700 font-medium">Doc 1</span>
                  </div>
                </div>

              </div>
            ) : (
              /* ================= EDIT MODE ================= */
              <div className="space-y-6">
                
                {/* Top Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Edit KYC Info</h1>
                    <p className="text-xs text-slate-500 mt-1">Update your verified banking and tax information.</p>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Account Holder Name *</label>
                    <input 
                      type="text" 
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Account Number *</label>
                    <input 
                      type="text" 
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Account Type *</label>
                    <select 
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Bank Name *</label>
                    <input 
                      type="text" 
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Branch *</label>
                    <input 
                      type="text" 
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">IFSC Code *</label>
                    <input 
                      type="text" 
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">PAN Number *</label>
                    <input 
                      type="text" 
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">GST Number</label>
                    <input 
                      type="text" 
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Save / Cancel Action Buttons */}
                <div className="pt-6 flex items-center justify-end space-x-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
                  >
                    Save Change
                  </button>
                </div>

              </div>
            )}

          </div>
        </main>

      </div>

      {/* 5. FIXED FOOTER */}
      <EventOrgFooter />

    </div>
  );
};

export default KYCDetails;