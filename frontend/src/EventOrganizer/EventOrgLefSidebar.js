import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  dashSidebarContainer,
  dashSidebarBlueStrip,
  dashSidebarBlueIconsTop,
  dashBlueIconButtonActive,
  dashBlueIconButton,
  dashSidebarBlueIconsBottom,
  dashSidebarSubPanel,
  dashNavList,
  dashNavItemActive,
  dashNavItemInactive,
  dashSidebarHeaderBox,
  dashSidebarHeaderTitle,
  dashSidebarDateRow
} from '../styles/MasterCSSClass';

const EventOrgLefSidebar = () => {
  const location = useLocation();
  const isMyEventsActive = location.pathname === '/my-events';
  const isOverviewActive = location.pathname === '/dashboard';

  return (
    <aside className={dashSidebarContainer}>
      {/* Blue Strip */}
      <div className={dashSidebarBlueStrip}>
        <div className={dashSidebarBlueIconsTop}>
          <button type="button" className={dashBlueIconButton} title="Toggle">
            <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
          </button>
          <button type="button" className={dashBlueIconButtonActive} title="Home">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <button type="button" className={dashBlueIconButton} title="Tickets">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
          </button>
          <button type="button" className={dashBlueIconButton} title="Favorites">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          <button type="button" className={dashBlueIconButton} title="Profile">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </button>
        </div>

        <div className={dashSidebarBlueIconsBottom}>
          <button type="button" className={dashBlueIconButton} title="Logout">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>

      {/* White Sub-Menu Panel */}
      <div className={dashSidebarSubPanel}>
        <div>
          <div className={dashSidebarHeaderBox}>
            <h2 className={dashSidebarHeaderTitle}>DashBoard</h2>
            <div className={dashSidebarDateRow}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>Sat, 25 Oct 2025</span>
            </div>
          </div>

          <nav className={`${dashNavList} p-3`}>
            {/* Overview Link */}
            <Link to="/dashboard" className={isOverviewActive ? dashNavItemActive : dashNavItemInactive}>
              <svg className={`w-4 h-4 shrink-0 ${isOverviewActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <span>Overview</span>
            </Link>

            {/* My Events Link (Highlights dynamically when active) */}
            <Link to="/my-events" className={isMyEventsActive ? dashNavItemActive : dashNavItemInactive}>
              <svg className={`w-4 h-4 shrink-0 ${isMyEventsActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>My Events</span>
            </Link>

          <Link to="/paycheque" className={location.pathname === '/paycheque' ? dashNavItemActive : dashNavItemInactive}>
            <svg className={`w-4 h-4 shrink-0 ${location.pathname === '/paycheque' ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <span>Paycheque</span>
          </Link>
          <Link to="/report" className={location.pathname === '/report' ? dashNavItemActive : dashNavItemInactive}>
            <svg className={`w-4 h-4 shrink-0 ${location.pathname === '/report' ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>Report</span>
          </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default EventOrgLefSidebar;