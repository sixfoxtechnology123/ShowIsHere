export const mainContainer = "min-h-screen bg-slate-50 flex flex-col relative"; // Added pb-24 so content doesn't hide behind the fixed footer

export const navbar = "bg-white text-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-200/80 sticky top-0 z-50 shadow-xs";
export const logoContainer = "flex items-center space-x-3 cursor-pointer";
export const logoImage = "h-9 w-auto object-contain rounded-md";
export const brandTitle = "text-xl font-bold tracking-tight text-slate-900";
export const navRightContainer = "flex items-center space-x-4";
export const locationButton = "flex items-center space-x-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition border border-slate-200";

export const navSearchWrapper = "flex-1 max-w-xl mx-8 hidden md:flex items-center bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500 transition shadow-inner";
export const navSearchInput = "w-full text-xs font-medium bg-transparent focus:outline-none text-slate-800 placeholder-slate-400";
export const signInButton = "bg-[#ed384e] hover:bg-[#d62d42] text-white text-xs font-semibold px-4 py-1.5 rounded-md transition shadow-xs cursor-pointer";
export const menuIconButton = "text-slate-700 hover:text-slate-900 focus:outline-none ml-1 cursor-pointer";

export const subNavbarContainer = "bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-xs overflow-x-auto";
export const subNavLeftLinks = "flex items-center space-x-6 text-sm font-medium text-slate-600";
export const subNavLink = "hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer";
export const subNavRightLinks = "flex items-center space-x-5 text-sm font-medium text-slate-700";
export const subNavRightLink = "hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer";

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
export const primaryButton = "w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-3 rounded-lg text-sm transition cursor-pointer shadow";
export const detailsButton = "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl transition text-sm";
export const heroArtSection = "lg:w-96 bg-gradient-to-br from-indigo-950 to-blue-900 p-6 relative flex items-center justify-center overflow-hidden";

export const modalOverlay = "fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-4 z-50 p-4";
export const modalContainer = "bg-white rounded-lg w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]";
export const modalBox = "bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative";
export const modalHeaderRow = "px-6 py-1 border-b border-slate-100 flex items-center justify-between";
export const modalHeaderTitle = "text-lg font-bold text-slate-800 text-center flex-grow";
export const modalCloseButton = "text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer";
export const searchBarWrapper = "px-8 pt-8 pb-2 ";
export const searchBarInner = "relative flex items-center border border-slate-300 rounded-xl px-4 py-1 bg-white shadow-xs focus-within:ring-1 focus-within:ring-[#415FCF] focus-within:border-transparent";
export const searchIcon = "text-rose-500 mr-3 text-lg";
export const searchInputClean = "w-full focus:outline-none text-slate-800 text-sm bg-transparent placeholder-slate-400";
export const detectIconBtn = "text-rose-500 hover:text-rose-600 pl-3 border-l border-slate-200 ml-2 cursor-pointer flex items-center";
export const modalBodyCompact = "px-8 py-1 overflow-y-auto space-y-1";
export const popularTitle = "text-center text-xs font-bold text-slate-400 tracking-wider mb-4";
export const popularGridCompact = "grid grid-cols-4 sm:grid-cols-8 gap-3 text-center justify-items-between w-full";
export const cityCardCompact = "flex flex-col items-center p-1 rounded-2xl hover:bg-[#F8FAFC] transition cursor-pointer hover:border-slate-100 bg-white shadow-xs";
export const cityIconCircle = "w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl mb-1 border border-slate-100";
export const cityNameCompact = "text-sm text-slate-800 truncate w-full";
export const otherCitiesContainer = "mt-6 pt-2 border-t border-slate-100";
export const otherCitiesGridMulti = "grid grid-cols-2 sm:grid-cols-5 gap-x-4 text-xs text-slate-600 max-h-48 overflow-y-auto pr-2";
export const otherCityItemRow = "hover:text-[#415FCF] text-slate-700 cursor-pointer transition py-1 truncate";
export const toggleAllCitiesBtn = "w-full text-center py-3 text-[#415FCF] font-semibold text-sm transition border-t border-slate-100 cursor-pointer";

export const tabsContainer = "flex space-x-6 px-6 pt-6 border-b border-slate-200 bg-white shadow-xs overflow-x-auto";
export const tabButtonActive = "pb-3 font-semibold text-sm transition-colors border-b-2 border-blue-600 text-blue-600 whitespace-nowrap";
export const tabButtonInactive = "pb-3 font-medium text-sm transition-colors border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap";

export const eventGrid = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-8 max-w-7xl mx-auto";
export const eventCard = "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer relative flex flex-col group";
export const eventThumbnail = "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300";
export const eventTitle = "font-bold text-lg text-slate-800 truncate px-4 pt-3";
export const eventSubText = "text-sm text-slate-500 px-4 pb-4 flex-grow";
export const cardFooter = "px-4 pb-4 flex justify-between items-center border-t border-slate-50 pt-3 mt-auto";
export const salesBadge = "text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md";
export const redSticker = "absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md z-10";
export const trendingBadge = "absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md z-10";
export const emptyState = "col-span-full text-center py-16 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-300 shadow-xs";

