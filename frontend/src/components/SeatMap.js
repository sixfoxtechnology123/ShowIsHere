import React, { useState } from 'react';
import API from '../utils/api';
import {
  seatMapWrapper,
  seatMapHeader,
  seatMapBody,
  seatMapSidebar,
  seatMapCanvasArea,
  zoomToolbar,
  canvasBoard,
  canvasGridBg,
  stageBox,
  sectionCard,
  propertiesSidebar,
  seatMapFooter,
  sidebarToggleBtn,
  sidebarSectionTitle,
  sidebarListContainer,
  sidebarItemCard,
  sidebarDivider,
  sidebarTemplateCard,
  sidebarInstructionBox,
  sidebarInstructionTitle
} from '../styles/MasterCSSClass';

const SeatMap = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState('creator');

  // State toggles for hiding/showing sidebars
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const [sections, setSections] = useState([
    { 
      id: 1, 
      name: 'West Stand (VIP)', 
      category: 'VIP', 
      price: 2500, 
      rows: 5, 
      seatsPerRow: 12, 
      x: 50, 
      y: 120, 
      useCustomRows: false,
      rowConfig: [
        { rowName: 'A', seatsCount: 4 },
        { rowName: 'B', seatsCount: 4 },
        { rowName: 'C', seatsCount: 2 },
        { rowName: 'D', seatsCount: 2 }
      ],
      seats: generateSeats(5, 12) 
    },
    { 
      id: 2, 
      name: 'East Stand (Premium)', 
      category: 'Premium', 
      price: 1500, 
      rows: 5, 
      seatsPerRow: 12, 
      x: 320, 
      y: 120, 
      useCustomRows: false,
      rowConfig: [],
      seats: generateSeats(5, 12) 
    },
    { 
      id: 3, 
      name: 'North Stand (General)', 
      category: 'Economy', 
      price: 800, 
      rows: 4, 
      seatsPerRow: 16, 
      x: 100, 
      y: 360, 
      useCustomRows: false,
      rowConfig: [],
      seats: generateSeats(4, 16) 
    }
  ]);

  const [selectedSectionId, setSelectedSectionId] = useState(1);
  const [stageConfig, setStageConfig] = useState({ name: 'MAIN STAGE / SCREEN', width: 200, height: 30 });

  function generateSeats(rowCount, seatCount) {
    const seatMap = {};
    const rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for (let r = 0; r < rowCount; r++) {
      for (let s = 1; s <= seatCount; s++) {
        const seatKey = `${rowNames[r]}-${s}`;
        seatMap[seatKey] = { status: 'available', type: 'standard' };
      }
    }
    return seatMap;
  }

  function generateCustomSeats(rowConfig) {
    const seatMap = {};
    rowConfig.forEach(row => {
      for (let s = 1; s <= row.seatsCount; s++) {
        const seatKey = `${row.rowName}-${s}`;
        seatMap[seatKey] = { status: 'available', type: 'standard' };
      }
    });
    return seatMap;
  }

  const activeSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, secId) => {
    if (viewMode === 'preview') return;
    setDraggingId(secId);
    const sec = sections.find(s => s.id === secId);
    setDragOffset({ x: e.clientX - sec.x, y: e.clientY - sec.y });
    setSelectedSectionId(secId);
  };

  const handleMouseMove = (e) => {
    if (!draggingId || viewMode === 'preview') return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setSections(sections.map(sec => 
      sec.id === draggingId ? { ...sec, x: Math.max(10, newX), y: Math.max(10, newY) } : sec
    ));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const loadTemplate = (type) => {
    if (type === 'Football Ground') {
      setStageConfig({ name: 'PLAYING FIELD', width: 450, height: 70 });
      setSections([
        { id: 1, name: 'West Stand', category: 'VIP', price: 2000, rows: 6, seatsPerRow: 14, x: 40, y: 140, useCustomRows: false, rowConfig: [], seats: generateSeats(6, 14) },
        { id: 2, name: 'East Stand', category: 'VIP', price: 2000, rows: 6, seatsPerRow: 14, x: 380, y: 140, useCustomRows: false, rowConfig: [], seats: generateSeats(6, 14) },
        { id: 3, name: 'North Stand', category: 'General', price: 750, rows: 4, seatsPerRow: 20, x: 120, y: 360, useCustomRows: false, rowConfig: [], seats: generateSeats(4, 20) },
      ]);
    } else if (type === 'Theatre' || type === 'Auditorium') {
      setStageConfig({ name: 'THEATRE STAGE', width: 500, height: 60 });
      setSections([
        { id: 1, name: 'Stalls', category: 'Premium', price: 1800, rows: 6, seatsPerRow: 15, x: 120, y: 150, useCustomRows: false, rowConfig: [], seats: generateSeats(6, 15) },
        { id: 2, name: 'Balcony', category: 'Standard', price: 1000, rows: 4, seatsPerRow: 15, x: 120, y: 370, useCustomRows: false, rowConfig: [], seats: generateSeats(4, 15) },
      ]);
    } else {
      setStageConfig({ name: 'MAIN SCREEN', width: 350, height: 50 });
      setSections([
        { id: 1, name: 'General Arena', category: 'Standard', price: 500, rows: 5, seatsPerRow: 10, x: 200, y: 180, useCustomRows: false, rowConfig: [], seats: generateSeats(5, 10) }
      ]);
    }
  };

  const handleSeatClick = (secId, seatKey) => {
    setSections(sections.map(sec => {
      if (sec.id === secId) {
        const currentSeat = sec.seats[seatKey];
        let nextStatus = 'available';
        if (currentSeat.status === 'available') nextStatus = 'blocked';
        else if (currentSeat.status === 'blocked') nextStatus = 'wheelchair';
        else if (currentSeat.status === 'wheelchair') nextStatus = 'sold';
        else nextStatus = 'available';

        return {
          ...sec,
          seats: { ...sec.seats, [seatKey]: { ...currentSeat, status: nextStatus } }
        };
      }
      return sec;
    }));
  };

  const handlePropertyChange = (field, value) => {
    setSections(sections.map(sec => {
      if (sec.id === selectedSectionId) {
        let updatedSec = { ...sec, [field]: value };
        if (field === 'rows' || field === 'seatsPerRow') {
          if (!updatedSec.useCustomRows) {
            updatedSec.seats = generateSeats(field === 'rows' ? value : sec.rows, field === 'seatsPerRow' ? value : sec.seatsPerRow);
          }
        }
        return updatedSec;
      }
      return sec;
    }));
  };

  const handleToggleCustomRows = (checked) => {
    setSections(sections.map(sec => {
      if (sec.id === selectedSectionId) {
        const initialCustomConfig = [
          { rowName: 'A', seatsCount: 4 },
          { rowName: 'B', seatsCount: 4 },
          { rowName: 'C', seatsCount: 2 },
          { rowName: 'D', seatsCount: 2 }
        ];
        return {
          ...sec,
          useCustomRows: checked,
          rowConfig: checked ? initialCustomConfig : sec.rowConfig,
          seats: checked ? generateCustomSeats(initialCustomConfig) : generateSeats(sec.rows, sec.seatsPerRow)
        };
      }
      return sec;
    }));
  };

  const handleCustomRowChange = (index, newSeatsCount) => {
    setSections(sections.map(sec => {
      if (sec.id === selectedSectionId) {
        const updatedConfig = [...sec.rowConfig];
        updatedConfig[index].seatsCount = Number(newSeatsCount);
        return {
          ...sec,
          rowConfig: updatedConfig,
          seats: generateCustomSeats(updatedConfig)
        };
      }
      return sec;
    }));
  };

  const addNewElement = (typeName) => {
    const newId = Date.now();
    setSections([...sections, {
      id: newId,
      name: typeName,
      category: 'Standard',
      price: 1000,
      rows: 4,
      seatsPerRow: 10,
      x: 220,
      y: 220,
      useCustomRows: false,
      rowConfig: [],
      seats: generateSeats(4, 10)
    }]);
    setSelectedSectionId(newId);
  };

  const handleSaveMap = async () => {
    try {
      const payload = { stageConfig, sections };
      await API.post('/events/seatmap', payload);
      alert('Seat map successfully saved to Database!');
    } catch (err) {
      console.error('API Save Error:', err);
      alert('Failed to save. Please make sure your backend server endpoint /events/seatmap is active.');
    }
  };

  const totalSeats = sections.reduce((acc, s) => acc + Object.keys(s.seats).length, 0);

  return (
    <div 
      className={seatMapWrapper}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      
   {/* TOP ACTION BAR */}
<header className={`${seatMapHeader} justify-between px-6`}>
  {/* Left Toggle Controls & Zoom Controls */}
  <div className="flex items-center space-x-3">
    {viewMode === 'creator' && (
      <button 
        onClick={() => setShowLeftSidebar(!showLeftSidebar)}
        className={sidebarToggleBtn}
        title="Toggle Elements Sidebar"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={showLeftSidebar ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
        <span>{showLeftSidebar ? 'Hide Elements' : 'Show Elements'}</span>
      </button>
    )}

    {/* MOVED ZOOM CONTROLS HERE */}
    <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs">
      <span className="font-semibold text-slate-600">Zoom</span>
      <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} className="font-bold px-1.5 py-0.5 bg-white hover:bg-slate-200 rounded cursor-pointer border border-slate-200">-</button>
      <span className="font-bold text-slate-800">{zoomLevel}%</span>
      <button onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))} className="font-bold px-1.5 py-0.5 bg-white hover:bg-slate-200 rounded cursor-pointer border border-slate-200">+</button>
      <button onClick={() => setZoomLevel(100)} className="text-blue-600 font-semibold ml-1 cursor-pointer">Reset</button>
    </div>
  </div>

  {/* Right Action Buttons & Right Sidebar Toggle */}
  <div className="flex items-center space-x-3">
    <button 
      onClick={() => setViewMode(viewMode === 'creator' ? 'preview' : 'creator')}
      className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer border ${viewMode === 'preview' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'}`}
    >
      {viewMode === 'creator' ? '👁️ Preview' : '⚙️ Creator'}
    </button>

    {viewMode === 'creator' && (
      <button 
        onClick={() => setShowRightSidebar(!showRightSidebar)}
        className={sidebarToggleBtn}
        title="Toggle Properties Sidebar"
      >
        <span>Properties</span>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={showRightSidebar ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
      </button>
    )}

    <button 
      onClick={handleSaveMap}
      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-sm cursor-pointer"
    >
      Save
    </button>
  </div>
</header>

      {/* WORKSPACE AREA */}
      <div className={seatMapBody}>
        
        {/* LEFT SIDEBAR (Conditionally Shown) */}
      {viewMode === 'creator' && showLeftSidebar && (
        <aside className={seatMapSidebar}>
          <div>
            <h3 className={sidebarSectionTitle}>Map Elements</h3>
            <div className={sidebarListContainer}>
              <div onClick={() => addNewElement('VIP Box')} className={sidebarItemCard}>
                <span>🪑</span> <span>Seating Section</span>
              </div>
              <div onClick={() => addNewElement('Aisle Walkway')} className={sidebarItemCard}>
                <span>↕️</span> <span>Aisle / Walkway</span>
              </div>
              <div onClick={() => addNewElement('Entrance Gate')} className={sidebarItemCard}>
                <span>🚪</span> <span>Entrance / Exit Gate</span>
              </div>
              <div onClick={() => addNewElement('Wheelchair Deck')} className={sidebarItemCard}>
                <span>♿</span> <span>Accessibility Deck</span>
              </div>
            </div>
          </div>


          <div>
            <h3 className={sidebarSectionTitle}>Templates</h3>
            <div className={sidebarListContainer}>
              <div onClick={() => loadTemplate('Theatre')} className={sidebarTemplateCard}>🎭 Theatre</div>
              <div onClick={() => loadTemplate('Auditorium')} className={sidebarTemplateCard}>🏛️ Auditorium</div>
              <div onClick={() => loadTemplate('Concert Hall')} className={sidebarTemplateCard}>🎸 Concert Hall</div>
              <div onClick={() => loadTemplate('Football Ground')} className={sidebarTemplateCard}>⚽ Football Ground</div>
              <div onClick={() => loadTemplate('Custom')} className={sidebarTemplateCard}>📐 Custom Blank Map</div>
            </div>
          </div>

          <div className={sidebarInstructionBox}>
            <span className={sidebarInstructionTitle}>Quick Instructions:</span>
            <p>• Drag any section card around the canvas.</p>
            <p>• Click individual seats to change status.</p>
          </div>
        </aside>
      )}

        {/* CENTER CANVAS */}
        <main className={seatMapCanvasArea}>
          <div 
            className={canvasBoard}
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <div className={canvasGridBg}></div>

            {/* Stage / Screen Element */}
            <div 
              className={stageBox}
              style={{ width: `${stageConfig.width}px`, height: `${stageConfig.height}px` }}
            >
              {stageConfig.name}
            </div>

            {/* Render Sections */}
            {sections.map((sec) => {
              const isSelected = sec.id === selectedSectionId;

              const rowsMap = {};
              Object.keys(sec.seats).forEach(seatKey => {
                const rowLetter = seatKey.split('-')[0];
                if (!rowsMap[rowLetter]) rowsMap[rowLetter] = [];
                rowsMap[rowLetter].push(seatKey);
              });

              return (
                <div 
                  key={sec.id}
                  onMouseDown={(e) => handleMouseDown(e, sec.id)}
                  onClick={() => setSelectedSectionId(sec.id)}
                  style={{ top: `${sec.y}px`, left: `${sec.x}px` }}
                  className={`${sectionCard} ${
                    isSelected && viewMode === 'creator' ? 'border-blue-600 ring-4 ring-blue-50 z-30' : 'border-slate-300 hover:border-slate-400 z-10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-1">
                    <span className="font-extrabold text-xs text-slate-800">{sec.name}</span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">₹{sec.price}</span>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    {Object.entries(rowsMap).map(([rowLetter, seatKeys]) => (
                      <div key={rowLetter} className="flex items-center justify-center space-x-1">
                        <span className="text-[8px] font-bold w-3 text-slate-400 text-right pr-0.5">{rowLetter}</span>
                        <div className="flex space-x-1">
                          {seatKeys.map((seatKey) => {
                            const seatData = sec.seats[seatKey];
                            let badgeColor = 'bg-white text-slate-700 border-slate-300 hover:border-blue-500';
                            if (seatData.status === 'blocked') badgeColor = 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed';
                            if (seatData.status === 'sold') badgeColor = 'bg-rose-500 text-white border-rose-600 cursor-not-allowed';
                            if (seatData.status === 'wheelchair') badgeColor = 'bg-indigo-600 text-white border-indigo-700';

                            return (
                              <div 
                                key={seatKey} 
                                title={`Seat ${seatKey} - Status: ${seatData.status}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSeatClick(sec.id, seatKey);
                                }}
                                className={`w-5 h-5 rounded-[5px] border text-[8px] flex items-center justify-center font-bold transition-transform hover:scale-110 cursor-pointer ${badgeColor}`}
                              >
                                {seatData.status === 'wheelchair' ? '♿' : seatKey.split('-')[1]}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          </div>
        </main>

        {/* RIGHT SIDEBAR (Conditionally Shown) */}
        {viewMode === 'creator' && showRightSidebar && (
          <aside className={propertiesSidebar}>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-1 uppercase tracking-wider">Section Properties</h3>
              <p className="text-slate-400 text-[11px]">Customize active section parameters</p>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Section Name</label>
                <input 
                  type="text" 
                  value={activeSection.name} 
                  onChange={(e) => handlePropertyChange('name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ticket Category</label>
                <select 
                  value={activeSection.category} 
                  onChange={(e) => handlePropertyChange('category', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="VIP">VIP</option>
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Economy">Economy</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Price per Seat (₹)</label>
                <input 
                  type="number" 
                  value={activeSection.price} 
                  onChange={(e) => handlePropertyChange('price', Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Toggle for Custom Row Configuration */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center space-x-2 cursor-pointer mb-3">
                  <input 
                    type="checkbox" 
                    checked={activeSection.useCustomRows || false}
                    onChange={(e) => handleToggleCustomRows(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="font-bold text-slate-700 text-xs">Enable Custom Row Lengths</span>
                </label>

                {activeSection.useCustomRows ? (
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Seats per Row Configuration</span>
                    {activeSection.rowConfig.map((row, idx) => (
                      <div key={row.rowName} className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Row {row.rowName}:</span>
                        <input 
                          type="number" 
                          min="1" max="25"
                          value={row.seatsCount}
                          onChange={(e) => handleCustomRowChange(idx, e.target.value)}
                          className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-center font-medium"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Rows</label>
                      <input 
                        type="number" 
                        min="1" max="10"
                        value={activeSection.rows} 
                        onChange={(e) => handlePropertyChange('rows', Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Seats / Row</label>
                      <input 
                        type="number" 
                        min="1" max="25"
                        value={activeSection.seatsPerRow} 
                        onChange={(e) => handlePropertyChange('seatsPerRow', Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button 
                onClick={() => {
                  const filtered = sections.filter(s => s.id !== activeSection.id);
                  if (filtered.length === 0) {
                    alert("You must have at least one section.");
                    return;
                  }
                  setSections(filtered);
                  setSelectedSectionId(filtered[0].id);
                }}
                className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold py-2.5 rounded-xl transition cursor-pointer"
              >
                Delete Section
              </button>
            </div>
          </aside>
        )}

      </div>

      {/* BOTTOM STATUS BAR */}
      <footer className={seatMapFooter}>
        <div className="flex items-center space-x-6">
          <div><span className="font-bold text-slate-900">{totalSeats}</span> Total Capacity</div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-white border border-slate-400 rounded-full inline-block"></span> <span>Available</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-slate-300 rounded-full inline-block"></span> <span>Blocked</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-indigo-600 rounded-full inline-block"></span> <span>Wheelchair ♿</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span> <span>Sold</span></div>
        </div>
        <div className="text-slate-400">
          Status: {viewMode === 'creator' ? '⚙️ Creator Mode (Click seats to change status)' : '👁️ Customer Preview Mode'}
        </div>
      </footer>

    </div>
  );
};

export default SeatMap;