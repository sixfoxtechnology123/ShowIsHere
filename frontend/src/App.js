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
import SigninDashboard from './components/SigninDashboard';
import ArtistMaster from './Master/ArtistMaster';
import EventOrgAccount from './EventOrganizer/EventOrgAccount';
import TermsOfUse from './components/TermsOfUse'; 
import RefundAndCancellation from './components/RefundAndCancellation';
import PrivacyPolicy from './components/PrivacyPolicy';
import Dashboard from './EventOrganizer/EventOrgDashboard';
import MyEvents from './EventOrganizer/MyEvents';
import Paycheque from './EventOrganizer/Paycheque';
import Report from './EventOrganizer/Report';
import CreateEvent from './EventOrganizer/CreateEvent';
import EventCategoryMaster from './Master/EventCategoryMaster';
import CategoryMaster from './Master/CategoryMaster';
import QuestionDatabseMaster from './Master/QuestionDatabseMaster';
import EventQuestion from './Master/EventQuestion';
import Profile from './EventOrganizer/Profile';
import KYCDetails from './EventOrganizer/KYCDetails';
import Setting from './EventOrganizer/Setting';
import EventDashboard from './Event/EventDashboard';


import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  
  // <-- CHANGED: Initialize location from localStorage
  const [location, setLocation] = useState(() => {
    return localStorage.getItem('selectedCity') || '';
  });

  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // <-- CHANGED: Open modal automatically ONLY IF location is NOT in localStorage
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(() => {
    return !localStorage.getItem('selectedCity');
  });

  // POPUP NOTIFICATION STATE FOR LOCATION UPDATE
  const [locationPopup, setLocationPopup] = useState(null);

  const routerLocation = useLocation();
  const isSeatMapPage = routerLocation.pathname === '/seatmap';
  const isEventOrgAccountPage = routerLocation.pathname === '/event-org-account'; 
  const isCreateevent = routerLocation.pathname === '/create-event'; 
  const isDashboardPage = routerLocation.pathname === '/dashboard';
  const isHomePage = routerLocation.pathname === '/';
  const isMyEventsPage = routerLocation.pathname === '/my-events';
  const isPaychequePage = routerLocation.pathname === '/paycheque';
  const isReportPage = routerLocation.pathname === '/report';
  const isprofile = routerLocation.pathname === '/profile';
  const iskyc = routerLocation.pathname === '/profile/kyc';
  const isprofilesettings = routerLocation.pathname === '/profile/settings';
  const isEventDashboard = routerLocation.pathname === '/event-dashboard';
  const isSigninDashboard = routerLocation.pathname === '/signinDashboard';


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
    
    // <-- ADDED: Save selected city into localStorage so it stays permanent
    localStorage.setItem('selectedCity', selectedCity);

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
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] animate-bounce-short pointer-events-none">
    <div className="bg-neutral-700 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 text-sm font-medium border border-neutral-600">
      {/* Location Pin Icon */}
      <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
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

      {/* Hide main headers on SeatMap, EventOrgAccount, and Dashboard pages */}
      {!isSeatMapPage && !isEventOrgAccountPage && !isDashboardPage && !isMyEventsPage && !isPaychequePage && !isReportPage && !isCreateevent && !isprofile && !iskyc && !isprofilesettings && !isEventDashboard && !isSigninDashboard && (
        <>
          <Navbar 
            location={location} 
            onDetectLocation={detectLocation} 
            onOpenLocationModal={() => setIsLocationModalOpen(true)} 
            onSignInClick={() => navigate('/signinDashboard')}
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
        <Route path="/event-org-account" element={<EventOrgAccount />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/refund-policy" element={<RefundAndCancellation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/paycheque" element={<Paycheque />} />
        <Route path="/report" element={<Report />} />
        <Route path="/event-category-master" element={<EventCategoryMaster />} />
        <Route path="/category-master" element={<CategoryMaster />} />
        <Route path="/question-databse-master" element={<QuestionDatabseMaster />} />
        <Route path="/question-database-master" element={<QuestionDatabseMaster />} />
        <Route path="/event-question-master" element={<EventQuestion />} />
        <Route path="/signinDashboard" element={<SigninDashboard />} />


        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/kyc" element={<KYCDetails />} />
        <Route path="/profile/settings" element={<Setting />} />.
       
        <Route path="/event-dashboard" element={<EventDashboard />} />
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