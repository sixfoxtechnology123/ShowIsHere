import React from 'react';
import Logo from '../assets/Logo.jpeg';
import userAvatar from '../assets/avatar.jpg';
import {
  dashLayoutWrapper,
  dashTopNavbar,
  dashTopNavTitleBox,
  dashTopMainHeading,
  dashTopSubDateText,
  dashTopNavRight,
  dashNotificationIconBox,
  dashNotificationBadge,
  dashUserProfileBox,
  dashUserAvatarImg,
  dashUserNameText,
  dashBodyFlexContainer,
  dashSidebarContainer,
  dashSidebarTop,
  dashBrandRow,
  dashBrandLogo,
  dashBrandTitle,
  dashNavList,
  dashNavItemActive,
  dashNavItemInactive,
  dashSidebarBottom,
  dashLogoutBtn,
  dashMainContentArea,
  dashScrollableBody,
  dashTopGridRow,
  dashAddEventCard,
  dashAddEventHeader,
  dashAddEventTitle,
  dashAddEventSub,
  dashCreateEventBtn,
  dashActiveEventCardBox,
  dashMiniEventCard,
  dashMiniEventHeaderRow,
  dashMiniEventThumb,
  dashMiniEventInfo,
  dashMiniEventName,
  dashMiniEventCategory,
  dashMiniEventProgressBox,
  dashMiniEventProgressMeta,
  dashMiniEventProgressLabel,
  dashMiniEventProgressVal,
  dashProgressBarBg,
  dashProgressBarFillGreen,
  dashProgressBarFillOrange,
  dashProgressBarFillBlue,
  dashStatsRowGrid,
  dashStatCard,
  dashStatCardHeaderRow,
  dashStatCardTitleBox,
  dashStatCardIconCircle,
  dashStatDropdownBtn,
  dashStatNumberRow,
  dashStatMainVal,
  dashStatTrendBadgeGreen,
  dashStatTrendBadgeRed,
  dashAnalyticsGridRow,
  dashDonutCard,
  dashSectionCardHeader,
  dashCardSectionTitle,
  dashDonutVisualContainer,
  dashDonutCenterTextBox,
  dashDonutCenterMainVal,
  dashDonutCenterSubLabel,
  dashDonutLegendGrid,
  dashLegendItemRow,
  dashLegendDotBlue,
  dashLegendDotGreen,
  dashLegendDotPurple,
  dashLegendDotYellow,
  dashBarChartCard,
  dashBarChartBody,
  dashBarGroupWrapper,
  dashBarColumnsContainer,
  dashBarColPrimary,
  dashBarColSecondary,
  dashBarColAccent,
  dashBarAxisLabel,
  dashBarChartLegendRow,
  dashBuyersListCard,
  dashBuyersHeaderRow,
  dashBuyersFilterGroup,
  dashSearchInputWrapper,
  dashSearchInputBox,
  dashFilterDropdownBtn,
  dashTableContainer,
  dashTableStyled,
  dashTableHeadRow,
  dashTableHeadTh,
  dashTableBodyRow,
  dashTableBodyTd,
  dashStatusBadgePaid,
  dashStatusBadgeCancelled,
  dashStatusBadgePending,
  dashTableFooterRow,
  dashPaginationBox,
  dashPaginationNumActive,
  dashPaginationNumInactive,
  dashRightCalendarColumn,
  dashWalletCardBox,
  dashWalletTitleText,
  dashWalletBalanceAmount,
  dashCalendarSectionBox,
  dashCalendarHeaderRow,
  dashCalendarHeaderTitle,
  dashCalendarDateSubText,
  dashScheduleEventItemCard,
  dashScheduleEventTime,
  dashScheduleEventName,
  dashScheduleEventLocation,
  dashSidebarSubPanel,
  dashBlueIconButton,
  dashSidebarBlueIconsBottom,
  dashBlueIconButtonActive,
  dashSidebarBlueIconsTop,
  dashSidebarBlueStrip
} from '../styles/MasterCSSClass';

