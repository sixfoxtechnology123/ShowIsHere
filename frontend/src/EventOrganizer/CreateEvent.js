import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
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
    artistsList: [
      { id: 1, name: 'Goutam Ghosh', role: 'Artist', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { id: 2, name: 'Surjo Bhattacharya', role: 'Artist', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
      { id: 3, name: 'Sagnik Sen', role: 'Artist', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
      { id: 4, name: 'Trisha Parul', role: 'Artist', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { id: 5, name: 'Saheb Chatterjee', role: 'Artist', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' }
    ],
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
          
          {/* STEP 1: EVENT DETAILS */}
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
                        className={`h-28 flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
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
                  disabled={!formData.eventCategory} // Disabled until category is selected
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
                  disabled={!formData.eventSubCategory} // Disabled until sub-category is selected
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
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
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
            className={`${inputFieldStyle} border-2 resize-none`}
          />
          <div className="text-right text-[11px] text-slate-400 mt-1">
            {formData.fullDescription.length}/2000
          </div>
        </div>

              <div className="pt-4 border-t border-slate-100">
  <h3 className={accountSectionHeading}>Event banner</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
    
    {/* BANNER UPLOAD BOX (1200x600 px) */}
    <div 
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, 'banner')}
      className="md:col-span-2 border-2  border-slate-300 rounded-2xl h-72 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition relative overflow-hidden"
    >
      {bannerPreview ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative group">
          <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover rounded-xl shadow-xs" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
            <label className="px-4 py-2 bg-white text-slate-800 text-xs font-semibold rounded-lg shadow cursor-pointer hover:bg-slate-100 transition">
              Change Banner Image
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} className="hidden" />
            </label>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-xs font-medium text-slate-500 mb-2 w-full text-left px-2">
            Upload Banner Image <span className="text-red-500 font-bold">*</span>
          </span>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs text-slate-600 mb-1">
            Drag & drop your file here or{' '}
            <label className="text-blue-600 font-semibold cursor-pointer underline">
              Click to upload
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} className="hidden" />
            </label>
          </p>
          <p className="text-[11px] text-slate-400">1200X600 px (landscape) - max 15 MB</p>
        </div>
      )}
    </div>

    {/* THUMBNAIL UPLOAD BOX (600x750 px) */}
    <div 
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, 'thumbnail')}
      className="md:col-span-1 border-2  border-slate-300 rounded-2xl h-72 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition relative overflow-hidden"
    >
      {thumbnailPreview ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative group">
          <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover rounded-xl shadow-xs" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
            <label className="px-3 py-2 bg-white text-slate-800 text-xs font-semibold rounded-lg shadow cursor-pointer hover:bg-slate-100 transition">
              Change Thumbnail
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" />
            </label>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-xs font-medium text-slate-500 mb-2 w-full text-left px-2">
            Upload Event Thumbnail <span className="text-red-500 font-bold">*</span>
          </span>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs text-slate-600 mb-1">
            Drag & drop or{' '}
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
          )}

          {/* STEP 2: ARTIST & CONTENT */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center w-full sm:w-auto gap-4">
                  <span className="text-xs font-bold text-slate-800 whitespace-nowrap">Artist/Performer</span>
                  <input
                    type="text"
                    name="artistSearchQuery"
                    placeholder="search artist"
                    value={formData.artistSearchQuery}
                    onChange={handleInputChange}
                    className={`${inputFieldStyle} border-2`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.currentArtistName.trim()) {
                      const newA = { id: Date.now(), name: formData.currentArtistName, role: formData.currentArtistRole || 'Artist', photo: formData.currentArtistPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' };
                      setFormData({ ...formData, artistsList: [...formData.artistsList, newA], currentArtistName: '', currentArtistRole: '', currentArtistBio: '', currentArtistPhoto: null });
                      toast.success('Artist added successfully!');
                    } else {
                      toast.error('Please enter an Artist Name.');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition whitespace-nowrap"
                >
                  + Add Artist
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div className="lg:col-span-5">
                  <label className={accountLabelStyle}>Artist/Performer Name</label>
                  <input
                    type="text"
                    name="currentArtistName"
                    placeholder="Enter artist name"
                    value={formData.currentArtistName}
                    onChange={handleInputChange}
                    className={`${inputFieldStyle} border-2`}
                  />
                </div>

                <div className="lg:col-span-5">
                  <label className={accountLabelStyle}>Role</label>
                  <select
                    name="currentArtistRole"
                    value={formData.currentArtistRole}
                    onChange={handleInputChange}
                    className={`${inputFieldStyle} border-2`}
                  >
                    <option value="">Select role</option>
                    <option value="Singer">Singer</option>
                    <option value="Performer">Performer</option>
                  </select>
                </div>

                <div className="lg:col-span-2 flex flex-col items-center justify-center">
                  <label className="w-20 h-20 rounded-full border-2  border-slate-300 hover:border-blue-500 bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative">
                    {formData.currentArtistPhoto ? (
                      <img src={formData.currentArtistPhoto} alt="Upload" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">upload Photo</span>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        const r = new FileReader();
                        r.onloadend = () => setFormData({ ...formData, currentArtistPhoto: r.result });
                        r.readAsDataURL(f);
                      }
                    }} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className={accountLabelStyle}>Bio (optional)</label>
                <textarea
                  name="currentArtistBio"
                  rows="3"
                  maxLength="200"
                  placeholder="Write a brief bio..."
                  value={formData.currentArtistBio}
                  onChange={handleInputChange}
                  className={`${inputFieldStyle} border-2 resize-none`}
                />
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => toast.success('Saved!')} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition">
                  Save
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className={accountSectionHeading}>Artists</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-3">
                  {formData.artistsList.map((artist) => (
                    <div key={artist.id} className="relative flex flex-col items-center p-3 rounded-xl border-2 border-slate-100 bg-white shadow-xs">
                      <button type="button" onClick={() => setFormData({ ...formData, artistsList: formData.artistsList.filter((a) => a.id !== artist.id) })} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-xs font-bold">×</button>
                      <img src={artist.photo} alt={artist.name} className="w-16 h-16 rounded-full object-cover mb-2 border border-slate-200" />
                      <span className="text-xs font-bold text-slate-800 text-center truncate w-full">{artist.name}</span>
                      <span className="text-[11px] text-slate-500">{artist.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className={accountSectionHeading}>Event Hashtag</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
                  {formData.hashtags.map((tag, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder="#hashtag"
                      value={tag}
                      onChange={(e) => {
                        const nt = [...formData.hashtags];
                        nt[index] = e.target.value;
                        setFormData({ ...formData, hashtags: nt });
                      }}
                      className={`${inputFieldStyle} border-2 text-center`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DATE & VENUE */}
          {activeStep === 3 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={accountSectionHeading}>Event Schedule</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div onClick={() => setFormData({ ...formData, eventScheduleType: 'single' })} className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${formData.eventScheduleType === 'single' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200'}`}>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Single event</h4>
                      <p className="text-[11px] text-slate-500">For events that happen only once</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.eventScheduleType === 'single' ? 'border-blue-600' : 'border-slate-300'}`}>
                      {formData.eventScheduleType === 'single' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                    </div>
                  </div>

                  <div onClick={() => setFormData({ ...formData, eventScheduleType: 'recurring' })} className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${formData.eventScheduleType === 'recurring' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200'}`}>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Recurring event</h4>
                      <p className="text-[11px] text-slate-500">For events that have repeating shows</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.eventScheduleType === 'recurring' ? 'border-blue-600' : 'border-slate-300'}`}>
                      {formData.eventScheduleType === 'recurring' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                    </div>
                  </div>
                </div>

                {formData.eventScheduleType === 'single' ? (
                  <div className="pt-2 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">Add date and time</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                      <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                      <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 space-y-4">
                    <div className="inline-flex p-1 bg-slate-100 rounded-xl border-2 border-slate-200">
                      <button type="button" onClick={() => setFormData({ ...formData, recurringType: 'daily' })} className={`px-6 py-1.5 rounded-lg text-xs font-semibold ${formData.recurringType === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Daily</button>
                      <button type="button" onClick={() => setFormData({ ...formData, recurringType: 'weekly' })} className={`px-6 py-1.5 rounded-lg text-xs font-semibold ${formData.recurringType === 'weekly' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Weekly</button>
                    </div>

                    {formData.recurringType === 'daily' ? (
                      <div className="space-y-3">
                        <input type="date" className={`${inputFieldStyle} border-2 max-w-xs`} />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="time" className={`${inputFieldStyle} border-2`} placeholder="Start time" />
                          <input type="time" className={`${inputFieldStyle} border-2`} placeholder="End time" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input type="date" className={`${inputFieldStyle} border-2 max-w-xs`} />
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold">Mon 27 Aug</span>
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold">Tue 28 Aug</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="time" className={`${inputFieldStyle} border-2`} />
                          <input type="time" className={`${inputFieldStyle} border-2`} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className={accountSectionHeading}>Venue Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-6 border-2 border-slate-200 rounded-2xl h-80 bg-slate-100 flex items-center justify-center text-center relative overflow-hidden">
                    <p className="text-xs font-bold text-slate-700">📍 Interactive Map Area</p>
                  </div>
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <label className={accountLabelStyle}>Venue Name <span className="text-red-500">*</span></label>
                      <input type="text" name="venueName" placeholder="Enter venue name" value={formData.venueName} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                    </div>
                    <div>
                      <label className={accountLabelStyle}>Address <span className="text-red-500">*</span></label>
                      <input type="text" name="venueAddress" placeholder="Enter address" value={formData.venueAddress} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select name="venueCity" value={formData.venueCity} onChange={handleInputChange} className={`${inputFieldStyle} border-2`}>
                        <option value="">Select city</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Mumbai">Mumbai</option>
                      </select>
                      <input type="text" name="venuePinCode" placeholder="PIN code" value={formData.venuePinCode} onChange={handleInputChange} className={`${inputFieldStyle} border-2`} />
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
                    <Link to="/seatmap" className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl text-center no-underline">Open Seat Map Creator</Link>
                    <label className="py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 text-xs font-semibold rounded-xl text-center cursor-pointer">
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

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-700 font-medium">
                ℹ️ Your KYC verification is in progress.
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