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
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200'
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
  const [rejectCancelItem, setRejectCancelItem] = useState(null);
  const [rejectCancelReason, setRejectCancelReason] = useState('');
  const [viewingAgreementId, setViewingAgreementId] = useState(null);
  const [deleteEventItem, setDeleteEventItem] = useState(null);
  const [resubmitEventItem, setResubmitEventItem] = useState(null);
  const [resubmitFields, setResubmitFields] = useState([]);
  const [resubmitReason, setResubmitReason] = useState('');
  const [viewEventModalData, setViewEventModalData] = useState(null);
  const [masterArtists, setMasterArtists] = useState([]);
  const [seatMapImage, setSeatMapImage] = useState(null);
  const [isSeatMapModalOpen, setIsSeatMapModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);
  const [modalPan, setModalPan] = useState({ x: 0, y: 0 });
  const [isDraggingModalImg, setIsDraggingModalImg] = useState(false);
  const [modalDragOrigin, setModalDragOrigin] = useState({ x: 0, y: 0 });


  useEffect(() => {
  API.get('/artists')
    .then((res) => {
      const artistArray = Array.isArray(res) ? res : (res?.data || res?.artists || []);
      setMasterArtists(artistArray);
    })
    .catch((err) => console.error("Error loading artists:", err));
}, []);
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


