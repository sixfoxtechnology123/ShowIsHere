import React, { useState, useEffect } from 'react';
import API from './utils/api';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar';
import FeaturedEventBanner from './components/FeaturedEventBanner';
import EventTabs from './components/EventTabs';
import EventGrid from './components/EventGrid';
import LocationModal from './components/LocationModal'; // 1. IMPORT MODAL
import { mainContainer } from './styles/MasterCSSClass';
import Footer from './components/Footer';

const App = () => {
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState('Kolkata');
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // 2. ADD MODAL OPEN/CLOSE STATE
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [location, activeTab]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await API.get(`/events?city=${location}&filter=${activeTab}`);
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocation('Kolkata'),
        () => alert('Location access denied or unavailable.')
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  // 3. HANDLER FOR SELECTING A CITY FROM THE MODAL
  const handleSelectCity = (selectedCity) => {
    setLocation(selectedCity);
    setIsLocationModalOpen(false);
  };

  return (
    <div className={mainContainer}>
      {/* 4. PASS MODAL OPEN TRIGGER TO NAVBAR */}
      <Navbar 
        location={location} 
        onDetectLocation={detectLocation} 
        onOpenLocationModal={() => setIsLocationModalOpen(true)} 
      />
      
      <SubNavbar />
      <FeaturedEventBanner />
      <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <EventGrid events={events} loading={loading} location={location} activeTab={activeTab} />
      <Footer />
      {/* 5. RENDER THE LOCATION MODAL COMPONENT */}
      <LocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={handleSelectCity}
      />
    </div>
  );
};

export default App;