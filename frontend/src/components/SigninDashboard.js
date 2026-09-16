import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../assets/Logo.jpeg';
import { 
  mainContainer, 
  inputFieldStyle 
} from '../styles/MasterCSSClass';

const SigninDashboard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.', { id: 'signin-toast' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success('Dummy OTP sent successfully! (Use: 1234)', { id: 'signin-toast' });
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== '1234') {
      toast.error('Invalid OTP. Use dummy OTP: 1234', { id: 'signin-toast' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Successfully Signed In!', { id: 'signin-toast' });
      navigate('/event-org-account');
    }, 800);
  };

  return (
    // FIX: Added 'flex flex-col lg:flex-row' to force side-by-side layout on desktop
    <div className={`${mainContainer} min-h-screen flex flex-col lg:flex-row bg-slate-50 w-full`}>
      
      {/* Left Side - Details & Benefits Panel */}
      <div className="w-full lg:w-1/2 bg-white p-12 flex flex-col justify-center border-r border-slate-200">
        <div className="max-w-md mx-auto space-y-10">
          <h1 className="text-2xl font-bold text-slate-900 leading-snug">
            Benefits of using <span className="text-blue-600">showishere</span><br />
            our new event management tool
          </h1>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quick & easy registration</h3>
              <p className="text-xs text-slate-500 mt-1">Complete your registration with just your business details and preferences.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Take your events live superfast!</h3>
              <p className="text-xs text-slate-500 mt-1">Publish your event within just 15 minutes! Add event details, dates, seat maps and BAM! Your event is ready.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monitor analytics & insights</h3>
              <p className="text-xs text-slate-500 mt-1">Track event sales, daily ticketing, get daily insights and more in real time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Mobile Login Interface Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-slate-50">
        <div className="w-full max-w-sm  p-8 rounded-2xl shadow-sm space-y-6">
          
          {/* Logo & Branding */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="w-10 h-10 object-contain rounded-md" />
              <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">showishere</span>
            </div>
            <p className="text-xs text-slate-400">Do It Yourself Portal</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Mobile no.</label>
                <input 
                  type="tel" 
                  maxLength="10"
                  value={mobileNumber} 
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))} 
                  placeholder="Enter your mobile no" 
                  className={`${inputFieldStyle} border-2`} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-slate-600">Enter dummy OTP sent to <span className="font-bold">+91 {mobileNumber}</span></p>
                <p className="text-[10px] text-blue-600 mt-1">(Hint: Use 1234)</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Enter OTP</label>
                <input 
                  type="text" 
                  maxLength="4"
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                  placeholder="1234" 
                  className={`${inputFieldStyle} border-2 text-center tracking-widest font-bold text-base`} 
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer border border-slate-200"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          <hr className="border-slate-100" />

          <div className="text-center space-y-2">
            <p className="text-xs text-slate-600">
              Already have an account? <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Sign in</span>
            </p>
            <p className="text-[10px] text-slate-400">
              Incase of any query, please write to<br />
             
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SigninDashboard;