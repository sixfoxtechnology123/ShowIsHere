import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { indianCities } from '../utils/indianCities';

import ahmedabadImg from '../assets/cityLogo/ahmedabad.png';
import bangaluruImg from '../assets/cityLogo/bangaluru.png';
import chennaiImg from '../assets/cityLogo/chennai.png';
import delhiImg from '../assets/cityLogo/delhi.png';
import hyderabadImg from '../assets/cityLogo/hyderabad.png';
import kolkataImg from '../assets/cityLogo/kolkata.png';
import mumbaiImg from '../assets/cityLogo/mumbai.png';
import puneImg from '../assets/cityLogo/pune.png';

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

  const defaultPopularCities = [
    { city: 'Mumbai', image: mumbaiImg },
    { city: 'Delhi-NCR', image: delhiImg },
    { city: 'Bengaluru', image: bangaluruImg },
    { city: 'Hyderabad', image: hyderabadImg },
    { city: 'Ahmedabad', image: ahmedabadImg },
    { city: 'Pune', image: puneImg },
    { city: 'Chennai', image: chennaiImg },
    { city: 'Kolkata', image: kolkataImg }
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
        <div className={modalHeaderRow}>
          <div className="w-5"></div>
          <h2 className={modalHeaderTitle}>Select Your City to Continue</h2>
          <button onClick={onClose} className={modalCloseButton}>✕</button>
        </div>

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
              <span className="text-xs font-semibold text-rose-500 ml-1.5 whitespace-nowrap">Detect Location</span>
            </button>
          </div>
        </div>
        <div className={modalBodyCompact}>
          <div>
            <h4 className={popularTitle}>Popular Cities</h4>
            <div className={popularGridCompact}>
              {popularCities.map((item, index) => {
                const cityNameStr = typeof item === 'string' ? item : item.city;
                const cityImg = item.image || defaultPopularCities.find(c => c.city.toLowerCase() === cityNameStr.toLowerCase())?.image;
                
                return (
                  <div 
                    key={index} 
                    onClick={() => { onSelectCity(cityNameStr); onClose(); }}
                    className={cityCardCompact}
                  >
                    <div className="w-14 h-14 flex items-center justify-center mb-1 bg-white rounded-2xl border border-slate-200/60 p-1 shadow-2xs">
                      {cityImg ? (
                        <img src={cityImg} alt={cityNameStr} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xl font-serif font-bold text-slate-800">{cityNameStr.charAt(0)}</span>
                      )}
                    </div>
                    <span className={cityNameCompact}>{cityNameStr}</span>
                  </div>
                );
              })}
            </div>
          </div>

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