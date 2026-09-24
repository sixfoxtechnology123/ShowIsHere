import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Determine if we are currently looking at a profile page route
  const isProfileRoute = location.pathname.startsWith('/profile');
  
const isEventDashboardRoute = 
  location.pathname.startsWith('/event-dashboard') || 
  location.pathname.startsWith('/events/') || 
  location.pathname === '/event-details';

  // Dashboard route checks
  const isOverviewActive = location.pathname === '/dashboard' || location.pathname === '/';
  const isMyEventsActive = location.pathname === '/my-events';
  const isPaychequeActive = location.pathname === '/paycheque';
  const isReportActive = location.pathname === '/report';
  const isAdminApprovalActive = location.pathname === '/admin-approval';

  // Event Dashboard sub-route checks
  const isEventOverviewActive = location.pathname.includes('/overview') || location.pathname === '/event-dashboard';
  const isExportListActive = location.pathname.includes('/export-list');
  const isEventDetailsActive = location.pathname.includes('/event-details');
  const isEventTicketsActive = location.pathname.includes('/tickets');
  const isEventDiscountActive = location.pathname.includes('/discount');
  const isEventSettingsActive = location.pathname.includes('/settings');

  // Profile route checks
  const isPersonalDetailsActive = location.pathname === '/profile' || location.pathname === '/profile/personal-details';
  const isKycActive = location.pathname === '/profile/kyc';
  const isSettingActive = location.pathname === '/profile/settings';

  const handleLogout = () => {
    localStorage.removeItem('orgToken');
    localStorage.removeItem('orgUserData');
    navigate('/');
  };

  return (
    <aside className={dashSidebarContainer}>
      {/* Blue Strip */}
      <div className={dashSidebarBlueStrip}>
        <div className={dashSidebarBlueIconsTop}>
          {/* Home Icon links back to dashboard overview */}
          <Link 
            to="/dashboard" 
            className={(!isProfileRoute && !isEventDashboardRoute) ? dashBlueIconButtonActive : dashBlueIconButton} 
            title="Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </Link>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <button type="button" className={dashBlueIconButton} title="Tickets">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
          </button>
          <button type="button" className={dashBlueIconButton} title="Favorites">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          
          {/* Profile Icon links to profile view */}
          <Link 
            to="/profile" 
            className={isProfileRoute ? dashBlueIconButtonActive : dashBlueIconButton} 
            title="Profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </Link>
        </div>

        <div className={dashSidebarBlueIconsBottom}>
         <button type="button" onClick={handleLogout} className={dashBlueIconButton} title="Logout">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
        </div>
      </div>

      {/* White Sub-Menu Panel - Scrollbar hidden by default, shows up on hover */}
      <div className={`${dashSidebarSubPanel} overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full`}>
        {isEventDashboardRoute ? (
          /* --- EVENT DASHBOARD MENU --- */
          <div className="flex flex-col h-full justify-between p-2">
            <div>
              <div className="p-3 mb-2">
                <h2 className="font-bold text-slate-900 text-lg leading-snug">Design thinking and innovation</h2>
                <span className="text-blue-600 font-semibold text-sm">week #7</span>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1">📍 London, UK</p>
                  <p className="flex items-center gap-1">📅 March 19 - 25, 2018 <br/>from 8:00 AM to 7:00 PM</p>
                </div>
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[18%]"></div>
                  </div>
                </div>
              </div>

              <nav className={`${dashNavList} p-2 space-y-1`}>
              <Link to="/event-dashboard" className={isEventOverviewActive ? dashNavItemActive : dashNavItemInactive}>
              <span>Overview</span>
            </Link>
                <Link to="" className={isExportListActive ? dashNavItemActive : dashNavItemInactive}>
                  <span>Export list</span>
                </Link>
               <Link to="/event-details" className={isEventDetailsActive ? dashNavItemActive : dashNavItemInactive}>
                  <span>Event Details</span>
                </Link>
                <Link to="" className={isEventTicketsActive ? dashNavItemActive : dashNavItemInactive}>
                  <span>Tickets</span>
                </Link>
                <Link to="" className={isEventDiscountActive ? dashNavItemActive : dashNavItemInactive}>
                  <span>Discount</span>
                </Link>
                <Link to="" className={isEventSettingsActive ? dashNavItemActive : dashNavItemInactive}>
                  <span>Settings</span>
                </Link>
              </nav>
            </div>

            {/* Event is Live Toggle Switch */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-between mt-4">
              <span className="text-xs font-semibold text-slate-900">Event is Live</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        ) : !isProfileRoute ? (
          /* --- DEFAULT DASHBOARD MENU --- */
          <div>
            <div className={dashSidebarHeaderBox}>
              <h2 className={dashSidebarHeaderTitle}>DashBoard</h2>
              <div className={dashSidebarDateRow}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span>Sat, 25 Oct 2025</span>
              </div>
            </div>

            <nav className={`${dashNavList} p-3`}>
              <Link to="/dashboard" className={isOverviewActive ? dashNavItemActive : dashNavItemInactive}>
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/>
              </svg>
                <span>Overview</span>
              </Link>

              <Link to="/my-events" className={isMyEventsActive ? dashNavItemActive : dashNavItemInactive}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-calendar4" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
            </svg>

                <span>My Events</span>
              </Link>

              <Link to="/paycheque" className={isPaychequeActive ? dashNavItemActive : dashNavItemInactive}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-wallet" viewBox="0 0 16 16">
                <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"/>
              </svg>
                <span>Paycheque</span>
              </Link>

              <Link to="/report" className={isReportActive ? dashNavItemActive : dashNavItemInactive}>
                <svg className={`w-5 h-5 shrink-0 ${isReportActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>Report</span>
              </Link>
            </nav>
          </div>
        ) : (
          /* --- PROFILE MENU --- */
          <div>
            <div className={dashSidebarHeaderBox}>
              <h2 className={dashSidebarHeaderTitle}>Profile</h2>
              <div className={dashSidebarDateRow}>
                <span>Active Since: Aug 28, 2026</span>
              </div>
            </div>

            <nav className={`${dashNavList} p-3`}>
              <Link to="/profile" className={isPersonalDetailsActive ? dashNavItemActive : dashNavItemInactive}>
                <svg className={`w-4 h-4 shrink-0 ${isPersonalDetailsActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <span>Personal Details</span>
              </Link>

              <Link to="/profile/kyc" className={isKycActive ? dashNavItemActive : dashNavItemInactive}>
                <svg className={`w-4 h-4 shrink-0 ${isKycActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>KYC Details</span>
              </Link>

              <Link to="/profile/settings" className={isSettingActive ? dashNavItemActive : dashNavItemInactive}>
                <svg className={`w-4 h-4 shrink-0 ${isSettingActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1.1 1.1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>Setting</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
};

export default EventOrgLefSidebar;