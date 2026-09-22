import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link,  useLocation} from 'react-router-dom';
import { indianCities } from '../utils/indianCities';



import API from '../utils/api';
import Logo from '../assets/Logo.jpeg';

import {
  mainContainer,
  inputFieldStyle,
  accountHeaderInner,
  accountStepsBar,
  accountStepItemActive,
  accountStepItemInactive,
  accountStepBadgeActive,
  accountStepBadgeInactive,
  accountUserIconBox,
  accountMainContainer,
  accountTitleSection,
  accountMainTitle,
  accountMainSubTitle,
  accountFormCard,
  accountSectionHeading,
  accountLabelStyle,
  accountFooterInner,
  accountSecondaryBtn,
  accountPrimaryBtn,
  dashBrandLogo,
  dashBrandTitle,
  inputFieldStyleduration
} from '../styles/MasterCSSClass';

const formatTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  if (isNaN(hour)) return timeStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour}:${minuteStr} ${ampm}`;
};

const calculateAvailableAfterEarlyBird = (ticketQty, earlyBirdQty) => {
  const baseQty = parseInt(ticketQty, 10) || 0;
  const ebQty = parseInt(earlyBirdQty, 10) || 0;
  return Math.max(0, baseQty - ebQty).toString();
};

const CreateEvent = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [masterCategories, setMasterCategories] = useState([]);
  const [eventCategoryTrees, setEventCategoryTrees] = useState([]);

  // Modal / Preview states
  const [bannerPreview, setBannerPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [seatMapImage, setSeatMapImage] = useState(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false);
  const [masterArtists, setMasterArtists] = useState([]);
  const [selectedArtistModal, setSelectedArtistModal] = useState(null);

  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
const [newArtistName, setNewArtistName] = useState('');
const [newArtistType, setNewArtistType] = useState('Artist');
const [newArtistDesc, setNewArtistDesc] = useState('');
const [newArtistPhoto, setNewArtistPhoto] = useState('');
const [isSavingArtist, setIsSavingArtist] = useState(false);
const [openSlotIndex, setOpenSlotIndex] = useState(null);
  const [ticketName, setTicketName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [available, setAvailable] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hasEarlyBird, setHasEarlyBird] = useState(false);
  const [ebPrice, setEbPrice] = useState('');
  const [ebQuantity, setEbQuantity] = useState('');
  const [ebStartDate, setEbStartDate] = useState('');
  const [ebStartTime, setEbStartTime] = useState('');
  const [ebEndDate, setEbEndDate] = useState('');
  const [ebEndTime, setEbEndTime] = useState('');
  const [sameTicketForEvent, setSameTicketForEvent] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [savedTickets, setSavedTickets] = useState([]);
  const [createdEventId, setCreatedEventId] = useState(null);
  const [mapZoom, setMapZoom] = useState(15);
  const [formData, setFormData] = useState({
    // Step 1
    eventTitle: '',
    eventCategory: '',
    eventSubCategory: '',
    eventType: '',
    eventLanguages: [], // Multiple languages selected
    eventFormat: '',
    fullDescription: '',
    bannerImage: null,
    thumbnailImage: null,
    // Step 2
    artistSearchQuery: '',
    currentArtistName: '',
    currentArtistRole: '',
    currentArtistBio: '',
    currentArtistPhoto: null,
    artistsList: [],
    hashtags: ['', '', '', '', '', ''],
    // Step 3
    eventScheduleType: 'single',
    startDate: '',
    startTime: '',
    endTime: '',
    recurringType: 'daily',
    dateRange: '',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venuePinCode: '',
    googleMapLink: '',
    // Step 4
    ticketsList: [
      { id: 1, name: 'VIP (A3-20)', price: '500', qty: '300', available: '270', startDate: '27-Aug-2026', endDate: '29-Aug-2026', ebPrice: '450', ebQty: '50', ebStart: '15-Aug-2026', ebEnd: '17-Aug-2026' }
    ],
    // Step 5
    minAgeLimit: '',
    durationHours: '',
    durationMinutes: '',
    isPetFriendly: 'no',
    idRequired: '',
    allowedDressCode: '',
    venueEnvironment: '',
    photographyAllowed: 'yes',
    musicGenre: '',
    stagPolicy: '',
    reEntryPolicy: '',
    // Step 6
    contactName: '',
    contactEmail: '',
    contactMobile: ''
  });

  const steps = [
    { id: 1, label: 'Event Details' },
    { id: 2, label: 'Artist & Content' },
    { id: 3, label: 'Date & Venue' },
    { id: 4, label: 'Seat Map & Ticket' },
    { id: 5, label: 'Event Features' },
    { id: 6, label: 'Event Contact' }
  ];

  const location = useLocation();
const today = new Date().toISOString().split('T')[0];

useEffect(() => {
  if (location.state?.targetStep) {
    setActiveStep(location.state.targetStep);
  }
}, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setIsDataSaved(false);
  };




  // Fetch category master data on load
  useEffect(() => {
    API.get('/categories?status=ACTIVE')
      .then((res) => {
        setMasterCategories(res.data || []);
      })
      .catch((err) => console.error("Error loading categories", err));

    API.get('/event-categories')
      .then((res) => {
        setEventCategoryTrees(res.data || []);
      })
      .catch((err) => console.error("Error loading category hierarchy", err));
  }, []);



useEffect(() => {
    API.get('/artists')
      .then((res) => {
       // console.log("Fetched artists from server:", res);
        // Since 'res' is already the direct array or response object from API.js:
        const artistArray = Array.isArray(res) 
          ? res 
          : (res?.data || res?.artists || []);
        setMasterArtists(artistArray);
      })
      .catch((err) => console.error("Error loading artists:", err));
  }, []);
  useEffect(() => {
    setSavedTickets([]);
    setOpenSlotIndex(null);
  }, [formData.selectedWeeklyDates, formData.recurringType, formData.eventScheduleType]);
const filteredMasterArtists = masterArtists.filter((artist) => {
    const query = formData.artistSearchQuery ? formData.artistSearchQuery.trim().toLowerCase() : '';
    if (!query) return false;
    const name = artist.artistName ? artist.artistName.toLowerCase() : '';
    return name.includes(query);
  });



// Find the clicked master category name from masterCategories using formData.eventCategory
const selectedMasterCardObj = masterCategories.find(
  (mc) => mc.categoryId === formData.eventCategory || mc._id === formData.eventCategory || mc.categoryName === formData.eventCategory
);

const selectedMasterCat = eventCategoryTrees.find((cat) => {
  const targetName = selectedMasterCardObj?.categoryName?.trim().toLowerCase() || formData.eventCategory?.trim().toLowerCase();
  return cat.categoryName?.trim().toLowerCase() === targetName;
});

// Fix filter to check isActive instead of status === 'ACTIVE'
const availableSubCategories = selectedMasterCat ? (selectedMasterCat.subCategories || []).filter((sub) => sub.isActive !== false) : [];

const selectedSubCatObj = availableSubCategories.find(
  (sub) => sub.subCategoryName?.trim().toLowerCase() === formData.eventSubCategory?.trim().toLowerCase()
);

const availableEventTypes = selectedSubCatObj ? (selectedSubCatObj.eventTypes || []).filter((type) => type.isActive !== false) : [];

const handleLanguageSelect = (e) => {
  const lang = e.target.value;
  if (lang && !formData.eventLanguages.includes(lang)) {
    if (formData.eventLanguages.length >= 2) {
     toast.error('You can select only 2 language.', { id: 'language-limit-toast' });
      return;
    }
    setFormData({
      ...formData,
      eventLanguages: [...formData.eventLanguages, lang]
    });
  }
};

  const removeLanguage = (langToRemove) => {
    setFormData({
      ...formData,
      eventLanguages: formData.eventLanguages.filter(l => l !== langToRemove)
    });
  };

const handleFileUpload = (eventOrFile, type) => {
    let file = null;
    if (eventOrFile instanceof File) {
      file = eventOrFile;
    } else if (eventOrFile?.target?.files?.[0]) {
      file = eventOrFile.target.files[0];
    }

    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const expectedWidth = type === 'banner' ? 1200 : 600;
      const expectedHeight = type === 'banner' ? 600 : 750;

      if (img.width !== expectedWidth || img.height !== expectedHeight) {
        toast.error(`Invalid dimensions! Expected ${expectedWidth}x${expectedHeight} px.`);
        return;
      }

      // Compress on hidden canvas to keep string small for simultaneous upload
      const canvas = document.createElement('canvas');
      canvas.width = expectedWidth;
      canvas.height = expectedHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, expectedWidth, expectedHeight);

      // JPEG compression at 70% quality (Reduces file to ~50KB)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

      if (type === 'banner') {
        setBannerPreview(compressedDataUrl);
        setFormData((prev) => ({ ...prev, bannerImage: compressedDataUrl }));
      } else if (type === 'thumbnail') {
        setThumbnailPreview(compressedDataUrl);
        setFormData((prev) => ({ ...prev, thumbnailImage: compressedDataUrl }));
      }
      toast.success(`${type === 'banner' ? 'Banner' : 'Thumbnail'} attached!`);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      toast.error('Failed to read image.');
    };

    img.src = objectUrl;
  };
const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file, type); // Passes the File object directly
    }
  };



  const validateStep1 = () => {
    if (!formData.eventTitle.trim()) {
      toast.error('Please enter the Event Title.', { id: 'event-error' });
      return false;
    }
    if (!formData.eventCategory) {
      toast.error('Please select an Event Category.', { id: 'event-error' });
      return false;
    }
    return true;
  };

// 1. Helper function to gather all inputs safely
  const buildPayload = () => ({
    eventId: createdEventId || undefined,
    currentActiveStep: activeStep,
    eventName: formData.eventTitle,
    eventDescription: formData.fullDescription || '',
    eventCategoryId: formData.eventCategory,
    eventCategoryName: selectedMasterCardObj?.categoryName || formData.eventCategory,
    subCategories: formData.eventSubCategory ? [{ subCategoryName: formData.eventSubCategory }] : [],
    eventTypes: formData.eventType ? [{ typeName: formData.eventType }] : [],
    eventLanguages: formData.eventLanguages || [],
    eventFormat: formData.eventFormat || '',
    artists: (formData.artistsList || []).map((a) => ({
      artistId: a.id || a.artistId,
      artistName: a.name,
      role: a.role
    })),
    hashtags: (formData.hashtags || []).filter(Boolean),
    media: {
      bannerImage: formData.bannerImage || null,
      thumbnailImage: formData.thumbnailImage || null,
      seatMapImage: seatMapImage || null
    },
    schedule: {
      eventScheduleType: formData.eventScheduleType || 'single',
      recurringType: formData.recurringType || 'daily',
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      startTime: formData.startTime || '',
      endTime: formData.endTime || '',
      dailyTimeSlots: formData.dailyTimeSlots || [],
      selectedWeeklyDates: formData.selectedWeeklyDates || [],
      weeklyTimeSlots: formData.weeklyTimeSlots || [],
      sameTimeSlotForAll: formData.sameTimeSlotForAll || false
    },
    venue: {
      name: formData.venueName || '',
      addressLine1: formData.venueAddress || '',
      city: formData.venueCity || '',
      pincode: formData.venuePinCode || '',
      googleMapLink: formData.venueGoogleMapLink || ''
    },
    ticketTiers: (savedTickets || []).map((t) => ({
      ticketName: t.name,
      price: Number(t.price) || 0,
      quantity: Number(t.qty) || 0,
      available: Number(t.available) || 0,
      startDate: t.startDate || '',
      startTime: t.startTime || '',
      endDate: t.endDate || '',
      endTime: t.endTime || '',
      ebPrice: t.ebPrice || '-',
      ebQty: t.ebQty || '-',
      ebStart: t.ebStart || '-',
      ebStartTime: t.ebStartTime || '-',
      ebEnd: t.ebEnd || '-',
      ebEndTime: t.ebEndTime || '-',
      slotDate: t.slotDate || ''
    })),
    guideResponses: [
      { questionId: 'PET', question: 'Is your event pet-friendly?', selectedOptions: [formData.isPetFriendly] },
      { questionId: 'ID', question: 'Is ID required for entry?', selectedOptions: [formData.idRequired] },
      { questionId: 'DRESS', question: 'Allowed dress code:', answerText: formData.allowedDressCode || '' },
      { questionId: 'VENUE', question: 'Is venue indoor or outdoor?', selectedOptions: [formData.venueType || ''] }
    ],
    minAgeLimit: formData.minAgeLimit || '',
    durationHours: formData.durationHours || '',
    durationMinutes: formData.durationMinutes || '',
    contactPerson: {
      name: formData.contactName || '',
      email: formData.contactEmail || '',
      mobile: formData.contactMobile || ''
    }
  });

// 1. "Save as Draft" Button (No loading toast)
  const handleSaveDraft = async () => {
    if (!formData.eventTitle.trim()) {
      return toast.error('Please enter the Event Title.');
    }
    if (!formData.eventCategory) {
      return toast.error('Please select an Event Category.');
    }

    setIsSaving(true);
    try {
      const payload = buildPayload();
      const res = await API.post('/events/save-step', payload);
      const savedDoc = res.data?.data || res.data || res;

      if (savedDoc?._id) {
        setCreatedEventId(savedDoc._id);
      }

      setIsDataSaved(true);
      toast.success(res.data?.message || 'Draft saved successfully!');
    } catch (err) {
      console.error('Draft error:', err);
      toast.error(err.response?.data?.message || 'Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  // 2. "Next / Proceed" Button (No loading toast)
  const handleProceed = async () => {
    if (activeStep === 1 && !validateStep1()) return;
    if (activeStep === 3 && !formData.venueName.trim()) {
      return toast.error('Please enter the Venue Name.');
    }

    try {
      const payload = buildPayload();

      if (activeStep < steps.length) {
        const res = await API.post('/events/save-step', payload);
        const savedDoc = res.data?.data || res.data || res;

        if (savedDoc?._id) {
          setCreatedEventId(savedDoc._id);
        }

        toast.success(res.data?.message || `Step ${activeStep} saved!`, { duration: 1500 });
        setActiveStep(activeStep + 1);
        setIsDataSaved(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const res = await API.post('/events/publish', {
          ...payload,
          eventId: createdEventId
        });
        toast.success(res.data?.message || 'Event published successfully!');
      }
    } catch (err) {
      console.error('Proceed error:', err);
      toast.error(err.response?.data?.message || 'Failed to save step.');
    }
  };

  const handleSecondaryAction = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      setIsDataSaved(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSaveDraft();
    }
  };

  // Sliding window navigation logic
  const getVisibleSteps = () => {
    if (activeStep <= 2) {
      return [steps[0], steps[1], steps[2]];
    } else if (activeStep >= steps.length - 1) {
      return [steps[steps.length - 3], steps[steps.length - 2], steps[steps.length - 1]];
    } else {
      return [steps[activeStep - 2], steps[activeStep - 1], steps[activeStep]];
    }
  };

  const visibleSteps = getVisibleSteps();

  return (
    <div className={mainContainer}>
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs w-full h-14 flex items-center">
        <div className={accountHeaderInner}>
          <Link to="/" className="flex items-center space-x-2 cursor-pointer no-underline">
            <img src={Logo} alt="Logo" className={dashBrandLogo} />
            <span className={dashBrandTitle}>let's do it</span>
          </Link>

          <div className={accountStepsBar}>
            {visibleSteps.map((step) => {
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => {
                    setActiveStep(step.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={isActive ? accountStepItemActive : accountStepItemInactive}
                >
                  <span className={isActive ? accountStepBadgeActive : accountStepBadgeInactive}>
                    {isCompleted ? '✓' : `0${step.id}`}
                  </span>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>

          <div className={accountUserIconBox}>
            <span>👤</span>
          </div>
        </div>
      </header>

      <main className={accountMainContainer}>
        <div className={accountTitleSection}>
          <h1 className={accountMainTitle}>{activeStep === 1 && 'Event Details'}</h1>
          <p className={accountMainSubTitle}>
            {activeStep === 1 && 'Tell us what makes your event special.'}
            {/* {activeStep === 2 && 'Add artists, performers, and hashtags.'}
            {activeStep === 3 && 'Set event schedule and venue location.'}
            {activeStep === 4 && 'Configure seating maps and ticket pricing.'}
            {activeStep === 5 && 'Configure event rules, age limits, and guides.'}
            {activeStep === 6 && 'Provide event inquiry contact details.'} */}
          </p>
        </div>

        <div className={accountFormCard}>
          
       {activeStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className={accountLabelStyle}>
                Event Title <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="eventTitle"
                placeholder="Enter event title"
                value={formData.eventTitle}
                onChange={handleInputChange}
                className={`${inputFieldStyle} border-2`}
              />
            </div>

            <div>
              <label className={accountLabelStyle}>Event Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                {masterCategories.map((cat) => {
                  const isSelected = formData.eventCategory === cat.categoryId;
                  return (
                    <div
                      key={cat.categoryId}
                     onClick={() => {
                        setFormData({ 
                          ...formData, 
                          eventCategory: cat.categoryId || cat.categoryName, 
                          eventSubCategory: '', 
                          eventType: '' 
                        });
                        setIsDataSaved(false);
                      }}
                      className={`h-28 flex flex-col items-center justify-center p-4 rounded-md border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600  text-blue-700 shadow-xs'
                          : 'border-slate-200  hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      {cat.imageBase64 ? (
                        <img src={cat.imageBase64} alt={cat.categoryName} className="w-11 h-11 mb-2  " />
                      ) : (
                        <div className="w-12 h-12 mb-2 rounded-full bg-slate-100  flex items-center justify-center text-[10px] font-bold text-slate-400">
                          CAT
                        </div>
                      )}
                      <span className="text-xs font-semibold">{cat.categoryName}</span>
                    </div>
                  );
                })}
                {masterCategories.length === 0 && (
                  <div className="col-span-full text-xs text-slate-400 text-center py-6 border border-slate-200 rounded-md">
                    No active categories found.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={accountLabelStyle}>Event Sub-Category</label>
               <select
                  name="eventSubCategory"
                  value={formData.eventSubCategory}
                  onChange={(e) => {
                    handleInputChange(e);
                    setFormData(prev => ({ ...prev, eventSubCategory: e.target.value, eventType: '' }));
                  }}
                  disabled={!formData.eventCategory}
                  className={`${inputFieldStyle} border-2 ${!formData.eventCategory ? 'bg-slate-100 cursor-not-allowed opacity-60' : ''}`}
                >
                  <option value="">{!formData.eventCategory ? 'First select an event category' : 'Select sub-category'}</option>
                  {availableSubCategories.filter(sub => sub.isActive !== false).map((sub) => (
                    <option key={sub._id || sub.subCategoryName} value={sub.subCategoryName}>
                      {sub.subCategoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={accountLabelStyle}>Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  disabled={!formData.eventSubCategory}
                  className={`${inputFieldStyle} border-2 ${!formData.eventSubCategory ? 'bg-slate-100 cursor-not-allowed opacity-60' : ''}`}
                >
                  <option value="">{!formData.eventSubCategory ? 'First select a sub-category' : 'Select event type'}</option>
                {availableEventTypes.filter(type => type.isActive !== false).map((type) => (
                    <option key={type._id || type.typeName} value={type.typeName}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <label className={accountLabelStyle + " mb-0"}>
                  Event Language
                </label>
                {formData.eventLanguages.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {formData.eventLanguages.map((lang) => (
                      <span key={lang} className="group relative inline-flex items-center gap-1 px-3 py-0.5 rounded-md text-xs font-semibold border border-blue-300 bg-blue-50/100 text-blue-700 shadow-2xs cursor-pointer">
                        {lang}
                        <button 
                          type="button" 
                          onClick={() => removeLanguage(lang)} 
                          className="hidden group-hover:inline-flex items-center text-blue-400 hover:text-red-600 font-bold text-sm leading-none ml-0.5"
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <select
                onChange={handleLanguageSelect}
                value=""
                className={`${inputFieldStyle} border-2`}
              >
                <option value="" disabled>Select language</option>
                <option value="English">English</option>
                <option value="Bengali">Bengali</option>
                <option value="Hindi">Hindi</option>
                <option value="Urdu">Urdu</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Marathi">Marathi</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Bhojpuri">Bhojpuri</option>
                <option value="Kannada">Kannada</option>
                <option value="Maithili">Maithili</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Odia">Odia</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Nepali">Nepali</option>
                <option value="Assamese">Assamese</option>
                <option value="Sanskrit">Sanskrit</option>
                <option value="Regional">Regional</option>
                <option value="Multilingual">Multilingual</option>
              </select>
            </div>

              <div>
                <label className={accountLabelStyle}>Event Format</label>
                <div className="flex items-center gap-6 pt-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="eventFormat"
                      value="Live Event"
                      checked={formData.eventFormat === 'Live Event'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 accent-blue-600"
                    />
                    Live Event
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="eventFormat"
                      value="Virtual Event"
                      checked={formData.eventFormat === 'Virtual Event'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 accent-blue-600"
                    />
                    Virtual Event
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`${accountLabelStyle} flex items-center gap-1.5 cursor-pointer`}>
                  Full Description 
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                </label>
              </div>
              <textarea
                name="fullDescription"
                rows="8"
                maxLength="2000"
                placeholder="Describe your event..."
                value={formData.fullDescription}
                onChange={handleInputChange}
                className={`${inputFieldStyle} border-2 resize-none p-4`}
              />
              <div className="text-right text-[11px] text-slate-400 mt-1">
                {formData.fullDescription.length}/2000
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-semibold text-base">Event banner</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
                
                {/* BANNER UPLOAD BOX (1200x600 px) */}
                <div className="md:col-span-2 space-y-2">
                  <label className={accountLabelStyle}>
                    Upload Banner Image <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'banner')}
                    className="border-2 border-slate-200 rounded-2xl h-72 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition relative overflow-hidden"
                  >
                    {bannerPreview ? (
                      <div className="w-full h-full flex flex-col items-center justify-center relative group">
                        <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover rounded-md shadow-xs" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                          <label className="px-4 py-2 bg-white text-slate-800 text-xs font-semibold rounded-lg shadow cursor-pointer hover:bg-slate-100 transition">
                            Change Banner Image
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-xs text-slate-600 mb-1">
                          Drop your file here or{' '}
                          <label className="text-blue-600 font-semibold cursor-pointer underline">
                            Click to upload
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} className="hidden" />
                          </label>
                        </p>
                        <p className="text-[11px] text-slate-400">1200X600 px (landscape) - max 15 MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* THUMBNAIL UPLOAD BOX (600x750 px) */}
                <div className="md:col-span-1 space-y-2">
                  <label className={accountLabelStyle}>
                    Upload Event Thumbnail <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'thumbnail')}
                    className="border-2 border-slate-200 rounded-2xl h-72 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition relative overflow-hidden"
                  >
                    {thumbnailPreview ? (
                      <div className="w-full h-full flex flex-col items-center justify-center relative group">
                        <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover rounded-md shadow-xs" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                          <label className="px-3 py-2 bg-white text-slate-800 text-xs font-semibold rounded-lg shadow cursor-pointer hover:bg-slate-100 transition">
                            Change Thumbnail
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-xs text-slate-600 mb-1">
                          Drop your file here or{' '}
                          <label className="text-blue-600 font-semibold cursor-pointer underline">
                            Click to upload
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" />
                          </label>
                        </p>
                        <p className="text-[11px] text-slate-400">600X750 px (Portrait) - max 5 MB</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      
{activeStep === 2 && (
  <div className="space-y-6">
    <div className="relative">
      <label className={accountLabelStyle}>Search & Add Artist/Performer</label>
      <div className="flex gap-4">
        <input
          type="text"
          name="artistSearchQuery"
          placeholder="Search artist by name..."
          value={formData.artistSearchQuery}
          onChange={handleInputChange}
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

      {/* Clean Dropdown: Name & Role only, no outer container box lines */}
      {formData.artistSearchQuery.trim() !== '' && filteredMasterArtists.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-xl max-h-60 overflow-y-auto z-50">
          {filteredMasterArtists.map((artist) => (
            <div
              key={artist._id}
              onClick={() => {
                const newA = {
                 id: artist.artistId || artist._id,
                  name: artist.artistName,
                  role: artist.artistType || 'Artist',
                  description: artist.description || '',
                  photo: artist.photoUrl || ''
                };
                if (!formData.artistsList.some((a) => a.name.toLowerCase() === newA.name.toLowerCase())) {
                  setFormData({
                    ...formData,
                    artistsList: [...formData.artistsList, newA],
                    artistSearchQuery: ''
                  });
                  toast.success('Artist added successfully!');
                } else {
                  toast.error('Artist already added.');
                }
              }}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer  last:border-none"
            >
              {artist.photoUrl ? (
                <img 
                  src={artist.photoUrl} 
                  alt={artist.artistName} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                  {/* Blank / empty placeholder if no image */}
                </div>
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

    {/* Selected Artists Grid matching reference layout */}
    <div className="pt-4 border-t border-slate-100">
      <h3 className="font-semibold text-base">Artists</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8  pt-3">
        {formData.artistsList.map((artist) => (
          <div 
            key={artist.id} 
            className="relative group flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedArtistModal(artist)}
          >
            {/* Cross Icon appears only on hover */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFormData({ ...formData, artistsList: formData.artistsList.filter((a) => a.id !== artist.id) });
              }}
              className="absolute top-0 right-0 w-5 h-5 rounded-full bg-white text-slate-600 shadow-md border border-slate-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Remove artist"
            >
              ×
            </button>

            {artist.photo ? (
              <img src={artist.photo} alt={artist.name} className="w-20 h-20 rounded-full object-cover mb-2 border border-slate-200 shadow-xs" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-200 mb-2 border border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                No Photo
              </div>
            )}
            <span className="text-xs font-bold text-slate-800 text-center truncate w-full">{artist.name}</span>
            <span className="text-[11px] text-slate-500">{artist.role}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Exactly 5 Hashtag Input Boxes with Validation (No spaces, must start with #) */}
    <div className="pt-4 border-t border-slate-100">
      <h3 className="font-semibold text-base">Event Hashtag</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
        {formData.hashtags.slice(0, 5).map((tag, index) => (
          <input
            key={index}
            type="text"
            placeholder={`#hashtag ${index + 1}`}
            value={tag}
            onChange={(e) => {
              let val = e.target.value;
              
              // Remove all spaces
              val = val.replace(/\s+/g, '');
              
              // Ensure it starts with '#' if user typed anything
              if (val.length > 0 && !val.startsWith('#')) {
                val = '#' + val;
              }

              const nt = [...formData.hashtags];
              nt[index] = val;
              setFormData({ ...formData, hashtags: nt });
            }}
            className={`${inputFieldStyle} border-2 text-center`}
          />
        ))}
      </div>
    </div>

    {/* Artist Details Popup Modal */}
    {selectedArtistModal && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
          <button
            type="button"
            onClick={() => setSelectedArtistModal(null)}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center font-bold text-sm"
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

      {/* ARTIST MASTER POPUP MODAL FOR DIRECT CREATION */}
      {isArtistModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          {/* Reduced padding to p-3.5 and spacing to space-y-2 to decrease modal height */}
          <div className="bg-white rounded-2xl max-w-lg w-full p-3.5 relative shadow-2xl space-y-2">
            <div className="flex items-center justify-between  pb-2">
              <h3 className="text-sm font-bold text-slate-800">Add New Artist</h3>
                  <button
                    type="button"
                    onClick={() => setIsArtistModalOpen(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center font-bold text-sm"
                  >
                    ×
                  </button>
                </div>

                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newArtistName.trim()) {
                      toast.error('Please enter artist name');
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
                      const savedArtist = res.data || res;

                      toast.success('Artist saved and added successfully!');

                      const formattedNewArtist = {
                        id: savedArtist.artistId || savedArtist._id || Date.now(),
                        name: savedArtist.artistName || newArtistName,
                        role: savedArtist.artistType || newArtistType,
                        description: savedArtist.description || newArtistDesc,
                        photo: savedArtist.photoUrl || newArtistPhoto
                      };

                      setFormData(prev => ({
                        ...prev,
                        artistsList: [...prev.artistsList, formattedNewArtist]
                      }));

                      setMasterArtists(prev => [savedArtist, ...prev]);

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

                <div className="flex flex-col items-center">
                    <label className={accountLabelStyle}>Photo</label>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setNewArtistPhoto(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-24 h-24 rounded-full border-2  border-slate-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50 hover:bg-slate-100 transition relative group shadow-xs"
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

{/* STEP 3: DATE & VENUE */}
{activeStep === 3 && (
  <div className="space-y-8">
    <div className="space-y-4">
      <h3 className="font-semibold text-base">Event Schedule</h3>
      
      <div className="grid grid-cols-1 gap-3">
        <div 
          onClick={() => setFormData({ 
              ...formData, 
              eventScheduleType: 'single',
              startDate: '',
              startTime: '',
              endTime: '',
              selectedWeeklyDates: [],
              weeklyTimeSlots: [],
              dailyTimeSlots: [{ startTime: '', endTime: '' }]
            })}
          className={`p-4 rounded-md border-2 cursor-pointer transition flex items-center justify-between ${formData.eventScheduleType === 'single' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200'}`}
        >
          <div>
            <h4 className="text-xs font-bold text-slate-800">Single event</h4>
            <p className="text-[11px] text-slate-500">For events that happen only once</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.eventScheduleType === 'single' ? 'border-blue-600' : 'border-slate-300'}`}>
            {formData.eventScheduleType === 'single' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
          </div>
        </div>

        <div 
          onClick={() => setFormData({ 
          ...formData, 
          eventScheduleType: 'recurring',
          startDate: '',
          startTime: '',
          endTime: '',
          selectedWeeklyDates: [],
          weeklyTimeSlots: [],
          dailyTimeSlots: [{ startTime: '', endTime: '' }]
        })}
          className={`p-4 rounded-md border-2 cursor-pointer transition flex items-center justify-between ${formData.eventScheduleType === 'recurring' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200'}`}
        >
          <div>
            <h4 className="text-xs font-bold text-slate-800">Recurring event</h4>
            <p className="text-[11px] text-slate-500">For events that have repeating shows</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.eventScheduleType === 'recurring' ? 'border-blue-600' : 'border-slate-300'}`}>
            {formData.eventScheduleType === 'recurring' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
          </div>
        </div>
      </div>

{/* SINGLE EVENT SCHEDULE */}
{formData.eventScheduleType === 'single' && (
  <div className="pt-2 space-y-3">
    <h4 className="text-xs font-bold text-slate-800">Add date and time</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start date</label>
        <input 
          type="date" 
          name="startDate" 
          min={today}
          value={formData.startDate || ''} 
          onChange={(e) => {
            const val = e.target.value;
            setFormData(prev => ({
              ...prev,
              startDate: val,
              startTime: '',
              endTime: ''
            }));
          }} 
          className={`${inputFieldStyle} border-2 w-full`} 
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start time</label>
        <input 
          type="time" 
          name="startTime" 
          disabled={!formData.startDate}
          value={formData.startTime || ''} 
          onChange={(e) => {
            const val = e.target.value;
            setFormData(prev => ({ ...prev, startTime: val, endTime: '' }));
          }} 
          className={`${inputFieldStyle} border-2 w-full disabled:bg-slate-100 disabled:cursor-not-allowed`} 
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">End time</label>
        <input 
          type="time" 
          name="endTime" 
          disabled={!formData.startTime}
          value={formData.endTime || ''} 
          onChange={(e) => {
            const val = e.target.value;
            if (formData.startTime && val <= formData.startTime) {
              toast.error('End time must be later than start time.', { id: 'time-validation-error' });
              return;
            }
            setFormData(prev => ({ ...prev, endTime: val }));
          }} 
          className={`${inputFieldStyle} border-2 w-full disabled:bg-slate-100 disabled:cursor-not-allowed`} 
        />
      </div>
    </div>
  </div>
)}

{/* RECURRING EVENT SCHEDULE */}
{formData.eventScheduleType === 'recurring' && (
  <div className="pt-2 space-y-4 w-full">
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-slate-800">Add date and time</h4>
      <hr className="border-slate-200" />
    </div>

    <h4 className="text-xs font-bold text-slate-800">Repeats</h4>
    <div className="inline-flex bg-slate-100 rounded-md w-full">
      <button 
        type="button" 
        onClick={() => setFormData({ 
          ...formData, 
          recurringType: 'daily',
          startDate: '',
          selectedWeeklyDates: [],
          weeklyTimeSlots: [],
          dailyTimeSlots: [{ startTime: '', endTime: '' }]
        })}
        className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${formData.recurringType === 'daily' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
      >
        Daily
      </button>
      <button 
        type="button" 
        onClick={() => setFormData({ 
          ...formData, 
          recurringType: 'weekly',
          startDate: '',
          selectedWeeklyDates: [],
          weeklyTimeSlots: [],
          dailyTimeSlots: [{ startTime: '', endTime: '' }]
        })} 
        className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${formData.recurringType === 'weekly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
      >
        Weekly
      </button>
    </div>

    {/* DAILY RECURRING VIEW */}
    {formData.recurringType === 'daily' ? (
      <div className="space-y-4 pt-2 w-full">
        <div className="flex items-center gap-4 w-full">
          <label className="text-sm font-bold text-slate-800 whitespace-nowrap min-w-[80px]">Select date</label>
          <div className="w-full max-w-xs">
            <input 
              type="date" 
              name="startDate" 
              min={today}
              value={formData.startDate || ''} 
              onChange={handleInputChange} 
              className={`${inputFieldStyle} border-2 w-full`} 
            />
          </div>
        </div>

        <div className="space-y-3 w-full">
          <h4 className="text-xs font-bold text-slate-800">Add Time Slots</h4>
          
          {(formData.dailyTimeSlots || [{ startTime: '', endTime: '' }]).map((slot, index, arr) => {
            const isLast = index === arr.length - 1;
            const hasMultiple = arr.length > 1;

            return (
              <div key={index} className="flex items-center gap-3 w-full">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Start time</label>
                  <input 
                    type="time" 
                    disabled={!formData.startDate}
                    value={slot.startTime} 
                    onChange={(e) => {
                      if (!formData.startDate) {
                        toast.error('Please select a date first', { id: 'date-restriction-toast' });
                        return;
                      }
                      const slots = [...arr];
                      slots[index].startTime = e.target.value;
                      setFormData({ ...formData, dailyTimeSlots: slots });
                    }} 
                    className={`${inputFieldStyle} border-2 w-full disabled:bg-slate-100 disabled:cursor-not-allowed`} 
                  />
                </div>
                <span className="text-slate-400 font-bold mt-5">-</span>
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">End time</label>
                  <input 
                    type="time" 
                    disabled={!slot.startTime}
                    value={slot.endTime}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (slot.startTime && val <= slot.startTime) {
                        toast.error('End time must be later than start time.', { id: 'time-validation-error' });
                        return;
                      }
                      const slots = [...arr];
                      slots[index].endTime = val;
                      setFormData({ ...formData, dailyTimeSlots: slots });
                    }} 
                    className={`${inputFieldStyle} border-2 w-full disabled:bg-slate-100 disabled:cursor-not-allowed`} 
                  />
                </div>

                {/* Slot Action Buttons */}
                <div className="mt-5 flex items-center gap-1.5">
                  {/* Delete button (Always visible when more than 1 row exists) */}
                  {hasMultiple && (
                    <button 
                      type="button" 
                      onClick={() => {
                        const slots = arr.filter((_, i) => i !== index);
                        setFormData({ ...formData, dailyTimeSlots: slots });
                      }} 
                      className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold text-sm cursor-pointer transition"
                      title="Delete slot"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

                    </button>
                  )}

                  {/* Add button (Only shown on the last row) */}
                  {isLast && (
                    <button 
                      type="button" 
                      onClick={() => {
                        const slots = [...arr, { startTime: '', endTime: '' }];
                        setFormData({ ...formData, dailyTimeSlots: slots });
                      }} 
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center font-bold text-base cursor-pointer transition"
                      title="Add time slot"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      /* WEEKLY RECURRING VIEW */
      <div className="space-y-4 pt-2 w-full">
        <div className="flex items-center gap-4 w-full">
          <label className="text-sm font-bold text-slate-800 whitespace-nowrap min-w-[80px]">Select date</label>
          <div className="w-full max-w-xs">
            <input 
              type="date" 
              min={today}
              id="weeklyDateInput"
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;

                const currentList = formData.selectedWeeklyDates || [];

                if (currentList.length === 0) {
                  const updatedDates = [val];
                  const currentSlots = formData.weeklyTimeSlots || [];
                  const updatedSlots = formData.sameTimeSlotForAll 
                    ? currentSlots 
                    : [...currentSlots.filter(s => s.date), { date: val, startTime: '', endTime: '' }];

                  setFormData({ 
                    ...formData, 
                    selectedWeeklyDates: updatedDates, 
                    weeklyTimeSlots: updatedSlots.length ? updatedSlots : [{ date: val, startTime: '', endTime: '' }] 
                  });
                  e.target.value = '';
                  toast.success('First date selected!', { id: 'weekly-toast' });
                  return;
                }

                const firstDate = new Date(currentList[0]);
                const newDate = new Date(val);
                const diffTime = newDate - firstDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                  toast.error('Selected date cannot be before the first weekly date.', { id: 'weekly-toast' });
                  e.target.value = '';
                } else if (diffDays >= 7) {
                  toast.error('Weekly selection must be within a 7-day window from the first date.', { id: 'weekly-toast' });
                  e.target.value = '';
                } else if (currentList.includes(val)) {
                  toast.error('Date already added.', { id: 'weekly-toast' });
                  e.target.value = '';
                } else {
                  const updatedDates = [...currentList, val];
                  const currentSlots = formData.weeklyTimeSlots || [];
                  const updatedSlots = formData.sameTimeSlotForAll 
                    ? currentSlots 
                    : [...currentSlots, { date: val, startTime: '', endTime: '' }];

                  setFormData({ ...formData, selectedWeeklyDates: updatedDates, weeklyTimeSlots: updatedSlots });
                  e.target.value = '';
                  toast.success('Date added successfully!', { id: 'weekly-toast' });
                }
              }} 
              className={`${inputFieldStyle} border-2 w-full`} 
            />
          </div>
        </div>

        {/* Removable Date Pills */}
        {formData.selectedWeeklyDates && formData.selectedWeeklyDates.length > 0 && (
          <div className="w-full">
            <label className="block text-[11px] font-semibold text-slate-500 mb-2">Selected Dates</label>
            <div className="flex flex-wrap gap-2 w-full">
              {formData.selectedWeeklyDates.map((dateStr, i) => {
                const d = new Date(dateStr);
                const dayNum = d.getDate();
                const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
                const weekdayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
                const formatted = `${weekdayStr} ${dayNum} ${monthStr}`;

                return (
                  <div key={i} className="relative group px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-bold shadow-xs inline-flex items-center justify-center">
                    <span>{formatted}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedDates = formData.selectedWeeklyDates.filter((_, index) => index !== i);
                        const updatedSlots = formData.sameTimeSlotForAll 
                          ? formData.weeklyTimeSlots 
                          : (formData.weeklyTimeSlots || []).filter(slot => slot.date !== dateStr);

                        setFormData({ 
                          ...formData, 
                          selectedWeeklyDates: updatedDates, 
                          weeklyTimeSlots: updatedSlots.length ? updatedSlots : [{ date: '', startTime: '', endTime: '' }] 
                        });
                      }}
                      className="ml-2 w-4 h-4 rounded-full bg-white text-slate-800 flex items-center justify-center text-[11px] font-bold cursor-pointer hover:bg-rose-100 hover:text-rose-600"
                      title="Remove date"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Checkbox for Same Time Slot For All Days */}
        <div className="flex items-center justify-between pt-2 w-full">
          <span className="text-xs font-bold text-slate-800">Same time slot for all days</span>
          <input 
            type="checkbox" 
            checked={formData.sameTimeSlotForAll || false} 
            onChange={(e) => {
              const isChecked = e.target.checked;
              if (isChecked) {
                setFormData({ 
                  ...formData, 
                  sameTimeSlotForAll: true, 
                  weeklyTimeSlots: [{ date: 'all', startTime: '', endTime: '' }] 
                });
              } else {
                const restoredSlots = (formData.selectedWeeklyDates || []).length > 0
                  ? formData.selectedWeeklyDates.map(d => ({ date: d, startTime: '', endTime: '' }))
                  : [{ date: '', startTime: '', endTime: '' }];

                setFormData({ 
                  ...formData, 
                  sameTimeSlotForAll: false, 
                  weeklyTimeSlots: restoredSlots 
                });
              }
            }} 
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" 
          />
        </div>

        {/* Weekly Dynamic Time Slots */}
        <div className="space-y-4 w-full pt-2">
          <h4 className="text-xs font-bold text-slate-800">Add Time Slots</h4>
          
          {(formData.weeklyTimeSlots || [{ date: '', startTime: '', endTime: '' }]).map((slot, index, arr) => {
            const isLast = index === arr.length - 1;
            const hasMultiple = arr.length > 1;

            let rowTitle = '';
            if (!formData.sameTimeSlotForAll && slot.date) {
              const d = new Date(slot.date);
              const dayNum = d.getDate();
              const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
              const weekdayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
              rowTitle = `${weekdayStr} ${dayNum} ${monthStr}`;
            }

            return (
              <div key={index} className="space-y-1 w-full">
                {!formData.sameTimeSlotForAll && rowTitle && (
                  <span className="text-xs font-bold text-slate-800 block">{rowTitle}</span>
                )}

                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Start time</label>
                    <input 
                      type="time" 
                      disabled={!formData.sameTimeSlotForAll && !slot.date && (!formData.selectedWeeklyDates || formData.selectedWeeklyDates.length === 0)}
                      value={slot.startTime} 
                      onChange={(e) => {
                        const slots = [...arr];
                        slots[index].startTime = e.target.value;
                        setFormData({ ...formData, weeklyTimeSlots: slots });
                      }} 
                      className={`${inputFieldStyle} border-2 w-full disabled:bg-slate-100 disabled:cursor-not-allowed`} 
                    />
                  </div>
                  <span className="text-slate-400 font-bold mt-5">-</span>
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">End time</label>
                    <input 
                      type="time" 
                      disabled={!slot.startTime}
                      value={slot.endTime}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (slot.startTime && val <= slot.startTime) {
                          toast.error('End time must be later than start time.', { id: 'time-validation-error' });
                          return;
                        }
                        const slots = [...arr];
                        slots[index].endTime = val;
                        setFormData({ ...formData, weeklyTimeSlots: slots });
                      }} 
                      className={`${inputFieldStyle} border-2 w-full disabled:bg-slate-100 disabled:cursor-not-allowed`} 
                    />
                  </div>

                  {/* Slot Action Buttons */}
                  <div className="mt-5 flex items-center gap-1.5">
                    {/* Delete button (Always visible when more than 1 row exists) */}
                    {hasMultiple && (
                      <button 
                        type="button" 
                        onClick={() => {
                          const slots = arr.filter((_, i) => i !== index);
                          setFormData({ ...formData, weeklyTimeSlots: slots });
                        }} 
                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold text-sm cursor-pointer transition"
                        title="Delete slot"
                      >
                        ×
                      </button>
                    )}

                    {/* Add button (Only shown on the last row) */}
                    {isLast && (
                      <button 
                        type="button" 
                        onClick={() => {
                          const newSlot = { 
                            date: formData.sameTimeSlotForAll ? 'all' : (slot.date || formData.selectedWeeklyDates?.[0] || ''), 
                            startTime: '', 
                            endTime: '' 
                          };
                          setFormData({ ...formData, weeklyTimeSlots: [...arr, newSlot] });
                        }} 
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center font-bold text-base cursor-pointer transition"
                        title="Add time slot"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
)}
    </div>

{/* VENUE DETAILS SECTION */}
<div className="pt-6 border-t border-slate-100 space-y-4 w-full">
  <h3 className="font-semibold text-base">Venue Details</h3>
  <div className="flex flex-col gap-6 w-full">
    
    {/* Venue Form Inputs */}
    <div className="space-y-4 w-full">
      <div>
        <label className={accountLabelStyle}>Venue Name <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          name="venueName" 
          placeholder="e.g. Mahajati Sadan" 
          value={formData.venueName || ''} 
          onChange={handleInputChange} 
          className={`${inputFieldStyle} border-2 w-full`} 
        />
      </div>

      <div>
        <label className={accountLabelStyle}>Address <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          name="venueAddress" 
          placeholder="e.g. 13B, Chittaranjan Ave" 
          value={formData.venueAddress || ''} 
          onChange={handleInputChange} 
          className={`${inputFieldStyle} border-2 w-full`} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={accountLabelStyle}>City <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            name="venueCity" 
            placeholder="Type city manually" 
            value={formData.venueCity || ''} 
            onChange={handleInputChange} 
            className={`${inputFieldStyle} border-2 w-full`} 
          />
        </div>
      <div>
  <label className={accountLabelStyle}>PIN Code</label>
  <input 
    type="text" 
    name="venuePinCode" 
    placeholder="e.g. 721161" 
    maxLength={6}
    value={formData.venuePinCode || ''} 
    onChange={(e) => {
      // Strictly allow ONLY numbers (0-9). Blocks all letters and venue names.
      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, venuePinCode: val }));
    }} 
    className={`${inputFieldStyle} border-2 w-full`} 
  />
</div>
      </div>
    </div>

    {/* Reset Location Action (Silent - No Toast) */}
    <div>
      <button
        type="button"
        onClick={() => {
          setFormData(prev => ({
            ...prev,
            venueName: '',
            venueAddress: '',
            venueCity: '',
            venuePinCode: '',
            venueGoogleMapLink: ''
          }));
        }}
        className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 transition cursor-pointer"
      >
        <span>↺</span> Reset Location
      </button>
    </div>
<div className="space-y-2 w-full">
  <label className={accountLabelStyle}>Location Map</label>

  <div className="border-2 border-slate-200 rounded-2xl h-96 bg-slate-100 relative overflow-hidden shadow-xs w-full">
    {formData.venueName?.trim() || formData.venueAddress?.trim() || formData.venueCity?.trim() || formData.venuePinCode?.trim() ? (
      <iframe
        title="Google Venue Location Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        src={(() => {
          const name = formData.venueName?.trim() || '';
          const address = formData.venueAddress?.trim() || '';
          const city = formData.venueCity?.trim() || '';
          const pin = formData.venuePinCode?.trim() || '';

          const query = [name, address, city, pin].filter(Boolean).join(', ');

          let zoom = 12;
          if (pin || (address && city)) {
            zoom = 16;
          } else if (address || city) {
            zoom = 14;
          }

          // Uses the full interactive viewer embed which includes native + / - buttons at bottom-right
          return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&hl=en&mapclient=embed&output=embed`;
        })()}
      ></iframe>
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-3xl mb-2">📍</p>
        <p className="text-xs font-bold text-slate-700">Location Map</p>
        <p className="text-[11px] text-slate-400">Enter Venue Name, City, or PIN above to load Google Maps</p>
      </div>
    )}
  </div>
</div>

  </div>
</div>
        </div>
      )}

          {/* STEP 4: SEAT MAP & TICKET */}
          {activeStep === 4 && (
            <div className="space-y-8">
             <div className="space-y-4">
              <h3 className="font-semibold text-base">Seat Map configuration</h3>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Image Box + Info Notice */}
                <div className="lg:col-span-7 space-y-3">
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files[0];
                      if (f && f.type.startsWith('image/')) {
                        const r = new FileReader();
                        r.onloadend = () => setSeatMapImage(r.result);
                        r.readAsDataURL(f);
                        toast.success('Seat map image uploaded successfully!');
                      } else {
                        toast.error('Please drop a valid image file (.jpg or .png)');
                      }
                    }}
                    className="border-2 border-slate-200 rounded-2xl h-48  flex items-center justify-center p-4 text-center cursor-pointer overflow-hidden transition hover:border-blue-400"
                  >
                    {seatMapImage ? (
                      <img src={seatMapImage} alt="Seat Map" className="h-full object-contain" />
                    ) : null}
                  </div>

                  {/* Info Notice Box */}
                  <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-2.5">
                    <span className="text-blue-500 text-sm mt-0.5">  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                              </svg></span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Upload a image of your event seat map as per your ticket category (.jpg or .png 600 X 750px recomended)
                    </p>
                  </div>
                </div>

                {/* Right Column: Buttons */}
                <div className="lg:col-span-5 flex flex-col gap-3 justify-center pt-8">
                  <Link 
                    to="/seatmap" 
                    className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg text-center no-underline shadow-xs transition"
                  >
                    Open Seat Map Creator
                  </Link>
                  
                  <div className="text-center text-xs text-slate-400 font-medium my-1">or</div>

                  <label className="py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-lg text-center cursor-pointer shadow-xs transition">
                    Upload image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) {
                          const r = new FileReader();
                          r.onloadend = () => {
                            setSeatMapImage(r.result);
                            toast.success('Seat map image uploaded successfully!');
                          };
                          r.readAsDataURL(f);
                        }
                      }} 
                      className="hidden" 
                    />
                  </label>
                </div>

              </div>
            </div>

      <div className="pt-6 border-t border-slate-100 space-y-4">
    <h3 className="font-semibold text-base">Ticket Type</h3>
    
    <div className="rounded-2xl bg-white overflow-hidden shadow-2xs space-y-4 p-4">
      
    {(formData.eventScheduleType === 'single' 
        ? (formData.startDate ? [{ date: formData.startDate, startTime: formData.startTime, endTime: formData.endTime }] : [])
        : (formData.recurringType === 'daily'
            ? (formData.startDate 
                ? (formData.dailyTimeSlots && formData.dailyTimeSlots.length > 0 
                    ? formData.dailyTimeSlots.map(slot => ({ date: formData.startDate, startTime: slot.startTime, endTime: slot.endTime }))
                    : [{ date: formData.startDate, startTime: '', endTime: '' }]
                  )
                : []
              )
            : (formData.selectedWeeklyDates && formData.selectedWeeklyDates.length > 0 
                ? formData.selectedWeeklyDates.map(date => {
                    const match = (formData.weeklyTimeSlots || []).find(s => s.date === date || formData.sameTimeSlotForAll);
                    return { date, startTime: match?.startTime || '', endTime: match?.endTime || '' };
                  })
                : []
              )
          )
    ).map((slot, slotIdx) => {
        const displayDate = slot.date || formData.startDate || '';
        const displayStart = slot.startTime || '';
        const displayEnd = slot.endTime || '';

        const slotTickets = savedTickets.filter(t => {
          const slotIdentifier = `${displayDate}_${displayStart}`;
          if (t.excludedSlots && t.excludedSlots.includes(slotIdentifier)) {
            return false;
          }
          if (t.slotDate === 'all') return true;
          return t.slotDate === displayDate && t.startTime === displayStart;
        });

        return (
          <div key={slotIdx} className="border border-slate-200/80 rounded-xl overflow-hidden bg-white mb-4">
            
            {/* Accordion Header */}
            <div 
                onClick={() => setOpenSlotIndex(openSlotIndex === slotIdx ? null : slotIdx)}
                className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-b border-slate-100/80 cursor-pointer select-none transition hover:bg-slate-100/80"
              >
                <span className="text-xs font-bold text-slate-800">
                  {(() => {
                    const formatDateString = (dateStr) => {
                      if (!dateStr) return '';
                      const d = new Date(dateStr);
                      if (isNaN(d)) return dateStr;
                      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const day = d.getDate();
                      const month = d.toLocaleDateString('en-US', { month: 'short' });
                      return `${weekday}, ${day} ${month}`;
                    };

                    const formattedDate = formatDateString(displayDate);
                    const timePart = displayStart && displayEnd 
                      ? `${formatTo12Hour(displayStart)} to ${formatTo12Hour(displayEnd)}` 
                      : formatTo12Hour(displayStart) || formatTo12Hour(displayEnd);

                    return [formattedDate, timePart].filter(Boolean).join(' - ');
                  })()}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${openSlotIndex === slotIdx ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

            {openSlotIndex === slotIdx && (
              <div className="p-6 space-y-2">
                
                {slotTickets.length === 0 && (
                  <div className="flex items-center justify-between w-full">
                    <div 
                      onClick={() => {
                        setEditingIndex(null);
                        setTicketName(''); setPrice(''); setQuantity(''); setAvailable('');
                        setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('');
                        setHasEarlyBird(false);
                        setEbPrice(''); setEbQuantity(''); setEbStartDate(''); setEbStartTime(''); setEbEndDate(''); setEbEndTime('');
                        setSameTicketForEvent(false);
                        setShowTicketForm(!showTicketForm);
                      }}
                      className="flex-1 py-3.5 px-4 bg-slate-100/90 hover:bg-slate-200/70 rounded-xl text-xs text-slate-600 font-medium text-center cursor-pointer transition border border-slate-200/60"
                    >
                      No tickets added yet!
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null);
                        setTicketName(''); setPrice(''); setQuantity(''); setAvailable('');
                        setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('');
                        setHasEarlyBird(false);
                        setEbPrice(''); setEbQuantity(''); setEbStartDate(''); setEbStartTime(''); setEbEndDate(''); setEbEndTime('');
                        setSameTicketForEvent(false);
                        setShowTicketForm(!showTicketForm);
                      }}
                      className="ml-3 text-slate-800 hover:text-blue-600 font-bold text-lg px-2 cursor-pointer transition"
                    >
                      {showTicketForm ? '−' : '+'}
                    </button>
                  </div>
                )}

                {slotTickets.length > 0 && (
                  <div className="space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-500 text-[12px]">
                            <th className="py-2.5 px-2">Name</th>
                            <th className="py-2.5 px-2">Price</th>
                            <th className="py-2.5 px-2">Qty</th>
                            <th className="py-2.5 px-2">Available</th>
                            <th className="py-2.5 px-2">Start Date</th>
                            <th className="py-2.5 px-2">End Date</th>
                            <th className="py-2.5 px-2">EB</th>
                            <th className="py-2.5 px-2">Price</th>
                            <th className="py-2.5 px-2">Start Date</th>
                            <th className="py-2.5 px-2">End Date</th>
                            <th className="py-2.5 px-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {slotTickets.map((t, idx) => {
                            const isLast = idx === slotTickets.length - 1;
                            return (
                              <tr key={idx} className="hover:bg-slate-50/50 text-[12px]">
                                <td className="py-3 px-2 text-slate-800">{t.name}</td>
                                <td className="py-3 px-2 text-slate-800">{t.price}</td>
                                <td className="py-3 px-2 text-slate-800">{t.qty}</td>
                                <td className="py-3 px-2 text-slate-800">{t.available}</td>
                                <td className="py-3 px-2 text-slate-800">{t.startDate}</td>
                                <td className="py-3 px-2 text-slate-800">{t.endDate}</td>
                                <td className="py-3 px-2 text-slate-800">{t.ebPrice}</td>
                                <td className="py-3 px-2 text-slate-800">{t.ebQty}</td>
                                <td className="py-3 px-2 text-slate-800">{t.ebStart}</td>
                                <td className="py-3 px-2 text-slate-800">{t.ebEnd}</td>
                                <td className="py-3 px-2 text-right space-x-2 whitespace-nowrap">
                                  <button 
                                  type="button" 
                                  onClick={() => {
                                    setEditingIndex(savedTickets.findIndex(item => item === t));
                                    setTicketName(t.name);
                                    setPrice(t.price);
                                    setQuantity(t.qty);
                                    setAvailable(t.available);
                                    setStartDate(t.startDate);
                                    setStartTime(t.startTime || '');
                                    setEndDate(t.endDate);
                                    setEndTime(t.endTime || '');
                                    
                                    // Properly pre-fill Early Bird fields & toggle state when editing
                                    const hasEB = t.ebPrice && t.ebPrice !== '-';
                                    setHasEarlyBird(hasEB);
                                    setEbPrice(hasEB ? t.ebPrice : '');
                                    setEbQuantity(hasEB ? t.ebQty : '');
                                    setEbStartDate(hasEB && t.ebStart !== '-' ? t.ebStart : '');
                                    setEbStartTime(hasEB && t.ebStartTime !== '-' ? (t.ebStartTime || '') : '');
                                    setEbEndDate(hasEB && t.ebEnd !== '-' ? t.ebEnd : '');
                                    setEbEndTime(hasEB && t.ebEndTime !== '-' ? (t.ebEndTime || '') : '');

                                    // Pre-fill "Same ticket for this event" toggle state
                                    setSameTicketForEvent(t.slotDate === 'all');
                                    
                                    setShowTicketForm(true);
                                  }}
                                  className="text-slate-500 hover:text-blue-600 cursor-pointer" 
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      if (t.slotDate === 'all') {
                                        const slotIdentifier = `${displayDate}_${displayStart}`;
                                        const updated = savedTickets.map(item => {
                                          if (item === t) {
                                            const exclusions = item.excludedSlots || [];
                                            return { ...item, excludedSlots: [...exclusions, slotIdentifier] };
                                          }
                                          return item;
                                        });
                                        setSavedTickets(updated);
                                      } else {
                                        setSavedTickets(savedTickets.filter(item => item !== t));
                                      }
                                    }} 
                                    className="text-slate-400 hover:text-red-600 cursor-pointer" 
                                    title="Delete"
                                  >
                                    ✕
                                  </button>
                                  {isLast && (
                                    <button 
                                      type="button" 
                                      onClick={() => setShowTicketForm(!showTicketForm)} 
                                      className="ml-1 text-slate-800 hover:text-blue-600 font-bold text-base px-1 cursor-pointer"
                                    >
                                      {showTicketForm ? '−' : '+'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Ticket Form */}
                {showTicketForm && (
                  <div className="space-y-5 pt-2 border-t border-slate-200">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                      <div className="sm:col-span-5 space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-800 block">Ticket Name</label>
                        <input type="text" placeholder="" value={ticketName} onChange={(e) => setTicketName(e.target.value)} className={`${inputFieldStyle} border border-slate-300 text-xs py-2`} />
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-800 block">Price</label>
                        <input 
                          type="text" 
                          placeholder="" 
                          value={price} 
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^\d*\.?\d*$/.test(val)) setPrice(val);
                          }} 
                          className={`${inputFieldStyle} border border-slate-300 text-xs py-2`} 
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-800 block">Quantity</label>
                        <input 
                          type="text" 
                          placeholder="" 
                          value={quantity} 
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^\d*$/.test(val)) {
                              setQuantity(val);
                              if (hasEarlyBird) {
                                setAvailable(val === '' ? '' : calculateAvailableAfterEarlyBird(val, ebQuantity));
                              }
                            }
                          }} 
                          className={`${inputFieldStyle} border border-slate-300 text-xs py-2`} 
                        />
                      </div>
                      <div className="sm:col-span-3 space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-800 block">Available</label>
                        <input 
                          type="text" 
                          placeholder="" 
                          value={available} 
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^\d*$/.test(val)) setAvailable(val);
                          }} 
                          className={`${inputFieldStyle} border border-slate-300 text-xs py-2`} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-semibold text-slate-800 block">Sales Period</span>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-5 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-500 block">Start date</label>
                            <input 
                              type="date" 
                              value={startDate} 
                              onChange={(e) => {
                                const val = e.target.value;
                                setStartDate(val);
                                if (endDate && endDate < val) setEndDate('');
                                setEndTime('');
                              }} 
                              className={`${inputFieldStyle} border border-slate-300 text-xs py-2`} 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-500 block">Start time</label>
                            <input 
                              type="time" 
                              value={startTime} 
                              disabled={!startDate}
                              onChange={(e) => {
                                setStartTime(e.target.value);
                                setEndTime('');
                              }} 
                              className={`${inputFieldStyle} border border-slate-300 text-xs py-2 disabled:bg-slate-100 disabled:cursor-not-allowed`} 
                            />
                          </div>
                        </div>
                        <span className="text-center text-slate-400 font-bold sm:col-span-1 pt-4">–</span>
                        <div className="sm:col-span-6 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-500 block">End date</label>
                            <input 
                              type="date" 
                              value={endDate} 
                              min={startDate} 
                              disabled={!startDate} 
                              onChange={(e) => {
                                setEndDate(e.target.value);
                                setEndTime('');
                              }} 
                              className={`${inputFieldStyle} border border-slate-300 text-xs py-2 disabled:bg-slate-100 disabled:cursor-not-allowed`} 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-500 block">End time</label>
                            <input 
                              type="time" 
                              value={endTime} 
                              min={startDate === endDate ? startTime : undefined}
                              disabled={!startTime} 
                              onChange={(e) => {
                                const val = e.target.value;
                                if (startDate === endDate && startTime && val <= startTime) {
                                  toast.error('End time must be later than start time.', { id: 'time-validation-error' });
                                  return;
                                }
                                setEndTime(val);
                              }} 
                              className={`${inputFieldStyle} border border-slate-300 text-xs py-2 disabled:bg-slate-100 disabled:cursor-not-allowed`} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-xs font-semibold text-slate-800">Early Bird Offer</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={hasEarlyBird} 
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setHasEarlyBird(checked);
                            if (checked) {
                              setAvailable(quantity ? calculateAvailableAfterEarlyBird(quantity, ebQuantity) : '');
                            }
                            if (!checked) {
                              setEbPrice('');
                              setEbQuantity('');
                              setAvailable(quantity);
                              setEbStartDate('');
                              setEbStartTime('');
                              setEbEndDate('');
                              setEbEndTime('');
                            }
                          }} 
                          className="sr-only peer" 
                        />
                        <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {hasEarlyBird && (
                      <div className="rounded-xl space-y-4">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-slate-800 block">Price</label>
                            <input 
                              type="text" 
                              value={ebPrice} 
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d*\.?\d*$/.test(val)) setEbPrice(val);
                              }} 
                              className={`${inputFieldStyle} border border-slate-300 text-xs py-2 bg-white`} 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-slate-800 block">Quantity</label>
                            <input 
                              type="text" 
                              value={ebQuantity} 
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d*$/.test(val)) {
                                  setEbQuantity(val);
                                  setAvailable(quantity ? calculateAvailableAfterEarlyBird(quantity, val) : '');
                                }
                              }} 
                              className={`${inputFieldStyle} border border-slate-300 text-xs py-2 bg-white`} 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-5 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-500 block">Start date</label>
                              <input type="date" value={ebStartDate} onChange={(e) => setEbStartDate(e.target.value)} className={`${inputFieldStyle} border border-slate-300 text-xs py-2 bg-white`} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-500 block">Start time</label>
                              <input type="time" value={ebStartTime} onChange={(e) => setEbStartTime(e.target.value)} className={`${inputFieldStyle} border border-slate-300 text-xs py-2 bg-white`} />
                            </div>
                          </div>
                          <span className="text-center text-slate-400 font-bold sm:col-span-1 pt-4">–</span>
                          <div className="sm:col-span-6 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-500 block">End date</label>
                              <input type="date" value={ebEndDate} min={ebStartDate} disabled={!ebStartDate} onChange={(e) => setEbEndDate(e.target.value)} className={`${inputFieldStyle} border border-slate-300 text-xs py-2 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed`} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-500 block">End time</label>
                              <input type="time" value={ebEndTime} disabled={!ebStartTime} onChange={(e) => setEbEndTime(e.target.value)} className={`${inputFieldStyle} border border-slate-300 text-xs py-2 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-600">Same ticket for this event</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={sameTicketForEvent} 
                            onChange={(e) => setSameTicketForEvent(e.target.checked)} 
                            className="sr-only peer" 
                          />
                          <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                     <button 
                        type="button" 
                        onClick={() => {
                          if (!ticketName || !price || !quantity) return toast.error('Please fill required ticket details.', { id: 'ticket-val' });
                          if (endDate && startDate && endDate < startDate) return toast.error('End date cannot be before start date.', { id: 'time-val' });

                          const newTicketData = { 
                            name: ticketName, 
                            price, 
                            qty: quantity, 
                            available: hasEarlyBird ? calculateAvailableAfterEarlyBird(quantity, ebQuantity) : (available || quantity),
                            startDate: startDate || '', 
                            startTime: startTime || '',
                            endDate: endDate || '', 
                            endTime: endTime || '',
                            ebPrice: hasEarlyBird ? ebPrice : '-', 
                            ebQty: hasEarlyBird ? ebQuantity : '-',
                            ebStart: hasEarlyBird ? ebStartDate : '-', 
                            ebStartTime: hasEarlyBird ? ebStartTime : '-',
                            ebEnd: hasEarlyBird ? ebEndDate : '-',
                            ebEndTime: hasEarlyBird ? ebEndTime : '-',
                            slotDate: sameTicketForEvent ? 'all' : displayDate,
                            startTime: displayStart
                          };

                          if (editingIndex !== null) {
                            const updated = [...savedTickets];
                            updated[editingIndex] = newTicketData;
                            setSavedTickets(updated);
                            toast.success('Ticket updated successfully!', { id: 'ticket-toast' });
                          } else {
                            setSavedTickets([...savedTickets, newTicketData]);
                            toast.success('Ticket added!', { id: 'ticket-toast' });
                          }

                          setTicketName(''); 
                          setPrice(''); 
                          setQuantity(''); 
                          setAvailable('');
                          setStartDate(''); 
                          setStartTime(''); 
                          setEndDate(''); 
                          setEndTime('');
                          setHasEarlyBird(false);
                          setEbPrice('');
                          setEbQuantity('');
                          setEbStartDate('');
                          setEbStartTime('');
                          setEbEndDate('');
                          setEbEndTime('');
                          setSameTicketForEvent(false);
                          setEditingIndex(null);
                          setShowTicketForm(false);
                        }} 
                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer"
                      >
                        {editingIndex !== null ? 'Update' : 'Save'}
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>
        );
      })}

    </div>
  </div>
  </div>
)}

{activeStep === 5 && (
  <div className="space-y-6">
    {/* Minimum Age Limit (1 to 99) */}
    <div>
      <label className={accountLabelStyle}>Minimum Age Limit</label>
      <div className="flex items-center gap-3">
        <select 
          name="minAgeLimit" 
          value={formData.minAgeLimit} 
          onChange={handleInputChange} 
          className={`${inputFieldStyle} border-2 w-full`}
        >
          <option value="">Select</option>
          {Array.from({ length: 99 }, (_, i) => i + 1).map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">& above</span>
      </div>
    </div>

    {/* Duration Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap">
        <label className={`${accountLabelStyle} mb-0`}>Duration</label>
        
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            name="durationHours" 
            value={formData.durationHours} 
            onChange={handleInputChange} 
            className={`${inputFieldStyleduration} border-2 w-20 text-center`} 
          />
          <span className="text-sm text-slate-700">Hours</span>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="number" 
            name="durationMinutes" 
            value={formData.durationMinutes} 
            onChange={handleInputChange} 
            className={`${inputFieldStyleduration} border-2 w-20 text-center`} 
          />
          <span className="text-sm text-slate-700">Minutes</span>
        </div>
      </div>

      {/* Optional Duration Preview Badge */}
      {(formData.durationHours || formData.durationMinutes) && (
        <div className="inline-block bg-blue-50 border border-blue-100 text-blue-800 text-xs font-medium px-16 ml-16 py-1.5 rounded-md">
          Duration : {formData.durationHours || 0} Hours {formData.durationMinutes || 0} Minutes
        </div>
      )}
    </div>

<div className="space-y-4 pt-4">
      <h3 className="font-semibold text-base text-slate-900">Event Guide</h3>
      <p className="text-xs text-slate-500 -mt-2">Provide attendees with valuable information and address their questions</p>
      
      {/* 1. Pet Friendly */}
      <div className="flex justify-between items-center pb-2 ">
        <span className="text-xs font-medium text-slate-800">Is your event pet-friendly?</span>
        <div className="w-1/3 flex gap-6 text-xs font-semibold">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="isPetFriendly" value="yes" checked={formData.isPetFriendly === 'yes'} onChange={handleInputChange} /> Yes
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="isPetFriendly" value="no" checked={formData.isPetFriendly === 'no'} onChange={handleInputChange} /> No
          </label>
        </div>
      </div>
      <div className="border-b border-slate-100"></div>
      {/* 2. ID Required */}
      <div className="flex justify-between items-center py-2 ">
        <span className="text-xs font-medium text-slate-800">Is ID required for entry?</span>
        <select name="idRequired" value={formData.idRequired} onChange={handleInputChange} className="w-1/3 text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500">
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
  <div className="border-b border-slate-100"></div>
      {/* 3. Allowed Dress Code */}
      <div className="flex justify-between items-center py-2 ">
        <span className="text-xs font-medium text-slate-800">Allowed dress code:</span>
        <input type="text" name="allowedDressCode" placeholder="e.g. Smart casuals only" value={formData.allowedDressCode} onChange={handleInputChange} className="w-1/3 text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500" />
      </div>
  <div className="border-b border-slate-100"></div>
      {/* 4. Venue Indoor or Outdoor */}
      <div className="flex justify-between items-center py-2 ">
        <span className="text-xs font-medium text-slate-800">Is venue indoor or outdoor?</span>
        <select name="venueType" value={formData.venueType || ''} onChange={handleInputChange} className="w-1/3 text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500">
          <option value="">Select</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Both">Both</option>
        </select>
      </div>
        <div className="border-b border-slate-100"></div>
      </div>
  </div>
)}

          {/* STEP 6: EVENT CONTACT */}
          {activeStep === 6 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-base">Contact Person</h3>
              <p className="text-xs text-slate-500">Please add a contact for event enquiries.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={accountLabelStyle}>Name</label>
                  <input type="text" name="contactName" placeholder="Name" value={formData.contactName} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                </div>
                <div>
                  <label className={accountLabelStyle}>Email</label>
                  <input type="email" name="contactEmail" placeholder="Email" value={formData.contactEmail} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                </div>
                <div>
                  <label className={accountLabelStyle}>Mobile</label>
                  <input type="text" name="contactMobile" placeholder="Mobile" value={formData.contactMobile} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                </div>
              </div>

              <div className=" bg-amber-50 border border-amber-200 rounded-md flex items-center justify-center gap-2 text-xs text-amber-700 font-medium absolute w-3/5 bottom-44 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <span>Your KYC verification is in progress.</span>
            </div>
            </div>
          )}

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-40 shadow-lg w-full h-14 flex items-center">
        <div className={accountFooterInner}>
          <button type="button" onClick={handleSecondaryAction} className={accountSecondaryBtn}>
            {activeStep > 1 ? 'Back' : 'Save as Draft'}
          </button>

          <button type="button" onClick={handleProceed} className={accountPrimaryBtn}>
            <span>{activeStep === steps.length ? 'Submit' : steps[activeStep].label}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CreateEvent;
