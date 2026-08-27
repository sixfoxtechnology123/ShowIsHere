import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import SeatMap from './components/SeatMap';
import ArtistMaster from './Master/ArtistMaster';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // INITIALIZED TO TRUE SO IT OPENS AUTOMATICALLY ON FIRST PAGE LOAD
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(true);

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

  const handleSelectCity = (selectedCity) => {
    setLocation(selectedCity);
    setIsLocationModalOpen(false);
  };

  return (
    <div className={mainContainer}>
      {/* CUSTOM TOASTER COMPONENT */}
      <Toaster
        reverseOrder={false}
        position="top-center"
        toastOptions={{
          style: {
            fontWeight: 600,
            fontSize: "13px",
            fontFamily: "sans-serif",
            maxWidth: "340px",
            width: "100%",
            borderRadius: "4px",
            padding: "6px 12px",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
          },
          success: {
            icon: (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#14532d" 
                strokeWidth="2.5" 
                className="w-4 h-4 flex-shrink-0"
                style={{ marginRight: "6px" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            style: {
              background: "#f0fdf4",
              color: "#14532d",
              border: "1px solid #15803d",
            },
          },
          error: {
            icon: (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#991b1b" 
                strokeWidth="2.5" 
                className="w-4 h-4 flex-shrink-0"
                style={{ marginRight: "6px" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #b91c1c",
            },
          },
        }}
      />

      <Navbar 
        location={location} 
        onDetectLocation={detectLocation} 
        onOpenLocationModal={() => setIsLocationModalOpen(true)} 
      />
      
      <SubNavbar />

      {/* URL-based Routing View Rendering */}
      <Routes>
        <Route path="/" element={
          <>
            <HomePage />
            <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <EventGrid events={events} loading={loading} location={location} activeTab={activeTab} />
          </>
        } />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/seatmap" element={<SeatMap />} />
        <Route path="/artist-master" element={<ArtistMaster />} />
      </Routes>

      <Footer />

      <LocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={handleSelectCity}
      />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;