export const footerWrapper = "bg-[#f8f9fc] border-t border-slate-200 mt-1 text-slate-700 text-sm";
export const footerTopBar = "bg-[#1f242d] text-white py-2 px-6 flex flex-col sm:flex-row items-center justify-around text-xs font-medium tracking-wide";
export const footerTopItem = "flex items-center space-x-2 cursor-pointer hover:text-slate-300 transition py-0.5";
export const footerMainContent = "max-w-7xl mx-auto px-6 py-1 relative overflow-hidden";
export const footerWatermark = "absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.08] select-none";
export const footerWatermarkText = "text-[10rem] sm:text-[12rem] font-black tracking-widest text-slate-400 whitespace-nowrap";
export const footerGrid = "grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-start";
export const footerNewsletterCol = "md:col-span-5 space-y-2";
export const footerHeading = "text-xs font-bold text-slate-400 tracking-widest mb-2";
export const footerLinkList = "space-y-1 text-xs text-slate-600";
export const footerLinkItem = "hover:text-blue-600 font-semibold cursor-pointer transition py-0.5";
export const footerBottomBar = "mt-3 pt-2 pb-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 relative z-10";
export const footerSocialIcons = "flex items-center space-x-3 my-2 md:my-0";
export const socialCircleBtn = "w-7 h-7 rounded-full border border-slate-600 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition text-slate-800 cursor-pointer text-xs font-bold shadow-2xs";
export const scrollToTopBtn = "absolute right-6 top-3 w-9 h-9 rounded-full bg-[#1f242d] text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition cursor-pointer z-20";

export const aboutContainer = "max-w-full mx-auto px-6 py-8 text-slate-800";
export const aboutSectionGrid = "grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-1";
export const aboutHeadingTitle = "text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6";
export const aboutSubHeadingTitle = "text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4";
export const aboutParagraph = "text-slate-600 text-sm sm:text-base leading-relaxed mb-4";
export const aboutStatsBar = "bg-[#1f242d] text-white py-5 px-6 my-1 grid grid-cols-1 md:grid-cols-3 text-center rounded-2xl shadow-lg relative";
export const aboutStatNumber = "text-4xl sm:text-5xl font-black mb-1";
export const aboutStatLabel = "text-xs font-bold text-slate-400 tracking-widest";

// ==========================================
// SEAT MAP CREATOR STYLES
// ==========================================
export const seatMapWrapper = "min-h-screen bg-[#f4f5f7] text-slate-900 font-sans flex flex-col justify-between select-none overflow-x-hidden";
export const seatMapHeader = "bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between sticky top-0 z-40 shadow-xs flex-wrap xl:flex-nowrap overflow-x-auto gap-2";
export const seatMapBody = "flex flex-1 overflow-hidden relative";
export const seatMapSidebar = "w-48 bg-white border-r border-slate-200 p-4 overflow-y-auto flex flex-col space-y-6 shrink-0 text-xs";
export const seatMapCanvasArea = "flex-1 bg-slate-50 relative overflow-auto flex flex-col items-center justify-center  w-full h-full min-h-[800px]";
export const zoomToolbar = "absolute top-4 right-6 bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center space-x-3 shadow-xs z-20 text-xs";
export const canvasBoard = "w-[2000px] h-[2000px] bg-white rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden transition-transform duration-150 absolute top-0 left-0 right-0 bottom-0";
export const canvasGridBg = "absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60 w-full h-full absolute";
export const stageBox = "absolute top-1 left-1/2 transform -translate-x-1/2 bg-white text-slate-800 rounded-2xl flex items-center justify-center font-extrabold text-xs tracking-widest shadow-sm border border-slate-300";
export const sectionCard = "absolute bg-white/95 backdrop-blur-xs border-2 rounded-2xl p-4 shadow-lg transition-shadow cursor-move";
export const propertiesSidebar = "w-64 bg-white border-l border-slate-200 p-6 overflow-y-auto shrink-0 space-y-5 text-xs z-30 max-h-[120vh]";
export const seatMapFooter = "bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-medium text-slate-600 z-40";
export const sidebarToggleBtn = "bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer border border-slate-200 flex items-center space-x-1.5";
 
// Page tabs & buttons
export const pageTabsBar = "bg-slate-100 border-b border-slate-200 px-4 py-1.5 flex items-center space-x-2 text-xs print:hidden";
export const pageTabActive = "px-3 py-1 rounded font-bold transition cursor-pointer border bg-blue-600 text-white border-blue-600 shadow-xs flex items-center space-x-2";
export const pageTabInactive = "px-3 py-1 rounded font-bold transition cursor-pointer border bg-white text-slate-700 border-slate-300 hover:bg-slate-50 flex items-center space-x-2";
export const addPageButton = "px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition cursor-pointer";

export const inputFieldStyle = "w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1 text-sm text-slate-900 outline-none focus:border-blue-500 font-normal";

// ==========================================
// SIDEBAR ELEMENT & TEMPLATE STYLES
// ==========================================
export const sidebarSectionTitle = "font-bold text-slate-400 tracking-wider mb-1";
export const sidebarListContainer = "text-slate-700 font-medium space-y-1";
export const sidebarItemCard = "p-1 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center space-x-2 transition";
export const sidebarTemplateCard = "p-1 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer transition";
export const sidebarInstructionBox = "bg-slate-50 p-1 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1";
export const sidebarInstructionTitle = "font-bold text-slate-700 block";
export const sidebarDivider = "border-slate-100 my-1";

