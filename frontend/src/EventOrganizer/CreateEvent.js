import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { indianCities } from '../utils/indianCities';

import API from '../utils/api';
import Logo from '../assets/Logo.jpeg';

// Import Category Icons from createevent assets folder
import musicIcon from '../assets/createevent/Music.png';
import performingArtIcon from '../assets/createevent/Performingart.png';
import conferenceIcon from '../assets/createevent/conference.png';
import sportsIcon from '../assets/createevent/Sports.png';
import artCultureIcon from '../assets/createevent/Arts&Culture.png';
import workshopIcon from '../assets/createevent/Workshop.png';
import exhibitionIcon from '../assets/createevent/Exhibitation.png';
import filmMediaIcon from '../assets/createevent/Film&Media.png';

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
  dashBrandTitle
} from '../styles/MasterCSSClass';

const CreateEvent = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [masterCategories, setMasterCategories] = useState([]);

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

  // Comprehensive Form Data State
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
    durationHours: '3',
    durationMinutes: '20',
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

  const categories = [
    { name: 'Music', icon: musicIcon },
    { name: 'Performing Art', icon: performingArtIcon },
    { name: 'Conference', icon: conferenceIcon },
    { name: 'Sport', icon: sportsIcon },
    { name: 'Art & Culture', icon: artCultureIcon },
    { name: 'Workshop', icon: workshopIcon },
    { name: 'Exhibition', icon: exhibitionIcon },
    { name: 'Film & Media', icon: filmMediaIcon }
  ];

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
    API.get('/event-categories')
      .then((res) => {
        setMasterCategories(res.data.data || res.data || []);
      })
      .catch((err) => console.error("Error loading categories", err));
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
const filteredMasterArtists = masterArtists.filter((artist) => {
    const query = formData.artistSearchQuery ? formData.artistSearchQuery.trim().toLowerCase() : '';
    if (!query) return false;
    const name = artist.artistName ? artist.artistName.toLowerCase() : '';
    return name.includes(query);
  });



