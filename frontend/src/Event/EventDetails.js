import React, { useState, useEffect } from 'react';
import EventOrgHeader from './../EventOrganizer/EventOrgHeader';
import EventOrgFooter from './../EventOrganizer/EventOrgFooter';
import EventOrgLefSidebar from './../EventOrganizer/EventOrgLefSidebar';
import toast from 'react-hot-toast';

import API from '../utils/api';
import {
  dashLayoutWrapper,
  dashBodyFlexContainer,
  dashMainContentArea,
  dashScrollableBody,
  accountLabelStyle,
  inputFieldStyle,
  accountPrimaryBtn
} from '../styles/MasterCSSClass';


const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const cleanDate = dateStr.split('T')[0];
    const [year, month, day] = cleanDate.split('-');
    return year && month && day ? `${day}-${month}-${year}` : cleanDate;
  };
  
const EventDetails = () => {
  const [activeTab, setActiveTab] = useState('Basics');
  const [isImagesEditable, setIsImagesEditable] = useState(false);
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const [isDescEditable, setIsDescEditable] = useState(false);
  const [isArtistsEditable, setIsArtistsEditable] = useState(false);
  const [masterArtists, setMasterArtists] = useState([]);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [selectedArtistModal, setSelectedArtistModal] = useState(null);
  const [newArtistName, setNewArtistName] = useState('');
  const [newArtistType, setNewArtistType] = useState('Artist');
  const [newArtistDesc, setNewArtistDesc] = useState('');
  const [newArtistPhoto, setNewArtistPhoto] = useState('');
  const [isSavingArtist, setIsSavingArtist] = useState(false);
  const [isHashtagsEditable, setIsHashtagsEditable] = useState(false);
 const [isDirty, setIsDirty] = useState(false);
 const [isDateEditable, setIsDateEditable] = useState(false);
 const [editScheduleIndex, setEditScheduleIndex] = useState(null);
 const [isVenueEditable, setIsVenueEditable] = useState(false);

  const [eventData, setEventData] = useState({
    title: '',
    subTitle: '',
    fullDescription: '',
    bannerImage: '',
    thumbnailImage: '',
    artists: [],
    hashtags: [],
    minAge: '',
    durationHours: '',
    durationMinutes: '',
    eventType: '',
    eventScheduleType: 'single', 
    schedules: [],
    venueName: '',
    address: '',
    city: '',
    pinCode: '',
    contactName: '',
    contactEmail: '',
    contactMobile: ''
  });



  // Fetch master artists list for searching
  useEffect(() => {
    API.get('/artists')
      .then((res) => {
        const artistArray = Array.isArray(res) ? res : (res?.data || res?.artists || []);
        setMasterArtists(artistArray);
      })
      .catch((err) => console.error("Error loading artists:", err));
  }, []);

  useEffect(() => {
    if (masterArtists.length > 0 && eventData.artists.length > 0) {
      setEventData(prev => ({
        ...prev,
        artists: prev.artists.map(a => {
          const match = masterArtists.find(m => String(m.artistId) === String(a.id) || m.artistName?.toLowerCase() === a.name?.toLowerCase());
          return {
            ...a,
            photo: a.photo || match?.photoUrl || match?.photoBase64 || ''
          };
        })
      }));
    }
  }, []);



  const filteredMasterArtists = masterArtists.filter((artist) => {
    const query = eventData.artistSearchQuery ? eventData.artistSearchQuery.trim().toLowerCase() : '';
    if (!query) return false;
    const name = artist.artistName ? artist.artistName.toLowerCase() : '';
    return name.includes(query);
  });
  useEffect(() => {
    const initData = async () => {
      try {
        const artistRes = await API.get('/artists');
        const artistArray = Array.isArray(artistRes) ? artistRes : (artistRes?.data || artistRes?.artists || []);
        setMasterArtists(artistArray);

        const createEventId = localStorage.getItem('createEventId');
        if (!createEventId) return;

        const organizer = JSON.parse(localStorage.getItem('orgUserData') || '{}');
        const mobile = organizer.loginMobileNumber || organizer.contactMobile || localStorage.getItem('loginMobileNumber');
        const orgId = organizer.orgId || localStorage.getItem('orgId');
        
        const params = new URLSearchParams();
        if (mobile) params.append('loginMobileNumber', mobile);
        if (orgId) params.append('orgId', orgId);

        const response = await API.get(`/events/my-events?${params.toString()}`);
        const eventsList = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        const data = eventsList.find(evt => evt.createEventId === createEventId || evt._id === createEventId);

        if (data) {
          const mappedArtists = Array.isArray(data.artists)
            ? data.artists.map(a => {
                const searchId = a.artistId || a.id || '';
                const searchName = (a.artistName || a.name || '').trim().toLowerCase();
                
                const masterMatch = artistArray.find(
                  m => String(m.artistId) === String(searchId) || 
                       String(m._id) === String(searchId) || 
                       (m.artistName && m.artistName.trim().toLowerCase() === searchName)
                );

                return {
                  id: searchId || masterMatch?.artistId || masterMatch?._id || '',
                  name: a.artistName || a.name || masterMatch?.artistName || '',
                  role: a.role || a.artistType || masterMatch?.artistType || 'Artist',
                  description: a.description || masterMatch?.description || '',
                  photo: a.photoUrl || a.photo || a.photoBase64 || masterMatch?.photoUrl || masterMatch?.photoBase64 || ''
                };
              })
            : [];

          setEventData({
            title: data.eventName || '',
            subTitle: data.eventFormat || '',
            fullDescription: data.eventDescription || '',
            bannerImage: data.media?.bannerImage || '',
            thumbnailImage: data.media?.thumbnailImage || '',
            artists: mappedArtists,
            hashtags: data.hashtags || [],
            minAge: data.minAgeLimit || '',
            durationHours: data.durationHours || '',
            durationMinutes: data.durationMinutes || '',
            eventType: data.eventFormat || '',
            eventScheduleType: data.schedule?.eventScheduleType || 'single',
            schedules: data.schedule ? [{
              startDate: data.schedule.startDate ? data.schedule.startDate.split('T')[0] : '',
              timeSlots: data.schedule.dailyTimeSlots?.length > 0 
                ? data.schedule.dailyTimeSlots 
                : (data.schedule.weeklyTimeSlots?.length > 0 ? data.schedule.weeklyTimeSlots : [{ startTime: data.schedule.startTime, endTime: data.schedule.endTime }])
            }] : [],

            venueName: data.venue?.name || '',
            address: data.venue?.addressLine1 || '',
            city: data.venue?.city || '',
            
           
            pinCode: data.venue?.pincode || data.venue?.pinCode || '',
            contactName: data.contactPerson?.name || '',
            contactEmail: data.contactPerson?.email || '',
            contactMobile: data.contactPerson?.mobile || '',
            artistSearchQuery: ''
          });
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initData();
  }, []); // Dependency on masterArtists ensures this runs as soon as the master artist list is ready

  const handleImageFile = (file, type) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => { 
      URL.revokeObjectURL(objectUrl);
      const expectedWidth = type === 'banner' ? 1200 : 600;
      const expectedHeight = type === 'banner' ? 600 : 750;

      if (img.width !== expectedWidth || img.height !== expectedHeight) {
        toast.error(`Invalid dimensions! Expected ${expectedWidth}x${expectedHeight} px.`);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = expectedWidth;
      canvas.height = expectedHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, expectedWidth, expectedHeight);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

      if (type === 'banner') {
        setEventData((prev) => ({ ...prev, bannerImage: compressedDataUrl }));
      } else if (type === 'thumbnail') {
        setEventData((prev) => ({ ...prev, thumbnailImage: compressedDataUrl }));
      }
      toast.success(`${type === 'banner' ? 'Banner' : 'Thumbnail'} attached!`);
    };

    img.src = objectUrl;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (!isImagesEditable) return;
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file, type);
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file, type);
  };


const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (field, value) => {
  setEventData(prev => ({ ...prev, [field]: value }));
  setIsDirty(true);
};
const handleChange = (e) => {
  const { name, value } = e.target;
  setEventData((prev) => ({ ...prev, [name]: value }));
  setIsDirty(true); // <--- Add this here
};

const handleSave = () => {
  localStorage.setItem('currentEventData', JSON.stringify(eventData));
  setIsDirty(false);
  alert('Event details updated successfully!');
};

  return (
    <div className={dashLayoutWrapper}>
      <EventOrgHeader />

      <div className={dashBodyFlexContainer}>
        <EventOrgLefSidebar />

        <main className={dashMainContentArea}>
          <div className={dashScrollableBody}>
            
            {/* Sub-Navigation Tabs Bar */}
            <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between  rounded-none shadow-none ">
              <div className="flex space-x-8 text-sm font-medium text-slate-500">
                {['Basics', 'Artists & Tags', 'Date & Location', 'Features', 'Contact'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`pb-1 transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                        : 'hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content Body Sections */}
            <div className="w-full max-w-full pr-10 space-y-6 p-6 text-sm">
              {activeTab === 'Basics' && (
                <div className="bg-transparent space-y-6">
                  
                  {/* Event Title */}
                  <div>
                    <label className="text-base font-semibold text-slate-900">Event Title <span className="text-red-600">*</span></label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        name="title"
                        readOnly={!isTitleEditable}
                        value={eventData.title}
                        onChange={handleChange}
                        className={`w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none ${!isTitleEditable ? 'bg-slate-50 text-slate-600 cursor-default' : 'border-blue-500 ring-1 ring-blue-500'}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setIsTitleEditable(!isTitleEditable)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none bg-transparent p-0 shrink-0"
                        title={isTitleEditable ? "Lock field" : "Edit field"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Full Description */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="text-base font-semibold text-slate-900">Full Description</label>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="w-full">
                        <textarea
                          name="fullDescription"
                          rows="7"
                          readOnly={!isDescEditable}
                          maxLength={2000}
                          value={eventData.fullDescription}
                          onChange={handleChange}
                          className={`w-full bg-white border border-slate-300 rounded-md p-3.5 text-sm text-slate-800 focus:outline-none resize-none ${!isDescEditable ? 'bg-slate-50 text-slate-600 cursor-default' : 'border-blue-500 ring-1 ring-blue-500'}`}
                        />
                        <div className="text-right text-xs text-slate-400 mt-0.5">
                          {eventData.fullDescription.length}/2000
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setIsDescEditable(!isDescEditable)}
                        className="mb-6 text-blue-600 hover:text-blue-800 focus:outline-none bg-transparent p-0 shrink-0"
                        title={isDescEditable ? "Lock field" : "Edit field"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                      </button>
                    </div>
                  </div>

        {/* Event Banners section */}
                  <div>
                    <label className="text-base font-semibold text-slate-900">Event banner</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      
                      {/* Banner Image Preview with Drag & Drop */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Banner Image <span className="text-red-600">*</span></label>
                        <div 
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'banner')}
                          className="rounded-lg border border-slate-200 overflow-hidden bg-white relative h-56 flex items-center justify-center"
                        >
                          {eventData.bannerImage ? (
                            <img src={eventData.bannerImage} alt="Banner" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="p-6 text-center text-sm text-slate-400">No banner image uploaded</div>
                          )}
                          {isImagesEditable && (
                            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer">
                              <span>Drag & drop or Click to change (1200x600)</span>
                              <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'banner')} className="hidden" />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Thumbnail Image Preview with Edit Icon on the Right & Drag & Drop */}
                      <div className="flex items-end gap-3">
                        <div className="w-full">
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Event Thumbnail <span className="text-red-600">*</span></label>
                          <div 
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'thumbnail')}
                            className="rounded-lg border border-slate-200 overflow-hidden bg-white k relative w-56 h-56 flex items-center justify-center"
                          >
                            {eventData.thumbnailImage ? (
                              <img src={eventData.thumbnailImage} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <div className="p-6 text-center text-sm text-slate-400">No thumbnail uploaded</div>
                            )}
                            {isImagesEditable && (
                              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer text-center p-2">
                                <span>Drop or Click to change (600x750)</span>
                                <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'thumbnail')} className="hidden" />
                              </label>
                            )}
                          </div>
                        </div>

                        <button 
                          type="button" 
                          onClick={() => setIsImagesEditable(!isImagesEditable)}
                          className="mb-2 text-blue-600 hover:text-blue-800 focus:outline-none bg-transparent p-0 shrink-0 cursor-pointer"
                          title={isImagesEditable ? "Lock Images" : "Edit Images"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                          </svg>
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              )}

                  {activeTab === 'Artists & Tags' && (
                        <div className="space-y-6 relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">Artists</h3>
                            <button 
                              type="button" 
                              onClick={() => setIsArtistsEditable(!isArtistsEditable)}
                              className="text-blue-600 hover:text-blue-800 focus:outline-none bg-transparent p-0 shrink-0 cursor-pointer"
                              title={isArtistsEditable ? "Lock section" : "Edit section"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                          
                          {/* Search & Add Artist Section */}
                          {isArtistsEditable && (
                            <div className="relative space-y-2">
                              <label className="block text-xs font-semibold text-slate-700 uppercase">Search & Add Artist/Performer</label>
                              <div className="flex gap-4">
                                <input
                                  type="text"
                                  placeholder="Search artist by name..."
                                  value={eventData.artistSearchQuery || ''}
                                  onChange={(e) => setEventData({ ...eventData, artistSearchQuery: e.target.value })}
                                  className={`${inputFieldStyle} border-2 flex-1`}
                                  autoComplete="off"
                                />
                                <button
                                  type="button"
                                  onClick={() => setIsArtistModalOpen(true)}
                                  className={accountPrimaryBtn}
                                >
                                  Add Artist
                                </button>
                              </div>

                              {/* Dropdown Results */}
                              {eventData.artistSearchQuery?.trim() !== '' && filteredMasterArtists.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-xl max-h-60 overflow-y-auto z-50">
                                  {filteredMasterArtists.map((artist) => (
                                    <div
                                      key={artist._id || artist.artistId}
                                      onClick={() => {
                                        const newA = {
                                          id: artist.artistId || artist._id,
                                          name: artist.artistName,
                                          role: artist.artistType || 'Artist',
                                          description: artist.description || '',
                                          photo: artist.photoUrl || artist.photoBase64 || ''
                                        };
                                        if (!eventData.artists.some((a) => (a.name || '').toLowerCase() === newA.name.toLowerCase())) {
                                          setEventData({
                                            ...eventData,
                                            artists: [...eventData.artists, newA],
                                            artistSearchQuery: ''
                                          });
                                          setIsDirty(true);
                                          toast.success('Artist added successfully!');
                                        } else {
                                          toast.error('Artist already added.',{ id: 'event-error' });
                                        }
                                      }}
                                      className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-none"
                                    >
                                      {artist.photoUrl || artist.photoBase64 ? (
                                        <img src={artist.photoUrl || artist.photoBase64} alt={artist.artistName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs">👤</div>
                                      )}
                                      <div>
                                        <h4 className="text-xs font-bold text-slate-800">{artist.artistName}</h4>
                                        <p className="text-[11px] text-slate-500">{artist.artistType || 'Artist'}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Selected Artists Grid */}
                          <div >
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-10 gap-1 ">
                              {eventData.artists.map((artist, idx) => {
                                const artistName = artist.name || '';
                                const artistRole = artist.role || 'Artist';
                                const artistPhoto = artist.photo || '';

                                return (
                                  <div 
                                    key={idx} 
                                    className="relative group flex flex-col items-center cursor-pointer"
                                    onClick={() => setSelectedArtistModal(artist)}
                                  >
                                    {isArtistsEditable && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const updated = eventData.artists.filter((_, i) => i !== idx);
                                          setEventData({ ...eventData, artists: updated });
                                          setIsDirty(true);
                                        }}
                                        className="absolute top-0 right-0 w-5 h-5 rounded-full bg-white text-slate-600 shadow-md border border-slate-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        title="Remove artist"
                                      >
                                        ×
                                      </button>
                                    )}

                                    {artistPhoto ? (
                                      <img src={artistPhoto} alt={artistName} className="w-20 h-20 rounded-full object-cover mb-2 border border-slate-200 shadow-xs" />
                                    ) : (
                                      <div className="w-20 h-20 rounded-full bg-slate-200 mb-2 border border-slate-300 flex items-center justify-center text-slate-500 text-xs font-bold">
                                        No Photo
                                      </div>
                                    )}
                                    <span className="text-xs font-bold text-slate-800 text-center truncate w-full">{artistName}</span>
                                    <span className="text-[11px] text-slate-500">{artistRole}</span>
                                  </div>
                                );
                              })}
                              {eventData.artists.length === 0 && (
                                <p className="text-xs text-slate-400">No artists assigned.</p>
                              )}
                            </div>
                          </div>

                       {/* Exactly 5 Hashtag Input Boxes */}
                      <div className="">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-semibold text-slate-600 uppercase">Event Hashtag</label>
                          <button 
                            type="button" 
                            onClick={() => setIsHashtagsEditable(!isHashtagsEditable)}
                            className="text-blue-600 hover:text-blue-800 focus:outline-none bg-transparent p-0 shrink-0 cursor-pointer"
                            title={isHashtagsEditable ? "Lock hashtags" : "Edit hashtags"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                          {Array.from({ length: 5 }).map((_, index) => {
                            const tag = (eventData.hashtags || [])[index] || '';
                            return (
                              <input
                                key={index}
                                type="text"
                                readOnly={!isHashtagsEditable}
                                placeholder={`#hashtag ${index + 1}`}
                                value={tag}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\s+/g, '');
                                  if (val.length > 0 && !val.startsWith('#')) val = '#' + val;
                                  const newTags = [...(eventData.hashtags || ['', '', '', '', ''])];
                                  newTags[index] = val;
                                  setEventData({ ...eventData, hashtags: newTags });
                                  setIsDirty(true);
                                }}
                                className={`${inputFieldStyle} border-2 text-center ${!isHashtagsEditable ? 'bg-slate-50 cursor-default' : ''}`}
                              />
                            );
                          })}
                        </div>
                      </div>

                          {/* Artist Details Popup Modal */}
                          {selectedArtistModal && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                              <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
                                <button
                                  type="button"
                                  onClick={() => setSelectedArtistModal(null)}
                                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center font-bold text-sm cursor-pointer"
                                >
                                  ×
                                </button>
                                <div className="flex flex-col items-center text-center">
                                  {selectedArtistModal.photo ? (
                                    <img src={selectedArtistModal.photo} alt={selectedArtistModal.name} className="w-28 h-28 rounded-full object-cover mb-3 border-2 border-slate-200 shadow-md" />
                                  ) : (
                                    <div className="w-28 h-28 rounded-full bg-slate-200 mb-3 border-2 border-slate-200 flex items-center justify-center text-slate-500 text-xs">
                                      No Photo
                                    </div>
                                  )}
                                  <h3 className="text-base font-bold text-slate-800">{selectedArtistModal.name}</h3>
                                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-1">{selectedArtistModal.role}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-100">
                                  <h4 className="text-xs font-bold text-slate-800 mb-1">Description</h4>
                                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-200">
                                    {selectedArtistModal.description || 'No description available for this artist.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {/* Artist Master Popup Modal for Direct Creation */}
                          {isArtistModalOpen && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                              <div className="bg-white rounded-2xl max-w-lg w-full p-3.5 relative shadow-2xl space-y-2">
                                <div className="flex items-center justify-between pb-2">
                                  <h3 className="text-sm font-bold text-slate-800">Add New Artist</h3>
                                  <button
                                    type="button"
                                    onClick={() => setIsArtistModalOpen(false)}
                                    className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center font-bold text-sm cursor-pointer"
                                  >
                                    ×
                                  </button>
                                </div>

                            <form 
                              onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!newArtistName.trim()) {
                                      toast.error('Please enter artist name',{ id: 'event-error' });
                                      return;
                                    }
                                    setIsSavingArtist(true);
                                    try {
                                      const payload = {
                                        artistName: newArtistName,
                                        artistType: newArtistType,
                                        description: newArtistDesc,
                                        photoBase64: newArtistPhoto
                                      };

                                      const res = await API.post('/artists', payload);
                                      const savedArtist = res.data?.data || res.data || res;

                                      toast.success('Artist saved and added successfully!');

                                      const formattedNewArtist = {
                                        id: savedArtist.artistId || savedArtist._id || Date.now(),
                                        name: savedArtist.artistName || newArtistName,
                                        role: savedArtist.artistType || newArtistType,
                                        description: savedArtist.description || newArtistDesc,
                                        photo: savedArtist.photoUrl || savedArtist.photoBase64 || newArtistPhoto
                                      };

                                      // ✅ Functional update ensures state always includes current items instantly
                                      let updatedList = [];
                                      setEventData(prev => {
                                        updatedList = [...(prev.artists || []), formattedNewArtist];
                                        return { ...prev, artists: updatedList };
                                      });
                                      setIsDirty(true);

                                      setMasterArtists(prev => [savedArtist, ...prev]);

                                      try {
                                        const createEventId = localStorage.getItem('createEventId');
                                        await API.post('/events/save-step', {
                                          eventId: createEventId,
                                          artists: updatedList.map(a => ({ artistId: a.id, artistName: a.name, role: a.role }))
                                        });
                                      } catch (err) {
                                        console.error('Failed to save artist to event', err);
                                      }

                                      setNewArtistName('');
                                      setNewArtistType('Artist');
                                      setNewArtistDesc('');
                                      setNewArtistPhoto('');
                                      setIsArtistModalOpen(false);
                                    } catch (err) {
                                      toast.error('Failed to save artist');
                                    } finally {
                                      setIsSavingArtist(false);
                                    }
                                  }}
                                  className="space-y-4"
                                >
                                  <div>
                                    <label className={accountLabelStyle}>Artist Name <span className="text-red-500">*</span></label>
                                    <input
                                      type="text"
                                      value={newArtistName}
                                      onChange={(e) => setNewArtistName(e.target.value)}
                                      placeholder="e.g. Arijit Singh"
                                      className={`${inputFieldStyle} border-2`}
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className={accountLabelStyle}>Type / Category</label>
                                    <select
                                      value={newArtistType}
                                      onChange={(e) => setNewArtistType(e.target.value)}
                                      className={`${inputFieldStyle} border-2`}
                                    >
                                      <option value="Artist">Artist</option>
                                      <option value="Singer">Singer</option>
                                      <option value="Actor">Actor</option>
                                      <option value="Band">Band</option>
                                      <option value="DJ">DJ</option>
                                      <option value="Comedian">Comedian</option>
                                      <option value="Performer">Performer</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className={accountLabelStyle}>Description</label>
                                    <textarea
                                      value={newArtistDesc}
                                      onChange={(e) => setNewArtistDesc(e.target.value)}
                                      placeholder="Type short bio..."
                                      rows="2"
                                      className={`${inputFieldStyle} border-2 resize-none p-3`}
                                    />
                                  </div>

                                  {/* Fixed Drag and Drop / File Select for Artist Photo */}
                                  <div className="flex flex-col items-center">
                                    <label className={accountLabelStyle}>Photo</label>
                                    <div
                                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const file = e.dataTransfer.files?.[0];
                                        if (file && file.type.startsWith('image/')) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => setNewArtistPhoto(reader.result);
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                      className="w-24 h-24 rounded-full border-2 border-slate-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50 hover:bg-slate-100 transition relative group shadow-xs"
                                    >
                                      {newArtistPhoto ? (
                                        <div className="w-full h-full relative flex items-center justify-center">
                                          <img src={newArtistPhoto} alt="Preview" className="w-full h-full object-cover rounded-full" />
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold text-center p-1 rounded-full">
                                            Change
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                                          <span className="text-[11px] font-bold text-slate-600">Upload</span>
                                          <span className="text-[9px] text-slate-400">or drop</span>
                                        </div>
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setNewArtistPhoto(reader.result);
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                    <button
                                      type="button"
                                      onClick={() => setIsArtistModalOpen(false)}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-md transition cursor-pointer border border-slate-200"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      disabled={isSavingArtist}
                                      type="submit"
                                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-md transition cursor-pointer shadow-xs"
                                    >
                                      {isSavingArtist ? 'Saving...' : 'Save & Add Artist'}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {activeTab === 'Date & Location' && (() => {
                        
                        return (
                          <div className="space-y-6">
                            
                            {/* Section Header */}
                            <div className="flex justify-between items-center">
                              <h3 className="text-base font-bold text-slate-900">Date and Time</h3>
                            </div>

                            {/* Dynamic Date & Time Rows with Individual Edit Icons on the Right */}
                            <div className="space-y-6">
                             {(eventData.schedules || [{ startDate: '', timeSlots: [] }]).map((schedule, index) => {
                              const isRowEditable = editScheduleIndex === index;
                              const timeSlots = schedule.timeSlots || [{ startTime: '', endTime: '' }];
                              
                              return (
                                <div key={index} className="space-y-4 ">
                                  <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Start date</label>
                                     <input 
                                        type={isRowEditable ? "date" : "text"} 
                                        readOnly={!isRowEditable}
                                        value={isRowEditable ? (schedule.startDate ? schedule.startDate.split('T')[0] : '') : formatDateDisplay(schedule.startDate)} 
                                        onChange={(e) => {
                                          const updated = [...eventData.schedules];
                                          updated[index].startDate = e.target.value;
                                          setEventData({ ...eventData, schedules: updated });
                                          setIsDirty(true);
                                        }}
                                        className={`w-full border rounded-lg bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 ${!isRowEditable ? 'cursor-default border-slate-200' : 'border-slate-300'}`} 
                                      />
                                    </div>
                                    <div className="pt-5 shrink-0">
                                      <button 
                                        type="button" 
                                        onClick={() => setEditScheduleIndex(isRowEditable ? null : index)}
                                        className="text-blue-600 hover:text-blue-800 focus:outline-none bg-transparent p-0 cursor-pointer"
                                        title={isRowEditable ? "Lock row" : "Edit row"}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    {timeSlots.map((slot, slotIdx) => (
                                      <div key={slotIdx} className="flex items-center gap-3">
                                        <div className="flex-1">
                                          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-0.5">Start time</label>
                                          <input 
                                            type="time" 
                                            readOnly={!isRowEditable}
                                            value={slot.startTime || ''} 
                                            onChange={(e) => {
                                              const updated = [...eventData.schedules];
                                              updated[index].timeSlots[slotIdx].startTime = e.target.value;
                                              setEventData({ ...eventData, schedules: updated });
                                              setIsDirty(true);
                                            }}
                                            className={`w-full border rounded-lg bg-white px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 ${!isRowEditable ? 'cursor-default border-slate-200' : 'border-slate-300'}`} 
                                          />
                                        </div>
                                        <span className="text-slate-400 pt-5">-</span>
                                        <div className="flex-1">
                                          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-0.5">End time</label>
                                          <input 
                                            type="time" 
                                            readOnly={!isRowEditable}
                                            value={slot.endTime || ''} 
                                            onChange={(e) => {
                                              const updated = [...eventData.schedules];
                                              updated[index].timeSlots[slotIdx].endTime = e.target.value;
                                              setEventData({ ...eventData, schedules: updated });
                                              setIsDirty(true);
                                            }}
                                            className={`w-full border rounded-lg bg-white px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 ${!isRowEditable ? 'cursor-default border-slate-200' : 'border-slate-300'}`} 
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                            </div>

                            {/* Venue & Location Inputs */}
                            <div className="space-y-4 ">
                              <div>
                                <label className="block text-sm font-semibold text-slate-600 uppercase mb-1">Venue Name <span className="text-red-600">*</span></label>
                                <input 
                                  type="text" 
                                  name="venueName" 
                                  readOnly={!isVenueEditable}
                                  value={eventData.venueName} 
                                  onChange={handleChange} 
                                  className={`w-full border rounded-lg bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 ${!isVenueEditable ? 'cursor-default border-slate-200' : 'border-slate-300'}`} 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-600 uppercase mb-1">Address <span className="text-red-600">*</span></label>
                                <input 
                                  type="text" 
                                  name="address" 
                                  readOnly={!isVenueEditable}
                                  value={eventData.address} 
                                  onChange={handleChange} 
                                  className={`w-full border rounded-lg bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 ${!isVenueEditable ? 'cursor-default border-slate-200' : 'border-slate-300'}`} 
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-slate-600 uppercase mb-1">City <span className="text-red-600">*</span></label>
                                  <input 
                                    type="text" 
                                    name="city" 
                                    readOnly={!isVenueEditable}
                                    value={eventData.city} 
                                    onChange={handleChange} 
                                    className={`w-full border rounded-lg bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 ${!isVenueEditable ? 'cursor-default border-slate-200' : 'border-slate-300'}`} 
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-slate-600 uppercase mb-1">PIN Code</label>
                                  <input 
                                    type="text" 
                                    name="pinCode" 
                                    readOnly={!isVenueEditable}
                                    value={eventData.pinCode} 
                                    onChange={handleChange} 
                                    className={`w-full border rounded-lg bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 ${!isVenueEditable ? 'cursor-default border-slate-200' : 'border-slate-300'}`} 
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Reset Location & Location Map Section */}
                            <div className=" space-y-3">
                              <div className="flex items-center gap-2">
                              <button 
                                type="button" 
                                onClick={() => {
                                  setEventData({
                                    ...eventData,
                                    venueName: '',
                                    address: '',
                                    city: '',
                                    pinCode: ''
                                  });
                                  setIsDirty(true);
                                }}
                                className="text-blue-600 text-xs font-semibold hover:underline bg-transparent p-0 flex items-center gap-1 cursor-pointer"
                              >
                                <span>↺ Reset Location</span>
                              </button>
                                <button 
                                  type="button" 
                                  onClick={() => setIsVenueEditable(!isVenueEditable)}
                                  className="text-blue-600 hover:text-blue-800 p-0 bg-transparent cursor-pointer"
                                  title={isVenueEditable ? "Lock venue" : "Edit venue"}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                  </svg>
                                </button>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-slate-600 uppercase mb-2">Location Map</label>
                                <div className="w-full h-96 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 relative">
                                  <iframe
                                    title="Dynamic Event Location Map"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    src={'https://maps.google.com/maps?q=' + encodeURIComponent((eventData.venueName || '') + ' ' + (eventData.address || '') + ' ' + (eventData.city || '') + ' ' + (eventData.pinCode || '')) + '&t=&z=14&ie=UTF8&iwloc=&output=embed'}
                                  ></iframe>
                                </div>
                              </div>
                            </div>

                          </div>
                        );
                      })()}
              {activeTab === 'Features' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-3">Event Features & Guidelines</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 uppercase mb-1">Minimum Age Limit</label>
                      <input type="text" value={eventData.minAge} onChange={(e) => setEventData({ ...eventData, minAge: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 uppercase mb-1">Duration (Hours)</label>
                      <input type="text" value={eventData.durationHours} onChange={(e) => setEventData({ ...eventData, durationHours: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Contact' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-3">Contact Person Details</h3>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 uppercase mb-1">Name</label>
                    <input type="text" name="contactName" value={eventData.contactName} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 uppercase mb-1">Email</label>
                      <input type="email" name="contactEmail" value={eventData.contactEmail} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 uppercase mb-1">Mobile</label>
                      <input type="text" name="contactMessage" value={eventData.contactMobile} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Save Changes Button */}
            <div className="w-full max-w-full pr-6 pb-12 flex justify-end">
       <button
          type="button"
          disabled={!isDirty}
          onClick={handleSave}
          className={`px-6 py-2.5 text-white text-sm font-semibold rounded-md shadow-sm transition-all ${
            !isDirty ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          }`}
        >
          Save Changes
        </button>
            </div>

          </div>
        </main>
      </div>

      <EventOrgFooter />
    </div>
  );
};

export default EventDetails;