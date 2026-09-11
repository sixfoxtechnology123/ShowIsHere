import React, { useState } from 'react';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';
import EventOrgLefSidebar from './EventOrgLefSidebar';
import Logo from '../assets/Logo.jpeg';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody
} from '../styles/MasterCSSClass';

const MyEvents = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Event list with status and right-side vertical color line configuration matching your reference image
  const myEventsList = [
    {
      id: 'EV-01',
      name: 'Marketing Workshop #3',
      category: 'Workshop',
      date: '26',
      month: 'JANUARY',
      time: '16:00-19:00',
      description: 'WARP Sprints is a product we passionately created based on our 3-year-long experience in helping hundreds of startups from all over the world.',
      location: 'Mahajati Sadan, Kolkata',
      status: 'Live',
      statusColor: 'bg-emerald-500',
      rightBarColor: 'bg-emerald-500',
      isCancelled: false
    },
    {
      id: 'EV-02',
      name: 'Marketing Workshop #3',
      category: 'Workshop',
      date: '26',
      month: 'JANUARY',
      time: '16:00-19:00',
      description: 'WARP Sprints is a product we passionately created based on our 3-year-long experience in helping hundreds of startups from all over the world.',
      location: 'Mahajati Sadan, Kolkata',
      status: 'Pending approval',
      statusColor: 'bg-amber-500',
      rightBarColor: 'bg-amber-500',
      isCancelled: false
    },
    {
      id: 'EV-03',
      name: 'Marketing Workshop #3',
      category: 'Workshop',
      date: '26',
      month: 'JANUARY',
      time: '16:00-19:00',
      description: 'WARP Sprints is a product we passionately created based on our 3-year-long experience in helping hundreds of startups from all over the world.',
      location: 'Mahajati Sadan, Kolkata',
      status: 'Complete',
      statusColor: 'bg-blue-600',
      rightBarColor: 'bg-blue-600',
      isCancelled: false
    },
    {
      id: 'EV-04',
      name: 'Marketing Workshop #3',
      category: 'Workshop',
      date: '26',
      month: 'JANUARY',
      time: '16:00-19:00',
      description: 'WARP Sprints is a product we passionately created based on our 3-year-long experience in helping hundreds of startups from all over the world.',
      location: 'Mahajati Sadan, Kolkata',
      status: 'Cancelled',
      statusColor: 'bg-red-600',
      rightBarColor: 'bg-slate-300',
      isCancelled: true
    }
  ];

  const filteredEvents = myEventsList.filter(evt =>
    evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={dashLayoutWrapper}>
      
      {/* 1. FIXED TOP NAVBAR HEADER */}
      <EventOrgHeader />

      <div className={dashBodyFlexContainer}>
        
        {/* 2. FIXED LEFT SIDEBAR */}
        <EventOrgLefSidebar />

        {/* 3. MIDDLE SCROLLABLE CONTENT AREA */}
        <main className={dashMainContentArea}>
          {/* Generous left and right margins/padding creating the centered boxed view with space on sides */}
          <div className={`${dashScrollableBody} px-12 sm:px-20 lg:px-28 py-4`}>
            
            {/* Top Action Row: Create New Event Button & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
              <button 
                type="button" 
                className="inline-flex items-center space-x-2 px-3 py-2 bg-transparent text-blue-600 hover:text-blue-700 font-bold text-xs transition cursor-pointer shrink-0"
              >
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shadow-sm">+</span>
                <span>CREATE NEW EVENT</span>
              </button>

              <div className="relative w-full sm:w-80">
                <input 
                  type="text" 
                  placeholder="Search an event" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-sm px-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
                />
                <span className="absolute right-3.5 top-2.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
              </div>
            </div>

            {/* Events List Stack */}
            <div className="space-y-5">
              {filteredEvents.map((evt, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs flex flex-col md:flex-row items-stretch relative transition hover:shadow-md"
                >
                  
                  {/* Status Badge Top Right */}
                  <div className={`absolute top-0 right-0 ${evt.statusColor} text-white text-[10px] font-extrabold px-3 py-1 uppercase tracking-wider z-10`}>
                    {evt.status}
                  </div>

                  {/* Left Thumbnail Image */}
                  <div className="w-full md:w-52 h-44 md:h-auto shrink-0 relative bg-slate-100">
                    <img 
                      src={Logo} 
                      alt={evt.name} 
                      className={`w-full h-full object-cover ${evt.isCancelled ? 'grayscale opacity-60' : ''}`} 
                    />
                  </div>

                  {/* Vertical Color Line right next to Thumbnail Image */}
                  <div className={`w-1 shrink-0 ${evt.rightBarColor}`}></div>

                  {/* Middle Content Section */}
                  <div className="flex-1 px-6 py-4 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h3 className={`text-base font-bold ${evt.isCancelled ? 'text-slate-400' : 'text-slate-900'}`}>
                        {evt.name}
                      </h3>
                      
                      <div className="flex items-center space-x-3 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${evt.isCancelled ? 'bg-slate-300' : 'bg-pink-600'}`}></span>
                          <span>{evt.category}</span>
                        </span>
                        <span>👁️</span>
                        <span>🔗</span>
                      </div>

                      <p className={`text-xs leading-relaxed pt-1 ${evt.isCancelled ? 'text-slate-400' : 'text-slate-500'}`}>
                        {evt.description}
                      </p>
                    </div>

                    <div className={`flex items-center text-xs font-medium ${evt.isCancelled ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span className="mr-1.5 mb-8">📍</span>
                      <span className="mr-1.5 mb-8">{evt.location}</span>
                    </div>
                  </div>

                  {/* Right Date & Action Menu Section */}
                  <div className="w-full md:w-40 px-4 py-4 border-t md:border-t-0 md:border-l border-slate-100 flex flex-row md:flex-col items-center justify-between md:justify-center text-center relative bg-white">
                    
                    {/* Date Block */}
                    <div>
                      <h4 className={`text-2xl font-black ${evt.isCancelled ? 'text-slate-300' : 'text-pink-600'}`}>
                        {evt.date}
                      </h4>
                      <span className={`text-[10px] font-extrabold tracking-wider block ${evt.isCancelled ? 'text-slate-300' : 'text-slate-400'}`}>
                        {evt.month}
                      </span>
                      <span className={`text-[10px] block mt-1 ${evt.isCancelled ? 'text-slate-300' : 'text-slate-400'}`}>
                        🕒 {evt.time}
                      </span>
                    </div>

                    {/* Three-dots options menu button */}
                    <button 
                      type="button" 
                      className="absolute bottom-3 right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title="Options"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                  </div>

                </div>
              ))}
            </div>

          </div>
        </main>

      </div>

      {/* 5. FIXED FOOTER */}
      <EventOrgFooter />

    </div>
  );
};

export default MyEvents;