import React from 'react';
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
  menuIconButton
} from '../styles/MasterCSSClass';

const Navbar = ({ location, onOpenLocationModal, onNavigateHome }) => {
  return (
    <nav className={navbar}>
      {/* Left: Logo & Brand Name */}
      <div className={logoContainer} onClick={onNavigateHome}>
        <img src={Logo} alt="ShowIsHere Logo" className={logoImage} />
        <span className={brandTitle}>showishere</span>
      </div>

      {/* Center: Search Bar with Light Gray/White Pill background */}
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
          <span>{location}</span>
          <span className="text-[10px] ml-1">▼</span>
        </button>

        <button className={signInButton}>
          Sign in
        </button>

        <button className={menuIconButton}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;