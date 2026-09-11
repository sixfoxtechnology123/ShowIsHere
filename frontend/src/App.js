import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation,useNavigate } from 'react-router-dom';
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
import EventCreate from './EventOrganizer/EventOrgAccount';
import TermsOfUse from './components/TermsOfUse'; 
import RefundAndCancellation from './components/RefundAndCancellation';
import PrivacyPolicy from './components/PrivacyPolicy';
import Dashboard from './EventOrganizer/EventOrgDashboard';
import MyEvents from './EventOrganizer/MyEvents';
import Paycheque from './EventOrganizer/Paycheque';
import Report from './EventOrganizer/Report';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // INITIALIZED TO TRUE SO IT OPENS AUTOMATICALLY ON FIRST PAGE LOAD
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(true);

  // POPUP NOTIFICATION STATE FOR LOCATION UPDATE
  const [locationPopup, setLocationPopup] = useState(null);

  const routerLocation = useLocation();
  const isSeatMapPage = routerLocation.pathname === '/seatmap';
  const isEventCreatePage = routerLocation.pathname === '/event-create'; 
  const isDashboardPage = routerLocation.pathname === '/dashboard';
  const isHomePage = routerLocation.pathname === '/';
  const isMyEventsPage = routerLocation.pathname === '/my-events';
  const isPaychequePage = routerLocation.pathname === '/paycheque';
  const isReportPage = routerLocation.pathname === '/report';

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
        () => handleSelectCity('Kolkata'),
        () => alert('Location access denied or unavailable.')
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleSelectCity = (selectedCity) => {
    setLocation(selectedCity);
    setIsLocationModalOpen(false);

    // Trigger floating popup message
    setLocationPopup(selectedCity);
    setTimeout(() => {
      setLocationPopup(null);
    }, 3000); 
    navigate('/');
  };

  return (
    <div className={mainContainer}>
      {/* FLOATING EXPLORING CITY POPUP BANNER */}
      {locationPopup && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-short">
          <div className="bg-neutral-700 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 text-sm font-medium border border-neutral-700">
            {/* Location Pin Icon */}
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>You’re exploring {locationPopup} now.</span>
          </div>
        </div>
      )}

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

      {/* Hide main headers on SeatMap, EventCreate, and Dashboard pages */}
      {!isSeatMapPage && !isEventCreatePage && !isDashboardPage && !isMyEventsPage && !isPaychequePage && !isReportPage && (
        <>
          <Navbar 
            location={location} 
            onDetectLocation={detectLocation} 
            onOpenLocationModal={() => setIsLocationModalOpen(true)} 
          />
          <SubNavbar />
        </>
      )}

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
        <Route path="/event-create" element={<EventCreate />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/refund-policy" element={<RefundAndCancellation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/paycheque" element={<Paycheque />} />
        <Route path="/report" element={<Report />} />
      </Routes>

      {/* Global Footer shown only on the home page */}
      {isHomePage && <Footer />}

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