const selectedMasterCat = masterCategories.find(
  (cat) => cat.categoryName?.trim().toLowerCase() === formData.eventCategory?.trim().toLowerCase()
);
  const availableSubCategories = selectedMasterCat ? selectedMasterCat.subCategories : [];

  const selectedSubCatObj = availableSubCategories.find(
    (sub) => sub.subCategoryName?.trim().toLowerCase() === formData.eventSubCategory?.trim().toLowerCase()
  );
  const availableEventTypes = selectedSubCatObj ? selectedSubCatObj.eventTypes : [];

  const handleLanguageSelect = (e) => {
    const lang = e.target.value;
    if (lang && !formData.eventLanguages.includes(lang)) {
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

    // Check if it's a drag-and-drop file object or a standard input event
    if (eventOrFile instanceof File) {
      file = eventOrFile;
    } else if (eventOrFile?.target?.files?.[0]) {
      file = eventOrFile.target.files[0];
    }

    if (!file) return;

    const maxSize = type === 'banner' ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    const sizeLimitLabel = type === 'banner' ? '15 MB' : '5 MB';
    if (file.size > maxSize) {
      toast.error(`File size exceeds the maximum limit of ${sizeLimitLabel}.`);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const width = img.width;
      const height = img.height;

      const expectedWidth = type === 'banner' ? 1200 : 600;
      const expectedHeight = type === 'banner' ? 600 : 750;

      if (width !== expectedWidth || height !== expectedHeight) {
        toast.error(`Invalid dimensions! Expected ${expectedWidth}x${expectedHeight} px, but got ${width}x${height} px.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'banner') {
          setBannerPreview(reader.result);
          setFormData(prev => ({ ...prev, bannerImage: reader.result }));
        } else if (type === 'thumbnail') {
          setThumbnailPreview(reader.result);
          setFormData(prev => ({ ...prev, thumbnailImage: reader.result }));
        }
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      toast.error('Failed to read the image file.');
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

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsDataSaved(true);
      toast.success('Draft saved successfully!', { id: 'save-draft' });
    } catch (err) {
      toast.error('Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProceed = async () => {
    if (activeStep === 1 && !validateStep1()) return;
    if (activeStep === 3 && !formData.venueName.trim()) {
      toast.error('Please enter the Venue Name.', { id: 'venue-error' });
      return;
    }

    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
      setIsDataSaved(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.success('Event creation submitted successfully!');
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs w-full h-14 flex items-center">
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
          <h1 className={accountMainTitle}>{steps[activeStep - 1].label}</h1>
          <p className={accountMainSubTitle}>
            {activeStep === 1 && 'Tell us what makes your event special.'}
            {activeStep === 2 && 'Add artists, performers, and hashtags.'}
            {activeStep === 3 && 'Set event schedule and venue location.'}
            {activeStep === 4 && 'Configure seating maps and ticket pricing.'}
            {activeStep === 5 && 'Configure event rules, age limits, and guides.'}
            {activeStep === 6 && 'Provide event inquiry contact details.'}
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
                {categories.map((cat) => {
                  const isSelected = formData.eventCategory === cat.name;
                  return (
                    <div
                      key={cat.name}
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          eventCategory: cat.name,
                          eventSubCategory: '', 
                          eventType: '' 
                        });
                        setIsDataSaved(false);
                      }}
                      className={`h-28 flex flex-col items-center justify-center p-4 rounded-md border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 text-blue-700 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <img src={cat.icon} alt={cat.name} className="w-10 h-10 mb-2 object-contain opacity-80" />
                      <span className="text-xs font-semibold">{cat.name}</span>
                    </div>
                  );
                })}
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
                  {availableSubCategories.map((sub) => (
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
                  {availableEventTypes.map((type) => (
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
                </select>
              </div>

              <div>
                <label className={accountLabelStyle}>Event Format</label>
                <div className="flex items-center gap-6 pt-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
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
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
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
                rows="4"
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

            <div className="pt-4 border-t border-slate-100">
              <h3 className={accountSectionHeading}>Event banner</h3>
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
                  id: artist._id,
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
              className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-none"
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
      <h3 className={accountSectionHeading}>Artists</h3>
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
      <h3 className={accountSectionHeading}>Event Hashtag</h3>
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
            <h4 className="text-xs font-bold text-slate-700 mb-1">Description</h4>
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
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
                        id: savedArtist._id || Date.now(),
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
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold text-center p-1 rounded-full">
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
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-md transition cursor-pointer border border-slate-200"
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
      <h3 className={accountSectionHeading}>Event Schedule</h3>
      
      <div className="grid grid-cols-1 gap-3">
        <div 
          onClick={() => setFormData({ ...formData, eventScheduleType: 'single' })} 
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
          onClick={() => setFormData({ ...formData, eventScheduleType: 'recurring' })} 
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

      {/* SINGLE EVENT SCHEDULE (WITH DATE RESTRICTION ON TIME) */}
      {formData.eventScheduleType === 'single' && (
        <div className="pt-2 space-y-3">
          <h4 className="text-xs font-bold text-slate-800">Add date and time</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start date</label>
              <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleInputChange} className={`${inputFieldStyle} border-2 w-full`} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start time</label>
              <input 
                type="time" 
                name="startTime" 
                value={formData.startTime || ''} 
                onChange={(e) => {
                  if (!formData.startDate) {
                    toast.error('Please select a start date first', { id: 'date-restriction-toast' });
                    return;
                  }
                  handleInputChange(e);
                }} 
                className={`${inputFieldStyle} border-2 w-full`} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">End time</label>
              <input 
                type="time" 
                name="endTime" 
                value={formData.endTime || ''} 
                onChange={(e) => {
                  if (!formData.startDate) {
                    toast.error('Please select a start date first', { id: 'date-restriction-toast' });
                    return;
                  }
                  handleInputChange(e);
                }} 
                className={`${inputFieldStyle} border-2 w-full`} 
              />
            </div>
          </div>
        </div>
      )}

      {/* RECURRING EVENT SCHEDULE (FULL WIDTH) */}
      {formData.eventScheduleType === 'recurring' && (
        <div className="pt-2 space-y-4 w-full">
          {/* Heading & Horizontal Line */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Add date and time</h4>
            <hr className="border-slate-200" />
          </div>

          <h4 className="text-xs font-bold text-slate-800">Repeats</h4>
          <div className="inline-flex bg-slate-100 rounded-md w-full">
            <button 
              type="button" 
              onClick={() => setFormData({ ...formData, recurringType: 'daily' })} 
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${formData.recurringType === 'daily' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Daily
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({ ...formData, recurringType: 'weekly' })} 
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${formData.recurringType === 'weekly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Weekly
            </button>
          </div>

          {/* DAILY RECURRING VIEW (FULL WIDTH) WITH HOVER CROSS DELETE */}
          {formData.recurringType === 'daily' ? (
          <div className="space-y-4 pt-2 w-full">
            {/* Flex container for inline alignment */}
            <div className="flex items-center gap-4 w-full">
              <label className="text-sm font-bold text-slate-800 whitespace-nowrap min-w-[80px]">Select date</label>
              <div className="w-full max-w-xs">
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate || ''} 
                  onChange={handleInputChange} 
                  className={`${inputFieldStyle} border-2 w-full`} 
                />
              </div>
            </div>

              <div className="space-y-3 w-full">
                <h4 className="text-xs font-bold text-slate-800">Add Time Slots</h4>
                
                {(formData.dailyTimeSlots || [{ startTime: '', endTime: '' }]).map((slot, index, arr) => (
                  <div key={index} className="relative group flex items-center gap-3 w-full">
                    <div className="flex-1">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Start time</label>
                      <input 
                        type="time" 
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
                        className={`${inputFieldStyle} border-2 w-full`} 
                      />
                    </div>
                    <span className="text-slate-400 font-bold mt-5">-</span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">End time</label>
                      <input 
                        type="time" 
                        value={slot.endTime} 
                        onChange={(e) => {
                          if (!formData.startDate) {
                            toast.error('Please select a date first', { id: 'date-restriction-toast' });
                            return;
                          }
                          const slots = [...arr];
                          slots[index].endTime = e.target.value;
                          setFormData({ ...formData, dailyTimeSlots: slots });
                        }} 
                        className={`${inputFieldStyle} border-2 w-full`} 
                      />
                    </div>
                    <div className="mt-5 flex items-center gap-1">
                      <button 
                        type="button" 
                        onClick={() => {
                          const slots = [...arr];
                          slots.splice(index + 1, 0, { startTime: '', endTime: '' });
                          setFormData({ ...formData, dailyTimeSlots: slots });
                        }}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center font-bold text-base cursor-pointer"
                        title="Add time slot"
                      >
                        +
                      </button>

                      {arr.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => {
                            const slots = arr.filter((_, i) => i !== index);
                            setFormData({ ...formData, dailyTimeSlots: slots });
                          }}
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete slot"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* WEEKLY RECURRING VIEW */
            <div className="space-y-4 pt-2 w-full">
              
            <div className="space-y-4 pt-2 w-full">
              {/* Flex container for inline alignment */}
              <div className="flex items-center gap-4 w-full">
                <label className="text-sm font-bold text-slate-800 whitespace-nowrap min-w-[80px]">
                  Select date
                </label>
                <div className="w-full max-w-xs">
                  <input 
                    type="date" 
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

                        setFormData({ ...formData, selectedWeeklyDates: updatedDates, weeklyTimeSlots: updatedSlots.length ? updatedSlots : [{ date: val, startTime: '', endTime: '' }] });
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
              </div>

              {/* Display Manually Selected Dates as Removable Pills */}
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
                        <div key={i} className="relative group px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-bold shadow-xs inline-flex items-center justify-center cursor-pointer">
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
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-slate-700 shadow-md flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-rose-100 hover:text-rose-600"
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
                <span className="text-xs font-bold text-slate-700">Same time slot for all days</span>
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

              {/* Dynamic Time Slots Rows (WITH DATE RESTRICTION) */}
              <div className="space-y-4 w-full pt-2">
                <h4 className="text-xs font-bold text-slate-800">Add Time Slots</h4>
                
                {(formData.weeklyTimeSlots || [{ date: '', startTime: '', endTime: '' }]).map((slot, index, arr) => {
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
                        <span className="text-xs font-bold text-slate-700 block">{rowTitle}</span>
                      )}

                      <div className="relative group flex items-center gap-3 w-full">
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Start time</label>
                          <input 
                            type="time" 
                            value={slot.startTime}
                            onChange={(e) => {
                              if (!formData.sameTimeSlotForAll && !slot.date && (!formData.selectedWeeklyDates || formData.selectedWeeklyDates.length === 0)) {
                                toast.error('Please select a date first', { id: 'date-restriction-toast' });
                                return;
                              }
                              const slots = [...arr];
                              slots[index].startTime = e.target.value;
                              setFormData({ ...formData, weeklyTimeSlots: slots });
                            }}
                            className={`${inputFieldStyle} border-2 w-full`} 
                          />
                        </div>
                        <span className="text-slate-400 font-bold mt-5">-</span>
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">End time</label>
                          <input 
                            type="time" 
                            value={slot.endTime}
                            onChange={(e) => {
                              if (!formData.sameTimeSlotForAll && !slot.date && (!formData.selectedWeeklyDates || formData.selectedWeeklyDates.length === 0)) {
                                toast.error('Please select a date first', { id: 'date-restriction-toast' });
                                return;
                              }
                              const slots = [...arr];
                              slots[index].endTime = e.target.value;
                              setFormData({ ...formData, weeklyTimeSlots: slots });
                            }}
                            className={`${inputFieldStyle} border-2 w-full`} 
                          />
                        </div>

                        <div className="mt-5 flex items-center gap-1">
                          <button 
                            type="button" 
                            onClick={() => {
                              const newSlot = { 
                                date: formData.sameTimeSlotForAll ? 'all' : (slot.date || formData.selectedWeeklyDates?.[0] || ''), 
                                startTime: '', 
                                endTime: '' 
                              };
                              const slots = [...arr];
                              slots.splice(index + 1, 0, newSlot);
                              setFormData({ ...formData, weeklyTimeSlots: slots });
                            }}
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center font-bold text-base cursor-pointer"
                            title="Add time slot"
                          >
                            +
                          </button>

                          {arr.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => {
                                const slots = arr.filter((_, i) => i !== index);
                                setFormData({ ...formData, weeklyTimeSlots: slots });
                              }}
                              className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete slot"
                            >
                              ×
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
  <h3 className={accountSectionHeading}>Venue Details</h3>
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
    
    {/* Interactive Map Preview Area */}
    <div className="lg:col-span-6 border-2 border-slate-200 rounded-2xl h-80 bg-slate-100 flex items-center justify-center text-center relative overflow-hidden shadow-xs">
      {formData.venueAddress || formData.venueCity || formData.venueGoogleMapLink ? (
        <iframe
          title="Venue Location Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            formData.venueGoogleMapLink && !formData.venueGoogleMapLink.includes('app.goo.gl') 
              ? formData.venueGoogleMapLink 
              : `${formData.venueAddress || ''}, ${formData.venueCity || ''}`
          )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        ></iframe>
      ) : (
        <div className="space-y-1 p-4">
          <p className="text-xl">📍</p>
          <p className="text-xs font-bold text-slate-700">Interactive Map Preview</p>
          <p className="text-[10px] text-slate-400">Enter address or map details to load location</p>
        </div>
      )}
    </div>

    {/* Venue Form Inputs */}
    <div className="lg:col-span-6 space-y-4">
      <div>
        <label className={accountLabelStyle}>Venue Name <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          name="venueName" 
          placeholder="Enter venue name" 
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
          placeholder="Enter address" 
          value={formData.venueAddress || ''} 
          onChange={handleInputChange} 
          className={`${inputFieldStyle} border-2 w-full`} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={accountLabelStyle}>City <span className="text-red-500">*</span></label>
          <select 
            name="venueCity" 
            value={formData.venueCity || ''} 
            onChange={handleInputChange} 
            className={`${inputFieldStyle} border-2 w-full`}
          >
            <option value="">Select city</option>
            {indianCities.map((city, idx) => (
              <option key={idx} value={typeof city === 'string' ? city : city.name}>
                {typeof city === 'string' ? city : city.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={accountLabelStyle}>PIN Code</label>
          <input 
            type="text" 
            name="venuePinCode" 
            placeholder="PIN code" 
            value={formData.venuePinCode || ''} 
            onChange={handleInputChange} 
            className={`${inputFieldStyle} border-2 w-full`} 
          />
        </div>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold">or</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <div>
        <label className={accountLabelStyle}>Google map link</label>
        <input 
          type="text" 
          name="venueGoogleMapLink" 
          placeholder="https://maps.google.com/..." 
          value={formData.venueGoogleMapLink || ''} 
          onChange={handleInputChange} 
          className={`${inputFieldStyle} border-2 w-full`} 
        />
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
                <h3 className={accountSectionHeading}>Seat Map configuration</h3>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 border-2  border-slate-200 rounded-2xl h-48 bg-slate-50 flex items-center justify-center p-4 text-center">
                    {seatMapImage ? <img src={seatMapImage} alt="Seat Map" className="h-full object-contain" /> : <p className="text-xs text-slate-400">Upload seat map image (.jpg or .png)</p>}
                  </div>
                  <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
                    <Link to="/seatmap" className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md text-center no-underline">Open Seat Map Creator</Link>
                    <label className="py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 text-xs font-semibold rounded-md text-center cursor-pointer">
                      Upload image
                      <input type="file" accept="image/*" onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) {
                          const r = new FileReader();
                          r.onloadend = () => setSeatMapImage(r.result);
                          r.readAsDataURL(f);
                        }
                      }} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className={accountSectionHeading}>Ticket Type</h3>
                <div className="border-2 border-slate-200 rounded-2xl bg-white overflow-hidden p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <input type="text" placeholder="Ticket Name" className={`${inputFieldStyle} border-2 sm:col-span-5`} />
                    <input type="text" placeholder="Price" className={`${inputFieldStyle} border-2 sm:col-span-2`} />
                    <input type="text" placeholder="Qty" className={`${inputFieldStyle} border-2 sm:col-span-2`} />
                    <input type="text" placeholder="Available" className={`${inputFieldStyle} border-2 sm:col-span-3`} />
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => toast.success('Ticket added!')} className="px-6 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg">Save</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: EVENT FEATURES */}
          {activeStep === 5 && (
            <div className="space-y-6">
              <div>
                <label className={accountLabelStyle}>Minimum Age Limit</label>
                <select name="minAgeLimit" value={formData.minAgeLimit} onChange={handleInputChange} className={`${inputFieldStyle} border-2`}>
                  <option value="">Select age limit</option>
                  <option value="18">18 & above</option>
                  <option value="21">21 & above</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={accountLabelStyle}>Hours</label>
                  <input type="number" name="durationHours" value={formData.durationHours} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                </div>
                <div>
                  <label className={accountLabelStyle}>Minutes</label>
                  <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className={accountSectionHeading}>Event Guide</h3>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-700">Is your event pet-friendly?</span>
                  <div className="flex gap-4 text-xs font-semibold">
                    <label><input type="radio" name="isPetFriendly" value="yes" checked={formData.isPetFriendly === 'yes'} onChange={handleInputChange} /> Yes</label>
                    <label><input type="radio" name="isPetFriendly" value="no" checked={formData.isPetFriendly === 'no'} onChange={handleInputChange} /> No</label>
                  </div>
                </div>

                <div>
                  <label className={accountLabelStyle}>Is ID required for entry?</label>
                  <select name="idRequired" value={formData.idRequired} onChange={handleInputChange} className={`${inputFieldStyle} border-2`}>
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className={accountLabelStyle}>Allowed dress code:</label>
                  <input type="text" name="allowedDressCode" placeholder="e.g. Smart casuals only" value={formData.allowedDressCode} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: EVENT CONTACT */}
          {activeStep === 6 && (
            <div className="space-y-6">
              <h3 className={accountSectionHeading}>Contact Person</h3>
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

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-center gap-2 text-xs text-amber-700 font-medium">
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