// ==========================================
// COMPACT ARTIST MASTER STYLES
// ==========================================
export const artistPageWrapper = "flex flex-col h-full w-full overflow-hidden bg-[#f4f5f7]";
export const artistWorkspace = "flex-1 w-full p-3 flex flex-col overflow-y-auto space-y-2";
export const artistFormBox = "bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-2 w-full";
export const artistFormHeader = "flex justify-between items-center border-b border-slate-100 pb-1.5";
export const artistFormHeading = "text-xs font-extrabold tracking-wide text-slate-800";
export const artistFormGrid = "grid grid-cols-1 md:grid-cols-2 gap-2";
export const artistLabelStyle = "block text-[10px] font-bold text-slate-700 mb-0.5";
export const artistInputStyle = "w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium";
export const artistTextareaStyle = "w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none";
export const artistListCard = "bg-white rounded-2xl shadow-sm border border-slate-100 p-3 space-y-2 flex-1 flex flex-col w-full";
export const artistListHeaderRow = "grid grid-cols-1 sm:grid-cols-3 items-center gap-2 border-b border-slate-100 pb-2";
export const artistSearchInputCenter = "w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 text-xs font-medium text-center focus:outline-none";
export const artistTableHeadStyle = "border-b border-slate-200 text-slate-400 text-[10px]";
export const artistTableRowStyle = "hover:bg-slate-50 transition border-b border-slate-100 text-xs text-slate-700";
export const artistAvatarCircle = "w-7 h-7 object-cover rounded-full border border-slate-200";
export const artistAvatarFallback = "w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-[9px]";
export const artistActionBtnEditClass = "text-blue-600 hover:text-blue-800 font-bold cursor-pointer text-[11px]";
export const artistActionBtnDeleteClass = "text-rose-600 hover:text-rose-800 font-bold cursor-pointer text-[11px]";
export const artistThSlNo = "py-0.5 px-2 w-12 text-center";
export const artistTdSlNo = "py-0.5 px-2 text-center font-medium text-slate-500";
export const artistThPhoto = "py-0.5 px-2 w-16";
export const artistThName = "py-0.5 px-2";
export const artistThType = "py-0.5 px-2 w-28";
export const artistThDesc = "py-0.5 px-2";
export const artistThAction = "py-0.5 px-2 text-right w-24";

export const artistImageUploadWrapper = "flex flex-col items-center justify-center my-1";
export const artistCirclePickerContainer = "relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-400 hover:border-blue-600 bg-slate-50 flex items-center justify-center cursor-pointer transition shadow-xs group";
export const artistCirclePreviewImage = "w-full h-full object-cover rounded-full";
export const artistCirclePlaceholderText = "text-[10px] font-bold text-slate-400 group-hover:text-blue-600 text-center";
export const artistDescImageGrid = "grid grid-cols-1 md:grid-cols-12 gap-3 items-center";

// ==========================================
// LANDING, AUTH & WIZARD STYLES (NEW)
// ==========================================
export const landingPageWrapper = "min-h-screen bg-[#071126] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden";
export const landingGradientBg = "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-[#071126] to-[#071126] pointer-events-none";
export const landingContentWrapper = "max-w-3xl mx-auto text-center z-10 space-y-6";
export const landingLogoWrapper = "flex justify-center mb-2";
export const landingLogoImage = "w-16 h-16 object-cover rounded-2xl border-2 border-blue-500 shadow-xl";
export const landingBadge = "inline-block px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wider shadow-inner";
export const landingHeading = "text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight";
export const landingHeadingHighlight = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300";
export const landingSubText = "text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium";
export const landingActionRow = "pt-4 flex justify-center items-center space-x-4";
export const landingGetStartedBtn = "px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm";

export const authPageWrapper = "min-h-screen bg-white flex flex-col lg:flex-row";
export const authLeftContainer = "lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-slate-50 border-r border-slate-200";
export const authLeftHeader = "flex items-center space-x-3 mb-6";
export const authLeftLogo = "w-10 h-10 object-cover rounded-xl border border-slate-200";
export const authBrandTitle = "text-xl font-black tracking-tight text-slate-900";
export const authLeftHeading = "text-3xl lg:text-4xl font-black mb-6 text-slate-900 leading-tight";
export const authBenefitsList = "space-y-6";
export const authBenefitItem = "flex items-start space-x-4";
export const authBenefitIcon = "p-3 bg-blue-50 rounded-xl text-blue-600 font-bold text-lg";
export const authBenefitTitle = "text-base font-bold text-slate-900";
export const authBenefitDesc = "text-slate-600 text-xs";
export const authRightContainer = "lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center";
export const authCardWrapper = "w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm";
export const authCardTitle = "text-xl font-black text-slate-900 mb-2";
export const authCardDesc = "text-xs text-slate-500 mb-6";
export const authFormSpace = "space-y-4";
export const authInputLabel = "block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2";
export const authOtpContainer = "space-y-3 pt-2";

export const wizardPageWrapper = "min-h-screen bg-[#f8f9fc] flex flex-col lg:flex-row";
export const wizardSidebar = "w-full lg:w-72 bg-white border-r border-slate-200 p-8 flex flex-col justify-between shrink-0 shadow-xs";
export const wizardSidebarHeader = "flex items-center space-x-3 mb-10";
export const wizardSidebarLogo = "w-9 h-9 object-cover rounded-xl border border-slate-200";
export const wizardSidebarBrand = "font-extrabold text-slate-900 tracking-tight text-sm";
export const wizardStepsContainer = "space-y-2 relative";
export const wizardLoggedInfo = "pt-6 border-t border-slate-100 text-[11px] text-slate-400";
export const wizardLoggedEmail = "text-slate-700 font-semibold";
export const wizardContentArea = "flex-1 p-8 lg:p-16 flex flex-col justify-between max-w-4xl";
export const wizardCardWrapper = "bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200/80";
export const wizardStepContentSpace = "space-y-6";
export const wizardStepTitle = "text-2xl font-black text-slate-900 tracking-tight mb-1";
export const wizardStepDesc = "text-xs text-slate-500 font-medium";
export const wizardTwoColGrid = "grid grid-cols-1 sm:grid-cols-2 gap-6";
export const wizardInputLabel = "block text-xs font-bold text-slate-700 mb-1";
export const wizardIfscFlex = "flex space-x-2";
export const wizardIfscFetchBtn = "px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap";
export const wizardErrorText = "text-[11px] text-rose-600 mt-1 font-semibold";
export const wizardBankPreviewGrid = "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2";
export const wizardPreviewLabel = "block text-[11px] font-bold text-slate-500 mb-1";
export const wizardAgreementWrapper = "space-y-6 text-center py-8";
export const wizardAgreementDesc = "text-xs text-slate-500 font-medium max-w-md mx-auto";
export const wizardFooterBar = "flex justify-between items-center mt-8 pt-4 border-t border-slate-200";
export const wizardProceedBtn = "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm";
// ==========================================
// ACCOUNT SETUP / EVENT CREATE STYLES (EXACT CLONE)
// ==========================================
export const accountHeaderInner = "w-full px-6 py-3 flex items-center justify-between";
export const accountFooterInner = "max-w-5xl mx-auto px-6 py-3 flex items-center justify-center space-x-4 w-full";
export const accountLogoContainer = "flex items-center space-x-2";
export const accountLogoImg = "w-8 h-8 object-cover rounded-lg";
export const accountBrandText = "font-extrabold text-blue-900 text-base tracking-tight";
export const accountStepsBar = "hidden md:flex items-center space-x-20";

