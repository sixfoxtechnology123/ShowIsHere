import React, { useState, useEffect } from 'react';
import API from './utils/api';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar';
import HomePage from './components/HomePage';
import EventTabs from './components/EventTabs';
import EventGrid from './components/EventGrid';
import LocationModal from './components/LocationModal';
import { mainContainer } from './styles/MasterCSSClass';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';

const App = () => {
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState('Kolkata');
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'about'
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    if (currentView === 'home') {
      fetchEvents();
    }
  }, [location, activeTab, currentView]);

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

  const handleSelectCity = (selectedCity) => {
    setLocation(selectedCity);
    setIsLocationModalOpen(false);
  };

  return (
    <div className={mainContainer}>
      <Navbar 
        location={location} 
        onDetectLocation={detectLocation} 
        onOpenLocationModal={() => setIsLocationModalOpen(true)} 
        onNavigateHome={() => setCurrentView('home')}
        onNavigateAbout={() => setCurrentView('about')}
      />
      
      {/* PASS VIEW NAVIGATION PROPS HERE */}
      <SubNavbar 
        onNavigateHome={() => setCurrentView('home')} 
        onNavigateAbout={() => setCurrentView('about')} 
      />

      {/* Conditional View Rendering */}
      {currentView === 'home' ? (
        <>
          <HomePage />
          <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <EventGrid events={events} loading={loading} location={location} activeTab={activeTab} />
        </>
      ) : (
        <AboutPage />
      )}

      <Footer />

      <LocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={handleSelectCity}
      />
    </div>
  );
};

export default App;