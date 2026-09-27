import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/Logo.jpeg';
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
  const menuRef = useRef(null);

  // Function to load organization data from localStorage
  const loadOrgData = () => {
    const storedData = localStorage.getItem('orgUserData');
    if (storedData) {
      try {
        setUserOrg(JSON.parse(storedData));
      } catch (e) {
        setUserOrg(null);
      }
    } else {
      setUserOrg(null);
    }
  };

  useEffect(() => {
    loadOrgData();

    // Listen for storage changes (e.g. when logging in from another tab or page)
    window.addEventListener('storage', loadOrgData);
    return () => window.removeEventListener('storage', loadOrgData);
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

  // Extract the name from orgUserData (checking common orgkyc field names)
  const orgName = userOrg?.businessName || userOrg?.ownerName || userOrg?.name || 'My Account';

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

      {/* Right: Location, Sign In / Org Name, Menu */}
      <div className={navRightContainer}>
        <button onClick={onOpenLocationModal} className={locationButton}>
          <span>{location || 'Select City'}</span>
          <span className="text-[10px] font-bold ml-1">▼</span>
        </button>

        {/* CONDITIONAL RENDER: Shows real org name & logout button if logged in */}
        {userOrg ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {orgName}
            </span>
            <button 
              onClick={handleLogout}
              className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Logout
            </button>
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