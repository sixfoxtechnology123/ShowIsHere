import React, { useState, useRef } from 'react';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';
import EventOrgLefSidebar from './EventOrgLefSidebar';
import userAvatar from '../assets/avatar.jpg';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody,
  dashTopGridRow,
  dashAddEventCard,
  dashAddEventHeader,
  dashAddEventTitle,
  dashAddEventSub,
  dashActiveEventCardBox,
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
  dashCalendarHeaderTitle,
  dashCalendarDateSubText
} from '../styles/MasterCSSClass';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState('2020-07-05');
  const dateInputRef = useRef(null);
  const timelineHours = [
    { time: '6 AM', event: null },
    { time: '7 AM', event: null },
    { time: '8 AM', event: null },
    { 
      time: '9 AM', 
      event: { 
        timeSlot: '8:30 AM - 9:30 AM', 
        name: 'Stand up comedy show', 
        location: 'Auditorium Hall, Sector 5',
        border: 'border-r-4 border-purple-600',
        bg: 'bg-purple-50/90'
      } 
    },
    { time: '10 AM', event: null },
    { time: '11 AM', event: null },
    { 
      time: '12 PM', 
      event: { 
        timeSlot: '12:00 PM - 2:00 PM', 
        name: 'Graphics Meetup', 
        secondName: 'Product Meetup',
        location: 'C-203, Silver hub, Vesu, Surat.',
        border: 'border-r-4 border-pink-500',
        bg: 'bg-pink-50/90'
      } 
    },
    { time: '1 PM', event: null },
    { time: '2 PM', event: null },
    { time: '3 PM', event: null },
    { time: '4 PM', event: null },
    { 
      time: '5 PM', 
      event: { 
        timeSlot: '5:00 PM - 6:00 PM', 
        name: 'Design review with Cambr Client', 
        border: 'border-r-4 border-emerald-500',
        bg: 'bg-emerald-50/90'
      } 
    },
    { time: '6 PM', event: null },
    { time: '7 PM', event: null },
    { time: '8 PM', event: null },
    { time: '9 PM', event: null },
    { time: '10 PM', event: null }
  ];

  return (
    <div className={dashLayoutWrapper}>
      
      {/* 1. FIXED TOP NAVBAR HEADER */}
      <EventOrgHeader />

      <div className={dashBodyFlexContainer}>
        
        {/* FIXED LEFT SIDEBAR */}
        <EventOrgLefSidebar />

        {/* 3. MIDDLE SCROLLABLE CONTENT AREA */}
        <main className={dashMainContentArea}>
          <div className={dashScrollableBody}>
            
            {/* Row 1: Add Event Card & Active Event Thumbnails */}
            <div className={dashTopGridRow}>
              <div className={dashAddEventCard}>
                <div className={dashAddEventHeader}>
                  <h3 className={dashAddEventTitle}>Add Event</h3>
                  <p className={dashAddEventSub}>Create a Eevent on Hubio.<br />Give event attendees a better Event Experience.</p>
                </div>
                <button type="button" className="inline-flex items-center space-x-3 text-blue-600 hover:text-blue-700 font-bold text-xs transition cursor-pointer mt-4">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </span>
                  <span>CREATE NEW EVENT</span>
                </button>
              </div>

              <div className={dashActiveEventCardBox}>
                {/* Card 1: Green Theme */}
                <div className="bg-emerald-100/70 border-0 rounded-3xl px-3 py-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="flex flex-col space-y-4 mb-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <span className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-white text-[10px] font-bold text-slate-700 shadow-sm">+49</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">Stand up comedy show</h4>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-medium text-slate-600">Event Completion</span>
                      <span className="font-extrabold text-slate-800">67%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Orange/Peach Theme */}
                <div className="bg-amber-100/70 border-0 rounded-3xl px-3 py-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="flex flex-col space-y-4 mb-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <span className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-white text-[10px] font-bold text-slate-700 shadow-sm">+49</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">Graphics meetup</h4>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-medium text-slate-600">Event Completion</span>
                      <span className="font-extrabold text-slate-800">32%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Blue Theme */}
                <div className="bg-sky-100/70 border-0 rounded-3xl px-3 py-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="flex flex-col space-y-4 mb-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" src={userAvatar} alt="" />
                      <span className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-white text-[10px] font-bold text-slate-700 shadow-sm">+49</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">DIGI Tech Freelancers</h4>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-medium text-slate-600">Event Completion</span>
                      <span className="font-extrabold text-slate-800">54%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '54%' }}></div>
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
                      <td className={dashTableBodyTd}><span className={dashStatusBadgePaid}>● Paid</span></td>
                    </tr>
                    <tr className={dashTableBodyRow}>
                      <td className={dashTableBodyTd}>TS9740</td>
                      <td className={dashTableBodyTd}>Jian Liam</td>
                      <td className={dashTableBodyTd}>liam99@exp.com</td>
                      <td className={dashTableBodyTd}>08942323550</td>
                      <td className={dashTableBodyTd}>VIP Ticket</td>
                      <td className={dashTableBodyTd}>21/01/2025 9:32 AM</td>
                      <td className={dashTableBodyTd}><span className={dashStatusBadgeCancelled}>● Cancelled</span></td>
                    </tr>
                    <tr className={dashTableBodyRow}>
                      <td className={dashTableBodyTd}>TS9741</td>
                      <td className={dashTableBodyTd}>Pedi Rian</td>
                      <td className={dashTableBodyTd}>rianz@exp.com</td>
                      <td className={dashTableBodyTd}>0899933244</td>
                      <td className={dashTableBodyTd}>Festival Ticket</td>
                      <td className={dashTableBodyTd}>21/01/2025 9:32 AM</td>
                      <td className={dashTableBodyTd}><span className={dashStatusBadgePaid}>● Paid</span></td>
                    </tr>
                    <tr className={dashTableBodyRow}>
                      <td className={dashTableBodyTd}>TS9739</td>
                      <td className={dashTableBodyTd}>Beri Stefan</td>
                      <td className={dashTableBodyTd}>beristf@exp.com</td>
                      <td className={dashTableBodyTd}>08999932102</td>
                      <td className={dashTableBodyTd}>Festival Ticket</td>
                      <td className={dashTableBodyTd}>21/01/2025 9:32 AM</td>
                      <td className={dashTableBodyTd}><span className={dashStatusBadgePending}>● Pending</span></td>
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

          </div>
        </main>

        {/* SCROLLABLE TIMELINE FROM 6 AM ONWARDS */}
        <aside className={dashRightCalendarColumn}>
          
          {/* FIXED WALLET & CALENDAR HEADER SECTION */}
          <div className="p-4 bg-white border-b border-slate-100 shrink-0">
            <div className={dashWalletCardBox}>
              <p className={dashWalletTitleText}>Your Wallet</p>
              <h2 className={dashWalletBalanceAmount}>₹1,00,320.00</h2>
            </div>

            <div className="px-2 pt-4 flex items-center justify-between">
              <div>
                <span className={dashCalendarHeaderTitle}>Calendar</span>
                <h4 className={dashCalendarDateSubText}>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h4>
              </div>

              {/* Clickable Calendar Icon with Hidden Date Picker Trigger */}
              <div className="relative">
                <input 
                  type="date" 
                  ref={dateInputRef}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  title="Choose date"
                />
                <button 
                  type="button" 
                  onClick={() => dateInputRef.current?.showPicker?.()}
                  className="w-9 h-9 rounded-xl border border-sky-100 bg-sky-50/50 flex items-center justify-center text-sky-400 hover:bg-sky-100 transition shrink-0 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 13l1.5 1.5L14.5 11" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* SCROLLABLE TIMELINE BODY */}
          <div className={dashCalendarSectionBox}>
            <div className="space-y-4 pt-2">
              {timelineHours.map((slot, index) => (
                <div key={index} className="flex items-start text-xs">
                  <span className="w-12 text-slate-400 font-medium pt-1 shrink-0 leading-tight">{slot.time}</span>
                  <div className="flex-1 border-t border-slate-100 min-h-[3.5rem] relative">
                    
                    {/* Render box ONLY if slot has an event name */}
                    {slot.event && slot.event.name && (
                      <div className={`absolute top-1 left-2 right-0 ${slot.event.bg} p-3 rounded-none shadow-none z-10`}>
                        
                        {/* 9 AM Event Format */}
                        {slot.time === '9 AM' && (
                          <>
                            <h5 className="font-bold text-purple-900 text-xs mb-1">{slot.event.name}</h5>
                            <div className="relative flex items-center my-1.5">
                              <div className="absolute -left-3 w-2 h-2 rounded-full bg-purple-600"></div>
                              <div className="w-full border-t border-purple-400"></div>
                            </div>
                            <span className="text-[10px] text-purple-600 font-medium">{slot.event.timeSlot}</span>
                          </>
                        )}

                        {/* 12 PM Multi-Event Simple Box Format matching your image */}
                        {slot.time === '12 PM' && (
                          <div className="space-y-2.5">
                            <div>
                              <h5 className="font-bold text-pink-600 text-xs">{slot.event.name}</h5>
                              <span className="text-[10px] text-pink-400 font-medium">{slot.event.timeSlot}</span>
                            </div>
                            <div>
                              <h5 className="font-bold text-pink-600 text-xs">{slot.event.secondName}</h5>
                              <p className="text-[10px] text-pink-400 font-medium truncate">{slot.event.location}</p>
                            </div>
                          </div>
                        )}

                        {/* 5 PM Event Format */}
                        {slot.time === '5 PM' && (
                          <>
                            <h5 className="font-bold text-emerald-900 text-xs mb-1">{slot.event.name}</h5>
                            <span className="text-[10px] text-emerald-600 font-medium">{slot.event.timeSlot}</span>
                          </>
                        )}

                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>

      {/* 5. FIXED FOOTER AT THE VERY BOTTOM */}
      <EventOrgFooter />

    </div>
  );
};

export default Dashboard;