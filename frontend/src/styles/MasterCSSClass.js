// ==========================================
// SHOWISHERE - MASTER CSS CLASS DEFINITIONS
// ==========================================

// Layout & Core
export const mainContainer = "min-h-screen bg-slate-50 text-slate-900 font-sans antialiased";

// Navbar
export const navbar = "bg-[#111827] text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50";
export const logoContainer = "flex items-center space-x-3 cursor-pointer";
export const logoImage = "h-10 w-auto object-contain bg-white rounded-md p-1 shadow-sm";
export const brandTitle = "text-xl font-bold tracking-tight text-white";
export const navRightContainer = "flex items-center space-x-4";
export const locationButton = "flex items-center space-x-1.5 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl transition shadow-sm border border-slate-700";

// Sub-Navbar
export const subNavbarContainer = "bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-xs overflow-x-auto";
export const subNavLeftLinks = "flex items-center space-x-6 text-sm font-medium text-slate-600";
export const subNavLink = "hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer";
export const subNavRightLinks = "flex items-center space-x-5 text-sm font-medium text-slate-700";
export const subNavRightLink = "hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer";

// Hero Banner
export const heroBannerWrapper = "px-6 py-6 max-w-7xl mx-auto";
export const ticketBannerContainer = "bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative flex flex-col lg:flex-row items-stretch";
export const heroContentArea = "p-8 flex-grow flex flex-col justify-between";
export const heroEventTitle = "text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3";
export const heroEventMetaRow = "flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-6 pb-4 border-b border-slate-100";
export const heroMetaItem = "flex items-center space-x-2 font-medium";
export const heroTierGrid = "grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6";
export const heroTierCardActive = "border border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 rounded-xl p-3 text-left transition cursor-pointer relative";
export const heroTierCardInactive = "border border-slate-200 hover:border-slate-300 rounded-xl p-3 text-left transition cursor-pointer relative";
export const heroTierName = "text-xs font-bold text-slate-700 block mb-1";
export const heroTierPrice = "text-sm font-extrabold text-slate-900";
export const heroActionRow = "flex flex-wrap items-center gap-4";
export const seatSelectorBox = "flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-800";
export const primaryButton = "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition duration-200 shadow-sm text-sm";
export const detailsButton = "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl transition text-sm";
export const heroArtSection = "lg:w-96 bg-gradient-to-br from-indigo-950 to-blue-900 p-6 relative flex items-center justify-center overflow-hidden";

// Location Modal Styles
export const modalOverlay = "fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4";
export const modalContainer = "bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]";
export const modalHeaderRow = "px-6 py-1 border-b border-slate-100 flex items-center justify-between";
export const modalHeaderTitle = "text-lg font-bold text-slate-800 text-center flex-grow";
export const modalCloseButton = "text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer";
export const searchBarWrapper = "px-8 py-1 border-b border-slate-100";
export const searchBarInner = "relative flex items-center border border-slate-300 rounded-xl px-4 py-1 bg-white shadow-xs focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-transparent";
export const searchIcon = "text-rose-500 mr-3 text-lg";
export const searchInputClean = "w-full focus:outline-none text-slate-800 text-sm bg-transparent placeholder-slate-400";
export const detectIconBtn = "text-rose-500 hover:text-rose-600 pl-3 border-l border-slate-200 ml-2 cursor-pointer flex items-center";
export const modalBodyCompact = "px-8 py-1 overflow-y-auto space-y-1";
export const popularTitle = "text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-4";
export const popularGridCompact = "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3 text-center";
export const cityCardCompact = "flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer border border-slate-100 hover:border-slate-200 bg-white shadow-xs";
export const cityIconCircle = "w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl mb-1 border border-slate-100";
export const cityNameCompact = "text-xs font-semibold text-slate-700 truncate w-full";
export const otherCitiesContainer = "mt-6 pt-6 border-t border-slate-100";
export const otherCitiesGridMulti = "grid grid-cols-2 sm:grid-cols-5 gap-y-2 gap-x-4 text-xs text-slate-600 max-h-48 overflow-y-auto pr-2";
export const otherCityItemRow = "hover:text-rose-600 cursor-pointer transition py-1 truncate";
export const toggleAllCitiesBtn = "w-full text-center py-3 text-rose-600 font-semibold text-sm hover:bg-rose-50 transition border-t border-slate-100 cursor-pointer";

// Event Tabs
export const tabsContainer = "flex space-x-6 px-6 pt-6 border-b border-slate-200 bg-white shadow-xs overflow-x-auto";
export const tabButtonActive = "pb-3 font-semibold text-sm transition-colors border-b-2 border-blue-600 text-blue-600 whitespace-nowrap";
export const tabButtonInactive = "pb-3 font-medium text-sm transition-colors border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap";

// Event Cards & Grid
export const eventGrid = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-8 max-w-7xl mx-auto";
export const eventCard = "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer relative flex flex-col group";
export const eventThumbnail = "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300";
export const eventTitle = "font-bold text-lg text-slate-800 truncate px-4 pt-3";
export const eventSubText = "text-sm text-slate-500 px-4 pb-4 flex-grow";
export const cardFooter = "px-4 pb-4 flex justify-between items-center border-t border-slate-50 pt-3 mt-auto";
export const salesBadge = "text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md";
export const redSticker = "absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md z-10";
export const trendingBadge = "absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md z-10";
export const emptyState = "col-span-full text-center py-16 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-300 shadow-xs";