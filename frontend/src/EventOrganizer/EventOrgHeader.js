import React from 'react';
import Logo from '../assets/Logo.jpeg';
import userAvatar from '../assets/avatar.jpg';
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
  return (
    <header className={dashTopNavbar}>
      <div className="flex items-center space-x-3">
        <img src={Logo} alt="Logo" className={dashBrandLogo} />
        <span className={dashBrandTitle}>showishere</span>
      </div>

      <div className={dashTopNavRight}>
        <div className={dashNotificationIconBox}>
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-xs font-bold text-slate-700 ml-1">23</span>
        </div>
        
        <div className={dashUserProfileBox}>
          <img src={userAvatar} alt="Andy Doe" className={dashUserAvatarImg} />
          <span className={dashUserNameText}>Andy Doe</span>
        </div>
      </div>
    </header>
  );
};

export default EventOrgHeader;