import React from 'react';
import EventOrgHeader from './../EventOrganizer/EventOrgHeader';
import EventOrgFooter from './../EventOrganizer/EventOrgFooter';
import EventOrgLefSidebar from './../EventOrganizer/EventOrgLefSidebar';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody,
  dashGridContainer,
  dashCardBase,
  dashCardHeaderFlex,
  dashCardTitle,
  dashCardMenuDots
} from '../styles/MasterCSSClass';

const EventDashboard = () => {
  return (
    <div className={dashLayoutWrapper}>
      
      {/* 1. FIXED TOP NAVBAR HEADER */}
      <EventOrgHeader />

      <div className={dashBodyFlexContainer}>
        
        {/* 2. FIXED LEFT SIDEBAR */}
        <EventOrgLefSidebar />

        {/* 3. MIDDLE SCROLLABLE CONTENT AREA */}
        <main className={dashMainContentArea}>
          <div className={dashScrollableBody}>
            <div className={dashGridContainer}>
          
          {/* Row 1, Column 1-8: Sale Trend Card */}
          <div className={`${dashCardBase} col-span-12 lg:col-span-8`}>
            <div className={dashCardHeaderFlex}>
              <div>
                <h3 className={dashCardTitle}>Sale Trend</h3>
                <div className="flex items-baseline space-x-6 mt-3">
                  <div>
                    <span className="text-xs text-slate-400 block">This week:</span>
                    <span className="text-2xl font-bold text-slate-900">$ 28 745</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Previous week:</span>
                    <span className="text-lg font-semibold text-slate-400">$ 12 980</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500">this week</span>
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                <span className={dashCardMenuDots}>...</span>
              </div>
            </div>
            
            {/* Visual SVG Waveform Mock matching Sale Trend */}
            <div className="mt-8 pt-4">
              <div className="flex justify-between text-xs text-slate-300 mb-2">
                <span>30 000</span>
                <span>15 000</span>
                <span>10 000</span>
                <span>5 000</span>
              </div>
              <div className="relative h-36 w-full flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 120" fill="none">
                  <path d="M0 90 Q 75 20, 150 90 T 300 90 T 450 30 T 600 70" stroke="#2563eb" strokeWidth="2.5" fill="none" />
                  <path d="M0 90 Q 75 20, 150 90 T 300 90 T 450 30 T 600 70 V 120 H 0 Z" fill="url(#blueGradient)" opacity="0.1" />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                  {/* Point Marker */}
                  <circle cx="450" cy="30" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2 border-t border-slate-100 pt-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span><span>Mon</span>
              </div>
            </div>
          </div>

          {/* Row 1, Column 9-12: Earlybird Ticket & Gross Sells */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* Earlybird Ticket Card */}
            <div className={dashCardBase}>
              <div className={dashCardHeaderFlex}>
                <h3 className={dashCardTitle}>Earlybird Ticket</h3>
                <span className={dashCardMenuDots}>...</span>
              </div>
              <div className="flex flex-col items-center my-2">
                <div className="relative w-28 h-28 rounded-full border-4 border-slate-100 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent -rotate-45"></div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-slate-900 block">78</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Sold Seats</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Total Seat</span>
                  <span className="font-bold text-slate-900 text-sm">300</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Gross</span>
                  <span className="font-bold text-blue-600 text-sm">$7500</span>
                </div>
              </div>
            </div>

            {/* Gross Sells Blue Header Card */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">Gross Sells</h3>
                <span className="text-white/60 font-bold">...</span>
              </div>
              <div className="text-2xl font-bold mb-3">$ 2 300</div>
              <div className="h-12 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" fill="none">
                  <path d="M0 30 Q 50 10, 100 25 T 200 10" stroke="#ffffff" strokeWidth="2" fill="none" />
                  <circle cx="140" cy="15" r="3" fill="#ffffff" />
                </svg>
              </div>
            </div>

          </div>

          {/* Row 2, Column 1-8: Recent Sells */}
          <div className={`${dashCardBase} col-span-12 lg:col-span-8`}>
            <div className={dashCardHeaderFlex}>
              <div>
                <h3 className={dashCardTitle}>Recent Sells</h3>
                <div className="flex items-center space-x-6 mt-2 text-xs">
                  <span className="text-slate-900 font-semibold">This week: <strong className="text-blue-600">78 tickets</strong></span>
                  <span className="text-slate-400">Previous week: 32 tickets</span>
                </div>
              </div>
              <span className={dashCardMenuDots}>...</span>
            </div>

            {/* Table or List Items */}
            <div className="mt-4 space-y-3">
              {[
                { name: 'Lora Walton', location: 'East Casper', type: 'EBT x 2', price: '$ 175', active: false },
                { name: 'Alma Gibbs', location: 'South Nathentown', type: 'REG x 2', price: '$ 175', active: true },
                { name: 'Eunice Brown', location: 'Donnelymouth', type: 'REG x 1', price: '$ 100', active: false },
                { name: 'Edna Marsh', location: 'Rutherfordview', type: 'REG x 1', price: '$ 100', active: false },
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl transition-all ${item.active ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-900'}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      <div className="w-full h-full bg-gradient-to-tr from-slate-300 to-slate-400 flex items-center justify-center text-xs font-bold text-white">
                        {item.name[0]}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold leading-tight">{item.name}</h4>
                      <p className={`text-xs ${item.active ? 'text-white/80' : 'text-slate-400'}`}>{item.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${item.active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{item.type}</span>
                    <span className="text-sm font-bold">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2, Column 9-12: Event Goals & Category */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* Event Goals Card */}
            <div className={dashCardBase}>
              <div className={dashCardHeaderFlex}>
                <h3 className={dashCardTitle}>Event Goals</h3>
                <span className={dashCardMenuDots}>...</span>
              </div>
              <div className="flex flex-col items-center my-2">
                <div className="relative w-28 h-28 rounded-full border-4 border-slate-100 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-l-transparent rotate-45"></div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-slate-900 block">290</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Total Seats</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Event Goal</span>
                  <span className="font-bold text-slate-900 text-sm">290</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Sold Seats</span>
                  <span className="font-bold text-rose-500 text-sm">78</span>
                </div>
              </div>
            </div>

            {/* Category Donut Card */}
            <div className={dashCardBase}>
              <div className={dashCardHeaderFlex}>
                <h3 className={dashCardTitle}>Category</h3>
                <span className={dashCardMenuDots}>...</span>
              </div>
              <div className="flex flex-col items-center my-2">
                <div className="relative w-24 h-24 rounded-full border-4 border-rose-400 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent rotate-90"></div>
                  <div className="text-center">
                    <span className="text-xl font-bold text-slate-900 block">880</span>
                    <span className="text-[9px] text-slate-400">Ticket Sold</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-100 text-xs text-center">
                <div className="w-1/2 border-r border-slate-100">
                  <span className="font-bold text-slate-900 text-sm block">660</span>
                  <span className="text-slate-400 text-[10px]">Male Participant</span>
                </div>
                <div className="w-1/2">
                  <span className="font-bold text-slate-900 text-sm block">220</span>
                  <span className="text-slate-400 text-[10px]">Female Participant</span>
                </div>
              </div>
            </div>

          </div>

            </div>
          </div>
        </main>

      </div>

      {/* 5. FIXED FOOTER */}
      <EventOrgFooter />

    </div>
  );
};

export default EventDashboard;