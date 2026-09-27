import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import Logo from '../assets/Logo.jpeg';
import defaultAvatar from '../assets/avatar.jpg';
import {
  navbar,
  navRightContainer,
  locationButton,
  navSearchWrapper,
  navSearchInput,
  signInButton,
  menuIconButton,
  dashBrandLogo,
  dashBrandTitle
} from '../styles/MasterCSSClass';

const Navbar = ({ location, onOpenLocationModal, onNavigateHome, onSignInClick }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userOrg, setUserOrg] = useState(null);
  const [orgName, setOrgName] = useState('My Account');
  const [profilePhoto, setProfilePhoto] = useState(defaultAvatar);
  const menuRef = useRef(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const logoutRef = useRef(null);

  // Close logout dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (logoutRef.current && !logoutRef.current.contains(e.target)) {
        setIsLogoutOpen(false);
      }
    };
    if (isLogoutOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isLogoutOpen]);

  // Function to load organization data and profile photo from database & localStorage
  const loadOrgData = async () => {
    try {
      const storedData = localStorage.getItem('orgUserData');
      let mobile = localStorage.getItem('loginMobileNumber');
      
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setUserOrg(parsed);
          if (parsed.orgName) setOrgName(parsed.orgName);
          if (!mobile && parsed.loginMobileNumber) mobile = parsed.loginMobileNumber;
        } catch (e) {
          setUserOrg(null);
        }
      } else {
        setUserOrg(null);
      }

      // Fetch live data from Profile model database using mobile number
      if (mobile) {
        const resData = await API.get(`/profile?loginMobileNumber=${mobile}`);
        if (resData && resData.success && resData.data) {
          const u = resData.data;
          if (u.orgName) setOrgName(u.orgName);
          if (u.profilePhoto) setProfilePhoto(u.profilePhoto);
        }
      }
    } catch (err) {
      console.error('Error loading navbar profile data:', err);
    }
  };

  useEffect(() => {
    loadOrgData();

    // Listen for storage changes and live profile updates
    window.addEventListener('storage', loadOrgData);
    window.addEventListener('profileUpdated', loadOrgData);
    
    return () => {
      window.removeEventListener('storage', loadOrgData);
      window.removeEventListener('profileUpdated', loadOrgData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('orgToken');
    localStorage.removeItem('orgUserData');
    localStorage.removeItem('orgId');
    localStorage.removeItem('loginMobileNumber');
    setUserOrg(null);
    navigate('/');
    window.location.reload();
  };

  // Automatically close menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      navigate('/');
    }
  };

  return (
    <nav className={navbar}>
       <Link to="/" className="flex items-center space-x-2 cursor-pointer no-underline" onClick={handleLogoClick}>
        <img src={Logo} alt="Logo" className={dashBrandLogo} />
        <span className={dashBrandTitle}>showishere</span>
      </Link>

      {/* Center: Search Bar */}
      <div className={navSearchWrapper}>
        <svg className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"></path>
        </svg>
        <input 
          type="text" 
          placeholder="Search events, artists, venues..." 
          className={navSearchInput}
        />
      </div>

      {/* Right: Location, Org Profile / Sign In, Menu */}
      <div className={navRightContainer}>
        <button onClick={onOpenLocationModal} className={locationButton}>
          <span>{location || 'Select City'}</span>
          <span className="text-[10px] font-bold ml-1">▼</span>
        </button>

        {/* CONDITIONAL RENDER: Shows profile photo & org name if logged in */}
       {/* CONDITIONAL RENDER: Click image or name to show only the logout option */}
        {userOrg ? (
          <div className="relative" ref={logoutRef}>
            <div 
              onClick={() => setIsLogoutOpen(!isLogoutOpen)}
              className="flex items-center gap-2 px-3 py-1 rounded-full shadow-xs cursor-pointer select-none  transition"
            >
              <img src={profilePhoto} alt="Org Avatar" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
              <span className="text-xs font-bold text-slate-700">{orgName}</span>
            </div>

           {isLogoutOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-[9999]">
              {/* Profile Option */}
              <button 
                onClick={() => {
                  setIsLogoutOpen(false);
                  navigate('/profile'); // Change '/profile' to your actual profile route path if different
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer bg-transparent border-none text-left"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>

              {/* Divider line */}
              <div className="border-t border-slate-100 my-1"></div>

              {/* Logout Option */}
              <button 
                onClick={() => {
                  setIsLogoutOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer bg-transparent border-none text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
          </div>
        ) : (
          <button onClick={onSignInClick} className={signInButton}>
            Sign in
          </button>
        )}

        {/* 3-Line Menu Button */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={menuIconButton}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-2xl py-1.5 z-[99999]">
              <Link to="/artist-master" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition">Artist Master</Link>
              <Link to="/seatmap" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition">Seat Map</Link>
              <Link to="/category-master" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition">Category Master</Link>
              <Link to="/event-category-master" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition">Category Listing</Link>
              <Link to="/question-database-master" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition">Question DB</Link>
              <Link to="/event-question-master" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition">Event Question</Link>
              <Link to="/admin-approval" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition">Admin Approval</Link>
            </div>
          )}
        </div>
      </div>
    </nav> 
  );
};

Navbar.defaultProps = {
  onSignInClick: () => {}
};

export default Navbar;