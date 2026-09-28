import React, { useState, useEffect, useRef } from 'react';
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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const saved = localStorage.getItem('readNotificationIds');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const dropdownRef = useRef(null);

  // Helper function to format timestamp into relative time
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
  localStorage.setItem('readNotificationIds', JSON.stringify(readNotificationIds));
}, [readNotificationIds]);
  // API 1: Fetch Profile Data (Name & Photo)
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
          if (u.orgName) setOrgName(u.orgName);
          if (u.profilePhoto) setProfilePhoto(u.profilePhoto);
        }
      }
    } catch (err) {
      console.error('Error fetching header profile photo:', err);
    }
  };

  // API 2: Fetch Notifications Data
  const fetchNotifications = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('orgUserData') || '{}');
      const mobile = savedUser.loginMobileNumber || savedUser.contactMobile || localStorage.getItem('loginMobileNumber');

      if (mobile) {
        const resData = await API.get(`/org/profile?loginMobileNumber=${mobile}`);
        
        if (resData && resData.success && resData.data) {
          const u = resData.data;
          if (u.reasonNotifications && Array.isArray(u.reasonNotifications)) {
            setNotifications(u.reasonNotifications);

            const lastSeen = localStorage.getItem('lastSeenNotificationTime');
            if (u.reasonNotifications.length > 0) {
              const latestNotificationTime = new Date(u.reasonNotifications[u.reasonNotifications.length - 1].createdAt).getTime();
              
              if (!lastSeen || latestNotificationTime > Number(lastSeen)) {
                setHasNewNotifications(true);
              } else {
                setHasNewNotifications(false);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error fetching notifications data:', err);
    }
  };

  useEffect(() => {
    fetchHeaderProfile();
    fetchNotifications();

    window.addEventListener('profileUpdated', fetchHeaderProfile);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('profileUpdated', fetchHeaderProfile);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);

    if (nextState && notifications.length > 0) {
      const latestNotificationTime = new Date(notifications[notifications.length - 1].createdAt).getTime();
      localStorage.setItem('lastSeenNotificationTime', latestNotificationTime.toString());
      setHasNewNotifications(false);
    }
  };

  return (
    <header className={dashTopNavbar}>
      <Link to="/" className="flex items-center space-x-2 cursor-pointer no-underline">
        <img src={Logo} alt="Logo" className={dashBrandLogo} />
        <span className={dashBrandTitle}>showishere</span>
      </Link>

      <div className={dashTopNavRight}>
        <div className="relative" ref={dropdownRef}>
          <div 
            className={`${dashNotificationIconBox} relative cursor-pointer`}
            onClick={handleToggleNotifications}
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            
            {hasNewNotifications && (
              <span className="absolute top-2 right-2  w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </div>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-sm text-slate-800">Notifications</span>
              </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.slice().reverse().slice(0, 10).map((item, index) => {
                    // Use a permanent, unique signature combining timestamp and reason instead of shifting index
                    const notificationId = item._id || `${item.createdAt}-${item.reason}`;
                    const isRead = readNotificationIds.includes(notificationId);

                    return (
                      <div 
                        key={notificationId} 
                        className={`px-4 py-2 transition-colors relative flex items-start gap-2.5 ${
                          isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-100/90 hover:bg-blue-50/80'
                        }`}
                      >
                        {/* Left side indicator dot - shows ONLY for unread messages */}
                        {!isRead && (
                          <span className="w-2 h-2 mt-1.5 bg-blue-400 rounded-full shrink-0"></span>
                        )}

                        {/* Content area */}
                        <div className="w-full">
                          {item.link ? (
                            <Link 
                              to={item.link} 
                              onClick={() => {
                                if (!isRead) {
                                  setReadNotificationIds(prev => [...prev, notificationId]);
                                }
                                setShowNotifications(false);
                              }}
                              className="block group no-underline"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-xs text-slate-800 font-normal group-hover:text-blue-600 leading-snug transition-colors">
                                  {item.reason}
                                </p>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5 font-medium">
                                  {formatTimeAgo(item.createdAt)}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <div 
                              onClick={() => {
                                if (!isRead) {
                                  setReadNotificationIds(prev => [...prev, notificationId]);
                                }
                              }}
                              className="flex justify-between items-start gap-2 cursor-pointer"
                            >
                              <p className="text-xs text-slate-800 font-medium leading-snug">
                                {item.reason}
                              </p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5 font-medium">
                                {formatTimeAgo(item.createdAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
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