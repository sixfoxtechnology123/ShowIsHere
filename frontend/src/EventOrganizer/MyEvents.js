import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import EventOrgHeader from './EventOrgHeader';
import EventOrgFooter from './EventOrgFooter';
import toast from 'react-hot-toast';
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

// Normalizes 12-hour (9:26 PM) or 24-hour (21:26) to standard HH:mm
const normalizeTimeTo24 = (timeStr) => {
  if (!timeStr) return '00:00';
  const clean = timeStr.trim();
  const match = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return clean;
  let [, h, m, meridiem] = match;
  let hours = parseInt(h, 10);
  if (meridiem) {
    const isPM = meridiem.toUpperCase() === 'PM';
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
  }
  return `${String(hours).padStart(2, '0')}:${m}`;
};

const getEventEndDate = (event) => {
  const sch = event.schedule || {};

  // 1. Ticket tier end date takes first priority
  const tierEnd = event.ticketTiers?.find((tier) => tier.endDate)?.endDate;
  if (tierEnd) return tierEnd;

  // 2. Weekly recurring
  if (Array.isArray(sch.weeklyTimeSlots) && sch.weeklyTimeSlots.length > 0) {
    const lastSlot = sch.weeklyTimeSlots[sch.weeklyTimeSlots.length - 1];
    if (lastSlot?.date) {
      const time = normalizeTimeTo24(lastSlot.endTime || lastSlot.startTime || '23:59');
      return `${lastSlot.date.split('T')[0]}T${time}`;
    }
  }

  // 3. Daily recurring
  if (Array.isArray(sch.dailyTimeSlots) && sch.dailyTimeSlots.length > 0) {
    const lastSlot = sch.dailyTimeSlots[sch.dailyTimeSlots.length - 1];
    const baseDate = sch.endDate || sch.startDate;
    if (baseDate) {
      const time = normalizeTimeTo24(lastSlot.endTime || lastSlot.startTime || '23:59');
      return `${baseDate.split('T')[0]}T${time}`;
    }
  }

  // 4. Single event
  const baseDate = sch.endDate || sch.startDate;
  if (baseDate) {
    const time = normalizeTimeTo24(sch.endTime || sch.startTime || '23:59');
    return `${baseDate.split('T')[0]}T${time}`;
  }

  return null;
};

const buildEventStatus = (event) => {
  const statusUpper = String(event.status || '').toUpperCase();

  if (statusUpper === 'DRAFT') {
    return { label: 'Draft', statusColor: 'bg-slate-500', rightBarColor: 'bg-slate-400', muted: false };
  }
  if (statusUpper === 'CANCELLED' || statusUpper === 'CANCEL') {
    return { label: 'Cancelled', statusColor: 'bg-rose-700', rightBarColor: 'bg-rose-700', muted: true };
  }
  if (statusUpper === 'REJECTED') {
    return { label: 'Rejected', statusColor: 'bg-red-600', rightBarColor: 'bg-red-500', muted: true };
  }
  if (statusUpper === 'PENDING') {
    return { label: 'Pending Approval', statusColor: 'bg-amber-500', rightBarColor: 'bg-amber-500', muted: false };
  }

  // Check if date has expired ONLY if an end date exists
  const endDateStr = getEventEndDate(event);
  if (endDateStr) {
    const endDate = new Date(endDateStr);
    if (!Number.isNaN(endDate.getTime()) && endDate < new Date()) {
      return { label: 'Complete', statusColor: 'bg-blue-600', rightBarColor: 'bg-blue-600', muted: false };
    }
  }

  if (statusUpper === 'APPROVED') {
    return { label: 'Live', statusColor: 'bg-emerald-500', rightBarColor: 'bg-emerald-500', muted: false };
  }

  return { label: statusUpper || 'Pending Approval', statusColor: 'bg-amber-500', rightBarColor: 'bg-amber-500', muted: false };
};

