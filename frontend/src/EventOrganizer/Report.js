import React, { useState } from 'react';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';
import EventOrgLefSidebar from './EventOrgLefSidebar';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody,
  reportWrapper,
  reportTabsHeader,
  reportTabActive,
  reportTabInactive,
  reportFilterRow,
  reportFilterGroup,
  reportDropdownButton,
  reportRefreshBtn,
  reportMetricsGrid,
  reportMetricCard,
  reportMetricValue,
  reportMetricLabel,
  reportSectionCard,
  reportSectionTitle,
  reportTable,
  reportTableHead,
  reportTh,
  reportThRight,
  reportTr,
  reportTrBold,
  reportTdItem,
  reportTdVal,
  reportChartsGrid,
  reportChartCard,
  reportChartContentLayout,
  reportDonutContainer,
  reportDonutCenterBox,
  reportLegendListHorizontal,
  reportLegendRow,
  reportLegendInfo,
  reportLegendDot
} from '../styles/MasterCSSClass';

const Report = () => {
  const [activeMainTab, setActiveMainTab] = useState('Sales');
  const [selectedEvent, setSelectedEvent] = useState('IMF MOUNTAIN FILM FESTIVAL (KOLKATA SCREENING)');
  const [selectedTimeRange, setSelectedTimeRange] = useState('ALL TIME');
  
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const eventList = [
    'IMF MOUNTAIN FILM FESTIVAL (KOLKATA SCREENING)',
    'Marketing Workshop #3',
    'Stand up comedy show',
    'DIGI Tech Freelancers'
  ];

  const timeRanges = ['ALL TIME', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];

  const summaryData = [
    { item: 'Online Tickets Sales', quantity: 272, amount: 0 },
    { item: 'Offline Tickets Sales', quantity: 0, amount: 0 },
    { item: 'Discounts', quantity: 0, amount: 0 },
    { item: 'Net Sales', quantity: 271, amount: 0, isBold: true },
    { item: 'Refunds & Cancellations', quantity: '-', amount: 0 },
    { item: 'Townscript Fee', quantity: '-', amount: 0 },
    { item: 'Tax on Townscript Fee', quantity: '-', amount: 0 },
    { item: 'Net Earnings', quantity: '-', amount: 0, isBold: true }
  ];

  const categoryModes = [
    { name: 'General Admission', count: '103 (38%)', color: 'bg-blue-600' },
    { name: 'VIP', count: '68 (25%)', color: 'bg-purple-600' },
    { name: 'Student', count: '41 (15%)', color: 'bg-emerald-500' },
    { name: 'Early Bird', count: '27 (10%)', color: 'bg-amber-400' },
    { name: 'Group Pass', count: '19 (7%)', color: 'bg-rose-500' },
    { name: 'Other', count: '13 (5%)', color: 'bg-slate-400' }
  ];

  return (
    <div className={dashLayoutWrapper}>
      
      <EventOrgHeader />

      <div className={dashBodyFlexContainer}>
        
        <EventOrgLefSidebar />

        <main className={dashMainContentArea}>
          <div className={`${dashScrollableBody} ${reportWrapper}`}>
            
            {/* Top Main Tabs */}
            <div className={reportTabsHeader}>
              <button 
                type="button" 
                onClick={() => setActiveMainTab('Sales')}
                className={activeMainTab === 'Sales' ? reportTabActive : reportTabInactive}
              >
                Sales
              </button>
              <button 
                type="button" 
                onClick={() => setActiveMainTab('Campaigns')}
                className={activeMainTab === 'Campaigns' ? reportTabActive : reportTabInactive}
              >
                Campaigns
              </button>
            </div>

            {/* Filter Bar Row */}
            <div className={reportFilterRow}>
              <div className={reportFilterGroup}>
                
                {/* Event Selector Dropdown */}
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                    className={reportDropdownButton}
                  >
                    <span className="font-bold text-slate-800">{selectedEvent}</span>
                    <span>▼</span>
                  </button>

                  {isEventDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-96 bg-white border border-slate-200 shadow-lg z-30 py-1">
                      {eventList.map((evt, idx) => (
                        <button 
                          key={idx}
                          onClick={() => { setSelectedEvent(evt); setIsEventDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium truncate"
                        >
                          {evt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Time Range Selector Dropdown */}
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                    className={reportDropdownButton}
                  >
                    <span className="font-bold text-slate-800">{selectedTimeRange}</span>
                    <span>▼</span>
                  </button>

                  {isTimeDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-40 bg-white border border-slate-200 shadow-lg z-30 py-1">
                      {timeRanges.map((tr, idx) => (
                        <button 
                          key={idx}
                          onClick={() => { setSelectedTimeRange(tr); setIsTimeDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          {tr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Refresh Button (Border Removed) */}
              <button type="button" className={reportRefreshBtn} title="Refresh">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>

              </button>
            </div>

            {/* Top 4 Metrics Cards */}
            <div className={reportMetricsGrid}>
              <div className={reportMetricCard}>
                <span className={reportMetricLabel}>Net Sales</span>
                <h3 className={reportMetricValue}>₹ 0</h3>
              </div>
              <div className={reportMetricCard}>
                <span className={reportMetricLabel}>Net Earnings</span>
                <h3 className={reportMetricValue}>₹ 0</h3>
              </div>
              <div className={reportMetricCard}>
                <span className={reportMetricLabel}>Refunds</span>
                <h3 className={reportMetricValue}>₹ 0</h3>
              </div>
              <div className={reportMetricCard}>
                <span className={reportMetricLabel}>Registration</span>
                <h3 className={reportMetricValue}>293</h3>
              </div>
            </div>

            {/* Summary Table Section */}
            <div className={reportSectionCard}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className={reportSectionTitle}>Summary</h4>
                {/* Download Button (Border Removed) */}
                <button type="button" title="Download" className="text-black font-bold text-xs bg-transparent border-none p-0 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                    </svg>
                    </button>
              </div>

              <div className="overflow-x-auto">
                <table className={reportTable}>
                  <thead>
                    <tr className={reportTableHead}>
                      <th className={reportTh}>Item</th>
                      <th className={reportTh}>Quantity</th>
                      <th className={reportThRight}>Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summaryData.map((row, idx) => (
                      <tr key={idx} className={row.isBold ? reportTrBold : reportTr}>
                        <td className={reportTdItem}>{row.item}</td>
                        <td className={reportTdItem}>{row.quantity}</td>
                        <td className={reportTdVal}>{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts Section Grid */}
            <div className={reportChartsGrid}>
              
              {/* Ticket Sales by Mode Chart */}
              <div className={reportChartCard}>
                <h4 className={reportSectionTitle}>Ticket Sales by Mode</h4>
                
                <div className={reportChartContentLayout}>
                  <div className={reportDonutContainer}>
                    <div 
                      className="w-32 h-32 rounded-full flex items-center justify-center relative shadow-xs"
                      style={{
                        background: 'conic-gradient(#2563eb 0deg 237.6deg, #10b981 237.6deg 360deg)'
                      }}
                    >
                      <div className="w-22 h-22 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-inner" style={{ width: '84px', height: '84px' }}>
                        <span className="text-xs font-black text-slate-900">₹ 27,500.00</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Sales</span>
                      </div>
                    </div>
                  </div>

                  <div className={reportLegendListHorizontal}>
                    <div className={reportLegendRow}>
                      <div className={reportLegendInfo}>
                        <span className={`${reportLegendDot} bg-blue-600`}></span>
                        <span>Online Sales</span>
                      </div>
                      <span className="font-bold">₹ 18,200.00 (66%)</span>
                    </div>
                    <div className={reportLegendRow}>
                      <div className={reportLegendInfo}>
                        <span className={`${reportLegendDot} bg-emerald-500`}></span>
                        <span>Offline Sales</span>
                      </div>
                      <span className="font-bold">₹ 9,300.00 (34%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales by Ticket Category Chart */}
              <div className={reportChartCard}>
                <h4 className={reportSectionTitle}>Sales by Ticket Category</h4>
                
                <div className={reportChartContentLayout}>
                  <div className={reportDonutContainer}>
                    <div 
                      className="w-32 h-32 rounded-full flex items-center justify-center relative shadow-xs"
                      style={{
                        background: 'conic-gradient(#2563eb 0deg 136.8deg, #9333ea 136.8deg 226.8deg, #10b981 226.8deg 280.8deg, #f59e0b 280.8deg 316.8deg, #f43f5e 316.8deg 342deg, #94a3b8 342deg 360deg)'
                      }}
                    >
                      <div className="w-22 h-22 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-inner" style={{ width: '84px', height: '84px' }}>
                        <span className="text-sm font-black text-slate-900">271</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Tickets</span>
                      </div>
                    </div>
                  </div>

                  <div className={reportLegendListHorizontal}>
                    {categoryModes.map((cat, idx) => (
                      <div key={idx} className={reportLegendRow}>
                        <div className={reportLegendInfo}>
                          <span className={`${reportLegendDot} ${cat.color}`}></span>
                          <span>{cat.name}</span>
                        </div>
                        <span className="font-bold">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>

      </div>

      <EventOrgFooter />

    </div>
  );
};

export default Report;