export const accountStepItemActive = "flex items-center space-x-2 px-5 py-1 rounded-xl bg-[#f0f4ff] border border-blue-100/60 shadow-xs relative text-blue-700 font-bold text-xs cursor-pointer overflow-hidden before:absolute before:left-0 before:inset-y-0 before:w-1.5 before:bg-blue-600 before:rounded-r-[1px]";
export const accountStepItemInactive = "flex items-center space-x-3 px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 cursor-pointer hover:text-slate-600 transition";

export const accountStepBadgeActive = "w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shadow-xs";
export const accountStepBadgeInactive = "w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px] font-bold";

export const accountUserIconBox = "w-9 h-9 rounded-full border border-blue-900/20 flex items-center justify-center text-blue-900 cursor-pointer shadow-2xs bg-white";

export const accountMainContainer = "mx-auto px-64 pb-14  flex-1 w-full bg-[#F2F5FA]";
export const footeraccountMainContainer = "mx-auto px-64   flex-1 w-full bg-[#F2F5FA]";
export const accountTitleSection = "text-center max-w-2xl mx-auto mb-6 ";
export const accountMainTitle = "text-2xl sm:text-3xl font-bold text-slate-700 tracking-tight";
export const accountMainSubTitle = "text-xs sm:text-sm text-slate-500 font-medium leading-relaxed";
export const accountFormCard = "bg-white  p-6 sm:px-6 shadow-sm w-full overflow-hidden";
export const accountFormCardtext = "bg-white  shadow-sm w-full overflow-hidden";
export const accountSectionHeading = "flex items-center space-x-3 py-1.5 px-4 sm:px-6 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-[#f0f4ff] text-xs font-black text-blue-900 tracking-wide relative overflow-hidden before:absolute before:left-0 before:inset-y-0 before:w-1.5 before:bg-blue-600 before:rounded-r-[4px]";
export const accountThreeColGrid = "grid grid-cols-1 sm:grid-cols-3 gap-4";
export const accountLabelStyle = "block text-xs font-bold text-slate-700 mb-2.5";
export const accountRadioGroup = "flex items-center space-x-6 pt-1";
export const accountRadioLabel = "flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer";
export const accountCheckboxWrapper = "flex items-center space-x-2.5 cursor-pointer";
export const accountNoticeBox = "bg-amber-50/80 border border-amber-200/80 text-amber-900 text-[11px] font-semibold px-4 py-2.5 rounded-xl";


export const accountSecondaryBtn = "px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs";
export const accountPrimaryBtn = "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow-sm flex items-center space-x-1.5";

// Step 2 Document Upload Styles
export const accountUploadStepWrapper = "space-y-2";
export const accountUploadGrid = "grid grid-cols-1 md:grid-cols-2 gap-6 pt-2";
export const accountUploadContainer = "border-2 border-dashed border-blue-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center";
export const accountUploadIconBox = "w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 text-xl";
export const accountUploadBtn = "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-sm";
export const accountUploadOrText = "text-[11px] text-slate-400 mb-4";
export const accountUploadSubtext = "text-[10px] text-slate-400 mt-3";

export const accountPreviewBox = "border border-slate-200 rounded-2xl p-5 bg-slate-50/30 flex flex-col justify-between";
export const accountPreviewList = "space-y-2 text-[11px] text-slate-600";
export const accountPreviewListItem = "flex items-center space-x-2";
export const accountPreviewBullet = "w-1.5 h-1.5 rounded-full bg-blue-600";
export const accountPreviewFooter = "mt-1 pt-1 border-t border-slate-200/60 flex flex-col items-center";

export const accountSampleCardWrapper = "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 inline-block shadow-2xs";
export const accountSampleCardTitle = "text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1";
export const accountSampleCardBox = "w-36 h-22 bg-white rounded border border-slate-300 mx-auto flex items-center justify-center text-[10px] text-slate-400 font-medium";

// Square GST Modal Styles
export const gstModalOverlay = "fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4";
export const gstModalCard = "bg-white rounded-2xl shadow-2xl w-[480px] h-[480px] overflow-hidden flex flex-col justify-between px-6 py-4";
export const gstModalHeader = "flex items-center justify-between shrink-0";
export const gstModalTitle = "text-base font-bold text-slate-800 flex items-center gap-2";
export const gstModalLogo = "w-6 h-6 rounded-md object-cover";

export const gstModalBody = "overflow-y-auto space-y-2 text-xs text-slate-600 font-medium leading-relaxed pr-2 border border-slate-200 bg-slate-50/40 p-2 rounded-xl flex-1 my-3";

// Centered Proceed Button style for the GST Modal
export const gstModalFooter = "space-y-3 shrink-0 pt-2 border-t border-slate-100 flex flex-col items-center";
export const gstModalProceedBtn = "px-6 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed";


export const gstDeclarationList = "list-decimal pl-5 space-y-2 text-justify";
// Add or update this inside your MasterCSSClass.js
export const gstDeclarationContainer = "space-y-4 text-xs text-slate-700 font-medium leading-relaxed text-justify font-sans";

