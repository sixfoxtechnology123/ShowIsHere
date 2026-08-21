import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { indianCities } from '../utils/indianCities';
import {
  modalOverlay,
  modalContainer,
  modalHeaderRow,
  modalHeaderTitle,
  modalCloseButton,
  searchBarWrapper,
  searchBarInner,
  searchIcon,
  searchInputClean,
  detectIconBtn,
  modalBodyCompact,
  popularTitle,
  popularGridCompact,
  cityCardCompact,
  cityIconCircle,
  cityNameCompact,
  otherCitiesContainer,
  otherCitiesGridMulti,
  otherCityItemRow,
  toggleAllCitiesBtn
} from '../styles/MasterCSSClass';

const LocationModal = ({ isOpen, onClose, onSelectCity }) => {
  const [popularCities, setPopularCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllCities, setShowAllCities] = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPopularCities();
    }
  }, [isOpen]);

  // Professional Artistic Line-Art SVGs matching BookMyShow style
  const defaultPopularCities = [
    { 
      city: 'Bengaluru', 
      svg: (
        <svg className="w-12 h-12 text-slate-800" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <text x="14" y="48" fontSize="42" fontFamily="serif" fontWeight="bold" fill="currentColor">B</text>
          <path d="M44 14v30M40 18l8-4M42 44h4" />
        </svg>
      ) 
    },
    { 
      city: 'Chennai', 
      svg: (
        <svg className="w-12 h-12 text-slate-800" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <text x="12" y="48" fontSize="42" fontFamily="serif" fontWeight="bold" fill="currentColor">C</text>
          <path d="M40 22c6 2 8 8 6 16" />
        </svg>
      ) 
    },
    { 
      city: 'Coimbatore', 
      svg: (
        <svg className="w-12 h-12 text-slate-800" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <text x="10" y="48" fontSize="42" fontFamily="serif" fontWeight="bold" fill="currentColor">C</text>
          <rect x="36" y="22" width="16" height="12" rx="2" />
          <path d="M40 28h8M40 32h8" />
        </svg>
      ) 
    },
    { 
      city: 'Hyderabad', 
      svg: (
        <svg className="w-12 h-12 text-slate-800" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 50V18h32v32M24 50V28h16v22M20 18l12-10 12 10" />
        </svg>
      ) 
    },
    { 
      city: 'Kochi', 
      svg: (
        <svg className="w-12 h-12 text-slate-800" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <text x="14" y="48" fontSize="42" fontFamily="serif" fontWeight="bold" fill="currentColor">K</text>
          <circle cx="44" cy="22" r="5" />
          <path d="M44 27v16" />
        </svg>
      ) 
    },
    { 
      city: 'Kolkata', 
      svg: (
        <svg className="w-12 h-12 text-slate-800" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <text x="12" y="48" fontSize="42" fontFamily="serif" fontWeight="bold" fill="currentColor">K</text>
          <path d="M38 18l14 10-14 10" />
        </svg>
      ) 
    },
    { 
      city: 'New Delhi', 
      svg: (
        <svg className="w-12 h-12 text-slate-800" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <text x="10" y="48" fontSize="42" fontFamily="serif" fontWeight="bold" fill="currentColor">D</text>
          <path d="M42 18v28M38 22h8" />
        </svg>
      ) 
    },
    { 
      city: 'Mumbai', 
      svg: (
        <svg className="w-12 h-12 text-slate-800" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <text x="8" y="48" fontSize="42" fontFamily="serif" fontWeight="bold" fill="currentColor">M</text>
          <path d="M40 20l12 6-12 6" />
        </svg>
      ) 
    }
  ];

  const fetchPopularCities = async () => {
    try {
      const data = await API.get('/events/cities');
      setPopularCities(data.length > 0 ? data : defaultPopularCities);
    } catch (err) {
      setPopularCities(defaultPopularCities);
    }
  };

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          const detectedCity = 
            data.address?.city || 
            data.address?.town || 
            data.address?.village || 
            data.address?.state_district || 
            'Kolkata';

          onSelectCity(detectedCity);
          onClose();
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          onSelectCity('Kolkata');
          onClose();
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert('Unable to retrieve your location. Please select manually.');
        setDetecting(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  if (!isOpen) return null;

  const filteredOtherCities = indianCities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={modalOverlay}>
      <div className={modalContainer}>
        {/* Compact Header */}
        <div className={modalHeaderRow}>
          <div className="w-5"></div>
          <h2 className={modalHeaderTitle}>Select Your City to Continue</h2>
          <button onClick={onClose} className={modalCloseButton}>✕</button>
        </div>

        {/* Compact Search Bar with Radar GPS Detect Button */}
        <div className={searchBarWrapper}>
          <div className={searchBarInner}>
            <span className={searchIcon}>🔍</span>
            <input 
              type="text"
              placeholder={detecting ? "Detecting location..." : "Search For A Location..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={searchInputClean}
              disabled={detecting}
            />
            <button 
              onClick={handleAutoDetectLocation} 
              title="Detect my current location" 
              className={detectIconBtn}
              disabled={detecting}
            >
              <svg className={`w-4 h-4 text-rose-500 ${detecting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Tight Compact Body */}
        <div className={modalBodyCompact}>
          <div>
            <h4 className={popularTitle}>Popular Cities</h4>
            <div className={popularGridCompact}>
              {popularCities.map((item, index) => {
                const cityNameStr = typeof item === 'string' ? item : item.city;
                const citySvg = item.svg || defaultPopularCities[index % defaultPopularCities.length].svg;
                return (
                  <div 
                    key={index} 
                    onClick={() => { onSelectCity(cityNameStr); onClose(); }}
                    className={cityCardCompact}
                  >
                    <div className="w-14 h-14 flex items-center justify-center mb-1 bg-white rounded-xl">{citySvg}</div>
                    <span className={cityNameCompact}>{cityNameStr}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expandable Other Cities Section */}
          {showAllCities && (
            <div className={otherCitiesContainer}>
              <h4 className={popularTitle}>Other Cities</h4>
              <div className={otherCitiesGridMulti}>
                {filteredOtherCities.map((city) => (
                  <div 
                    key={city} 
                    onClick={() => { onSelectCity(city); onClose(); }}
                    className={otherCityItemRow}
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Professional Bottom Toggle Footer */}
        <button 
          onClick={() => setShowAllCities(!showAllCities)}
          className={toggleAllCitiesBtn}
        >
          {showAllCities ? 'Hide all cities' : 'View all cities'}
        </button>
      </div>
     </div>
  );
};

export default LocationModal;