const renderCellData = (data, fieldName) => {
  if (!data) return '-';

  // Handle Arrays (like artists, hashtags, etc.)
  if (Array.isArray(data)) {
    if (fieldName === 'artists') {
      return (
        <div className="space-y-2 max-h-40 overflow-y-auto py-1">
          {data.map((artist, idx) => (
            <div key={idx} className="flex items-center gap-2.5 ">
              {artist.photoUrl ? (
                <img 
                  src={artist.photoUrl} 
                  alt={artist.artistName} 
                  className="w-10 h-10 object-cover rounded-full shrink-0 border border-slate-200" 
                />
              ) : (
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-500 font-bold shrink-0">
                  No Pic
                </div>
              )}
              <div className="text-left leading-tight">
                <div className="font-bold text-slate-900">{artist.artistName || 'Unnamed'}</div>
                <div className="text-[10px] text-slate-500">{artist.role || 'Artist'} {artist.description ? `• ${artist.description}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return JSON.stringify(data, null, 2);
  }

  // Handle single direct image strings (like bannerImage, thumbnailImage, etc.)
  const stringVal = typeof data === 'object' ? JSON.stringify(data) : String(data);
  const isImage = stringVal.startsWith('data:image') || stringVal.startsWith('http://') || stringVal.startsWith('https://');

  if (isImage && (fieldName.toLowerCase().includes('image') || fieldName.toLowerCase().includes('photo') || fieldName.toLowerCase().includes('banner') || fieldName.toLowerCase().includes('media'))) {
    return (
      <img 
        src={stringVal} 
        alt="Preview" 
        className="w-12 h-12 object-cover rounded border border-slate-200 shadow-2xs" 
      />
    );
  }

  return typeof data === 'object' ? JSON.stringify(data) : stringVal;
};


const handleApprovalChangeRequest = async (eventItem, changeEntryId, action) => {
  const label = action === 'accept' ? 'accept' : 'reject';
  if (!window.confirm(`Are you sure you want to ${label} this change request?`)) return;

  try {
    const response = await API.put(`/events/admin/events/${eventItem._id}/changes-request/${changeEntryId}`, { action });
    const updated = response.data.data || response.data;
    setEvents((prev) => prev.map((item) => (item._id === eventItem._id ? updated : item)));
    toast.success(`Change request ${label}ed successfully.`);
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'API request failed');
  }
};

const handleBulkApprovalChangeRequest = async (eventItem, action) => {
  const label = action === 'accept' ? 'accept all' : 'reject all';
  if (!window.confirm(`Are you sure you want to ${label} changes for this event?`)) return;

  try {
    const response = await API.put(`/events/admin/events/${eventItem._id}/changes-request/bulk`, { action });
    const updated = response.data.data || response.data;
    setEvents((prev) => prev.map((item) => (item._id === eventItem._id ? updated : item)));
    toast.success(`All changes ${label}ed successfully.`);
  } catch (error) {
    toast.error(error.message || `Failed to ${label} changes.`);
  }
};


const updateEventStatus = async (eventItem, status) => {
  const label = status === 'approved' ? 'approve' : 'reject';
  if (!window.confirm(`Are you sure you want to ${label} this event?`)) return;

  const reason = status === 'rejected'
    ? window.prompt('Reject reason (optional)', eventItem.rejectionReason || '') || ''
    : '';

  try {
    const response = await API.put(`/events/admin/events/${eventItem._id}/approval`, { status, reason });
    const updated = response.data.data || response.data;
    setEvents((prev) => prev.map((item) => (item._id === eventItem._id ? { ...updated, resubmit: false } : item)));
    toast.success(`Event ${status}.`);
  } catch (error) {
    toast.error(error.message || 'Failed to update event.');
  }
};


  const toggleResubmitField = (field) => {
  setResubmitFields((fields) => fields.includes(field) ? fields.filter((item) => item !== field) : [...fields, field]);
};

const submitResubmit = async () => {
  if (!resubmitEventItem || resubmitFields.length === 0) {
    toast.error('Select at least one field for resubmission.');
    return;
  }
  try {
    const response = await API.put(`/events/admin/events/${resubmitEventItem._id}/resubmit`, { fields: resubmitFields, reason: resubmitReason });
    const updated = response.data.data || response.data;
    setEvents((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
    setResubmitEventItem(null);
    setResubmitFields([]);
    setResubmitReason('');
    toast.success('Resubmission request sent.');
  } catch (error) {
    toast.error(error.message || 'Failed to send resubmission request.');
  }
};

const cancelEvent = async (event) => {
  if (!window.confirm('Are you sure you want to cancel this event?')) return;
  try {
    const response = await API.put(`/events/admin/events/${event._id}/approval`, { status: 'cancelled' });
    const updated = response.data.data || response.data;
    setEvents((prev) => prev.map((item) => (item._id === event._id ? updated : item)));
    toast.success('Event cancelled.');
  } catch (error) {
    toast.error(error.message || 'Failed to cancel event.');
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
  if (status === 'rejected') {
    // Open the popup modal instead of window.confirm/prompt
    const targetCancelItem = event.cancelHistory.find(
      (item) => (item._id || item.requestId) === cancelRequestId
    );
    setRejectCancelItem({ event, cancelRequestId, item: targetCancelItem });
    setRejectCancelReason('');
    return;
  }

  // Direct approval flow
  if (!window.confirm('Are you sure you want to accept this cancellation request?')) return;

  try {
    const response = await API.put(`/events/admin/events/${event._id}/cancel-request/${cancelRequestId}`, { 
      status: 'approved' 
    });
    const updatedEvent = response.data.data || response.data;
    setEvents((prev) => prev.map((item) => (item._id === event._id ? updatedEvent : item)));
    toast.success('Cancellation request accepted.');
  } catch (error) {
    toast.error(error.message || 'Failed to update cancellation request.');
  }
};

const deleteEvent = async (event) => {
  if (!window.confirm('Are you sure you want to delete this event?')) return;
  try {
    await API.delete(`/events/admin/events/${event._id}`);
    setEvents((prev) => prev.filter((item) => item._id !== event._id));
    toast.success('Event deleted.');
  } catch (error) {
    toast.error(error.message || 'Failed to delete event.');
  }
};

const resubmitEvent = async (event) => {
  if (!window.confirm('Are you sure you want to request resubmission for this event?')) return;
  try {
    const response = await API.put(`/events/admin/events/${event._id}/approval`, { status: 'resubmit' });
    setEvents((prev) => prev.map((item) => (item._id === event._id ? response.data : item)));
    toast.success('Event marked for resubmission.');
  } catch (error) {
    toast.error(error.message || 'Failed to update event.');
  }
};
const submitCancelRejection = async () => {
  if (!rejectCancelItem) return;
  const { event, cancelRequestId } = rejectCancelItem;

  try {
    // This sends data to your backend server
    const response = await API.put(`/events/admin/events/${event._id}/cancel-request/${cancelRequestId}`, {
      status: 'rejected',
      reason: rejectCancelReason
    });
    
    const updatedEvent = response.data.data || response.data;
    setEvents((prev) => prev.map((item) => (item._id === event._id ? updatedEvent : item)));
    setRejectCancelItem(null);
    setRejectCancelReason('');
    toast.success('Cancellation request rejected.');
  } catch (error) {
    toast.error(error.message || 'Failed to reject cancellation request.');
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
               Event Cancel Request
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
                      const isPending = normalizedStatus === 'pending';
                      const isResubmit = normalizedStatus === 'resubmit';

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
                         <button
                          type="button"
                          onClick={() => setViewEventModalData(event)}
                          className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded text-[11px] font-bold cursor-pointer"
                        >
                          View Event Application
                        </button>
                        </td>
                         
                         
                        <td className="px-4 py-4">
                        {/* Dynamic Status Display */}
                        {event.status === 'CANCELLED' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Cancelled
                          </span>
                        ) : event.status === 'APPROVED' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Approved
                          </span>
                        ) : event.resubmit === true ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                            Requested to Organizer
                          </span>
                        ) : (event.resubmitHistory && event.resubmitHistory.length > 0) ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Organizer Updated
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {(() => {
                          // ── Helper Flags ──
                          const isCancelled = event.status === 'CANCELLED';
                          const isApproved = event.status === 'APPROVED';
                          const isResubmit = event.resubmit === true;
                          const hasResubmitActivity = event.resubmitHistory && event.resubmitHistory.length > 0;
                          const isPending = !isApproved && !hasResubmitActivity;

                          return (
                            <div className="inline-flex gap-2">
                              <button 
                                type="button" 
                                disabled={isCancelled || isResubmit}
                                onClick={() => { setResubmitEventItem(event); setResubmitFields(event.resubmitFields || []); setResubmitReason(''); }} 
                                className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                  isCancelled || isResubmit
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none'
                                    : 'bg-amber-500 text-white hover:bg-amber-600 cursor-pointer'
                                }`}
                              >
                                Resubmit
                              </button>
                            
                              <button 
                                type="button" 
                                disabled={isCancelled || isApproved || isResubmit} 
                                onClick={() => updateEventStatus(event, 'approved')} 
                                className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                  isCancelled || isApproved || isResubmit 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                                }`}
                              >
                                Approve
                              </button>

                              <button 
                                type="button" 
                                disabled={isCancelled || isPending} 
                                onClick={() => cancelEvent(event)} 
                                className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                  isCancelled || isPending 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                    : 'bg-orange-50 border border-orange-300 text-orange-600 hover:bg-orange-100 cursor-pointer shadow-2xs'
                                }`}
                              >
                                Cancel
                              </button>

                              <button 
                                type="button" 
                                disabled={isCancelled || isApproved || isResubmit || hasResubmitActivity} 
                                onClick={() => deleteEvent(event)} 
                                className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                  isCancelled || isApproved || isResubmit || hasResubmitActivity 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                    : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                                }`}
                              >
                                Delete
                              </button>
                            </div>
                          );
                        })()}
                      </td>
                        </tr>
                      );
                    })}
                  {events.length === 0 && <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-semibold">No events found.</td></tr>}
                </tbody>
              </table>
            </div>
         ) : activeSection === 'events' && eventSubTab === 'changes' ? (
            <div className="bg-white border border-slate-200 overflow-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Event Name</th>
                    <th className="text-left px-4 py-3">Field Name</th>
                    <th className="text-left px-4 py-3">Old Data</th>
                    <th className="text-left px-4 py-3">New Data</th>
                    <th className="text-left px-4 py-3">Requested Date</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(events || [])
                    .flatMap((event) => 
                      (event.changesRequest || []).map((changeItem) => ({
                        ...changeItem,
                        eventRef: event
                      }))
                    )
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .map((item) => {
                      const event = item.eventRef;
                      const status = (item.status || 'pending').toLowerCase();
                      const isProcessed = status === 'accepted' || status === 'rejected';

                      return (
                        <tr key={item._id} className="align-middle">
                          <td className="px-4 py-4 font-bold text-slate-900">
                            <div>{event.eventName || 'Untitled'}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{event.createEventId}</div>
                          </td>
                          <td className="px-4 py-4 font-semibold text-blue-600">{item.fieldName}</td>
                         <td className="px-4 py-4 text-slate-600 max-w-xs truncate">
                            {renderCellData(item.oldData, item.fieldName)}
                          </td>
                          <td className="px-4 py-4 text-slate-900 font-medium max-w-xs truncate">
                            {renderCellData(item.newData, item.fieldName)}
                          </td>
                          <td className="px-4 py-4 text-slate-500">
                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button 
                                type="button" 
                                disabled={isProcessed} 
                                onClick={() => handleApprovalChangeRequest(event, item._id, 'accept')} 
                                className={`px-3 py-1.5 rounded text-xs font-bold shadow-sm ${
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
                                onClick={() => handleApprovalChangeRequest(event, item._id, 'reject')} 
                                className={`px-3 py-1.5 rounded text-xs font-bold shadow-sm ${
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

                  {(events || []).flatMap(e => e.changesRequest || []).length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-slate-500 font-semibold">No changes requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
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

      
{viewEventModalData && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Event Application Review</h3>
          <p className="text-[11px] text-slate-500">{viewEventModalData.eventName} ({viewEventModalData.createEventId})</p>
        </div>
        <button 
          type="button" 
          onClick={() => setViewEventModalData(null)} 
          className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 text-xs font-bold cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-8 overflow-y-auto space-y-8 text-xs">
        
        {/* STEP 1: EVENT DETAILS */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-blue-600 border-b pb-2">1. Event Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Title</label>
              <div className="p-3 bg-slate-50 border rounded-lg text-slate-800 font-medium">{viewEventModalData.eventName || '-'}</div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Category</label>
              <div className="p-3 bg-slate-50 border rounded-lg text-slate-800 font-medium">{viewEventModalData.eventCategoryName || viewEventModalData.eventCategoryId || '-'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Sub-Category</label>
              <div className="p-3 bg-slate-50 border rounded-lg text-slate-800 font-medium">{viewEventModalData.subCategories?.[0]?.subCategoryName || '-'}</div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Type</label>
              <div className="p-3 bg-slate-50 border rounded-lg text-slate-800 font-medium">{viewEventModalData.eventTypes?.[0]?.typeName || '-'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Languages</label>
              <div className="p-3 bg-slate-50 border rounded-lg text-slate-800 font-medium">
                {(viewEventModalData.eventLanguages || []).join(', ') || '-'}
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Format</label>
              <div className="p-3 bg-slate-50 border rounded-lg text-slate-800 font-medium">{viewEventModalData.eventFormat || '-'}</div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Description</label>
            <div className="p-3 bg-slate-50 border rounded-lg text-slate-800 whitespace-pre-wrap leading-relaxed">{viewEventModalData.eventDescription || '-'}</div>
          </div>

          {/* Banner & Thumbnail Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2 space-y-1">
              <label className="block font-bold text-slate-700">Banner Image</label>
              {viewEventModalData.media?.bannerImage ? (
                <img src={viewEventModalData.media.bannerImage} alt="Banner" className="h-40 w-full object-cover rounded-lg border shadow-2xs" />
              ) : (
                <div className="h-40 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">No Banner Image</div>
              )}
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Thumbnail Image</label>
              {viewEventModalData.media?.thumbnailImage ? (
                <img src={viewEventModalData.media.thumbnailImage} alt="Thumbnail" className="h-40 w-full object-cover rounded-lg border shadow-2xs" />
              ) : (
                <div className="h-40 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">No Thumbnail Image</div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 2: ARTISTS & HASHTAGS */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-bold text-sm text-blue-600 border-b pb-2">2. Artist & Content</h4>
          <div>
            <label className="block font-bold text-slate-700 mb-2">Artists List</label>
            <div className="grid grid-cols-2 sm:grid-cols-8 gap-2">
              {(viewEventModalData.artists || []).map((art, idx) => {
                // 1. Try finding photo from the event artist object itself
                let picUrl = art.photoUrl || art.photo || art.photoBase64 || art.photoBase64Data || '';

                // 2. If not found, cross-reference with masterArtists state using artistId or artistName
                if (!picUrl && masterArtists.length > 0) {
                  const matchedMaster = masterArtists.find(
                    (m) => String(m.artistId) === String(art.artistId) || 
                          String(m._id) === String(art.artistId) || 
                          (m.artistName && m.artistName.toLowerCase() === (art.artistName || art.name || '').toLowerCase())
                  );
                  if (matchedMaster) {
                    picUrl = matchedMaster.photoUrl || matchedMaster.photoBase64 || matchedMaster.photo || '';
                  }
                }

                // 3. Ensure base64 prefix if needed
                if (picUrl && !picUrl.startsWith('data:image') && !picUrl.startsWith('http')) {
                  picUrl = `data:image/jpeg;base64,${picUrl}`;
                }

                return (
                  <div key={idx} className="flex flex-col items-center text-center ">
                    {picUrl ? (
                      <img 
                        src={picUrl} 
                        alt={art.artistName || art.name} 
                        className="w-16 h-16 rounded-full object-cover mb-2 shadow-2xs" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-200 mb-2 flex items-center justify-center text-[10px] text-slate-500 font-bold">No Photo</div>
                    )}
                    <span className="font-bold text-slate-900">{art.artistName || art.name || 'Unnamed'}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{art.role || 'Artist'}</span>
                  </div>
                );
              })}
              {(!viewEventModalData.artists || viewEventModalData.artists.length === 0) && (
                <div className="col-span-full text-slate-400 py-2">No artists added.</div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">Hashtags</label>
            <div className="flex flex-wrap gap-2">
              {(viewEventModalData.hashtags || []).map((tag, idx) => (
                tag ? <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md font-semibold">{tag}</span> : null
              ))}
            </div>
          </div>
        </div>

      {/* STEP 3: SCHEDULE & VENUE */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-bold text-sm text-blue-600 border-b pb-2">3. Date & Venue</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Schedule Type</label>
              <div className="p-3 bg-slate-50 border rounded-lg uppercase font-semibold">{viewEventModalData.schedule?.eventScheduleType || 'single'}</div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Repeat Type</label>
              <div className="p-3 bg-slate-50 border rounded-lg uppercase font-semibold">{viewEventModalData.schedule?.recurringType || '-'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date</label>
              <div className="p-3 bg-slate-50 border rounded-lg font-medium">
                {viewEventModalData.schedule?.startDate ? new Date(viewEventModalData.schedule.startDate).toLocaleDateString() : '-'}
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">End Date</label>
              <div className="p-3 bg-slate-50 border rounded-lg font-medium">
                {viewEventModalData.schedule?.endDate ? new Date(viewEventModalData.schedule.endDate).toLocaleDateString() : '-'}
              </div>
            </div>
          </div>

          {/* Dynamic Time Slots for Single, Daily, or Weekly Events */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Time Slots & Schedule Details</label>
            <div className="space-y-1.5">
              {/* Single Event Time */}
              {viewEventModalData.schedule?.startTime && (
                <div className="p-2.5 bg-slate-50 border rounded-md flex justify-between font-medium">
                  <span>Single Event Time</span>
                  <span className="font-bold">{viewEventModalData.schedule.startTime} to {viewEventModalData.schedule.endTime || '--'}</span>
                </div>
              )}

              {/* Daily Time Slots */}
              {Array.isArray(viewEventModalData.schedule?.dailyTimeSlots) && viewEventModalData.schedule.dailyTimeSlots.map((slot, sIdx) => (
                slot.startTime ? (
                  <div key={sIdx} className="p-2.5 bg-slate-50 border rounded-md flex justify-between font-medium">
                    <span>Daily Slot {sIdx + 1}</span>
                    <span className="font-bold">{slot.startTime} to {slot.endTime || '--'} {slot.durationHours ? `(${slot.durationHours}h ${slot.durationMinutes || 0}m)` : ''}</span>
                  </div>
                ) : null
              ))}

              {/* Weekly Time Slots */}
              {Array.isArray(viewEventModalData.schedule?.weeklyTimeSlots) && viewEventModalData.schedule.weeklyTimeSlots.map((slot, sIdx) => (
                slot.startTime ? (
                  <div key={sIdx} className="p-2.5 bg-slate-50 border rounded-md flex justify-between font-medium">
                    <span>Date: {slot.date ? new Date(slot.date).toLocaleDateString() : 'All Dates'}</span>
                    <span className="font-bold">{slot.startTime} to {slot.endTime || '--'}</span>
                  </div>
                ) : null
              ))}

              {(!viewEventModalData.schedule?.startTime && (!viewEventModalData.schedule?.dailyTimeSlots || viewEventModalData.schedule.dailyTimeSlots.length === 0) && (!viewEventModalData.schedule?.weeklyTimeSlots || viewEventModalData.schedule.weeklyTimeSlots.length === 0)) && (
                <div className="p-3 bg-slate-50 border rounded-lg text-slate-400">No time slots recorded.</div>
              )}
            </div>
          </div>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Venue Name</label>
                <div className="p-3 bg-slate-50 border rounded-lg font-medium">{viewEventModalData.venue?.name || '-'}</div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Venue Address</label>
                <div className="p-3 bg-slate-50 border rounded-lg font-medium">{viewEventModalData.venue?.addressLine1 || '-'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <div className="p-3 bg-slate-50 border rounded-lg font-medium">{viewEventModalData.venue?.city || '-'}</div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIN Code</label>
                  <div className="p-3 bg-slate-50 border rounded-lg font-medium">{viewEventModalData.venue?.pincode || '-'}</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Seat Map Image</label>
              {viewEventModalData.media?.seatMapImage ? (
                <div 
                  onClick={() => {
                    setSeatMapImage(viewEventModalData.media.seatMapImage);
                    setModalZoom(1);
                    setModalPan({ x: 0, y: 0 });
                    setIsSeatMapModalOpen(true);
                  }}
                  className="h-44 w-full bg-slate-100 rounded-lg border flex items-center justify-center cursor-zoom-in overflow-hidden relative group"
                  title="Click to zoom seat map"
                >
                  <img src={viewEventModalData.media.seatMapImage} alt="Seat Map" className="h-full w-full object-contain p-2" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs">
                    Click to Zoom
                  </div>
                </div>
              ) : (
                <div className="h-44 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">No Seat Map Uploaded</div>
              )}
            </div>
          </div>
        </div>

     {/* STEP 4: TICKETS & EARLY BIRD (COLUMN-WISE TABLE) */}
<div className="space-y-4 pt-4 border-t">
  <h4 className="font-bold text-sm text-blue-600 border-b pb-2">4. Complete Ticket Tiers & Sales Configuration</h4>
  <div className="border rounded-lg overflow-x-auto">
    <table className="min-w-full text-xs border-collapse">
      <thead className="bg-slate-100 text-slate-600">
        <tr>
          <th className="p-2.5 text-left border-b">Type</th>
          <th className="p-2.5 text-left border-b">Name</th>
          <th className="p-2.5 text-left border-b">Price</th>
          <th className="p-2.5 text-left border-b">Qty</th>
          <th className="p-2.5 text-left border-b">Available</th>
          <th className="p-2.5 text-left border-b">Slot Date</th>
          <th className="p-2.5 text-left border-b">General Sales Period</th>
          <th className="p-2.5 text-left border-b border-l bg-blue-50/60">EB Price</th>
          <th className="p-2.5 text-left border-b  bg-blue-50/60">EB Qty</th>
          <th className="p-2.5 text-left border-b  bg-blue-50/60">EB Period</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {(viewEventModalData.ticketTiers || []).map((t, idx) => (
          <tr key={idx} className="hover:bg-slate-50/50">
            <td className="p-2.5 uppercase font-bold text-blue-600">{t.ticketType || '-'}</td>
            <td className="p-2.5 font-medium text-slate-900">{t.ticketName || t.name || '-'}</td>
            <td className="p-2.5 font-semibold text-emerald-700">₹{t.price ?? 0}</td>
            <td className="p-2.5">{t.quantity ?? t.qty ?? 0}</td>
            <td className="p-2.5">{t.available ?? 0}</td>
            <td className="p-2.5 whitespace-nowrap">{t.slotDate ? new Date(t.slotDate).toLocaleDateString() : 'All Dates'}</td>
            <td className="p-2.5 text-[11px] text-slate-600 whitespace-nowrap">
              {t.startDate ? new Date(t.startDate).toLocaleDateString() : '--'} to {t.endDate ? new Date(t.endDate).toLocaleDateString() : '--'}
            </td>
            <td className="p-2.5 bg-blue-50/30 border-l border-slate-200 font-semibold text-emerald-800">
              {t.ebPrice && t.ebPrice !== '-' ? `₹${t.ebPrice}` : '-'}
            </td>
            <td className="p-2.5 bg-blue-50/30  border-slate-200 font-semibold">{t.ebQty && t.ebQty !== '-' ? t.ebQty : '-'}</td>
            <td className="p-2.5 bg-blue-50/30  border-slate-200 text-[11px] text-slate-600 whitespace-nowrap">
              {t.ebStart && t.ebStart !== '-' ? new Date(t.ebStart).toLocaleDateString() : '--'} to {t.ebEnd && t.ebEnd !== '-' ? new Date(t.ebEnd).toLocaleDateString() : '--'}
            </td>
          </tr>
        ))}
        {(!viewEventModalData.ticketTiers || viewEventModalData.ticketTiers.length === 0) && (
          <tr>
            <td colSpan="10" className="p-4 text-center text-slate-400">No tickets configured.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

        {/* STEP 5 & 6: FEATURES & CONTACT */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-bold text-sm text-blue-600 border-b pb-2">5 & 6. Features & Contact Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Minimum Age Limit</label>
              <div className="p-3 bg-slate-50 border rounded-lg font-medium">{viewEventModalData.minAgeLimit || '-'}</div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Person Name</label>
              <div className="p-3 bg-slate-50 border rounded-lg font-medium">{viewEventModalData.contactPerson?.name || '-'}</div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
              <div className="p-3 bg-slate-50 border rounded-lg font-medium">{viewEventModalData.contactPerson?.email || '-'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Mobile Number</label>
              <div className="p-3 bg-slate-50 border rounded-lg font-medium">{viewEventModalData.contactPerson?.mobile || '-'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
)}


      
      {/* FULL SCREEN SEAT MAP PREVIEW MODAL WITH ZOOM & PAN */}
{isSeatMapModalOpen && seatMapImage && (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Close Button */}
      <button
        type="button"
        onClick={() => setIsSeatMapModalOpen(false)}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center font-bold text-lg z-50 cursor-pointer transition"
      >
        ✕
      </button>

      {/* Zoom Instructions Badge */}
      <div className="absolute top-5 left-5 bg-black/50 text-white px-3 py-1.5 rounded-md text-xs z-50 pointer-events-none">
        Scroll mouse wheel to Zoom In/Out • Click & drag to move
      </div>

      {/* Zoomable Image Container */}
      <div
        onWheel={(e) => {
          e.preventDefault();
          const delta = e.deltaY < 0 ? 0.15 : -0.15;
          setModalZoom((prev) => Math.min(6, Math.max(0.5, Number((prev + delta).toFixed(2)))));
        }}
        onMouseDown={(e) => {
          setIsDraggingModalImg(true);
          setModalDragOrigin({ x: e.clientX - modalPan.x, y: e.clientY - modalPan.y });
        }}
        onMouseMove={(e) => {
          if (!isDraggingModalImg) return;
          setModalPan({
            x: e.clientX - modalDragOrigin.x,
            y: e.clientY - modalDragOrigin.y
          });
        }}
        onMouseUp={() => setIsDraggingModalImg(false)}
        onMouseLeave={() => setIsDraggingModalImg(false)}
        className={`w-full h-full flex items-center justify-center overflow-hidden ${
          isDraggingModalImg ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <img
          src={seatMapImage}
          alt="Full Seat Map Preview"
          draggable={false}
          style={{
            transform: `translate(${modalPan.x}px, ${modalPan.y}px) scale(${modalZoom})`,
            transformOrigin: 'center center',
            transition: isDraggingModalImg ? 'none' : 'transform 0.05s ease-out'
          }}
          className="max-w-[90vw] max-h-[90vh] object-contain pointer-events-none"
        />
      </div>
    </div>
  </div>
)}


{resubmitEventItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Select Re-submit option</h3>
            <p className="text-[11px] text-slate-500">{resubmitEventItem.eventName}</p>
          </div>
        </div>
        <button type="button" onClick={() => setResubmitEventItem(null)} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-bold cursor-pointer">✕</button>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['eventTitle', 'Event title'],
            ['date', 'Date'],
            ['description', 'Description'],
            ['venue', 'venue'],
            ['eventBanner', 'Event Banner'],
            ['ticketType', 'Ticket type'],
            ['artist', 'Artist'],
            ['ageLimit', 'Age Limit'],
            ['eventContact', 'Event Contact'],
            ['eventGuide', 'Event Guide']
          ].map(([value, label]) => (
            <label key={value} className="flex items-center gap-3 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input type="checkbox" checked={resubmitFields.includes(value)} onChange={() => toggleResubmitField(value)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
              {label}
            </label>
          ))}
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Write reason:</label>
          <textarea value={resubmitReason} onChange={(event) => setResubmitReason(event.target.value)} rows="6" placeholder="Enter reason for re-KYC..." className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => setResubmitEventItem(null)} className="px-5 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
          <button
            type="button"
            onClick={submitResubmit}
            disabled={resubmitFields.length === 0}
            className={`px-6 py-2 text-xs font-semibold rounded-lg shadow-sm transition ${
              resubmitFields.length > 0
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

{/* Reject Cancellation Request Modal */}
      {rejectCancelItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Write reason:</h3>
              <button 
                type="button" 
                onClick={() => setRejectCancelItem(null)} 
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <textarea 
                  value={rejectCancelReason} 
                  onChange={(event) => setRejectCancelReason(event.target.value)} 
                  rows="4" 
                  placeholder="Enter reason for reject request..." 
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" 
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setRejectCancelItem(null)} 
                  className="px-5 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
               <button
                  type="button"
                  onClick={submitCancelRejection}
                  disabled={!rejectCancelReason.trim()}
                  className={`px-6 py-2 text-xs font-semibold rounded-lg shadow-sm transition ${
                    rejectCancelReason.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 inline-block mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Cancellation Reason & Description Popup Modal */}
      {selectedCancelDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Cancellation Request Details ({selectedCancelDetail.requestId})</h3>
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
                <p className="bg-slate-50 p-2.5 rounded border border-slate-200">{selectedCancelDetail.reason || '-'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">Description:</span>
                <p className="bg-slate-50 p-2.5 rounded border border-slate-200 whitespace-pre-wrap">{selectedCancelDetail.description || 'No description provided.'}</p>
              </div>
              {selectedCancelDetail.attachment && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1.5">Attached Document:</span>
                  <div className="flex justify-center bg-slate-100 p-2 rounded border border-slate-200 overflow-hidden max-h-[50vh]">
                    {selectedCancelDetail.attachment.startsWith('data:application/pdf') ? (
                      <iframe src={selectedCancelDetail.attachment} title="PDF Viewer" className="w-full h-[40vh]" />
                    ) : (
                      <img 
                        src={selectedCancelDetail.attachment} 
                        alt="Attachment Document" 
                        className="max-h-[40vh] w-auto object-contain cursor-pointer hover:opacity-95" 
                        onClick={() => setSelectedAttachment(selectedCancelDetail.attachment)}
                      />
                    )}
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