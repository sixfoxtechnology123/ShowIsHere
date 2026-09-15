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
    { name: 'Create Events', path: '/create-event' },
    // { name: 'Seat Map', path: '/seatmap' },
    // { name: 'Category Master', path: '/category-master' },
    // { name: 'Event Category Master', path: '/event-category-master' },
    // { name: 'Question DB', path: '/question-database-master' },
    // { name: 'Artists', path: '/artist-master' },
    { name: 'Collaborate', path: '/dashboard' },
    { name: 'Coupon', path: '/event-org-account' },
    // { name: 'Find My Tickets', path: '/event-category-master' }
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
