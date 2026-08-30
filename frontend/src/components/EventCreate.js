import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Logo from '../assets/Logo.jpeg';
import {
  mainContainer,
  primaryButton,
  inputFieldStyle
} from '../styles/MasterCSSClass';

const EventCreate = () => {
  // Navigation Flow: 'landing' (Get Started) -> 'auth' (Login Page) -> 'wizard' (Form Details)
  const [currentView, setIcurrentView] = useState('landing');
  const [activeStep, setActiveStep] = useState(1);

  // Auth / Login states
  const [loginInput, setLoginInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  // IFSC Auto-fetch loading state
  const [isFetchingIfsc, setIsFetchingIfsc] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    panNumber: '',
    gstinNumber: '',
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankIfsc: '',
    bankName: '',
    branchName: '',
    bankAddress: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Trigger Dummy OTP Send
  const handleSendOtp = () => {
    if (!loginInput || loginInput.trim().length < 5) {
      toast.error('Please enter a valid mobile number or email ID');
      return;
    }
    setOtpSent(true);
    setFormData(prev => ({ ...prev, contactNumber: loginInput }));
    toast.success('Dummy OTP sent: Use any 4 digits (e.g. 1234)');
  };

  // Verify Dummy OTP & Proceed to Form
  const handleVerifyOtp = () => {
    if (!otpInput || otpInput.length < 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }
    toast.success('Logged in successfully!');
    setIcurrentView('wizard'); 
  };

  // Auto-fetch Bank Details using native fetch
  const handleFetchIfscDetails = async () => {
    const ifsc = formData.bankIfsc.trim().toUpperCase();
    if (!ifsc || ifsc.length < 11) {
      toast.error('Please enter a valid 11-character IFSC code');
      return;
    }

    setIsFetchingIfsc(true);
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
      if (!res.ok) throw new Error('Invalid IFSC');
      const data = await res.json();
      
      setFormData((prev) => ({
        ...prev,
        bankName: data.BANK || '',
        branchName: data.BRANCH || '',
        bankAddress: data.ADDRESS || ''
      }));
      toast.success('Bank details fetched successfully!');
    } catch (error) {
      toast.error('Invalid IFSC code or network error. Please check and try again.');
    } finally {
      setIsFetchingIfsc(false);
    }
  };

  const steps = [
    { id: 1, label: 'Create profile' },
    { id: 2, label: 'PAN details' },
    { id: 3, label: 'GST details' },
    { id: 4, label: 'Bank details' },
    { id: 5, label: 'Agreement' }
  ];

  return (
    <div className={mainContainer}>
      {/* 1. FIRST: GET STARTED LANDING PAGE (Matched to Logo Blue Color Theme) */}
      {currentView === 'landing' && (
        <div className="min-h-screen bg-[#071126] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-[#071126] to-[#071126] pointer-events-none"></div>
          
          <div className="max-w-3xl mx-auto text-center z-10 space-y-6">
            <div className="flex justify-center mb-2">
              <img src={Logo} alt="Logo" className="w-16 h-16 object-cover rounded-2xl border-2 border-blue-500 shadow-xl" />
            </div>
            
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wider shadow-inner">
              Elevate your Events to new heights
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              List all your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">"Going-Out"</span> events with us
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium">
              Maximise your event’s reach by listing it on our platform, where millions discover and book exciting events every day.
            </p>

            <div className="pt-4 flex justify-center items-center space-x-4">
              <button
                onClick={() => setIcurrentView('auth')}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECOND: LOGIN PAGE (Phone Number / Email ID verification) */}
      {currentView === 'auth' && (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-slate-50 border-r border-slate-200">
            <div className="flex items-center space-x-3 mb-6">
              <img src={Logo} alt="Logo" className="w-10 h-10 object-cover rounded-xl border border-slate-200" />
              <span className="text-xl font-black tracking-tight text-slate-900">Event Portal</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black mb-6 text-slate-900 leading-tight">
              Benefits of using our new event management tool
            </h1>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 font-bold text-lg">⚡</div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Take your events live superfast!</h3>
                  <p className="text-slate-600 text-xs">Publish your event within just 15 minutes! Add event details, tickets and BAM! Ready.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 font-bold text-lg">📊</div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Monitor analytics & insights</h3>
                  <p className="text-slate-600 text-xs">Track event sales, daily ticketing, and get insights in real-time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-2">Sign in to continue</h2>
              <p className="text-xs text-slate-500 mb-6">Enter your mobile number or email ID to log in.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Mobile no. / Email ID
                  </label>
                  <input
                    type="text"
                    disabled={otpSent}
                    placeholder="Enter mobile no or email"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className={inputFieldStyle}
                  />
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className={primaryButton + " bg-blue-600 hover:bg-blue-700"}
                  >
                    Send OTP / Continue
                  </button>
                ) : (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Enter 4-digit OTP (e.g., 1234)
                    </label>
                    <input
                      type="text"
                      maxLength="4"
                      placeholder="Enter OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className={inputFieldStyle}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className={primaryButton + " bg-emerald-600 hover:bg-emerald-700"}
                    >
                      Verify & Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. THIRD: FORM DETAILS PAGE (Multi-step Wizard) */}
      {currentView === 'wizard' && (
        <div className="min-h-screen bg-[#f8f9fc] flex flex-col lg:flex-row">
          <div className="w-full lg:w-72 bg-white border-r border-slate-200 p-8 flex flex-col justify-between shrink-0 shadow-xs">
            <div>
              <div className="flex items-center space-x-3 mb-10">
                <img src={Logo} alt="Logo" className="w-9 h-9 object-cover rounded-xl border border-slate-200" />
                <span className="font-extrabold text-slate-900 tracking-tight text-sm">Event Portal</span>
              </div>

              <div className="space-y-2 relative">
                {steps.map((step) => {
                  const isActive = activeStep === step.id;
                  const isCompleted = activeStep > step.id;
                  return (
                    <div
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition font-bold text-xs ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-2xs' 
                          : isCompleted 
                          ? 'text-slate-700 hover:bg-slate-50' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                        isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isCompleted ? '✓' : `0${step.id}`}
                      </span>
                      <span>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-400">
              Logged in as: <span className="text-slate-700 font-semibold">{formData.contactNumber}</span>
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-16 flex flex-col justify-between max-w-4xl">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200/80">
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Create your user profile</h2>
                    <p className="text-xs text-slate-500 font-medium">Verify your primary profile credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul"
                        className={inputFieldStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Last name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="e.g. Sharma"
                        className={inputFieldStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Verified Contact Number / Email ID</label>
                    <input
                      type="text"
                      disabled
                      value={formData.contactNumber}
                      className={inputFieldStyle + " bg-slate-100 text-slate-600"}
                    />
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">PAN details</h2>
                    <p className="text-xs text-slate-500 font-medium">Provide your organization or individual PAN for tax deduction compliance.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PAN Card Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. ABCDE1234F"
                      className={inputFieldStyle}
                    />
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">GST details</h2>
                    <p className="text-xs text-slate-500 font-medium">Enter your GSTIN if applicable for ticket sales tax invoicing.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      name="gstinNumber"
                      value={formData.gstinNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      className={inputFieldStyle}
                    />
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Bank details</h2>
                    <p className="text-xs text-slate-500 font-medium">Enter account holder name, IFSC code to auto-fetch bank details, and confirm account number.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name (As per Bank Records)</label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className={inputFieldStyle}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bank IFSC Code</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          name="bankIfsc"
                          value={formData.bankIfsc}
                          onChange={handleInputChange}
                          placeholder="e.g. HDFC0001234"
                          className={inputFieldStyle}
                        />
                        <button
                          type="button"
                          onClick={handleFetchIfscDetails}
                          disabled={isFetchingIfsc}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap"
                        >
                          {isFetchingIfsc ? 'Fetching...' : 'Fetch Details'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="Enter account number"
                        className={inputFieldStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Account Number</label>
                      <input
                        type="password"
                        name="confirmAccountNumber"
                        value={formData.confirmAccountNumber}
                        onChange={handleInputChange}
                        placeholder="Re-enter account number"
                        className={inputFieldStyle}
                      />
                      {formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">Account numbers do not match</p>
                      )}
                    </div>
                  </div>

                  {/* Auto-populated Bank Info Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Bank Name</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.bankName}
                        placeholder="Auto-filled"
                        className={inputFieldStyle + " bg-slate-100 text-slate-600"}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Branch Name</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.branchName}
                        placeholder="Auto-filled"
                        className={inputFieldStyle + " bg-slate-100 text-slate-600"}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Bank Address</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.bankAddress}
                        placeholder="Auto-filled"
                        className={inputFieldStyle + " bg-slate-100 text-slate-600"}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 5 && (
                <div className="space-y-6 text-center py-8">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Review & Agreement</h2>
                  <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">By submitting, you agree to merchant service terms and ticket sales commissions.</p>
                  <button className={primaryButton + " max-w-xs mx-auto bg-blue-600 hover:bg-blue-700"}>
                    Accept & Complete Registration
                  </button>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-200">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep(activeStep - 1)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeStep === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeStep === 4 && formData.accountNumber !== formData.confirmAccountNumber) {
                    toast.error('Account numbers do not match. Please check.');
                    return;
                  }
                  if (activeStep < 5) setActiveStep(activeStep + 1);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
              >
                {activeStep === 5 ? 'Submit' : 'Proceed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCreate;