import React from 'react';
import { Link } from 'react-router-dom';
import {
  subNavbarContainer,
  subNavLeftLinks,
  subNavLink,
  subNavRightLinks,
  subNavRightLink
} from '../styles/MasterCSSClass';

const SubNavbar = () => {
  const leftLinks = [
    { name: 'Movies', path: '/' },
    { name: 'Events', path: '/' },
    { name: 'Plays', path: '/' },
    { name: 'Sports', path: '/' },
    { name: 'Activities', path: '/' }
  ];

  const rightLinks = [
    { name: 'Create Events', path: '/event-create' },
    { name: 'Seat Map', path: '/seatmap' },
    { name: 'Artists', path: '/artist-master' },
    { name: 'Collaborate', path: '#' },
    { name: 'Coupon', path: '#' },
    { name: 'Find My Tickets', path: '#' }
  ];

  return (
    <div className={subNavbarContainer}>
      <div className={subNavLeftLinks}>
        {leftLinks.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            className={subNavLink}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className={subNavRightLinks}>
        {rightLinks.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            className={subNavRightLink}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubNavbar;