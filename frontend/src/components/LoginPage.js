import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Logo from '../assets/Logo.jpeg';
import { 
  mainContainer, 
  inputFieldStyle 
} from '../styles/MasterCSSClass';

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState(false); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.', { id: 'signin-toast' });
      return;
    }
    setStep(2);
    setTimer(60);
    setCanResend(false);
    toast.success('OTP sent successfully', { id: 'signin-toast' });
  };

  const handleResendOtp = () => {
    setTimer(60);
    setCanResend(false);
    setOtp('');
    toast.success('Resent OTP', { id: 'signin-toast' });
  };

  const verifyAndLogin = async (enteredOtp) => {
    if (enteredOtp !== '1234') {
      toast.error('Invalid OTP', { id: 'signin-toast' });
      return;
    }
    if (isForgotPassword) {
      setStep(3); // Moves to the new password form (Step 3)
      setOtp('');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/login-page/login-mobile', { 
        loginMobileNumber: mobileNumber 
      });

      setLoading(false);

      if (response.success) {
        if (response.exists) {
          toast.success('Successfully Signed In!', { id: 'signin-toast' });
          if (response.token) {
            localStorage.setItem('orgToken', response.token);
          }
          if (response.data) {
            localStorage.setItem('orgUserData', JSON.stringify(response.data));
          
            localStorage.setItem('orgId', response.data.orgId || response.data._id);
            localStorage.setItem('loginMobileNumber', mobileNumber);
          }
          navigate('/dashboard'); 
        } else {
          toast.success('New user! Please complete your registration.', { id: 'signin-toast' });
          localStorage.setItem('loginMobileNumber', mobileNumber);
          navigate('/event-org-account', { state: { prefilledMobile: mobileNumber } });
        }
      } else {
        toast.error(response.message || 'Login failed.', { id: 'signin-toast' });
      }
    } catch (error) {
      setLoading(false);
      console.error('Login check error:', error);
      toast.error(error.message || 'Server error while checking account.', { id: 'signin-toast' });
    }
  };

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtp(val);
    
    // Auto-verify when 4 digits are completed
    if (val.length === 4) {
      verifyAndLogin(val);
    }
  };

  return (
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-slate-100">
        <div className="w-full max-w-sm p-8   space-y-6 ">
          
          {/* Logo & Branding */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="w-10 h-10 object-contain rounded-md" />
              <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">showishere</span>
            </div>
          
          </div>

{/* --- MAIN FORM RENDER SWITCH --- */}
{!isPasswordMode ? (
  step === 1 ? (
    /* --- OTP STEP 1: MOBILE ENTRY --- */
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div>
        <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Mobile no.</label>
        <input 
          type="tel" 
          maxLength="10"
          value={mobileNumber} 
          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))} 
          placeholder="Enter your mobile no" 
          className={`${inputFieldStyle} border-2 bg-white`} 
        />
      </div>
      <button 
        type="submit" 
        disabled={mobileNumber.length !== 10}
        className="w-full bg-blue-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer shadow-sm disabled:cursor-not-allowed"
      >
        Send OTP
      </button>
    </form>
  ) : step === 2 ? (
    /* --- OTP STEP 2: 4-DIGIT VERIFICATION --- */
    <div className="space-y-4">
      <div>
        <label className="text-[12px] font-medium text-slate-700 mb-1">One-time password</label>
        <input 
          type="text" 
          maxLength="4"
          value={otp} 
          onChange={handleOtpChange} 
          placeholder="Enter OTP" 
          className={`${inputFieldStyle} border-2 tracking-widest font-bold text-base bg-white`} 
        />
      </div>
      <div className="flex justify-end text-xs">
        {canResend ? (
          <button type="button" onClick={handleResendOtp} className="text-blue-600 font-semibold cursor-pointer">
            Resend OTP
          </button>
        ) : (
          <span className="text-slate-400">Resend in {timer}s</span>
        )}
      </div>
      <div className="flex justify-center pt-2">
        <button type="button" onClick={() => { setStep(1); setOtp(''); setIsForgotPassword(false); }} className="text-blue-600 font-semibold hover:underline cursor-pointer text-xs">
          Back
        </button>
      </div>
      {loading && (
        <div className="text-center text-xs text-slate-500 font-medium">Verifying OTP...</div>
      )}
    </div>
  ) : (
    /* --- STEP 3: RESET PASSWORD FORM --- */
    <form onSubmit={async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match!', { id: 'signin-toast' });
        return;
      }
      try {
        const response = await API.post('/login-page/reset-password', {
          mobileNumber,
          newPassword
        });
        if (response.success) {
          toast.success('Password changed successfully!', { id: 'signin-toast' });
          setIsForgotPassword(false);
          setIsPasswordMode(true);
          setStep(1);
          setNewPassword('');
          setConfirmPassword('');
          setOtp('');
          setPassword('');
        } else {
          toast.error(response.message || 'Failed to reset password.');
        }
      } catch (err) {
        toast.error('Server error while resetting password.', { id: 'signin-toast' });
      }
    }} className="space-y-4">
      <div className="text-center text-xs text-slate-600 mb-2 font-medium">
        To Reset your password enter your registered mobile number to get OTP
      </div>

      <div>
        <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">New Password</label>
        <div className="relative">
          <input 
            type={showNewPassword ? "text" : "password"} 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            placeholder="Enter password" 
            className={`${inputFieldStyle} border-2 bg-white pr-10`} 
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 cursor-pointer"
          >
            {showNewPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" /></svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Confirm Password</label>
        <div className="relative">
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Enter password" 
            className={`${inputFieldStyle} border-2 bg-white pr-10`} 
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 cursor-pointer"
          >
            {showConfirmPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" /></svg>
            )}
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!newPassword || !confirmPassword}
        className="w-full bg-blue-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer shadow-sm disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </form>
  )
) : (
  /* --- PASSWORD LOGIN VIEW --- */
  <form onSubmit={async (e) => {
    e.preventDefault();
    try {
    const response = await API.post('/login-page/login-password', { 
  loginMobileNumber: mobileNumber, 
  password 
});
  if (response.success) {
        toast.success('Successfully Signed In!');
        if (response.token) localStorage.setItem('orgToken', response.token);
        if (response.data) {
          localStorage.setItem('orgUserData', JSON.stringify(response.data));
          localStorage.setItem('orgId', response.data.orgId || response.data._id);
          localStorage.setItem('loginMobileNumber', mobileNumber);
        }
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed. Please check credentials.', { id: 'signin-toast' });
    }
  }} className="space-y-4">
    <div>
      <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Mobile no.</label>
      <input 
        type="tel" 
        maxLength="10"
        value={mobileNumber} 
        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))} 
        placeholder="Enter Mobile no." 
        className={`${inputFieldStyle} border-2 bg-white`} 
      />
    </div>

    <div>
      <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Password</label>
      <div className="relative">
        <input 
          type={showPassword ? "text" : "password"} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter password" 
          className={`${inputFieldStyle} border-2 bg-white pr-10`} 
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 cursor-pointer"
        >
          {showPassword ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" /></svg>
          )}
        </button>
      </div>
      <div className="text-right mt-1">
        <span 
          onClick={() => {
            setIsPasswordMode(false);
            setIsForgotPassword(true);
            setStep(1);
            setMobileNumber('');
            setOtp('');
          }} 
          className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline"
        >
          Forgot password?
        </span>
      </div>
    </div>

    <button 
      type="submit" 
      disabled={mobileNumber.length !== 10 || !password}
      className="w-full bg-blue-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer shadow-sm disabled:cursor-not-allowed"
    >
      Proceed
    </button>
    <div className="text-center">
      <button 
        type="button" 
        onClick={() => setIsPasswordMode(false)} 
        className="text-blue-600 font-semibold text-xs cursor-pointer"
      >
        Login with OTP
      </button>
    </div>
  </form>
)}

          <hr className="border-slate-300" />

   <div className="text-center space-y-2">
            <p className="text-xs font-bold text-slate-800">
              {isPasswordMode ? (
                <>
                  Don't have an account?{' '}
                  <span 
                    onClick={() => {
                      setIsPasswordMode(false);
                      setStep(1);
                    }} 
                    className="text-blue-600 font-bold cursor-pointer hover:underline"
                  >
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span 
                    onClick={() => {
                      setIsPasswordMode(true);
                      setStep(1);
                    }} 
                    className="text-blue-600 font-bold cursor-pointer hover:underline"
                  >
                    Sign in
                  </span>
                </>
              )}
            </p>
            <div className="text-xs text-slate-800 font-semibold">
              <p>For any queries, please write to</p>
              <a href="mailto:showishereofficial@gmail.com" className="text-blue-600 font-bold hover:underline">
                showishereofficial@gmail.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;