const Dashboard = () => {
  return (
    <div className={dashLayoutWrapper}>
      
   {/* Full-Width Top Navbar Header (Matching Reference Image) */}
      <header className={dashTopNavbar}>
        
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="Logo" className={dashBrandLogo} />
          <span className={dashBrandTitle}>showishere</span>
        </div>

        {/* Right Side: Notifications & User Profile */}
        <div className={dashTopNavRight}>
          <div className={dashNotificationIconBox} style={{ display: 'flex', alignItems: 'center', spaceX: '0.5rem' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-xs font-bold text-slate-700 ml-1">23</span>
          </div>
          
          <div className={dashUserProfileBox}>
            <img src={userAvatar} alt="Andy Doe" className={dashUserAvatarImg} />
            <span className={dashUserNameText}>Andy Doe</span>
          </div>
        </div>

      </header>

      {/* Body Flex Container for Sidebar, Content, and Calendar */}
      <div className={dashBodyFlexContainer}>
        
  {/* Left Sidebar Navigation */}
        <aside className={dashSidebarContainer}>
          
          {/* Column 1: Blue Icon Strip */}
          <div className={dashSidebarBlueStrip}>
            <div className={dashSidebarBlueIconsTop}>
              <button type="button" className={dashBlueIconButtonActive} title="Home">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </button>
              <button type="button" className={dashBlueIconButton} title="Tickets">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              </button>
              <button type="button" className={dashBlueIconButton} title="Favorites">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>

            <div className={dashSidebarBlueIconsBottom}>
              <button type="button" className={dashBlueIconButton} title="Profile">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </button>
            </div>
          </div>

          {/* Column 2: White Sub-Menu Panel */}
          <div className={dashSidebarSubPanel}>
            <div>
              <nav className={dashNavList}>
                <a href="#overview" className={dashNavItemActive}>
                  <svg className="w-4 h-4 shrink-0 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  <span>Overview</span>
                </a>
                <a href="#events" className={dashNavItemInactive}>
                  <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>My Events</span>
                </a>
                <a href="#paycheque" className={dashNavItemInactive}>
                  <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <span>Paycheque</span>
                </a>
                <a href="#report" className={dashNavItemInactive}>
                  <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span>Report</span>
                </a>
              </nav>
            </div>

            <div className={dashSidebarBottom}>
              <button type="button" className={dashLogoutBtn}>
                <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span>Logout</span>
              </button>
            </div>
          </div>

        </aside>

        {/* Center Main Content Area */}
        <main className={dashMainContentArea}>
          <div className={dashScrollableBody}>
            
            {/* Row 1: Add Event Card & Active Event Thumbnails */}
            <div className={dashTopGridRow}>
              <div className={dashAddEventCard}>
                <div className={dashAddEventHeader}>
                  <h3 className={dashAddEventTitle}>Add Event</h3>
                  <p className={dashAddEventSub}>Create a Event on Hubio<br />Give event attendees a better Event Experience.</p>
                </div>
                <button type="button" className={dashCreateEventBtn}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  <span>CREATE NEW EVENT</span>
                </button>
              </div>

              <div className={dashActiveEventCardBox}>
                <div className={dashMiniEventCard}>
                  <div className={dashMiniEventHeaderRow}>
                    <img src={Logo} alt="Event" className={dashMiniEventThumb} />
                    <div className={dashMiniEventInfo}>
                      <h4 className={dashMiniEventName}>Stand up comedy show</h4>
                      <span className={dashMiniEventCategory}>Event Completion</span>
                    </div>
                  </div>
                  <div className={dashMiniEventProgressBox}>
                    <div className={dashMiniEventProgressMeta}>
                      <span className={dashMiniEventProgressLabel}>Progress</span>
                      <span className={dashMiniEventProgressVal}>67%</span>
                    </div>
                    <div className={dashProgressBarBg}>
                      <div className={dashProgressBarFillGreen} style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>

                <div className={dashMiniEventCard}>
                  <div className={dashMiniEventHeaderRow}>
                    <img src={Logo} alt="Event" className={dashMiniEventThumb} />
                    <div className={dashMiniEventInfo}>
                      <h4 className={dashMiniEventName}>Graphics meetup</h4>
                      <span className={dashMiniEventCategory}>Event Completion</span>
                    </div>
                  </div>
                  <div className={dashMiniEventProgressBox}>
                    <div className={dashMiniEventProgressMeta}>
                      <span className={dashMiniEventProgressLabel}>Progress</span>
                      <span className={dashMiniEventProgressVal}>35%</span>
                    </div>
                    <div className={dashProgressBarBg}>
                      <div className={dashProgressBarFillOrange} style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>

                <div className={dashMiniEventCard}>
                  <div className={dashMiniEventHeaderRow}>
                    <img src={Logo} alt="Event" className={dashMiniEventThumb} />
                    <div className={dashMiniEventInfo}>
                      <h4 className={dashMiniEventName}>DIGI Tech Freelancers</h4>
                      <span className={dashMiniEventCategory}>Event Completion</span>
                    </div>
                  </div>
                  <div className={dashMiniEventProgressBox}>
                    <div className={dashMiniEventProgressMeta}>
                      <span className={dashMiniEventProgressLabel}>Progress</span>
                      <span className={dashMiniEventProgressVal}>54%</span>
                    </div>
                    <div className={dashProgressBarBg}>
                      <div className={dashProgressBarFillBlue} style={{ width: '54%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Stats Cards */}
            <div className={dashStatsRowGrid}>
              <div className={dashStatCard}>
                <div className={dashStatCardHeaderRow}>
                  <div className={dashStatCardTitleBox}>
                    <span className={dashStatCardIconCircle}>🎫</span>
                    <span>Total Tickets</span>
                  </div>
                  <button type="button" className={dashStatDropdownBtn}>
                    <span>Total</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                <div className={dashStatNumberRow}>
                  <span className={dashStatMainVal}>10.000</span>
                  <span className={dashStatTrendBadgeGreen}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    <span>Update +200 05/01/2025</span>
                  </span>
                </div>
              </div>

              <div className={dashStatCard}>
                <div className={dashStatCardHeaderRow}>
                  <div className={dashStatCardTitleBox}>
                    <span className={dashStatCardIconCircle}>🎟️</span>
                    <span>Tickets Sold</span>
                  </div>
                  <button type="button" className={dashStatDropdownBtn}>
                    <span>Total</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                <div className={dashStatNumberRow}>
                  <span className={dashStatMainVal}>9.741</span>
                  <span className={dashStatTrendBadgeRed}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    <span>Down 1.4% from last week</span>
                  </span>
                </div>
              </div>

              <div className={dashStatCard}>
                <div className={dashStatCardHeaderRow}>
                  <div className={dashStatCardTitleBox}>
                    <span className={dashStatCardIconCircle}>💰</span>
                    <span>Total Revenue</span>
                  </div>
                  <button type="button" className={dashStatDropdownBtn}>
                    <span>Total</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                <div className={dashStatNumberRow}>
                  <span className={dashStatMainVal}>320</span>
                  <span className={dashStatTrendBadgeGreen}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    <span>Up by 2.9% this week</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: Analytics Graphs */}
            <div className={dashAnalyticsGridRow}>
              <div className={dashDonutCard}>
                <div className={dashSectionCardHeader}>
                  <h3 className={dashCardSectionTitle}>Total Ticket / Ticket Type</h3>
                </div>
                
                <div className={dashDonutVisualContainer}>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-blue-600" strokeWidth="4" stroke="currentColor" fill="none" strokeDasharray="45, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" strokeWidth="4" stroke="currentColor" fill="none" strokeDasharray="25, 100" strokeDashoffset="-45" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-purple-600" strokeWidth="4" stroke="currentColor" fill="none" strokeDasharray="15, 100" strokeDashoffset="-70" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-amber-400" strokeWidth="4" stroke="currentColor" fill="none" strokeDasharray="15, 100" strokeDashoffset="-85" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className={dashDonutCenterTextBox}>
                    <span className={dashDonutCenterMainVal}>9,741 / 259</span>
                    <span className={dashDonutCenterSubLabel}>Sold / Available</span>
                  </div>
                </div>

                <div className={dashDonutLegendGrid}>
                  <div className={dashLegendItemRow}><span className={dashLegendDotBlue}></span><span>Event A</span></div>
                  <div className={dashLegendItemRow}><span className={dashLegendDotGreen}></span><span>Event B</span></div>
                  <div className={dashLegendItemRow}><span className={dashLegendDotPurple}></span><span>Event C</span></div>
                  <div className={dashLegendItemRow}><span className={dashLegendDotYellow}></span><span>Event D</span></div>
                </div>
              </div>

              <div className={dashBarChartCard}>
                <div className={dashSectionCardHeader}>
                  <h3 className={dashCardSectionTitle}>Tiket Sales Analytics</h3>
                </div>

                <div className={dashBarChartBody}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={day} className={dashBarGroupWrapper}>
                      <div className={dashBarColumnsContainer}>
                        <div className={dashBarColPrimary} style={{ height: `${(idx + 3) * 12}%` }}></div>
                        <div className={dashBarColSecondary} style={{ height: `${(idx + 2) * 10}%` }}></div>
                        <div className={dashBarColAccent} style={{ height: `${(idx + 1) * 14}%` }}></div>
                      </div>
                      <span className={dashBarAxisLabel}>{day}</span>
                    </div>
                  ))}
                </div>

                <div className={dashBarChartLegendRow}>
                  <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-blue-600"></span><span>VIP Ticket</span></div>
                  <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-amber-400"></span><span>Gold Ticket</span></div>
                  <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-purple-600"></span><span>Festival Tickets</span></div>
                </div>
              </div>
            </div>

            {/* Row 4: Buyers List Table */}
            <div className={dashBuyersListCard}>
              <div className={dashBuyersHeaderRow}>
                <h3 className={dashCardSectionTitle}>Buyers List</h3>
                
                <div className={dashBuyersFilterGroup}>
                  <div className={dashSearchInputWrapper}>
                    <input type="text" placeholder="Search ticket ID, name, etc." className={dashSearchInputBox} />
                  </div>
                  <button type="button" className={dashFilterDropdownBtn}>
                    <span>Filter</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button type="button" className={dashFilterDropdownBtn}>
                    <span>Ticket Type</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button type="button" className={dashFilterDropdownBtn}>
                    <span>January 2025</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              </div>

              <div className={dashTableContainer}>
                <table className={dashTableStyled}>
                  <thead>
                    <tr className={dashTableHeadRow}>
                      <th className={dashTableHeadTh}>Ticket ID</th>
                      <th className={dashTableHeadTh}>Name</th>
                      <th className={dashTableHeadTh}>Email</th>
                      <th className={dashTableHeadTh}>Phone Number</th>
                      <th className={dashTableHeadTh}>Ticket Type</th>
                      <th className={dashTableHeadTh}>Date & Time</th>
                      <th className={dashTableHeadTh}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className={dashTableBodyRow}>
                      <td className={dashTableBodyTd}>TS9741</td>
                      <td className={dashTableBodyTd}>Stefanie Corn</td>
                      <td className={dashTableBodyTd}>stef233@exp.com</td>
                      <td className={dashTableBodyTd}>08999323122</td>
                      <td className={dashTableBodyTd}>VIP Ticket</td>
                      <td className={dashTableBodyTd}>21/01/2025 9:32 AM</td>
                      <td className={dashTableBodyTd}>
                        <span className={dashStatusBadgePaid}>● Paid</span>
                      </td>
                    </tr>
                    <tr className={dashTableBodyRow}>
                      <td className={dashTableBodyTd}>TS9740</td>
                      <td className={dashTableBodyTd}>Jian Liam</td>
                      <td className={dashTableBodyTd}>liam99@exp.com</td>
                      <td className={dashTableBodyTd}>08942323550</td>
                      <td className={dashTableBodyTd}>VIP Ticket</td>
                      <td className={dashTableBodyTd}>21/01/2025 9:32 AM</td>
                      <td className={dashTableBodyTd}>
                        <span className={dashStatusBadgeCancelled}>● Cancelled</span>
                      </td>
                    </tr>
                    <tr className={dashTableBodyRow}>
                      <td className={dashTableBodyTd}>TS9741</td>
                      <td className={dashTableBodyTd}>Pedi Rian</td>
                      <td className={dashTableBodyTd}>rianz@exp.com</td>
                      <td className={dashTableBodyTd}>0899933244</td>
                      <td className={dashTableBodyTd}>Festival Ticket</td>
                      <td className={dashTableBodyTd}>21/01/2025 9:32 AM</td>
                      <td className={dashTableBodyTd}>
                        <span className={dashStatusBadgePaid}>● Paid</span>
                      </td>
                    </tr>
                    <tr className={dashTableBodyRow}>
                      <td className={dashTableBodyTd}>TS9739</td>
                      <td className={dashTableBodyTd}>Beri Stefan</td>
                      <td className={dashTableBodyTd}>beristf@exp.com</td>
                      <td className={dashTableBodyTd}>08999932102</td>
                      <td className={dashTableBodyTd}>Festival Ticket</td>
                      <td className={dashTableBodyTd}>21/01/2025 9:32 AM</td>
                      <td className={dashTableBodyTd}>
                        <span className={dashStatusBadgePending}>● Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={dashTableFooterRow}>
                <span>Show 12 of 300 results</span>
                <div className={dashPaginationBox}>
                  <span className={dashPaginationNumActive}>1</span>
                  <span className={dashPaginationNumInactive}>2</span>
                  <span className={dashPaginationNumInactive}>3</span>
                  <span className={dashPaginationNumInactive}>...</span>
                  <span className={dashPaginationNumInactive}>30</span>
                </div>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="pt-4 pb-2 text-center text-xs text-slate-400 font-medium">
              Showishere © 2026 – All rights reserved
            </div>

          </div>
        </main>

        {/* Right Sidebar Wallet & Timeline Column */}
        <aside className={dashRightCalendarColumn}>
          <div className={dashWalletCardBox}>
            <p className={dashWalletTitleText}>Your Wallet</p>
            <h2 className={dashWalletBalanceAmount}>₹1,00,320.00</h2>
          </div>

          <div className={dashCalendarSectionBox}>
            <div className={dashCalendarHeaderRow}>
              <span className={dashCalendarHeaderTitle}>Calendar</span>
              <button type="button" className="text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
            </div>
            <h4 className={dashCalendarDateSubText}>Sunday, 5 July, 2020</h4>

            <div className="space-y-3 pt-3">
              <div className={dashScheduleEventItemCard}>
                <span className={dashScheduleEventTime}>8:30 AM - 9:30 AM</span>
                <h5 className={dashScheduleEventName}>Stand up comedy show</h5>
                <p className={dashScheduleEventLocation}>Auditorium Hall, Sector 5</p>
              </div>

              <div className={dashScheduleEventItemCard}>
                <span className={dashScheduleEventTime}>12:00 PM - 2:00 PM</span>
                <h5 className={dashScheduleEventName}>Graphics Meetup</h5>
                <p className={dashScheduleEventLocation}>Cyber Sphere Hub, Venue Suid</p>
              </div>

              <div className={dashScheduleEventItemCard}>
                <span className={dashScheduleEventTime}>3:00 PM - 4:00 PM</span>
                <h5 className={dashScheduleEventName}>Product Meetup</h5>
                <p className={dashScheduleEventLocation}>Cyber Sphere Hub, Venue Suid</p>
              </div>

              <div className={dashScheduleEventItemCard} style={{ borderLeft: '3px solid #10B981', backgroundColor: '#ECFDF5' }}>
                <span className={dashScheduleEventTime}>5:00 PM - 6:00 PM</span>
                <h5 className={dashScheduleEventName}>Design review with Cambic Client</h5>
                <p className={dashScheduleEventLocation}>Online Meet</p>
              </div>
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
};

export default Dashboard;