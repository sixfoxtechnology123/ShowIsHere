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

const Setting = () => {
  const [loading, setLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password visibility states (Eye Icon toggles)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  // Forgot password modal state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer] = useState(56);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  // Check password status on mount
  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        let savedUser = {};
        try {
          savedUser = JSON.parse(localStorage.getItem('orgUserData') || '{}');
        } catch (e) {
          savedUser = {};
        }

        const id = savedUser._id || savedUser.id || localStorage.getItem('orgId');
        const email = savedUser.contactEmail || savedUser.email || localStorage.getItem('contactEmail');

        const params = new URLSearchParams();
        if (id) params.append('id', id);
        if (email) params.append('contactEmail', email);

        if (!params.toString()) {
          setLoading(false);
          return;
        }

        const response = await API.get(`/org/password-status?${params.toString()}`);
        const resData = response?.data || response;

        if (resData.success) {
          setHasPassword(resData.hasPassword);
          setUserEmail(resData.email || email || '');
          setUserId(id || '');
        }
      } catch (err) {
        console.error('Error checking password status:', err);
      } finally {
        setLoading(false);
      }
    };

    checkPasswordStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle setting / updating password with Toast notifications for mismatches
  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (formData.newPassword.length < 4) {
      toast.error("Password must be at least 4 characters long.");
      return;
    }

    try {
      if (!hasPassword) {
        // First-time password creation
        const response = await API.put('/org/password', {
          id: userId,
          newPassword: formData.newPassword
        });
        const resData = response?.data || response;
        if (resData.success) {
          toast.success("Password created successfully!");
          setHasPassword(true);
          setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } else {
          toast.error(resData.message || "Failed to create password.");
        }
      } else {
        // Changing existing password
        if (!formData.oldPassword) {
          toast.error("Please enter your old password.");
          return;
        }

        const response = await API.put('/org/password', {
          id: userId,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        });
        const resData = response?.data || response;
        if (resData.success) {
          toast.success("Password updated successfully!");
          setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } else {
          toast.error(resData.message || "Old password is incorrect.");
        }
      }
    } catch (error) {
      console.error('Password update error:', error);
      const errorMsg = error.response?.data?.message || "Server error while updating password.";
      toast.error(errorMsg);
    }
  };

  // Trigger Forgot Password OTP
  const handleSendForgotPasswordOtp = async () => {
    try {
      const response = await API.post('/org/password/send-reset-otp', {
        id: userId,
        email: userEmail
      });
      const resData = response?.data || response;
      if (resData.success) {
        setIsOtpModalOpen(true);
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(resData.message || "Failed to send verification code.");
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error("Failed to send verification code.");
    }
  };

  // Verify OTP and Reset Password with Toast validations
  const handleVerifyAndResetPassword = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      toast.error("Please enter the complete 4-digit code.");
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await API.post('/org/password/reset', {
        id: userId,
        email: userEmail,
        otp: enteredOtp,
        newPassword: resetNewPassword
      });
      const resData = response?.data || response;
      if (resData.success) {
        toast.success("Password reset successfully!");
        setIsOtpModalOpen(false);
        setHasPassword(true);
        setResetNewPassword('');
        setResetConfirmPassword('');
        setOtp(['', '', '', '', '', '']);
      } else {
        toast.error(resData.message || "Invalid or expired verification code.");
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error("Server error while resetting password.");
    }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
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
              <p className="text-xs text-slate-500 font-medium">Loading settings...</p>
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
          <div className={`${dashScrollableBody} px-10 sm:px-12 lg:px-16 py-8`}>
            
            <div className="max-w-2xl space-y-8">
              
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {hasPassword ? 'Change your password' : 'Create your password'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {hasPassword ? 'You can change your current password here' : 'You can set your password here'}
                </p>
              </div>

              <form onSubmit={handleSubmitPassword} className="space-y-6">
                
                {/* Old Password Field with Eye Icon */}
                {hasPassword && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Old password</label>
                    <div className="relative">
                      <input 
                        type={showOldPassword ? "text" : "password"} 
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                     <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        {showOldPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* New Password Field with Eye Icon */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">New password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  {showNewPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" /></svg>
                  )}
                </button>
                  </div>
                </div>

                {/* Confirm New Password Field with Eye Icon */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Confirm new password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" /></svg>
                    )}
                  </button>
                  </div>
                </div>

                {hasPassword && (
                  <div>
                    <button 
                      type="button"
                      onClick={handleSendForgotPasswordOtp}
                      className="text-xs text-blue-600 hover:underline font-medium cursor-pointer bg-transparent border-none p-0"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
                  >
                    {hasPassword ? 'Save' : 'Set Password'}
                  </button>
                </div>

              </form>

            </div>

          </div>
        </main>

      </div>

      <EventOrgFooter />

      {/* Forgot Password OTP Modal with Eye Toggles */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-6 shadow-xl relative">
            
            <button 
              type="button" 
              onClick={() => setIsOtpModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">Set a password</h2>
              <p className="text-xs text-slate-500">We'll send a 6-digit verification code to confirm it's you.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Send code to</label>
              <div className="flex items-center justify-between border border-blue-300 bg-blue-50/30 rounded-lg px-3.5 py-2.5 text-xs">
                <span className="font-medium text-slate-800">Email: {userEmail}</span>
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              </div>
            </div>

            <form onSubmit={handleVerifyAndResetPassword} className="space-y-4">
              <div className="space-y-2 text-center">
                <p className="text-xs text-slate-600">Enter the code sent to {userEmail}.</p>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      className="w-10 h-10 text-center border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                  <span>Resend in {timer}s</span>
                  <button type="button" onClick={handleSendForgotPasswordOtp} className="text-blue-600 font-semibold hover:underline">Resend code</button>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showResetNewPassword ? "text" : "password"}
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                   <button
                      type="button"
                      onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      {showResetNewPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showResetConfirmPassword ? "text" : "password"}
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                   <button
                    type="button"
                    onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    {showResetConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" /></svg>
                    )}
</button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
              >
                Continue & Reset Password
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Setting;