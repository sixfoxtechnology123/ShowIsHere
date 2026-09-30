import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';
import AgreementPdf from './AgreementPdf';
import SignAgrement from '../utils/SignAgrement';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody
} from '../styles/MasterCSSClass';

const statusClasses = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  accept: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  reject: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200'
};

const AdminApproval = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('events');
  const [events, setEvents] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPanImage, setSelectedPanImage] = useState(null);
  const [reKycAccount, setReKycAccount] = useState(null);
  const [reKycFields, setReKycFields] = useState([]);
  const [reKycReason, setReKycReason] = useState('');
  const [activeTab, setActiveTab] = useState('approve');
  const [eventSubTab, setEventSubTab] = useState('approve');
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [selectedCancelDetail, setSelectedCancelDetail] = useState(null);
  
  // State for opening the agreement inside a popup modal on the same page
  const [viewingAgreementId, setViewingAgreementId] = useState(null);


  const getPdfBlobUrl = (base64String) => {
  try {
    // Clean data prefix if present
    const base64Clean = base64String.includes('base64,') 
      ? base64String.split('base64,')[1] 
      : base64String;

    const byteCharacters = atob(base64Clean);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Blob conversion error:', error);
    return base64String; // Fallback
  }
};

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const [eventResponse, accountResponse] = await Promise.all([
        API.get('/events/admin/events'),
        API.get('/org/admin/accounts')
      ]);
      setEvents(Array.isArray(eventResponse.data) ? eventResponse.data : []);
      setAccounts(Array.isArray(accountResponse.data) ? accountResponse.data : []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch approvals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const updateEventStatus = async (event, status) => {
    const label = status === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${label} this event?`)) return;

    const reason = status === 'rejected'
      ? window.prompt('Reject reason (optional)', event.rejectionReason || '') || ''
      : '';

    try {
      const response = await API.put(`/events/admin/events/${event._id}/approval`, { status, reason });
      setEvents((prev) => prev.map((item) => (item._id === event._id ? response.data : item)));
      toast.success(`Event ${status}.`);
    } catch (error) {
      toast.error(error.message || 'Failed to update event.');
    }
  };

  const updateAccountStatus = async (account, status) => {
    const label = status === 'approved' ? 'approve' : 'reject';
    
    const confirmMessage = status === 'rejected'
      ? `Are you sure you want to reject this KYC?`
      : `Are you sure you want to ${label} this account?`;

    if (!window.confirm(confirmMessage)) return;

    const reason = '';

    try {
      const response = await API.put(`/org/admin/accounts/${account._id}/approval`, { status, reason });
      const updatedAccount = response.data?.data || response.data || response;

      if (status === 'rejected') {
        setAccounts((prev) => prev.filter((item) => item._id !== account._id));
      } else {
        setAccounts((prev) => prev.map((item) => (item._id === account._id ? { ...item, approvalStatus: 'approved', rekyc: false } : item)));
      }

      toast.success(`Account ${status}.`);
    } catch (error) {
      toast.error(error.message || 'Failed to update account.');
    }
  };

  const toggleReKycField = (field) => {
    setReKycFields((fields) => fields.includes(field) ? fields.filter((item) => item !== field) : [...fields, field]);
  };

  const submitReKyc = async () => {
    if (!reKycAccount || reKycFields.length === 0) {
      toast.error('Select at least one field for Re-KYC.');
      return;
    }
    try {
      const response = await API.post(`/org/admin/accounts/${reKycAccount._id}/rekyc`, { fields: reKycFields, reason: reKycReason });
      const updated = response.data || response;
      setAccounts((items) => items.map((item) => item._id === updated._id ? updated : item));
      setReKycAccount(null); setReKycFields([]); setReKycReason('');
      toast.success('Re-KYC request sent.');
    } catch (error) { toast.error(error.message || 'Unable to request Re-KYC.'); }
  };

  const updateCancelRequestStatus = async (event, cancelRequestId, status) => {
    const label = status === 'approved' ? 'accept' : 'reject';
    
    const confirmMessage = status === 'rejected'
      ? 'Are you sure you want to reject this cancellation request?'
      : `Are you sure you want to ${label} this cancellation request?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await API.put(`/events/admin/events/${event._id}/cancel-request/${cancelRequestId}`, { status });
      const updatedEvent = response.data.data || response.data;
      setEvents((prev) => prev.map((item) => (item._id === event._id ? updatedEvent : item)));
      toast.success(`Cancellation request ${status === 'approved' ? 'accepted' : 'rejected'}.`);
    } catch (error) {
      toast.error(error.message || 'Failed to update cancellation request.');
    }
  };

  const renderStatus = (rawStatus = 'PENDING') => {
    const status = (rawStatus || 'pending').toLowerCase();
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] font-bold uppercase ${statusClasses[status] || statusClasses.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className={dashLayoutWrapper}>
      <EventOrgHeader />
      <main className={dashMainContentArea}>
        <div className={`${dashScrollableBody} px-8 lg:px-12 py-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Approval</h1>
              <p className="text-xs text-slate-500 mt-1">Approve or reject submitted events and organizer accounts.</p>
            </div>
            <div className="inline-flex border border-slate-200 rounded-md overflow-hidden bg-white">
              <button type="button" onClick={() => setActiveSection('events')} className={`px-4 py-2 text-xs font-bold ${activeSection === 'events' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                Event Approval
              </button>
              <button type="button" onClick={() => setActiveSection('accounts')} className={`px-4 py-2 text-xs font-bold border-l border-slate-200 ${activeSection === 'accounts' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                Account Approval
              </button>
            </div>
          </div>

          {/* ── 3 SUB-TABS (Appears only when Event Approval is active) ── */}
          {activeSection === 'events' && (
            <div className="flex gap-2 mb-5 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setEventSubTab('approve')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                  eventSubTab === 'approve' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Event Approve
              </button>
              <button
                type="button"
                onClick={() => setEventSubTab('changes')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                  eventSubTab === 'changes' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Changes Request
              </button>
              <button
                type="button"
                onClick={() => setEventSubTab('cancel')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                  eventSubTab === 'cancel' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cancel Request
              </button>
            </div>
          )}

          {loading ? (
            <div className="bg-white border border-slate-200 px-5 py-8 text-center text-xs font-semibold text-slate-500">Loading approval data...</div>
          ) : activeSection === 'events' && eventSubTab === 'approve' ? (
            <div className="bg-white border border-slate-200 overflow-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Event</th>
                    <th className="text-left px-4 py-3">Organizer</th>
                    <th className="text-left px-4 py-3">Schedule / Venue</th>
                    <th className="text-left px-4 py-3">Details</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events
                    .filter((event) => (event.status || '').toUpperCase() !== 'DRAFT')
                    .map((event) => {
                      const normalizedStatus = (event.status || '').toLowerCase();
                      const isApproved = normalizedStatus === 'approved';
                      const isRejected = normalizedStatus === 'rejected';

                      return (
                        <tr key={event._id} className="align-top">
                          <td className="px-4 py-4">
                            <div className="font-bold text-slate-900">{event.eventName || 'Untitled'}</div>
                            <div className="text-slate-500 mt-1">{event.eventCategoryName || 'General Event'}</div>
                          </td>
                          <td className="px-4 py-2 text-slate-700">
                            <div>{event.loginMobileNumber}</div>
                            <div>{event.contactPerson?.email}</div>
                          </td>
                          <td className="px-4 py-2 text-slate-700">
                            <div>{event.schedule?.startDate ? new Date(event.schedule.startDate).toLocaleDateString() : 'No date'}</div>
                            <div>{event.schedule?.startTime || '--'} to {event.schedule?.endTime || '--'}</div>
                            <div>{[event.venue?.name, event.venue?.city].filter(Boolean).join(', ') || 'No venue'}</div>
                          </td>
                          <td className="px-4 py-2 text-slate-700">
                            <div>Format: {event.eventFormat || '-'}</div>
                            <div>Languages: {(event.eventLanguages || []).join(', ') || '-'}</div>
                            <div>Tickets: {event.ticketTiers?.length || 0}</div>
                          </td>
                          <td className="px-4 py-4">
                            {renderStatus(event.status)}
                            {event.rejectionReason && <div className="text-red-600 mt-2">Reason: {event.rejectionReason}</div>}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button 
                                type="button" 
                                disabled={isApproved} 
                                onClick={() => updateEventStatus(event, 'approved')} 
                                className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                  isApproved 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                              >
                                Approve
                              </button>
                              <button 
                                type="button" 
                                disabled={isRejected} 
                                onClick={() => updateEventStatus(event, 'rejected')} 
                                className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                  isRejected 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {events.length === 0 && <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-semibold">No events found.</td></tr>}
                </tbody>
              </table>
            </div>
          ) : activeSection === 'events' && eventSubTab === 'changes' ? (
            <div className="bg-white border border-slate-200 px-5 py-12 text-center text-xs font-semibold text-slate-500">
              Changes Request table will go here...
            </div>
          ) : activeSection === 'events' && eventSubTab === 'cancel' ? (
            <div className="bg-white border border-slate-200 overflow-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Request ID</th>
                    <th className="text-left px-4 py-3">Event ID</th>
                    <th className="text-left px-4 py-3">Event Name</th>
                    <th className="text-left px-4 py-3">Organizer</th>
                    <th className="text-left px-4 py-3">Requested On</th>
                    <th className="text-left px-4 py-3">Reason</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-center px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(events || [])
                    .flatMap((event) => 
                      (event.cancelHistory || []).map((cancelItem) => ({
                        ...cancelItem,
                        eventRef: event
                      }))
                    )
                    .sort((a, b) => new Date(b.cancelledAt || 0) - new Date(a.cancelledAt || 0))
                    .map((item) => {
                      const event = item.eventRef;
                      const latestStatus = (item.cancelRequest || '').toLowerCase();
                      const isProcessed = latestStatus === 'accept' || latestStatus === 'reject' || latestStatus === 'approved' || latestStatus === 'rejected';

                      return (
                        <tr key={item._id || item.requestId} className="align-top">
                          <td className="px-4 py-4 font-semibold text-slate-900">{item.requestId || '-'}</td>
                          <td className="px-4 py-4 text-slate-700">{event.createEventId || '-'}</td>
                          <td className="px-4 py-4 font-bold text-slate-900">{event.eventName || '-'}</td>
                          <td className="px-4 py-4 text-slate-700">{event.contactPerson?.name || '-'}</td>
                          <td className="px-4 py-4 text-slate-700">
                          {item.cancelledAt ? (
                            <div>
                              <div>{new Date(item.cancelledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                              <div className="text-slate-600 text-[11px] mt-0.5">
                                {new Date(item.cancelledAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
                              </div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                          <td className="px-4 py-4 text-slate-700">
                            <button
                              type="button"
                              onClick={() => setSelectedCancelDetail(item)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer transition"
                            >
                              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                              View Details
                            </button>
                          </td>
                          <td className="px-4 py-4 font-semibold uppercase text-slate-700">
                            {renderStatus(item.cancelRequest || 'pending')}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button 
                                type="button" 
                                disabled={isProcessed} 
                                onClick={() => updateCancelRequestStatus(event, item._id, 'approved')} 
                                className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                  isProcessed 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                                }`}
                              >
                                Accept
                              </button>
                              <button 
                                type="button" 
                                disabled={isProcessed} 
                                onClick={() => updateCancelRequestStatus(event, item._id, 'rejected')} 
                                className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                  isProcessed 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                    : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                                }`}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  {(events || []).flatMap(e => e.cancelHistory || []).length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-slate-500 font-semibold">No cancel requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-slate-300 overflow-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Account</th>
                    <th className="text-left px-4 py-3">Contact</th>
                    <th className="text-left px-4 py-3">KYC / Bank</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-center px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {accounts.map((account) => {
                    const normalizedStatus = (account.approvalStatus || account.status || '').toLowerCase();
                    const isApproved = normalizedStatus === 'approved';
                    const isRejected = normalizedStatus === 'rejected';
                    const panImageUrl = account.panCardDocument?.base64Data || account.panCardImage || account.panImage;

                    return (
                      <tr key={account._id} className="align-top">
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900">{account.orgName}</div>
                          <div className="text-slate-500 mt-1">{account.orgAddress || account.city || '-'}</div>
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          <div>{account.contactFullName || '-'}</div>
                          <div>{account.contactEmail}</div>
                          <div>{account.loginMobileNumber || account.contactMobile}</div>
                        </td>
                        <td className="px-4 py-2 text-slate-700 space-y-1">
                          <div>PAN: {account.panNumber || '-'}</div>
                          {panImageUrl && (
                            <div>
                              <button 
                                type="button" 
                                onClick={() => setSelectedPanImage(panImageUrl)} 
                                className="text-blue-600 underline font-semibold hover:text-blue-800 cursor-pointer"
                              >
                                View PAN Card Image
                              </button>
                            </div>
                          )}
                          <div>GST: {account.gstinNumber || '-'}</div>
                          <div>Holder: {account.accountHolderName || '-'}</div>
                          <div>A/C: {account.accountNumber || '-'} ({account.accountType || '-'})</div>
                          {account.signinAgreement && (
                            <div>
                              <button 
                                type="button" 
                                onClick={() => setViewingAgreementId(account._id)}
                                className="text-blue-600 underline font-semibold hover:text-blue-800 cursor-pointer"
                              >
                                View signed agreement
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {renderStatus(account.approvalStatus || account.status)}
                          {account.rekyc && <div className="text-amber-600 mt-1 font-semibold">Re-KYC Requested</div>}
                          {account.rejectionReason && <div className="text-red-600 mt-2">Reason: {account.rejectionReason}</div>}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="inline-flex gap-2">
                            <button 
                              type="button" 
                              disabled={account.rekyc === true}
                              onClick={() => { setReKycAccount(account); setReKycFields(account.reKycFields || []); setReKycReason(''); }} 
                              className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                account.rekyc === true
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none'
                                  : 'bg-amber-500 text-white hover:bg-amber-600 cursor-pointer'
                              }`}
                            >
                              Re-KYC
                            </button>
                            <button 
                              type="button" 
                              disabled={isApproved || account.rekyc === true} 
                              onClick={() => updateAccountStatus(account, 'approved')} 
                              className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                (isApproved || account.rekyc === true)
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                              }`}
                            >
                              Approve
                            </button>
                            <button 
                              type="button" 
                              disabled={isRejected} 
                              onClick={() => updateAccountStatus(account, 'rejected')} 
                              className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                isRejected 
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                  : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {accounts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-slate-500 font-semibold">No accounts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

{/* Cancellation Reason & Description Popup Modal */}
{selectedCancelDetail && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
    <div className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900">Cancellation Request Details ({selectedCancelDetail?.requestId || ''})</h3>
        <button 
          type="button" 
          onClick={() => setSelectedCancelDetail(null)} 
          className="text-slate-400 hover:text-slate-600 text-base font-bold cursor-pointer"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4 text-xs text-slate-700">
        <div>
          <span className="font-bold text-slate-900 block mb-1">Reason:</span>
          <p className="bg-slate-50 p-2.5 rounded border border-slate-200">{selectedCancelDetail?.reason || '-'}</p>
        </div>
        <div>
          <span className="font-bold text-slate-900 block mb-1">Description:</span>
          <p className="bg-slate-50 p-2.5 rounded border border-slate-200 whitespace-pre-wrap">{selectedCancelDetail?.description || 'No description provided.'}</p>
        </div>
        
        {/* Centered View Document Link with Hover Effect */}
        {Array.isArray(selectedCancelDetail?.documentPaths) && selectedCancelDetail.documentPaths[0] && (
          <div className="pt-2 text-center">
            <span className="font-bold text-slate-900 block mb-1.5">Attached Document:</span>
            <div className="bg-slate-50 p-3 rounded border border-slate-200 flex flex-col items-center justify-center space-y-2">
              {/* <span className="text-slate-600 text-[11px]">{selectedCancelDetail?.documentNames?.[0] || 'Document'}</span> */}
              <button
                type="button"
                onClick={() => {
                  const docPath = selectedCancelDetail.documentPaths[0];
                  const isPdf = docPath.includes('pdf') || docPath.startsWith('JVBERi0') || docPath.startsWith('data:application/pdf');

                  if (isPdf) {
                    const blobUrl = getPdfBlobUrl(docPath);
                    window.open(blobUrl, '_blank');
                  } else {
                    setSelectedAttachment(docPath);
                  }
                }}
                className="text-blue-600 hover:text-blue-800 font-bold text-xs underline cursor-pointer transition"
              >
                View Document 
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      {/* Agreement Popup Modal */}
      {viewingAgreementId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
            <div className="overflow-y-auto flex-1 w-full">
              <AgreementPdf 
                orgId={viewingAgreementId} 
                onClose={() => setViewingAgreementId(null)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* PAN Card Image Popup Modal */}
      {selectedPanImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-md max-w-lg w-full p-4 relative shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900">PAN Card Document</h3>
              <button 
                type="button" 
                onClick={() => setSelectedPanImage(null)} 
                className="text-slate-400 hover:text-slate-600 text-base font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center bg-slate-100 p-2 rounded-sm overflow-hidden">
              <img src={selectedPanImage} alt="PAN Card" className="max-h-[70vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Re-KYC Modal */}
      {reKycAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Select Re-KYC option</h3>
                  <p className="text-[11px] text-slate-500">{reKycAccount.orgName}</p>
                </div>
              </div>
              <button type="button" onClick={() => setReKycAccount(null)} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-bold cursor-pointer">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ['accountHolderName', 'Account holder name'],
                  ['accountNumber', 'Account number'],
                  ['accountType', 'Account type'],
                  ['bankName', 'Bank name'],
                  ['bankIfsc', 'IFSC code'],
                  ['panNumber', 'PAN number'],
                  ['gstinNumber', 'GSTIN'],
                  ['uploadPanDocuments', 'Upload PAN document']
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center gap-3 text-xs font-medium text-slate-700 cursor-pointer select-none">
                    <input type="checkbox" checked={reKycFields.includes(value)} onChange={() => toggleReKycField(value)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                    {label}
                  </label>
                ))}
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Write reason:</label>
                <textarea value={reKycReason} onChange={(event) => setReKycReason(event.target.value)} rows="4" placeholder="Enter reason for re-KYC..." className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setReKycAccount(null)} className="px-5 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button
                  type="button"
                  onClick={submitReKyc}
                  disabled={reKycFields.length === 0}
                  className={`px-6 py-2 text-xs font-semibold rounded-lg shadow-sm transition ${
                    reKycFields.length > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 inline-block mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <EventOrgFooter />
    </div>
  );
};

export default AdminApproval;