// Signature Modal & Canvas Styles
export const sigModalOverlay = "fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4";
export const sigModalCard = "bg-white rounded-2xl shadow-2xl w-[640px] overflow-hidden flex flex-col p-6 space-y-4";
export const sigModalHeader = "flex flex-col space-y-1 pb-3 border-b border-slate-100";
export const sigModalTitle = "text-base font-bold text-slate-800 ";
export const sigModalSubTitle = "text-xs text-slate-500";
export const sigCanvasBox = "w-full h-48 border border-slate-300 rounded-xl bg-white touch-none shadow-inner";
export const sigNoticeBox = "flex items-center gap-2 p-1.5 bg-blue-50/60 border border-blue-100 rounded-xl text-[11px] text-slate-600";
export const sigModalFooter = "flex items-center justify-between pt-3 border-t border-slate-100";
export const sigCancelBtn = "px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer border border-slate-200";
export const sigClearBtn = "px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer border border-slate-200";
export const sigSaveBtn = "px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm cursor-pointer";

// Signature Preview Box on Step 3
export const sigActionBox = "flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-2";
export const sigCreateBtn = "px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer";
export const sigPreviewWrapper = "flex flex-col items-center space-y-1";
export const sigImgPreview = "h-16 object-contain border border-slate-300 bg-white rounded-lg px-3 py-1 shadow-xs";
export const sigDeleteBtn = "text-[11px] font-bold text-red-600 hover:underline cursor-pointer";

// Signature Box & Preview Layout
export const sigPreviewBoxContainer = "flex flex-col space-y-2 w-[240px]";
export const sigImageCard = "w-full h-24 border border-slate-300 rounded-xl bg-white flex items-center justify-center p-2 shadow-inner overflow-hidden";
export const sigImgPreviewTag = "max-h-full max-w-full object-contain";
export const sigPreviewFooterRow = "flex items-center justify-between w-full px-1";
export const sigLabelText = "text-xs font-semibold text-slate-800";
export const sigDeleteButtonStyled = "px-3 py-1 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition shadow-sm cursor-pointer";

// Add these to your existing MasterCSSClass.js exports:
export const agreementContainer = "space-y-4  px-32 pt-24 pb-64 text-xs sm:text-sm font-sans text-slate-800 leading-relaxed font-normal";
export const agreementContainer1 = "space-y-4 text-xs pb-4 text-xs sm:text-sm font-sans text-slate-800 leading-relaxed font-normal text-justify";
export const agreementHeader = "text-center font-medium text-sm tracking-wide text-slate-900 pb-6";
export const agreementSectionTitle = "font-medium text-slate-800 pt-2";
export const annexureTableClass = "w-full text-[13px] border-collapse border border-slate-400 text-[12px]";
export const annexureTableHeader = "text-slate-900 font-medium";
export const annexureTableCell = "border border-slate-400 p-1";
export const signatureBlockWrapper = "pt-6 space-y-5  text-justify";
export const signatureBoxContainer = "w-full h-20 border border-slate-400 rounded-lg bg-white flex items-center justify-center p-2  overflow-hidden";
export const signatureEmptyBox = "flex flex-col items-center justify-center rounded-xl p-4 space-y-2 w-[240px]";

// Image Preview Modal Styles
export const imgModalOverlay = "fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4";
export const imgModalCard = "bg-white rounded-2xl p-4 max-w-2xl w-full relative shadow-2xl border border-slate-100";
export const imgModalHeader = "flex items-center justify-between pb-3 mb-3 border-b border-slate-100";
export const imgModalTitle = "text-xs font-bold text-slate-800";
export const imgModalCloseBtn = "w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition cursor-pointer";
export const imgModalBody = "text-center";
export const imgModalImage = "max-h-[70vh] w-auto mx-auto rounded-xl object-contain shadow-sm";



/// ==========================================
// DASHBOARD STYLES (CORRECTED LAYOUT LOCK)
// ==========================================
export const dashLayoutWrapper = "h-screen bg-white font-sans text-slate-800 flex flex-col w-full overflow-hidden relative";

// Full width top navbar spanning the entire top edge (Fixed Height: h-14)
export const dashTopNavbar = "h-14 bg-white px-6 lg:px-8 border-b border-slate-200 flex items-center justify-between sticky top-0 z-50 shadow-xs w-full shrink-0";
export const dashTopNavTitleBox = "flex flex-col";
export const dashTopMainHeading = "text-xl font-extrabold text-slate-900 tracking-tight";
export const dashTopSubDateText = "text-xs font-medium text-slate-400";
export const dashTopNavRight = "flex items-center space-x-4 lg:space-x-6";
export const dashNotificationIconBox = "relative text-slate-400 hover:text-slate-600 cursor-pointer p-2 rounded-full hover:bg-slate-50 transition flex items-center";
export const dashNotificationBadge = "absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full";
export const dashUserProfileBox = "flex items-center space-x-3 pl-4 border-l border-slate-200 cursor-pointer";
export const dashUserAvatarImg = "w-10 h-10 rounded-full object-cover border border-slate-200";
export const dashUserNameText = "text-sm font-bold text-slate-800 hidden sm:inline";

// Brand Logo & Title Styles for Top Navbar
export const dashBrandLogo = "w-9 h-9 object-cover rounded-xl shrink-0";
export const dashBrandTitle = "text-xl font-bold tracking-tight text-blue-900";

// Footer Area (Fixed Height: h-14, matching header, right-aligned content)
export const dashFooterArea = "shrink-0 z-30 bg-white border-t border-slate-200 h-14 px-8 flex items-center justify-end text-xs text-slate-400 font-medium";

