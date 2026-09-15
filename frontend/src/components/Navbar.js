import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/Logo.jpeg';
import {
  navbar,
  logoContainer,
  logoImage,
  brandTitle,
  navRightContainer,
  locationButton,
  navSearchWrapper,
  navSearchInput,
  signInButton,
  menuIconButton,
  dashBrandLogo,
  dashBrandTitle
} from '../styles/MasterCSSClass';

const Navbar = ({ location, onOpenLocationModal, onNavigateHome }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
       <Link to="/" className="flex items-center space-x-2 cursor-pointer no-underline">
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

      {/* Right: Location, Sign In, Menu */}
      <div className={navRightContainer}>
        <button onClick={onOpenLocationModal} className={locationButton}>
          <span>{location || 'Select City'}</span>
          <span className="text-[10px] font-bold ml-1">▼</span>
        </button>

        <button className={signInButton}>
          Sign in
        </button>

        {/* 3-Line Menu Button with Master Options Dropdown & Outside Click Ref */}
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
              <Link 
                to="/artist-master" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition"
              >
                Artist Master
              </Link>
              <Link 
                to="/seatmap" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition"
              >
                Seat Map
              </Link>
              <Link 
                to="/event-category-master" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition"
              >
                Category Master
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;