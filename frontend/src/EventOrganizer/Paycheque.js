import React, { useState, useRef } from 'react';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';
import EventOrgLefSidebar from './EventOrgLefSidebar';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody,
  paychequeWrapper,
  paychequeMetricGrid,
  paychequeBalanceCard,
  paychequeCardHeader,
  paychequeCardLabel,
  paychequeHelpIcon,
  paychequeAmountText,
  paychequeCardFooterBlue,
  paychequeViewTxLink,
  paychequeStandardCard,
  paychequeCardFooterWhite,
  paychequeRequestBtn,
  paychequeRecentPayoutHeader,
  paychequePayoutRow,
  paychequePayoutDate,
  paychequePayoutVal,
  paychequeTransactionSection,
  paychequeSectionHeaderRow,
  paychequeSectionTitle,
  paychequeTabsGroup,
  paychequeTabActive,
  paychequeTabInactive,
  paychequeUpdateText,
  paychequeUpdateBtn,
  paychequeFilterBar,
  paychequeSearchWrapper,
  paychequeSearchInput,
  paychequeSearchIcon,
  paychequeDropdownBtn,
  paychequeDropdownMenu,
  paychequeDropdownMenuRight,
  paychequeDropdownItem,
  paychequeTableWrapper,
  paychequeTable,
  paychequeTableHead,
  paychequeTh,
  paychequeThRight,
  paychequeTr,
  paychequeTdDate,
  paychequeTdCategory,
  paychequeTdId,
  paychequeTdAmount,
  paychequeSuccessBadge,
  paychequeProgressBadge,
  paychequeEmptyTd,
  paychequeTableFooter,
  paychequePaginationGroup,
  paychequePageBtn,
  paychequePageBtnActive,
  paychequeBottomActionsRow,
  paychequeBottomDropdownMenu
} from '../styles/MasterCSSClass';