// Container for everything between the fixed header and footer
export const dashBodyFlexContainer = "flex flex-1 min-h-0 relative overflow-hidden";

export const dashMainContentArea = "flex-1 flex flex-col min-w-0 h-full overflow-y-auto";
export const dashScrollableBody = "p-4 lg:p-4 space-y-4";
export const dashTopGridRow = "grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch";

export const dashAddEventCard = "lg:col-span-4 rounded-xl p-6  shadow-xs flex flex-col justify-between";
export const dashAddEventHeader = "space-y-1";
export const dashAddEventTitle = "text-lg font-semibold text-slate-900";
export const dashAddEventSub = "text-xs text-slate-400 font-medium leading-relaxed";
export const dashCreateEventBtn = "inline-flex items-center justify-center space-x-2 px-5 py-2.5  text-blue-600 font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer mt-4";

export const dashActiveEventCardBox = "lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4";
export const dashMiniEventCard = "bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 transition";
export const dashMiniEventHeaderRow = "flex items-center space-x-3 mb-3";
export const dashMiniEventThumb = "w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100";
export const dashMiniEventInfo = "min-w-0";
export const dashMiniEventName = "text-xs font-bold text-slate-900 truncate";
export const dashMiniEventCategory = "text-[10px] text-slate-400 truncate";
export const dashMiniEventProgressBox = "space-y-1.5 mt-2";
export const dashMiniEventProgressMeta = "flex justify-between items-center text-[10px]";
export const dashMiniEventProgressLabel = "font-medium text-slate-400";
export const dashMiniEventProgressVal = "font-extrabold text-slate-700";
export const dashProgressBarBg = "w-full h-2 bg-slate-100 rounded-full overflow-hidden";
export const dashProgressBarFillGreen = "h-full bg-emerald-400 rounded-full";
export const dashProgressBarFillOrange = "h-full bg-amber-400 rounded-full";
export const dashProgressBarFillBlue = "h-full bg-blue-500 rounded-full";

export const dashStatsRowGrid = "grid grid-cols-1 sm:grid-cols-3 gap-6";
export const dashStatCard = "bg-white rounded-2xl p-6 border-2 border-slate-300 shadow-xs flex flex-col justify-between";
export const dashStatCardHeaderRow = "flex items-center justify-between mb-4";
export const dashStatCardTitleBox = "flex items-center space-x-2 text-xs font-bold text-slate-500 tracking-wider";
export const dashStatCardIconCircle = "w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs";
export const dashStatDropdownBtn = "text-slate-400 hover:text-slate-600 text-xs font-medium flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer";
export const dashStatNumberRow = "flex items-baseline justify-between flex-wrap gap-2";
export const dashStatMainVal = "text-2xl font-black text-slate-900 tracking-tight";
export const dashStatTrendBadgeGreen = "flex items-center space-x-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md";
export const dashStatTrendBadgeRed = "flex items-center space-x-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md";

export const dashAnalyticsGridRow = "grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch";
export const dashDonutCard = "lg:col-span-5 bg-white rounded-xl p-6 border-2 border-slate-300 shadow-xs flex flex-col justify-between";
export const dashSectionCardHeader = "flex items-center justify-between mb-4";
export const dashCardSectionTitle = "text-sm font-extrabold text-slate-900";
export const dashDonutVisualContainer = "relative w-48 h-48 mx-auto my-4 flex items-center justify-center";
export const dashDonutCenterTextBox = "absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none";
export const dashDonutCenterMainVal = "text-base font-black text-slate-900";
export const dashDonutCenterSubLabel = "text-[10px] font-bold text-slate-400 uppercase tracking-widest";
export const dashDonutLegendGrid = "grid grid-cols-2 gap-3 pt-3 border-t border-slate-100";
export const dashLegendItemRow = "flex items-center space-x-2 text-xs font-medium text-slate-600";
export const dashLegendDotBlue = "w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0";
export const dashLegendDotGreen = "w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0";
export const dashLegendDotPurple = "w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0";
export const dashLegendDotYellow = "w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0";

export const dashBarChartCard = "lg:col-span-7 bg-white rounded-xl p-6 border-2 border-slate-300 shadow-xs flex flex-col justify-between";
export const dashBarChartBody = "flex items-end justify-between h-56 pt-6 pb-2 px-2 border-b border-slate-100";
export const dashBarGroupWrapper = "flex flex-col items-center space-y-2 flex-1";
export const dashBarColumnsContainer = "flex items-end space-x-1 h-44";
export const dashBarColPrimary = "w-2.5 bg-blue-600 rounded-t-sm";
export const dashBarColSecondary = "w-2.5 bg-amber-400 rounded-t-sm";
export const dashBarColAccent = "w-2.5 bg-purple-600 rounded-t-sm";
export const dashBarAxisLabel = "text-[11px] font-bold text-slate-400";
export const dashBarChartLegendRow = "flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-600";

export const dashBuyersListCard = "bg-white rounded-xl p-6 border-2 border-slate-300 shadow-xs space-y-6";
export const dashBuyersHeaderRow = "flex flex-col sm:flex-row sm:items-center justify-between gap-4";
export const dashBuyersFilterGroup = "flex flex-wrap items-center gap-3";
export const dashSearchInputWrapper = "relative flex items-center";
export const dashSearchInputBox = "w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
export const dashFilterDropdownBtn = "flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 transition cursor-pointer";

