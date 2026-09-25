import React, { useState } from 'react';
import homeArt from './../assets/homePage/home2.png'; 

const HomePage = () => {
  const [selectedTier, setSelectedTier] = useState('ROYAL');
  const seatCount = 2;

  const tiers = [
    { name: 'ROYAL', price: 'INR 3000', icon: '👑' },
    { name: 'VIP', price: 'INR 2500', icon: '⭐' },
    { name: 'PLATINUM', price: 'INR 2000', icon: '💎' },
    { name: 'DIAMOND', price: 'INR 1500', icon: '💎' },
    { name: 'GOLD', price: 'INR 1200', icon: '🏅' },
  ];

  return (
    // Outer container matching your page background so the notches punch out cleanly
    <div className="w-full flex justify-center bg-slate-100 p-4 ">
      
      {/* Main Ticket Wrapper */}
      <div className="relative flex w-full max-w-6xl  rounded-2xl overflow-hidden  items-stretch">

        {/* ================= SECTION 1: MAIN BODY (Left Tab + Content) ================= */}
        <div className="relative flex flex-1 bg-white rounded-l-2xl shadow-sm overflow-hidden">
          
          {/* 1 & 2. Left Edge Notches (Top-Left & Bottom-Left) */}
          <div className="absolute -left-3 top-8 w-6 h-6 bg-slate-100 rounded-full z-20"></div>
          <div className="absolute -left-3 bottom-8 w-6 h-6 bg-slate-100 rounded-full z-20"></div>

          {/* Left Blue Tab ("LIVE EVENT") */}
          <div className="bg-blue-600 text-white w-8 flex flex-col items-center justify-center py-6 gap-3 select-none relative">
            
            {/* Rotated Text */}
            <span className="text-[11px] tracking-widest font-semibold [writing-mode:vertical-lr] rotate-180">
              LIVE EVENT
            </span>

            {/* Star Icon placed safely in flex flow with a gap instead of absolute positioning */}
            <span className="text-sm opacity-90">★</span>

          </div>

          {/* Main Content Area */}
          <div className="flex-1 px-8 py-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-4">Gaaner Khata O Praner Kobita</h1>
              
              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-xl text-sm font-medium">
                  <span>📅</span>
                  <span>11 Sep 11:30 AM</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm">
                  <span>📅</span>
                  <span>11 Sep 02:30 PM</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold ml-2">
                  <span>📍</span>
                  <span>G D BIRLA SABHA GHAR</span>
                </div>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                {tiers.map((tier) => {
                  const isSelected = selectedTier === tier.name;
                  return (
                    <div 
                      key={tier.name} 
                      onClick={() => setSelectedTier(tier.name)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-600' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <input type="radio" checked={isSelected} readOnly className="accent-blue-600 w-4 h-4" />
                        <span className="text-sm">{tier.icon}</span>
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-800 tracking-wider">{tier.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{tier.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                <span className="text-xs text-slate-500 mr-3">Seats</span>
                <span className="text-blue-600 font-bold text-base">{seatCount}</span>
              </div>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                <span>🎟️</span> Book Tickets
              </button>
              <button className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-all">
                Details
              </button>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: MIDDLE PERFORATED DIVIDER ================= */}
        <div className="relative w-0 flex items-center justify-center z-20">
          {/* 3 & 4. Middle Seam Notches (Top-Middle & Bottom-Middle) */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-slate-100 rounded-full z-30"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-100 rounded-full z-30"></div>
          
          {/* Dashed line */}
          <div className="h-full border-r-2 border-dashed border-slate-300"></div>
        </div>

      {/* ================= SECTION 3: RIGHT ART SECTION ================= */}
        <div className="relative w-60 h-full min-h-[320px] bg-gradient-to-b from-slate-900 to-blue-950 flex flex-col items-center justify-center rounded-r-2xl overflow-hidden">
          
          {/* 5 & 6. Right Edge Notches (Top-Right & Bottom-Right) */}
          <div className="absolute -right-3 top-8 w-6 h-6 bg-slate-100 rounded-full z-20"></div>
          <div className="absolute -right-3 bottom-8 w-6 h-6 bg-slate-100 rounded-full z-20"></div>

          {/* Ticket Image Asset */}
          <img 
            src={homeArt} 
            alt="Event Ticket Art" 
            className="w-full h-full object-cover z-10"
          />

        </div>

      </div>
    </div>
  );
};

export default HomePage;