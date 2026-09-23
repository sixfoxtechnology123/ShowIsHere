import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
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

const getStoredOrganizer = () => {
  try {
    return JSON.parse(localStorage.getItem('orgUserData') || '{}');
  } catch (error) {
    return {};
  }
};

const getEventEndDate = (event) => {
  const tierEnd = event.ticketTiers?.find((tier) => tier.endDate)?.endDate;
  return tierEnd || event.schedule?.startDate || event.updatedAt || event.createdAt;
};

const buildEventStatus = (event) => {
  if (event.status === 'DRAFT') {
    return { label: 'Draft', statusColor: 'bg-slate-500', rightBarColor: 'bg-slate-400', muted: false };
  }
  if (event.approvalStatus === 'rejected') {
    return { label: 'Rejected', statusColor: 'bg-red-600', rightBarColor: 'bg-red-500', muted: true };
  }
  if (event.approvalStatus !== 'approved') {
    return { label: 'Pending Approval', statusColor: 'bg-amber-500', rightBarColor: 'bg-amber-500', muted: false };
  }

  const endDate = new Date(getEventEndDate(event));
  if (!Number.isNaN(endDate.getTime()) && endDate < new Date()) {
    return { label: 'Complete', statusColor: 'bg-blue-600', rightBarColor: 'bg-blue-600', muted: false };
  }

  return { label: 'Live', statusColor: 'bg-emerald-500', rightBarColor: 'bg-emerald-500', muted: false };
};

const formatDateParts = (event) => {
  const rawDate = event.schedule?.startDate || event.createdAt;
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return { day: '--', month: 'DATE', timeRange: event.schedule?.startTime || '--' };
  }

  const startTime = event.schedule?.startTime || event.ticketTiers?.[0]?.eventStartTime || '--';
  const endTime = event.schedule?.endTime || event.ticketTiers?.[0]?.eventEndTime || '';
  const timeRange = endTime ? `${startTime}-${endTime}` : startTime;

  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: date.toLocaleString('en-US', { month: 'long' }).toUpperCase(),
    timeRange
  };
};

const MyEvents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      setLoading(true);
      setError('');

      const organizer = getStoredOrganizer();
      const mobile = organizer.loginMobileNumber || organizer.contactMobile || localStorage.getItem('loginMobileNumber');
      const orgId = organizer.orgId || localStorage.getItem('orgId');
      const params = new URLSearchParams();
      if (mobile) params.append('loginMobileNumber', mobile);
      if (orgId) params.append('orgId', orgId);

      if (!params.toString()) {
        setEvents([]);
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`/events/my-events?${params.toString()}`);
        setEvents(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.message || 'Unable to fetch events.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return events;

    return events.filter((evt) => {
      const fields = [
        evt.eventName,
        evt.eventCategoryName,
        evt.venue?.name,
        evt.venue?.city,
        evt.venue?.addressLine1,
        buildEventStatus(evt).label
      ];
      return fields.some((field) => String(field || '').toLowerCase().includes(query));
    });
  }, [events, searchQuery]);

  return (
    <div className={dashLayoutWrapper}>
      <EventOrgHeader />

      <div className={dashBodyFlexContainer}>
        <EventOrgLefSidebar />

        <main className={dashMainContentArea}>
          <div className={`${dashScrollableBody} px-8 sm:px-14 lg:px-24 py-4`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
              <Link
                to="/create-event"
                className="inline-flex items-center space-x-2 px-3 py-2 bg-transparent text-blue-600 hover:text-blue-700 font-bold text-xs transition cursor-pointer shrink-0 no-underline"
              >
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shadow-sm">+</span>
                <span>CREATE NEW EVENT</span>
              </Link>

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

            {loading && (
              <div className="bg-white border border-slate-200 px-5 py-8 text-center text-xs font-semibold text-slate-500">
                Loading your events...
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 px-5 py-4 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && filteredEvents.length === 0 && (
              <div className="bg-white border border-slate-200 px-5 py-10 text-center">
                <h3 className="text-sm font-bold text-slate-900">No events found</h3>
                <p className="text-xs text-slate-500 mt-1">Events created from this login will appear here.</p>
              </div>
            )}

            <div className="space-y-5">
              {filteredEvents.map((evt) => {
                const status = buildEventStatus(evt);
                const dateParts = formatDateParts(evt);
                const image = evt.media?.thumbnailImage || evt.media?.bannerImage || Logo;
                const location = [evt.venue?.name, evt.venue?.city].filter(Boolean).join(', ') || evt.venue?.addressLine1 || 'Venue not added';

                return (
                  <div
                    key={evt._id || evt.createEventId}
                    className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs flex flex-col md:flex-row items-stretch relative transition hover:shadow-md"
                  >
                    <div className={`absolute top-0 right-0 ${status.statusColor} text-white text-[10px] font-extrabold px-3 py-1 uppercase tracking-wider z-10`}>
                      {status.label}
                    </div>

                    {/* Strict 3:4 Aspect Ratio Thumbnail Container */}
                    <div className="w-full md:w-36 lg:w-40 aspect-[3/4] shrink-0 relative bg-slate-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={image}
                        alt={evt.eventName || 'Event'}
                        className={`w-full h-full object-cover ${status.muted ? 'grayscale opacity-60' : ''}`}
                      />
                    </div>

                    <div className={`w-1 shrink-0 ${status.rightBarColor}`}></div>

                    <div className="flex-1 px-6 py-4 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className={`text-base font-bold ${status.muted ? 'text-slate-400' : 'text-slate-900'}`}>
                          {evt.eventName || 'Untitled event'}
                        </h3>

                        <div className="flex items-center space-x-3 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${status.muted ? 'bg-slate-300' : 'bg-pink-600'}`}></span>
                            <span>{evt.eventCategoryName || evt.eventFormat || 'Event'}</span>
                          </span>
                        </div>

                        <p className={`text-xs leading-relaxed pt-1 ${status.muted ? 'text-slate-400' : 'text-slate-500'}`}>
                          {evt.eventDescription || 'No description added yet.'}
                        </p>
                        {evt.rejectionReason && (
                          <p className="text-xs font-semibold text-red-600 pt-1">Reason: {evt.rejectionReason}</p>
                        )}
                      </div>

                      <div className={`flex items-center pb-6 text-xs font-medium ${status.muted ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span className="mr-1.5 text-sm">📍</span>
                        <span>{location}</span>
                      </div>
                    </div>

                    <div className="w-full md:w-40 px-4 py-4 border-t md:border-t-0  flex flex-row md:flex-col items-center justify-between md:justify-center text-center relative bg-white">
                      <div>
                        <h4 className={`text-2xl font-black ${status.muted ? 'text-slate-300' : 'text-pink-600'}`}>
                          {dateParts.day}
                        </h4>
                        <span className={`text-[10px] font-extrabold tracking-wider block uppercase ${status.muted ? 'text-slate-300' : 'text-pink-600'}`}>
                          {dateParts.month}
                        </span>
                        <div className={`flex items-center justify-center space-x-1.5 text-xs font-bold mt-1.5 ${status.muted ? 'text-slate-300' : 'text-slate-900'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 shrink-0 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span>{dateParts.timeRange}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <EventOrgFooter />
    </div>
  );
};

export default MyEvents;