export const dashTableContainer = "overflow-x-auto";
export const dashTableStyled = "w-full text-left border-collapse text-xs whitespace-nowrap";
export const dashTableHeadRow = "border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]";
export const dashTableHeadTh = "pb-3 font-bold px-3 first:pl-0 last:pr-0";
export const dashTableBodyRow = "border-b border-slate-100 hover:bg-slate-50/80 transition text-slate-700 font-medium";
export const dashTableBodyTd = "py-4 px-3 first:pl-0 last:pr-0";
export const dashStatusBadgePaid = "inline-flex items-center space-x-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-[11px] font-bold";
export const dashStatusBadgeCancelled = "inline-flex items-center space-x-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg text-[11px] font-bold";
export const dashStatusBadgePending = "inline-flex items-center space-x-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg text-[11px] font-bold";
export const dashTableFooterRow = "flex flex-col sm:flex-row items-center justify-between pt-2 text-xs text-slate-400 font-medium gap-3";
export const dashPaginationBox = "flex items-center space-x-1.5";
export const dashPaginationNumActive = "w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs";
export const dashPaginationNumInactive = "w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs cursor-pointer";

// Right Sidebar (Fixed Width w-80, h-full, scrollable calendar body)
export const dashRightCalendarColumn = "w-72 bg-white border-l border-slate-200 hidden xl:flex flex-col shrink-0 h-full z-20 overflow-hidden";
export const dashWalletCardBox = "p-5 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20";
export const dashWalletTitleText = "text-xs font-semibold text-blue-200 tracking-wider uppercase mb-1";
export const dashWalletBalanceAmount = "text-2xl font-bold tracking-tight";
export const dashCalendarSectionBox = "px-6 py-2 flex-1 space-y-4 pb-8 overflow-y-auto";
export const dashCalendarHeaderRow = "flex items-center justify-between mb-2";
export const dashCalendarHeaderTitle = "text-xs font-bold text-slate-400 uppercase tracking-widest";
export const dashCalendarDateSubText = "text-sm font-semibold text-slate-900";
export const dashScheduleEventItemCard = "p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition space-y-1";
export const dashScheduleEventTime = "text-[10px] font-bold text-blue-600";
export const dashScheduleEventName = "text-xs font-extrabold text-slate-900";
export const dashScheduleEventLocation = "text-[11px] text-slate-500 font-medium truncate";

// Dual-Column Left Sidebar Styles (Fixed Width w-80 matching right sidebar perfectly)
export const dashSidebarContainer = "w-64 bg-white border-r border-slate-200 flex shrink-0 h-full z-20 transition-all overflow-hidden";
export const dashSidebarBlueStrip = "w-14 bg-blue-600 flex flex-col items-center justify-between py-6 shrink-0 z-10 text-white";
export const dashSidebarBlueIconsTop = "flex flex-col items-center space-y-6";
export const dashSidebarBlueIconsBottom = "flex flex-col items-center space-y-4";
export const dashBlueIconButton = "p-2 rounded-xl hover:bg-blue-700 transition cursor-pointer text-white/80 hover:text-white";
export const dashBlueIconButtonActive = "p-2 rounded-xl bg-blue-700 text-white shadow-sm";

export const dashSidebarSubPanel = "hidden lg:flex flex-col justify-between flex-1 bg-white p-2 h-full overflow-y-auto";
export const dashNavList = "space-y-1";
export const dashNavItemActive = "flex items-center space-x-3 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 font-medium text-sm transition";
export const dashNavItemInactive = "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition cursor-pointer";
export const dashSidebarHeaderBox = "p-3 border-b border-slate-100";
export const dashSidebarHeaderTitle = "font-semibold text-slate-900 text-lg";
export const dashSidebarDateRow = "flex items-center space-x-1.5 text-xs text-slate-400 mt-1";
export const dashSidebarTimeSubText = "text-xs text-slate-400 mt-0.5 ml-5";
export const dashSidebarBottom = "border-t border-slate-100 pt-4";
export const dashLogoutBtn = "flex items-center space-x-3 text-slate-500 hover:text-rose-600 font-medium text-sm transition cursor-pointer w-full px-3 py-2";



// Paycheque Page Specific Styles
export const paychequeWrapper = "px-10 lg:px-16 py-6 space-y-6";
export const paychequeMetricGrid = "grid grid-cols-1 lg:grid-cols-3 gap-6";
export const paychequeBalanceCard = "bg-blue-50/40 rounded-xl border border-blue-100 p-6 flex flex-col justify-between shadow-xs";
export const paychequeCardHeader = "flex items-center space-x-1.5 mb-1";
export const paychequeCardLabel = "text-xs font-bold text-slate-500";
export const paychequeHelpIcon = "text-slate-400 cursor-pointer text-xs";
export const paychequeAmountText = "text-3xl font-black text-slate-900 tracking-tight mt-1";
export const paychequeCardFooterBlue = "mt-4 pt-3 border-t border-blue-100/60";
export const paychequeViewTxLink = "text-xs underline font-bold text-blue-600 hover:text-blue-700 cursor-pointer";

export const paychequeStandardCard = "bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs";
export const paychequeCardFooterWhite = "mt-4 pt-3 border-t border-slate-100";
export const paychequeRequestBtn = "px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-none transition";
export const paychequeRecentPayoutHeader = "flex items-center space-x-1.5 mb-3";
export const paychequePayoutRow = "flex items-center justify-between text-slate-600 font-medium";
export const paychequePayoutDate = "text-slate-400";
export const paychequePayoutVal = "font-bold text-slate-900";

export const paychequeTransactionSection = "bg-white rounded-none border border-slate-200 p-6 space-y-6 shadow-xs";
export const paychequeSectionHeaderRow = "flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4";
export const paychequeSectionTitle = "text-sm font-extrabold text-slate-900";
export const paychequeTabsGroup = "flex space-x-6 text-xs font-bold pt-2";
export const paychequeTabActive = "pb-3 relative transition cursor-pointer text-blue-600 border-b-2 border-blue-600 -mb-4";
export const paychequeTabInactive = "pb-3 relative transition cursor-pointer text-slate-400 hover:text-slate-600";
export const paychequeUpdateText = "text-xs text-slate-400 font-medium flex items-center space-x-2";
export const paychequeUpdateBtn = "p-1 hover:text-slate-600 cursor-pointer";