const formatDateParts = (event) => {
  const sch = event.schedule || {};
  let rawDate = null;
  let startTime = null;
  let endTime = null;

  if (Array.isArray(sch.weeklyTimeSlots) && sch.weeklyTimeSlots.length > 0) {
    rawDate = sch.weeklyTimeSlots[0]?.date;
    startTime = sch.weeklyTimeSlots[0]?.startTime;
    endTime = sch.weeklyTimeSlots[0]?.endTime;
  } else if (Array.isArray(sch.dailyTimeSlots) && sch.dailyTimeSlots.length > 0) {
    rawDate = sch.startDate;
    startTime = sch.dailyTimeSlots[0]?.startTime;
    endTime = sch.dailyTimeSlots[0]?.endTime;
  } else {
    rawDate = sch.startDate;
    startTime = sch.startTime;
    endTime = sch.endTime;
  }

  if (!rawDate) return { day: null, month: null, timeRange: null };

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return { day: null, month: null, timeRange: null };

  const timeRange = startTime && endTime ? `${startTime}-${endTime}` : (startTime || null);

  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: date.toLocaleString('en-US', { month: 'long' }).toUpperCase(),
    timeRange
  };
};

const MyEvents = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

const handleDuplicateEvent = async (e, eventId) => {
  e.preventDefault();
  e.stopPropagation();

  // 1. Warning Confirmation
  const isConfirmed = window.confirm("Are you sure you want to duplicate this event?");
  if (!isConfirmed) return;

  // 2. Find event & create temporary optimistic clone locally (Marked as syncing)
  const targetEvent = events.find((evt) => (evt._id || evt.createEventId) === eventId);
  const tempId = `temp-${Date.now()}`;
  const optimisticEvent = {
    ...targetEvent,
    _id: tempId,
    createEventId: 'Duplicating...',
    eventName: `${targetEvent?.eventName || 'Event'} (Copy)`,
    status: 'DRAFT',
    isSyncing: true // Flag to disable click until real DB ID arrives
  };

  // 3. Instant local state update
  setEvents((prev) => [optimisticEvent, ...prev]);

  // 4. API request runs to create DB record
  try {
    const response = await API.post(`/events/duplicate/${eventId}`);
    if (response.data?.success) {
      const actualEvent = response.data.data;
      
      // Replace temporary event with real backend data instantly
      setEvents((prev) =>
        prev.map((evt) => (evt._id === tempId ? { ...actualEvent, isSyncing: false } : evt))
      );
      toast.success("Event duplicated!");
    }
  } catch (err) {
    // Revert state & inform user if call fails
    setEvents((prev) => prev.filter((evt) => evt._id !== tempId));
    toast.error(err.response?.data?.message || 'Failed to duplicate event on server.');
  }
};
  useEffect(() => {
    const fetchMyEvents = async () => {
      setLoading(true);
      setError('');

      const organizer = getStoredOrganizer();
      const mobile = organizer.loginMobileNumber || organizer.contactMobile || localStorage.getItem('loginMobileNumber');
      const orgkycId = organizer.orgkycId || localStorage.getItem('orgkycId');
      const params = new URLSearchParams();
      if (mobile) params.append('loginMobileNumber', mobile);
      if (orgkycId) params.append('orgkycId', orgkycId);

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
  
  const cleanDate = startDateStr.split('T')[0];
  const cleanTime = normalizeTimeTo24(startTimeStr);
  const eventDate = new Date(`${cleanDate}T${cleanTime}:00`);
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

              const isCancelled = status.label === 'Cancelled';

              return (
                <Link
                  to={isCancelled ? "#" : "/event-dashboard"}
                  state={{ createEventId: evt.createEventId }}
                  onClick={(e) => {
                    if (isCancelled) {
                      e.preventDefault(); // Stops navigation entirely
                      return;
                    }
                    localStorage.setItem('createEventId', evt.createEventId);
                  }}
                  key={evt._id || evt.createEventId}
                  className={`bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs flex flex-col md:flex-row items-stretch relative transition shadow-md no-underline group ${
                    isCancelled 
                      ? 'opacity-80 bg-slate-100cursor-not-allowed pointer-events-none grayscale-[30%]' 
                      : (status.label === 'Live' ? 'hover:bg-[#cccccc]' : '')
                  }`}
                >
                  <div 
                    onClick={(e) => {
                      if (status.label === 'Draft') {
                        e.preventDefault();
                        e.preventDefault();
                        e.stopPropagation();
                        
                       // Check duplicate status
                        if (evt.duplicate === true) {
                          localStorage.setItem('createEventId', evt.createEventId); // <--- ADD THIS LINE
                          navigate('/event-details', { 
                            state: { createEventId: evt.createEventId } 
                          });
                        } else {
                          localStorage.setItem('createEventId', evt.createEventId); // <--- (Optional) Good practice here too
                          navigate('/create-event', { 
                            state: { eventId: evt._id || evt.createEventId } 
                          });
                        }
                      }
                    }}
                    className={`absolute top-0 right-0 ${status.statusColor} text-white text-[10px] font-extrabold px-3 py-1 uppercase tracking-wider z-10 ${
                      status.label === 'Draft' ? 'cursor-pointer hover:opacity-90' : ''
                    }`}
                  >
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

                        {/* {evt.rejectionReason && (
                          <p className="text-xs font-semibold text-red-600 pt-1">Reason: {evt.rejectionReason}</p>
                        )} */}
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
                  <div className="w-full md:w-36 lg:w-40  py-4 border-t md:border-t-0 flex flex-col items-center justify-center text-center relative ">
                   {/* Share and Duplicate buttons - Shown vertically on hover ONLY for Live events */}
                  {status.label === 'Live' && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          /* Add your share action here */ 
                        }}
                        className="w-7 h-7 rounded-full bg-[#666666] text-white flex items-center justify-center shadow-md transition-colors"
                        title="Share"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>

                      </button>

                     {/* Duplicate Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDuplicateEvent(e, evt._id || evt.createEventId)}
                        className="w-7 h-7 rounded-full bg-[#666666] text-white flex items-center justify-center shadow-md transition-colors hover:bg-slate-800"
                        title="Duplicate"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                        </svg>
                      </button>
                    </div>
                  )}
                    {dateParts.day && dateParts.month && (
                      <div className="flex flex-col items-center">
                        <h4 className={`text-3xl font-semibold ${status.muted ? 'text-slate-300' : 'text-pink-600'}`}>
                          {dateParts.day}
                        </h4>
                        <span className={`text-[12px] font-bold uppercase ${status.muted ? 'text-slate-300' : 'text-pink-600'}`}>
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
                  // 1. Show ONLY if event status is APPROVED
                  const isApproved = evt.status?.toUpperCase() === 'APPROVED';
                  if (!isApproved) return null;

               const weeklySlots = evt.schedule?.weeklyTimeSlots;
                  const firstSlot = Array.isArray(weeklySlots) && weeklySlots.length > 0 ? weeklySlots[0] : null;
                 
                  

                  const sch = evt.schedule || {};
                  let rawDate = null;
                  let startTime = null;

                  if (Array.isArray(sch.weeklyTimeSlots) && sch.weeklyTimeSlots.length > 0) {
                    rawDate = sch.weeklyTimeSlots[0]?.date;
                    startTime = sch.weeklyTimeSlots[0]?.startTime;
                  } else if (Array.isArray(sch.dailyTimeSlots) && sch.dailyTimeSlots.length > 0) {
                    rawDate = sch.startDate;
                    startTime = sch.dailyTimeSlots[0]?.startTime;
                  } else {
                    rawDate = sch.startDate;
                    startTime = sch.startTime;
                  }

                  if (!rawDate || !startTime) return null;

                  const timeLeft = calculateTimeLeft(rawDate, startTime);
                  
                  // 2. Hide timer if expired or if calculation returns null
                  if (!timeLeft || timeLeft.expired || (timeLeft.days <= 0 && timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0)) {
                    return null;
                  }

                  return (
                    <div className="mt-2 pt-2 pr-20 w-full flex items-center justify-center space-x-1 text-slate-900 font-bold text-sm">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-slate-900">{timeLeft.days}</span>
                        <span className="text-[10px] font-medium text-slate-700">Days</span>
                      </div>
                      <span className="text-slate-900 font-extrabold pb-6">:</span>
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-slate-900">{timeLeft.hours}</span>
                        <span className="text-[10px] font-medium text-slate-700">Hours</span>
                      </div>
                      <span className="text-slate-900 font-extrabold pb-6">:</span>
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-slate-900">{timeLeft.minutes}</span>
                        <span className="text-[10px] font-medium text-slate-700">Minutes</span>
                      </div>
                      <span className="text-slate-900 font-extrabold pb-6">:</span>
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-slate-900">{timeLeft.seconds}</span>
                        <span className="text-[10px] font-medium text-slate-700">Seconds</span>
                      </div>
                    </div>
                  );
                })()}
                  </div>
                  </Link>
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