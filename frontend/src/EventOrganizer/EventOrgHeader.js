import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import Logo from '../assets/Logo.jpeg';
import defaultAvatar from '../assets/avatar.jpg';
import {
  dashTopNavbar,
  dashBrandLogo,
  dashBrandTitle,
  dashTopNavRight,
  dashNotificationIconBox,
  dashUserProfileBox,
  dashUserAvatarImg,
  dashUserNameText
} from '../styles/MasterCSSClass';

const EventOrgHeader = () => {
  const [orgName, setOrgName] = useState('My Account');
  const [profilePhoto, setProfilePhoto] = useState(defaultAvatar);

  const fetchHeaderProfile = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('orgUserData') || '{}');
      const mobile = savedUser.loginMobileNumber || savedUser.contactMobile || localStorage.getItem('loginMobileNumber');

      if (savedUser.orgName) {
        setOrgName(savedUser.orgName);
      }

      if (mobile) {
        const resData = await API.get(`/profile?loginMobileNumber=${mobile}`);
        
        if (resData && resData.success && resData.data) {
          const u = resData.data;
          
          if (u.orgName) {
            setOrgName(u.orgName);
          }
          if (u.profilePhoto) {
            setProfilePhoto(u.profilePhoto);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching header profile photo:', err);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchHeaderProfile();

    // Listen for live profile updates from other pages (like Profile.js)
    window.addEventListener('profileUpdated', fetchHeaderProfile);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('profileUpdated', fetchHeaderProfile);
    };
  }, []);

  return (
    <header className={dashTopNavbar}>
      <Link to="/" className="flex items-center space-x-2 cursor-pointer no-underline">
        <img src={Logo} alt="Logo" className={dashBrandLogo} />
        <span className={dashBrandTitle}>showishere</span>
      </Link>

      <div className={dashTopNavRight}>
        <div className={dashNotificationIconBox}>
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-xs font-bold text-slate-700 ml-1">23</span>
        </div>
        
        <div className={dashUserProfileBox}>
          <img src={profilePhoto} alt="Profile Avatar" className={dashUserAvatarImg} />
          <span className={dashUserNameText}>{orgName}</span>
        </div>
      </div>
    </header>
  );
};

export default EventOrgHeader;