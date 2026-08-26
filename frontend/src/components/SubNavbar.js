import React from 'react';
import {
  subNavbarContainer,
  subNavLeftLinks,
  subNavLink,
  subNavRightLinks,
  subNavRightLink
} from '../styles/MasterCSSClass';

const SubNavbar = ({ onNavigateHome, onNavigateAbout, onNavigateSeatMap, onNavigateArtistMaster }) => {
  const leftLinks = ['Movies', 'Events', 'Plays', 'Sports', 'Activities'];
  const rightLinks = ['Create Events', 'Artists', 'Collaborate', 'Coupon', 'Find My Tickets'];

  const handleLinkClick = (link) => {
    if (link === 'About Us' && onNavigateAbout) {
      onNavigateAbout();
    } else if ((link === 'Events' || link === 'Movies') && onNavigateHome) {
      onNavigateHome();
    } else if (link === 'Create Events' && onNavigateSeatMap) {
      onNavigateSeatMap(); // Opens the Seat Map Creator
    } else if (link === 'Artists' && onNavigateArtistMaster) {
      onNavigateArtistMaster(); // Opens the Artist Master Page
    }
  };

  return (
    <div className={subNavbarContainer}>
      <div className={subNavLeftLinks}>
        {leftLinks.map((link) => (
          <span 
            key={link} 
            className={subNavLink}
            onClick={() => handleLinkClick(link)}
          >
            {link}
          </span>
        ))}
      </div>
      <div className={subNavRightLinks}>
        {rightLinks.map((link) => (
          <span 
            key={link} 
            className={subNavRightLink}
            onClick={() => handleLinkClick(link)}
          >
            {link}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SubNavbar;