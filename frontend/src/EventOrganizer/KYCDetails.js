import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../utils/api';
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
  const [loading, setLoading] = useState(true);
  const [docPreview, setDocPreview] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Form state mapped to database attributes
  const [formData, setFormData] = useState({
    id: '',
    orgId: '',
    accountHolderName: '',
    accountNumber: '',
    accountType: '',
    bankName: '',
    branch: '',
    ifscCode: '',
    panNumber: '',
    gstNumber: '',
    approvalStatus: '',
  });

  // Fetch live database profile data on component load
  useEffect(() => {
    const fetchKycData = async () => {
      try {
        let savedUser = {};
        try {
          savedUser = JSON.parse(localStorage.getItem('orgUserData') || '{}');
        } catch (e) {
          savedUser = {};
        }

        const orgId = savedUser.orgId || localStorage.getItem('orgId');
        const userId = savedUser._id || savedUser.id;
        const tenantKey = savedUser.tenantKey;
        const mobile = savedUser.loginMobileNumber || 
                       savedUser.contactMobile || 
                       localStorage.getItem('loginMobileNumber');
        const email = savedUser.contactEmail || savedUser.email;

        const params = new URLSearchParams();
        if (orgId) params.append('orgId', orgId);
        else if (userId) params.append('id', userId);
        else if (tenantKey) params.append('tenantKey', tenantKey);
        else if (mobile) params.append('loginMobileNumber', mobile);
        else if (email) params.append('contactEmail', email);

        if (!params.toString()) {
          setLoading(false);
          return;
        }

        const response = await API.get(`/org/get-profile?${params.toString()}`);
        const userData = response?.data?.data || response?.data || response;

        if (userData && (userData._id || userData.orgId || userData.contactEmail)) {
          setFormData({
            id: userData._id || userData.id || '',
            orgId: userData.orgId || '',
            approvalStatus: userData.approvalStatus || 'pending',
            accountHolderName: userData.accountHolderName || userData.orgName || userData.contactFullName || '',
            accountNumber: userData.accountNumber || '',
            accountType: userData.accountType || 'Savings',
            bankName: userData.bankName || '',
            branch: userData.branch || '',
            ifscCode: userData.bankIfsc || userData.ifscCode || '',
            panNumber: userData.panNumber || '',
            gstNumber: userData.gstinNumber || userData.gstNumber || ''
          });

          const rawDoc = userData.panCardDocument || userData.panImage || userData.panDoc;
          if (rawDoc) {
            const previewUrl = typeof rawDoc === 'object' && rawDoc !== null
              ? (rawDoc.base64Data || rawDoc.url || '') 
              : rawDoc;
            setDocPreview(previewUrl);
          }
        }
      } catch (err) {
        console.error('Error fetching KYC data:', err);
        toast.error('Failed to load KYC information.');
      } finally {
        setLoading(false);
      }
    };

    fetchKycData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSaveChanges = async () => {
    try {
      const payload = {
        id: formData.id,
        orgId: formData.orgId,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        bankName: formData.bankName,
        branch: formData.branch,
        bankIfsc: formData.ifscCode,
        gstinNumber: formData.gstNumber
      };

      const response = await API.put('/org/update-kyc', payload);
      
      // 🛡️ Safe unwrapping: handles both axios response wrappers and direct returns
      const resData = response?.data?.success !== undefined ? response.data : response;
 
      if (resData && resData.success) {
        toast.success('KYC details updated successfully!');
        setIsEditing(false);
      } else {
        // Fallback if success is false or missing
        toast.error(resData?.message || 'Failed to update KYC details.');
      }
    } catch (error) {
      console.error('Update KYC error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Server error while updating KYC details.';
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className={dashLayoutWrapper}>
        <EventOrgHeader />
        <div className={dashBodyFlexContainer}>
          <EventOrgLefSidebar />
          <main className={dashMainContentArea}>
            <div className={`${dashScrollableBody} px-10 py-12 flex items-center justify-center`}>
              <p className="text-xs text-slate-500 font-medium">Loading KYC information...</p>
            </div>
          </main>
        </div>
        <EventOrgFooter />
      </div>
    );
  }

  return (
    <div className={dashLayoutWrapper}>
      <EventOrgHeader />

      <div className={dashBodyFlexContainer}>
        <EventOrgLefSidebar />

        <main className={dashMainContentArea}>
          <div className={`${dashScrollableBody} px-10 sm:px-12 lg:px-16 py-8 space-y-6`}>
            
            {!isEditing ? (
              /* ================= VIEW MODE ================= */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h1 className="text-xl font-bold text-slate-900">KYC Info</h1>
               {formData.approvalStatus?.toLowerCase() === 'approved' ? (
                          /* Verified Badge (Outlined Icon) */
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-emerald-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Verified
                          </span>
                        ) : (
                          /* In-progress Badge */
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-amber-700">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            In-progress
                          </span>
                        )}
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-12 text-xs pt-2">
                  <div>
                    <p className="text-slate-400 font-normal">Account Holder Name</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.accountHolderName || '—'}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">Account Number</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.accountNumber || '—'}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">Account Type</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.accountType || '—'}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">Bank Name</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.bankName || '—'}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">Branch</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.branch || '—'}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">IFSC Code</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.ifscCode || '—'}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">PAN Number</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.panNumber || '—'}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-normal">GST Number</p>
                    <p className="text-slate-800 font-medium mt-1">{formData.gstNumber || '—'}</p>
                  </div>
                </div>

                {/* Document Thumbnail */}
                <div className="pt-4">
                  {docPreview ? (
                    <div 
                      onClick={() => setIsImageModalOpen(true)}
                      className="w-24 border border-slate-200 rounded-lg p-1.5 bg-white shadow-xs cursor-pointer hover:border-blue-400 transition text-center"
                    >
                      <img src={docPreview} alt="PAN Card" className="h-12 w-full object-cover rounded mb-1" />
                      <span className="text-[10px] text-slate-700 font-medium">PAN Document</span>
                    </div>
                  ) : (
                    <div className="w-20 border border-slate-200 rounded-lg p-1.5 bg-white shadow-xs text-center">
                      <div className="h-12 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400 font-bold mb-1">
                        No Doc
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Not Uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ================= EDIT MODE ================= */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Edit KYC Info</h1>
                    <p className="text-xs text-slate-500 mt-1">Update your verified banking information.</p>
                  </div>
                </div>

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

                  {/* 🔒 PAN Number (Locked) */}
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1.5">PAN Number (Locked)</label>
                    <input 
                      type="text" 
                      name="panNumber"
                      value={formData.panNumber}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  {/* 🔒 GST Number (Locked) */}
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1.5">GST Number (Locked)</label>
                    <input 
                      type="text" 
                      name="gstNumber"
                      value={formData.gstNumber}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Compact PAN Document Thumbnail (Bottom Left) */}
                <div className="pt-4">
                  {docPreview ? (
                    <div 
                      onClick={() => setIsImageModalOpen(true)}
                      className="w-24 border border-slate-200 rounded-lg p-1.5 bg-white shadow-xs cursor-pointer hover:border-blue-400 transition text-center"
                    >
                      <img src={docPreview} alt="PAN Card" className="h-12 w-full object-cover rounded mb-1" />
                      <span className="text-[10px] text-slate-700 font-medium">PAN Document</span>
                    </div>
                  ) : (
                    <div className="w-20 border border-slate-200 rounded-lg p-1.5 bg-white shadow-xs text-center">
                      <div className="h-12 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400 font-bold mb-1">
                        No Doc
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Not Uploaded</span>
                    </div>
                  )}
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
                    onClick={handleSaveChanges}
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

      <EventOrgFooter />

      {/* Document Preview Modal */}
      {isImageModalOpen && docPreview && (
        <div 
          onClick={() => setIsImageModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-4 max-w-lg w-full space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800">Uploaded Document Preview</h3>
              <button type="button" onClick={() => setIsImageModalOpen(false)} className="text-xs font-bold text-slate-500 hover:text-slate-800">✕</button>
            </div>
            <img src={docPreview} alt="Document Full" className="w-full max-h-96 object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCDetails;