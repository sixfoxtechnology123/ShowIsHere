import React from 'react';
import Logo from '../assets/Logo.jpeg';
import {
  navbar,
  logoContainer,
  logoImage,
  brandTitle,
  navRightContainer,
  locationButton
} from '../styles/MasterCSSClass';

const Navbar = ({ location, onOpenLocationModal }) => {
  return (
    <nav className={navbar}>
      <div className={logoContainer}>
        <img src={Logo} alt="ShowIsHere Logo" className={logoImage} />
        <span className={brandTitle}>ShowIsHere</span>
      </div>
      <div className={navRightContainer}>
        <button onClick={onOpenLocationModal} className={locationButton}>
          <span>📍 {location}</span>
          <span className="text-xs opacity-75">▼</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;