import React from 'react';
import { useNavigate ,Link} from 'react-router-dom';
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

  // Handles home navigation safely (uses prop if available, falls back to React Router)
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
          <span>{location || 'Select City'}</span>
          <span className="text-[10px] font-bold ml-1">▼</span>
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