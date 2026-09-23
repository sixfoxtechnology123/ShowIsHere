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
  const rawDate = event.schedule?.startDate;
  if (!rawDate) return { day: null, month: null, timeRange: null };

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return { day: null, month: null, timeRange: null };

  const startTime = event.schedule?.startTime;
  const endTime = event.schedule?.endTime;
  const timeRange = startTime && endTime ? `${startTime}-${endTime}` : (startTime || null);

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

  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const calculateTimeLeft = (startDateStr, startTimeStr) => {
    if (!startDateStr || !startTimeStr) return null;
    
    const eventDate = new Date(`${startDateStr.split('T')[0]}T${startTimeStr}`);
    const difference = eventDate.getTime() - new Date().getTime();
    if (difference <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00', expired: true };

    return {
      days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
      hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
      minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
      expired: false
    };
  };

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
                
                const venueString = [evt.venue?.name, evt.venue?.city].filter(Boolean).join(', ') || evt.venue?.addressLine1 || '';
                const location = venueString ? venueString : '';

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
                          {(evt.eventCategoryName || evt.eventFormat) && (
                            <span className="flex items-center space-x-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${status.muted ? 'bg-slate-300' : 'bg-pink-600'}`}></span>
                              <span>{evt.eventCategoryName || evt.eventFormat}</span>
                            </span>
                          )}
                        </div>

                        {evt.eventDescription && (
                          <p className={`text-xs leading-relaxed pt-1 ${status.muted ? 'text-slate-400' : 'text-slate-500'}`}>
                            {evt.eventDescription}
                          </p>
                        )}

                        {evt.rejectionReason && (
                          <p className="text-xs font-semibold text-red-600 pt-1">Reason: {evt.rejectionReason}</p>
                        )}
                      </div>

                      {location ? (
                        <div className={`flex items-center pb-6 text-xs font-medium ${status.muted ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span className="mr-1.5 text-sm">📍</span>
                          <span>{location}</span>
                        </div>
                      ) : (
                        <div className="pb-6"></div>
                      )}
                    </div>

               {/* Right column matching reference image alignment and layout */}
                  <div className="w-full md:w-56 px-4 py-4 border-t md:border-t-0 flex flex-col items-center justify-center text-center relative bg-white">
                    {dateParts.day && dateParts.month && (
                      <div className="flex flex-col items-center">
                        <h4 className={`text-2xl font-black ${status.muted ? 'text-slate-300' : 'text-pink-600'}`}>
                          {dateParts.day}
                        </h4>
                        <span className={`text-[10px] font-extrabold tracking-wider block uppercase ${status.muted ? 'text-slate-300' : 'text-pink-600'}`}>
                          {dateParts.month}
                        </span>
                        {dateParts.timeRange && (
                          <div className={`flex items-center justify-center space-x-1.5 text-xs font-bold mt-1 ${status.muted ? 'text-slate-300' : 'text-slate-900'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 shrink-0 text-slate-900">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span className="font-bold text-slate-900">{dateParts.timeRange}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {!status.muted && (() => {
                      const rawDate = evt.schedule?.startDate;
                      const startTime = evt.schedule?.startTime;
                      if (!rawDate || !startTime) return null;

                      const timeLeft = calculateTimeLeft(rawDate, startTime);
                      if (!timeLeft || timeLeft.expired) return null;

                      return (
                        <div className="mt-3 pt-3  w-full flex items-center justify-center space-x-1 text-slate-900 font-bold text-sm">
                          <div className="flex flex-col items-center">
                            <span className="text-base font-black text-slate-900">{timeLeft.days}</span>
                            <span className="text-[10px] font-medium text-slate-600">Days</span>
                          </div>
                          <span className="text-slate-900 font-extrabold pb-6 px-0.5">:</span>
                          <div className="flex flex-col items-center">
                            <span className="text-base font-black text-slate-900">{timeLeft.hours}</span>
                            <span className="text-[10px] font-medium text-slate-600">Hours</span>
                          </div>
                          <span className="text-slate-900 font-extrabold pb-6 px-0.5">:</span>
                          <div className="flex flex-col items-center">
                            <span className="text-base font-black text-slate-900">{timeLeft.minutes}</span>
                            <span className="text-[10px] font-medium text-slate-600">Minutes</span>
                          </div>
                          <span className="text-slate-900 font-extrabold pb-6 px-0.5">:</span>
                          <div className="flex flex-col items-center">
                            <span className="text-base font-black text-slate-900">{timeLeft.seconds}</span>
                            <span className="text-[10px] font-medium text-slate-600">Seconds</span>
                          </div>
                        </div>
                      );
                    })()}
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