const Paycheque = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [selectedMonth, setSelectedMonth] = useState('October 2025');
  
  const [showTransactions, setShowTransactions] = useState(false);
  const transactionListRef = useRef(null);

  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isBottomMonthDropdownOpen, setIsBottomMonthDropdownOpen] = useState(false);

  const dateRanges = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'];
  const monthsList = [
    'October 2026', 'September 2026', 'August 2026', 'July 2026', 'June 2026', 'May 2026', 'April 2026', 'March 2026', 'February 2026', 'January 2026',
    'October 2025', 'September 2025', 'August 2025', 'July 2025', 'June 2025', 'May 2025', 'April 2025', 'March 2025', 'February 2025', 'January 2025'
  ];

  const allTransactions = [
    { date: '15 October 2025 • 20:23', monthYear: 'October 2025', category: 'Send Money', id: 'TXN12345678', status: 'Success', amount: '3.000.00' },
    { date: '10 October 2025 • 14:12', monthYear: 'October 2025', category: 'Send Money', id: 'TXN12345679', status: 'Success', amount: '3.120.00' },
    { date: '05 October 2025 • 09:45', monthYear: 'October 2025', category: 'Receive Money', id: 'TXN12345680', status: 'Success', amount: '2.500.00' },
    { date: '22 September 2025 • 18:30', monthYear: 'September 2025', category: 'Send Money', id: 'TXN12345681', status: 'Success', amount: '4.120.00' },
    { date: '14 September 2025 • 11:20', monthYear: 'September 2025', category: 'Receive Money', id: 'TXN12345682', status: 'Success', amount: '1.800.00' },
    { date: '19 August 2025 • 16:15', monthYear: 'August 2025', category: 'Top Up', id: 'TXN12345683', status: 'In Progress', amount: '3.120.00' },
    { date: '08 July 2025 • 12:00', monthYear: 'July 2025', category: 'Receive Money', id: 'TXN12345684', status: 'Success', amount: '5.000.00' },
    { date: '12 June 2025 • 10:10', monthYear: 'June 2025', category: 'Send Money', id: 'TXN12345685', status: 'Success', amount: '2.200.00' }
  ];

  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = tx.monthYear === selectedMonth;
    
    if (!matchesMonth) return false;

    if (activeTab === 'Money Sent') return matchesSearch && tx.category === 'Send Money';
    if (activeTab === 'Money Received') return matchesSearch && tx.category === 'Receive Money';
    return matchesSearch;
  });

  const handleToggleTransactionClick = (e) => {
    e.preventDefault();
    const nextState = !showTransactions;
    setShowTransactions(nextState);
    if (nextState) {
      setTimeout(() => {
        transactionListRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsMonthDropdownOpen(false);
    setIsBottomMonthDropdownOpen(false);
  };

  return (
    <div className={dashLayoutWrapper}>
      
      <EventOrgHeader />

      <div className={dashBodyFlexContainer}>
        
        <EventOrgLefSidebar />

        <main className={dashMainContentArea}>
          <div className={`${dashScrollableBody} ${paychequeWrapper}`}>
            
            {/* Top 3 Metric Cards Row */}
            <div className={paychequeMetricGrid}>
              
              {/* Total Balance Card */}
              <div className={paychequeBalanceCard}>
                <div>
                  <div className={paychequeCardHeader}>
                    <span className={paychequeCardLabel}>Total Balance</span>
                    <span className={paychequeHelpIcon}>?</span>
                  </div>
                  <h2 className={paychequeAmountText}>₹ 27,500.00</h2>
                </div>
                <div className={paychequeCardFooterBlue}>
                  <a 
                    href="#transaction-list" 
                    onClick={handleToggleTransactionClick} 
                    className={paychequeViewTxLink}
                  >
                    {showTransactions ? 'Hide Transaction' : 'View Transaction'}
                  </a>
                </div>
              </div>

              {/* Funds Available Card */}
              <div className={paychequeStandardCard}>
                <div>
                  <div className={paychequeCardHeader}>
                    <span className={paychequeCardLabel}>Funds Available</span>
                    <span className={paychequeHelpIcon}>?</span>
                  </div>
                  <h2 className={paychequeAmountText}>₹ 3,500.00</h2>
                </div>
                <div className={paychequeCardFooterWhite}>
                  <button type="button" className={paychequeRequestBtn}>
                    Request Payment
                  </button>
                </div>
              </div>

              {/* Recent Payouts Card */}
              <div className={paychequeStandardCard}>
                <div>
                  <div className={paychequeRecentPayoutHeader}>
                    <span className={paychequeCardLabel}>Recent Payouts</span>
                    <span className={paychequeHelpIcon}>?</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className={paychequePayoutRow}>
                      <span className={paychequePayoutDate}>On 02.09.2026</span>
                      <span className={paychequePayoutVal}>₹ 3,500.00</span>
                    </div>
                    <div className={paychequePayoutRow}>
                      <span className={paychequePayoutDate}>On 02.09.2026</span>
                      <span className={paychequePayoutVal}>₹ 3,500.00</span>
                    </div>
                  </div>
                </div>
                <div className={`${paychequeCardFooterWhite} invisible`}>
                  <span className="text-xs">Placeholder</span>
                </div>
              </div>

            </div>

            {/* Transaction List Section & Bottom Action Buttons */}
            {showTransactions && (
              <div ref={transactionListRef} className="space-y-6 scroll-mt-6">
                
                <div className={paychequeTransactionSection}>
                  
                  {/* Section Header & Tabs */}
                  <div className={paychequeSectionHeaderRow}>
                    <div className="space-y-1">
                      <h3 className={paychequeSectionTitle}>Transaction List</h3>
                      <div className={paychequeTabsGroup}>
                        <button 
                          type="button" 
                          onClick={() => setActiveTab('All')}
                          className={activeTab === 'All' ? paychequeTabActive : paychequeTabInactive}
                        >
                          All Transaction
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setActiveTab('Money Sent')}
                          className={activeTab === 'Money Sent' ? paychequeTabActive : paychequeTabInactive}
                        >
                          Money Sent
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setActiveTab('Money Received')}
                          className={activeTab === 'Money Received' ? paychequeTabActive : paychequeTabInactive}
                        >
                          Money Received
                        </button>
                      </div>
                    </div>

                    <div className={paychequeUpdateText}>
                      <span>Last updated - 1 hour ago</span>
                      <button type="button" className={paychequeUpdateBtn}>🔄</button>
                    </div>
                  </div>

                  {/* Filters Bar */}
                  <div className={paychequeFilterBar}>
                    <div className={paychequeSearchWrapper}>
                      <input 
                        type="text" 
                        placeholder="Search Transaction ID" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={paychequeSearchInput}
                      />
                      <span className={paychequeSearchIcon}>  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
                    </div>

                    {/* Range Dropdown */}
                    <div className="relative">
                      <button 
                        type="button" 
                        onClick={() => setIsRangeDropdownOpen(!isRangeDropdownOpen)}
                        className={paychequeDropdownBtn}
                      >
                        <span>{selectedRange}</span>
                        <span>▼</span>
                      </button>

                      {isRangeDropdownOpen && (
                        <div className={paychequeDropdownMenu}>
                          {dateRanges.map((range, idx) => (
                            <button 
                              key={idx}
                              onClick={() => { setSelectedRange(range); setIsRangeDropdownOpen(false); }}
                              className={paychequeDropdownItem}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Select Month Dropdown */}
                    <div className="relative">
                      <button 
                        type="button" 
                        onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                        className={paychequeDropdownBtn}
                      >
                        <span className="flex items-center space-x-2">
                          <span>📅</span>
                          <span>{selectedMonth}</span>
                        </span>
                        <span>▲</span>
                      </button>

                      {isMonthDropdownOpen && (
                        <div className={paychequeDropdownMenuRight}>
                          {monthsList.map((m, idx) => (
                            <button 
                              key={idx}
                              onClick={() => handleMonthSelect(m)}
                              className={paychequeDropdownItem}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className={paychequeTableWrapper}>
                    <table className={paychequeTable}>
                      <thead>
                        <tr className={paychequeTableHead}>
                          <th className={paychequeTh}>Transaction Date ↕</th>
                          <th className={paychequeTh}>Category ↕</th>
                          <th className={paychequeTh}>Transaction ID ↕</th>
                          <th className={paychequeTh}>Status ↕</th>
                          <th className={paychequeThRight}>Amount ↕</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((tx, idx) => (
                            <tr key={idx} className={paychequeTr}>
                              <td className={paychequeTdDate}>{tx.date}</td>
                              <td className={paychequeTdCategory}>{tx.category}</td>
                              <td className={paychequeTdId}>{tx.id}</td>
                              <td className="py-4 px-3">
                                {tx.status === 'Success' && (
                                  <span className={paychequeSuccessBadge}>
                                    <span>Success</span>
                                  </span>
                                )}
                                {tx.status === 'In Progress' && (
                                  <span className={paychequeProgressBadge}>
                                    <span>In Progress</span>
                                  </span>
                                )}
                              </td>
                              <td className={paychequeTdAmount}>₹ {tx.amount}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className={paychequeEmptyTd}>
                              No transactions found for {selectedMonth}.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer & Pagination */}
                  <div className={paychequeTableFooter}>
                    <span>Showing {filteredTransactions.length} entries</span>
                    <div className={paychequePaginationGroup}>
                      <button type="button" className={paychequePageBtn}>‹</button>
                      <button type="button" className={paychequePageBtnActive}>1</button>
                      <button type="button" className={paychequePageBtn}>›</button>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions Row */}
                <div className={paychequeBottomActionsRow}>
                  <div className="relative">
                    <button type="button" className={paychequeDropdownBtn}>
                      <span className="flex items-center space-x-2">
                        <span>📥</span>
                        <span>Download Statement</span>
                      </span>
                      <span>▼</span>
                    </button>
                  </div>

                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setIsBottomMonthDropdownOpen(!isBottomMonthDropdownOpen)}
                      className={paychequeDropdownBtn}
                    >
                      <span className="flex items-center space-x-2">
                        <span>📅</span>
                        <span>{selectedMonth}</span>
                      </span>
                      <span>▼</span>
                    </button>

                    {isBottomMonthDropdownOpen && (
                      <div className={paychequeBottomDropdownMenu}>
                        {monthsList.map((m, idx) => (
                          <button 
                            key={idx}
                            onClick={() => handleMonthSelect(m)}
                            className={paychequeDropdownItem}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>

      </div>

      <EventOrgFooter />

    </div>
  );
};

export default Paycheque;