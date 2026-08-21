import React from 'react';
import {
  subNavbarContainer,
  subNavLeftLinks,
  subNavLink,
  subNavRightLinks,
  subNavRightLink
} from '../styles/MasterCSSClass';

const SubNavbar = () => {
  const leftLinks = ['Movies', 'Events', 'Plays', 'Sports', 'Activities'];
  const rightLinks = ['Create Events', 'Collaborate', 'Coupon', 'Find My Tickets'];

  return (
    <div className={subNavbarContainer}>
      <div className={subNavLeftLinks}>
        {leftLinks.map((link) => (
          <span key={link} className={subNavLink}>{link}</span>
        ))}
      </div>
      <div className={subNavRightLinks}>
        {rightLinks.map((link) => (
          <span key={link} className={subNavRightLink}>{link}</span>
        ))}
      </div>
    </div>
  );
};

export default SubNavbar;