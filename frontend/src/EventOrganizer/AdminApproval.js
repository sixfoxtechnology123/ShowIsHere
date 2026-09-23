import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';
import EventOrgLefSidebar from './EventOrgLefSidebar';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody
} from '../styles/MasterCSSClass';

const statusClasses = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200'
};

const AdminApproval = () => {
  const [activeSection, setActiveSection] = useState('events');
  const [events, setEvents] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const updateEventStatus = async (event, approvalStatus) => {
    const label = approvalStatus === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${label} this event?`)) return;

    const reason = approvalStatus === 'rejected'
      ? window.prompt('Reject reason (optional)', event.rejectionReason || '') || ''
      : '';

    try {
      const response = await API.put(`/events/admin/events/${event._id}/approval`, { approvalStatus, reason });
      setEvents((prev) => prev.map((item) => (item._id === event._id ? response.data : item)));
      toast.success(`Event ${approvalStatus}.`);
    } catch (error) {
      toast.error(error.message || 'Failed to update event.');
    }
  };

  const updateAccountStatus = async (account, approvalStatus) => {
    const label = approvalStatus === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${label} this account?`)) return;

    const reason = approvalStatus === 'rejected'
      ? window.prompt('Reject reason (optional)', account.rejectionReason || '') || ''
      : '';

    try {
      const response = await API.put(`/org/admin/accounts/${account._id}/approval`, { approvalStatus, reason });
      setAccounts((prev) => prev.map((item) => (item._id === account._id ? response.data : item)));
      toast.success(`Account ${approvalStatus}.`);
    } catch (error) {
      toast.error(error.message || 'Failed to update account.');
    }
  };

  const renderStatus = (status = 'pending') => (
    <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] font-bold uppercase ${statusClasses[status] || statusClasses.pending}`}>
      {status}
    </span>
  );

  return (
    <div className={dashLayoutWrapper}>
      <EventOrgHeader />
      <div className={dashBodyFlexContainer}>
        {/* <EventOrgLefSidebar /> */}
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

            {loading ? (
              <div className="bg-white border border-slate-200 px-5 py-8 text-center text-xs font-semibold text-slate-500">Loading approval data...</div>
            ) : activeSection === 'events' ? (
              <div className="bg-white border border-slate-200 overflow-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3">Event</th>
                      <th className="text-left px-4 py-3">Organizer</th>
                      <th className="text-left px-4 py-3">Schedule / Venue</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Details</th>
                      <th className="text-right px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map((event) => (
                      <tr key={event._id} className="align-top">
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900">{event.eventName || 'Untitled'}</div>
                          <div className="text-slate-500 mt-1">{event.createEventId} / {event.eventCategoryName || event.eventCategoryId}</div>
                          <div className="text-slate-500 mt-1">{event.eventDescription || 'No description'}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <div>{event.orgId}</div>
                          <div>{event.loginMobileNumber}</div>
                          <div>{event.contactPerson?.email}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <div>{event.schedule?.startDate ? new Date(event.schedule.startDate).toLocaleDateString() : 'No date'} {event.schedule?.startTime || ''}</div>
                          <div>{[event.venue?.name, event.venue?.city].filter(Boolean).join(', ') || 'No venue'}</div>
                        </td>
                        <td className="px-4 py-4">
                          {renderStatus(event.approvalStatus)}
                          <div className="text-slate-500 mt-2">{event.status}</div>
                          {event.rejectionReason && <div className="text-red-600 mt-2">Reason: {event.rejectionReason}</div>}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <div>Format: {event.eventFormat || '-'}</div>
                          <div>Languages: {(event.eventLanguages || []).join(', ') || '-'}</div>
                          <div>Tickets: {event.ticketTiers?.length || 0}</div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <button type="button" onClick={() => updateEventStatus(event, 'approved')} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-[11px] font-bold">Approve</button>
                            <button type="button" onClick={() => updateEventStatus(event, 'rejected')} className="px-3 py-1.5 bg-red-600 text-white rounded text-[11px] font-bold">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-semibold">No events found.</td></tr>}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 overflow-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3">Account</th>
                      <th className="text-left px-4 py-3">Contact</th>
                      <th className="text-left px-4 py-3">KYC / Bank</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-right px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accounts.map((account) => (
                      <tr key={account._id} className="align-top">
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900">{account.orgName}</div>
                          <div className="text-slate-500 mt-1">{account.orgId} / {account.tenantKey}</div>
                          <div className="text-slate-500 mt-1">{account.orgAddress || account.city || '-'}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <div>{account.contactFullName || '-'}</div>
                          <div>{account.contactEmail}</div>
                          <div>{account.loginMobileNumber || account.contactMobile}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <div>PAN: {account.panNumber || '-'}</div>
                          <div>GST: {account.gstinNumber || '-'}</div>
                          <div>Bank: {account.bankName || '-'} {account.accountNumber || ''}</div>
                        </td>
                        <td className="px-4 py-4">
                          {renderStatus(account.approvalStatus)}
                          {account.rejectionReason && <div className="text-red-600 mt-2">Reason: {account.rejectionReason}</div>}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <button type="button" onClick={() => updateAccountStatus(account, 'approved')} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-[11px] font-bold">Approve</button>
                            <button type="button" onClick={() => updateAccountStatus(account, 'rejected')} className="px-3 py-1.5 bg-red-600 text-white rounded text-[11px] font-bold">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {accounts.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500 font-semibold">No accounts found.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
      <EventOrgFooter />
    </div>
  );
};

export default AdminApproval;
