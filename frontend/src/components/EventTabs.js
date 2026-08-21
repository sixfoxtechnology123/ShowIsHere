import React from 'react';
import {
  tabsContainer,
  tabButtonActive,
  tabButtonInactive
} from '../styles/MasterCSSClass';

const EventTabs = ({ activeTab, onTabChange }) => {
  const tabs = ['All', 'For you', 'Today', 'This Weekend'];

  return (
    <div className={tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={activeTab === tab ? tabButtonActive : tabButtonInactive}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default EventTabs;