import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/Logo.jpeg';
import PerformingartImg from '../assets/createevent/Performingart.png';
import ArtsCultureImg from '../assets/createevent/Arts&Culture.png';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white text-slate-800 font-sans ">
      
    {/* ================= 1. BETTER TOGETHER BANNER ================= */}
      <div className="w-full bg-[#5c6e82] text-white py-10 px-8 md:px-24 lg:px-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Content Area */}
          <div className="max-w-xl text-center md:text-left z-10">
            <h2 className="text-4xl lg:text-5xl font-light tracking-wide mb-3">Better Together.</h2>
            <p className="text-sm lg:text-base text-slate-100 opacity-90 mb-6 font-light">Together, We Shape Moments Into Memories.</p>
            <Link 
              to="/loginPage" 
              onClick={scrollToTop} 
              className="inline-block bg-white text-slate-800 font-medium text-xs px-6 py-2.5 rounded-full shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
              style={{ textDecoration: 'none' }}
            >
              Become a Partner
            </Link>
          </div>

          {/* Right Side Illustration */}
          <div className="z-10 flex justify-center">
            <img 
              src={PerformingartImg} 
              alt="Performing Art" 
              className="max-h-48 lg:max-h-56 object-contain filter drop-shadow-md" 
            />
          </div>

        </div>
      </div>

   {/* ================= 2. CREATE EVENT CALLOUT BAR ================= */}
    <div className="w-full bg-[#26282b] text-white py-5 px-8 md:px-24 lg:px-40 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <img 
          src={ArtsCultureImg} 
          alt="Arts & Culture" 
          className="w-10 h-10 object-contain filter brightness-0 invert opacity-90" 
        />
        <p className="text-xs lg:text-sm text-slate-300 font-normal">
          Have an upcoming event, show, or experience? Give it the spotlight it deserves and invite your audience to be part of it.
        </p>
      </div>
      <Link 
        to="/loginPage" 
        onClick={scrollToTop} 
        className="border border-slate-500 tracking-widest hover:border-white text-white text-xs font-medium px-4 py-2.5 rounded-md transition-all shrink-0 cursor-pointer"
        style={{ textDecoration: 'none' }}
      >
        Create Event
      </Link>
    </div>

      {/* ================= 3. MAIN FOOTER CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-8 pt-10 pb-8">
        
       {/* Top Header Row with Logo and Exact Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center space-x-2">
            <img src={LogoImg} alt="logo" className="h-8 w-auto object-contain rounded-md" />
            <span className="font-medium text-lg text-slate-900 tracking-tight">showishere</span>
          </div>

          {/* Social Icons (Black SVGs, no wrapper backgrounds) */}
          <div className="flex items-center space-x-5 text-slate-900">
            {/* Facebook */}
            <a  className="hover:opacity-75 transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* Twitter */}
            <a  className="hover:opacity-75 transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a  className="hover:opacity-75 transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a  className="hover:opacity-75 transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

       {/* Grid Links and Newsletter Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Left Description Column */}
          <div className="md:col-span-5 pr-4">
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Where ideas become events, moments become memories, and people come together to experience something extraordinary.
            </p>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2">
            <ul className="space-y-1 text-sm text-slate-700">
              <li><Link to="/about" onClick={scrollToTop} className="hover:text-black transition" style={{ textDecoration: 'none', color: 'inherit' }}>Our Story</Link></li>
              <li><Link  onClick={scrollToTop} className="hover:text-black transition" style={{ textDecoration: 'none', color: 'inherit' }}>The Way It Works</Link></li>
              <li><Link  onClick={scrollToTop} className="hover:text-black transition" style={{ textDecoration: 'none', color: 'inherit' }}>Check-in</Link></li>
              <li><a  className="hover:text-black transition">Blog</a></li>
              <li><a  className="hover:text-black transition">Contact</a></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="md:col-span-2">
            <ul className="space-y-1 text-sm text-slate-700">
              <li><a  className="hover:text-black transition">Kolkata</a></li>
              <li><a  className="hover:text-black transition">Chennai</a></li>
              <li><a  className="hover:text-black transition">Bengaluru</a></li>
              <li><a  className="hover:text-black transition">Hyderabad</a></li>
              <li><a  className="hover:text-black transition">Mumbai</a></li>
              <li><a  className="hover:text-black transition">Goa</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Never miss an event!</h3>
            <p className="text-xs text-slate-500 mb-3">Get the latest events, offers, and updates in your inbox.</p>
            <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden w-full">
              <input 
                type="email" 
                placeholder="your e-mail" 
                className="w-full px-3.5 py-2.5 text-xs focus:outline-none bg-transparent"
              />
              <button className="bg-black text-white px-4 py-2.5 hover:bg-slate-800 transition flex items-center justify-center cursor-pointer shrink-0">
                <svg className="w-3.5 h-3.5 transform rotate-45" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

    {/* ================= 4. HELP CONTACT CHIP BAR & SCROLL BUTTON ================= */}
        <div className="w-full flex items-center justify-center mb-8 relative px-4">
          
          {/* Main Light Blue Help Pill Container (Centered and smaller width) */}
          <div className="w-full max-w-4xl bg-[#E6EEF8] rounded-full py-6 px-10 flex items-center justify-center gap-6">
            <span className="text-xs font-semibold text-slate-700">Need Help?</span>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-800">
              {/* Phone Support */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-2xs">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span className="font-medium text-xs">94323 26900</span>
              </div>

              {/* WhatsApp Support */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-2xs">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span className="font-medium text-xs">94323 26900</span>
              </div>

              {/* Email Support */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-2xs">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="font-medium text-xs">showishereofficial@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Scroll to Top Button (Positioned completely outside on the far right as shown in your image) */}
          <button 
            onClick={scrollToTop} 
            className="fixed right-10 bottom-10 w-8 h-8 bg-[#3a3535] hover:bg-black text-white rounded-full flex items-center justify-center transition cursor-pointer shadow-lg z-50" 
            title="Scroll to top"
          >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
          </svg>

          </button>
        </div>

        {/* ================= 5. COPYRIGHT & LEGAL FOOTER ================= */}
        <div className="flex items-center justify-center text-[13px] text-slate-600 pt-2 text-center gap-1">
          <span className='font-medium text-slate-800'> ShowIsHere © 2026 — All rights reserved.</span>
          <span>By using our platform, you agree to our</span>
          <Link to="/terms" onClick={scrollToTop} className=" hover:text-slate-800" style={{ textDecoration: '', color: 'inherit' }}>Terms of Use</Link>,
          <Link to="/privacy-policy" onClick={scrollToTop} className=" hover:text-slate-800" style={{ textDecoration: '', color: 'inherit' }}>Privacy Policy</Link>, and
          <Link to="/refund-policy" onClick={scrollToTop} className=" hover:text-slate-800" style={{ textDecoration: '', color: 'inherit' }}>Refund Policy</Link>.
        </div>

      </div>
    </footer>
  );
};

export default Footer;