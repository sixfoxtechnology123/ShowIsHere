import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';

import SignAgrement from '../utils/SignAgrement';
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
  const [selectedPanImage, setSelectedPanImage] = useState(null);
  const [reKycAccount, setReKycAccount] = useState(null);
  const [reKycFields, setReKycFields] = useState([]);
  const [reKycReason, setReKycReason] = useState('');
  
  // State for opening the agreement inside a popup modal on the same page
  const [viewingAgreementId, setViewingAgreementId] = useState(null);

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
    if (!window.confirm(`Are you sure you want to ${label} this account?`)) return;

    const reason = status === 'rejected'
      ? window.prompt('Reject reason (optional)', account.rejectionReason || '') || ''
      : '';

    try {
      const response = await API.put(`/org/admin/accounts/${account._id}/approval`, { status, reason });
      setAccounts((prev) => prev.map((item) => (item._id === account._id ? response.data : item)));
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
                          <td className="px-4 py-4 text-slate-600">
                            <div>{event.loginMobileNumber}</div>
                            <div>{event.contactPerson?.email}</div>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            <div>{event.schedule?.startDate ? new Date(event.schedule.startDate).toLocaleDateString() : 'No date'}</div>
                            <div>{event.schedule?.startTime || '--'} to {event.schedule?.endTime || '--'}</div>
                            <div>{[event.venue?.name, event.venue?.city].filter(Boolean).join(', ') || 'No venue'}</div>
                          </td>
                          <td className="px-4 py-4">
                            {renderStatus(event.status)}
                            {event.rejectionReason && <div className="text-red-600 mt-2">Reason: {event.rejectionReason}</div>}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            <div>Format: {event.eventFormat || '-'}</div>
                            <div>Languages: {(event.eventLanguages || []).join(', ') || '-'}</div>
                            <div>Tickets: {event.ticketTiers?.length || 0}</div>
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
                          <td className="px-4 py-4 text-slate-600">
                            <div>{account.contactFullName || '-'}</div>
                            <div>{account.contactEmail}</div>
                            <div>{account.loginMobileNumber || account.contactMobile}</div>
                          </td>
                          <td className="px-4 py-4 text-slate-600 space-y-1">
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
                            <div>GST: {account.gstinNumber || '-'}</div>
                            <div>Bank: {account.bankName || '-'} {account.accountNumber || ''}</div>
                          </td>
                          <td className="px-4 py-4">
                            {renderStatus(account.approvalStatus || account.status)}
                            {account.rejectionReason && <div className="text-red-600 mt-2">Reason: {account.rejectionReason}</div>}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button 
                                type="button" 
                                disabled={isApproved} 
                                onClick={() => updateAccountStatus(account, 'approved')} 
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
                                onClick={() => updateAccountStatus(account, 'rejected')} 
                                className={`px-3 py-1.5 rounded text-[11px] font-bold ${
                                  isRejected 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none' 
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                              >
                                Reject
                              </button>
                              <button type="button" onClick={() => { setReKycAccount(account); setReKycFields(account.reKycFields || []); setReKycReason(''); }} className="px-3 py-1.5 rounded text-[11px] font-bold bg-amber-500 text-white hover:bg-amber-600">
                                Re-KYC
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {accounts.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500 font-semibold">No accounts found.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
    

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

   {/* Full-Width Agreement Modal Popup */}
      {viewingAgreementId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs overflow-y-auto p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <h3 className="text-sm font-bold text-slate-900">Signed Agreement Preview</h3>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => window.print()} 
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition cursor-pointer shadow-sm"
                >
                  Download PDF
                </button>
                <button 
                  type="button" 
                  onClick={() => setViewingAgreementId(null)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              <AgreementModalContent accountId={viewingAgreementId} />
            </div>
          </div>
        </div>
      )}
      {reKycAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3"><div><h3 className="text-base font-bold text-slate-900">Request Re-KYC</h3><p className="mt-1 text-xs text-slate-500">{reKycAccount.orgName}</p></div><button type="button" onClick={() => setReKycAccount(null)} className="text-slate-500 hover:text-slate-800">x</button></div>
            <div className="mt-4 space-y-3">{[
              ['organizationName', 'Organization name'], ['panDetails', 'PAN details'], ['accountDetails', 'Account details'], ['organizationAddress', 'Organization address'], ['uploadPanDocuments', 'Upload PAN documents'], ['contactDetails', 'Contact details']
            ].map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"><input type="checkbox" checked={reKycFields.includes(value)} onChange={() => toggleReKycField(value)} className="h-4 w-4" />{label}</label>)}</div>
            <label className="mt-5 block text-xs font-semibold text-slate-700">Reason<textarea value={reKycReason} onChange={(event) => setReKycReason(event.target.value)} rows="4" className="mt-1.5 w-full resize-none rounded-md border border-slate-300 p-2 text-sm font-normal" /></label>
            <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setReKycAccount(null)} className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700">Cancel</button><button type="button" onClick={submitReKyc} className="rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-white">Send Re-KYC</button></div>
          </div>
        </div>
      )}

      <EventOrgFooter />
    </div>
  );
};

// Agreement Modal Content Helper Component with exact padding and scroll classes
const AgreementModalContent = ({ accountId }) => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    API.get(`/org/get-kyc?id=${accountId}`)
      .then((response) => setAccount(response.data || response))
      .catch(() => setAccount(false));
  }, [accountId]);

  if (account === null) return <p className="text-center text-sm text-slate-600">Loading signed agreement...</p>;
  if (!account) return <p className=" text-center text-sm text-red-700">Signed agreement not found.</p>;

  return (
    <div className="bg-white pb-24 min-h-screen p-6 sm:px-40 shadow-sm w-full max-w-5xl mx-auto my-auto overflow-hidden">
      
      <SignAgrement
        signingDate={account.signingAt ? new Date(account.signingAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
        organizerName={account.orgName}
        organizerLocation={account.orgAddress || [account.address1, account.city, account.state].filter(Boolean).join(', ')}
        organizerPan={account.panNumber}
        organizerGst={account.gstinNumber}
        organizerType={account.panLinkedAadhaar}
        isPanLinkedWithAadhaar={account.panLinkedAadhaar}
        bankAccountName={account.accountHolderName}
        bankName={account.bankName}
        bankAccountNumber={account.accountNumber}
        accountHolderName={account.accountHolderName}
        contactPersonName={account.contactFullName}
        contactMobile={account.contactMobile || account.loginMobileNumber}
        accountType={account.accountType}
        bankIfsc={account.bankIfsc}
        signatoryEmail={account.contactEmail}
        signedDateTime={account.signingAt ? new Date(account.signingAt).toLocaleString('en-IN') : ''}
        signatureImage={account.signatureImage}
        onCreateSignature={() => {}}
        onDeleteSignature={null}
      />
    </div>
  );
};

export default AdminApproval;