export const paychequeFilterBar = "flex flex-wrap items-center gap-3";
export const paychequeSearchWrapper = "relative flex-1 sm:max-w-xs";
export const paychequeSearchInput = "w-full bg-white border border-slate-200 rounded-none px-8 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500";
export const paychequeSearchIcon = "absolute left-3 top-2.5 text-slate-400";
export const paychequeDropdownBtn = "bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 flex items-center space-x-4 rounded-none cursor-pointer";
export const paychequeDropdownMenu = "absolute left-0 mt-1 w-40 bg-white border border-slate-200 shadow-lg z-20 rounded-none py-1";
export const paychequeDropdownMenuRight = "absolute right-0 mt-1 w-52 bg-white border border-slate-200 shadow-lg z-20 rounded-none py-1 max-h-56 overflow-y-auto";
export const paychequeDropdownItem = "w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium";

export const paychequeTableWrapper = "overflow-x-auto";
export const paychequeTable = "w-full text-left border-collapse text-xs whitespace-nowrap";
export const paychequeTableHead = "border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]";
export const paychequeTh = "pb-3 px-3 first:pl-0";
export const paychequeThRight = "pb-3 px-3 text-right last:pr-0";
export const paychequeTr = "hover:bg-slate-50/80 transition text-slate-700 font-medium";
export const paychequeTdDate = "py-4 px-3 first:pl-0 text-slate-600";
export const paychequeTdCategory = "py-4 px-3 text-slate-900 font-bold";
export const paychequeTdId = "py-4 px-3 text-slate-600";
export const paychequeTdAmount = "py-4 px-3 text-right last:pr-0 font-bold text-slate-900";
export const paychequeSuccessBadge = "inline-flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-none text-[11px] font-bold";
export const paychequeProgressBadge = "inline-flex items-center space-x-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-none text-[11px] font-bold";
export const paychequeEmptyTd = "py-8 text-center text-slate-400 text-xs";

export const paychequeTableFooter = "flex flex-col sm:flex-row items-center justify-between   text-xs text-slate-400 font-medium gap-2";
export const paychequePaginationGroup = "flex items-center space-x-1";
export const paychequePageBtn = "w-7 h-7 rounded-none border border-slate-200 text-slate-400 flex items-center justify-center text-xs";
export const paychequePageBtnActive = "w-7 h-7 rounded-none bg-blue-600 text-white font-bold flex items-center justify-center text-xs";

export const paychequeBottomActionsRow = "flex flex-wrap items-center gap-3 pt-2";
export const paychequeBottomDropdownMenu = "absolute left-0 mt-1 w-52 bg-white border border-slate-200 shadow-lg z-40 rounded-none py-1 max-h-56 overflow-y-auto";




// Report Page Specific Styles
export const reportWrapper = "px-10 lg:px-16 py-6 space-y-6";
export const reportTabsHeader = "flex space-x-8 border-b border-slate-200 pb-2 mb-4";
export const reportTabActive = "text-sm font-extrabold text-blue-600 pb-3 relative border-b-2 border-blue-600 -mb-2.5 cursor-pointer";
export const reportTabInactive = "text-sm font-bold text-slate-400 hover:text-slate-600 pb-3 cursor-pointer";
export const reportFilterRow = "flex flex-wrap items-center justify-between gap-4 bg-slate-100 py-2 px-8 rounded-xs   shadow-xs mb-2";
export const reportFilterGroup = "flex flex-wrap items-center gap-3";
export const reportDropdownButton = "bg-white border-2 border-purple-300 px-4 py-2 text-xs font-bold text-purple-900 flex items-center justify-between space-x-6 rounded-md shadow-xs cursor-pointer";


export const reportMetricsGrid = "grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6";
export const reportMetricCard = "bg-white rounded-md border  border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-xs";
export const reportMetricValue = "text-2xl font-black text-slate-900 tracking-tight mt-1";
export const reportMetricLabel = "text-xs font-bold text-slate-400 uppercase tracking-wider";

export const reportSectionCard = "bg-white border border-slate-200 p-6 shadow-xs space-y-4 mb-6";
export const reportSectionTitle = "text-sm font-extrabold text-slate-900";
export const reportTable = "w-full text-left border-collapse text-xs whitespace-nowrap";
export const reportTableHead = "border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]";
export const reportTh = "pb-3 px-3 first:pl-0";
export const reportThRight = "pb-3 px-3 text-right last:pr-0";
export const reportTr = "border-b border-slate-100 hover:bg-slate-50/80 transition text-slate-700 font-medium";
export const reportTrBold = "border-b border-slate-200 bg-slate-50/50 font-bold text-slate-900";
export const reportTdItem = "py-3 px-3 first:pl-0";
export const reportTdVal = "py-3 px-3 text-right last:pr-0";

export const reportChartsGrid = "grid grid-cols-1 lg:grid-cols-2 gap-6";

export const reportDonutCenterBox = "absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none";
export const reportLegendList = "space-y-2 pt-2 border-t border-slate-100 text-xs";


// Replace/Update these in MasterCSSClass.js
export const reportRefreshBtn = "p-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold cursor-pointer";
export const reportChartCard = "bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between";
export const reportChartContentLayout = "flex flex-col sm:flex-row items-center justify-around my-4 gap-4";
export const reportDonutContainer = "relative w-36 h-36 shrink-0 flex items-center justify-center";
export const reportLegendListHorizontal = "space-y-2 text-xs flex-col justify-center";
export const reportLegendRow = "flex items-center justify-between text-slate-600 font-medium space-x-4";
export const reportLegendInfo = "flex items-center space-x-2";
export const reportLegendDot = "w-2.5 h-2.5 rounded-full shrink-0";