import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/Logo.jpeg';
import {
  footerWrapper,
  footerTopBar,
  footerTopItem,
  footerMainContent,
  footerWatermark,
  footerWatermarkText,
  footerGrid,
  footerNewsletterCol,
  footerHeading,
  footerLinkList,
  footerLinkItem,
  footerBottomBar,
  footerSocialIcons,
  socialCircleBtn,
  scrollToTopBtn
} from '../styles/MasterCSSClass';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fixed layout: using 'block w-max' instead of 'inline-block' so items stay stacked correctly
  const linkHoverClass = `${footerLinkItem} relative block w-max after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-900 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100 cursor-pointer`;

  return (
    <footer className={footerWrapper}>
      {/* Top Bar */}
      <div className={footerTopBar}>
        <a 
          href="https://wa.me/919836858904?text=Hello%20ShowIsHere%20Support,%20I%20need%20help%20with%20my%20booking." 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${footerTopItem} hover:text-emerald-400 transition-colors`}
        >
          <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="cursor-pointer">24/7 CUSTOMER SUPPORT</span>
        </a>
        
        <div className="hidden md:block border-r border-slate-700 h-4"></div>
        
        <div className={footerTopItem}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span>LIST YOUR SHOW</span>
        </div>
      </div>

      {/* Main Container */}
      <div className={footerMainContent}>
        {/* Scroll To Top Button */}
        <button onClick={scrollToTop} className={scrollToTopBtn} title="Scroll to top">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Crisp, Clear Small Watermark */}
        <div className={footerWatermark}>
          <span className={footerWatermarkText}>Show is here</span>
        </div>

        {/* Grid Sections */}
        <div className={footerGrid}>
          {/* Newsletter Column */}
          <div className={footerNewsletterCol}>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Never miss an event!</h3>
            <p className="text-xs text-slate-500 mb-4">Get the latest shows, events, offers, and updates in your inbox.</p>
            <div className="flex items-center max-w-md bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-slate-900">
              <input 
                type="email" 
                placeholder="your e-mail" 
                className="w-full px-4 py-2.5 text-sm focus:outline-none bg-transparent"
              />
              <button className="bg-black text-white px-5 py-3 hover:bg-slate-800 transition flex items-center justify-center cursor-pointer">
                <svg className="w-4 h-4 transform rotate-45" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h4 className={footerHeading}>EXPLORE</h4>
            <ul className={footerLinkList}>
              <li>
                <Link to="/about" onClick={scrollToTop} className={linkHoverClass} style={{ textDecoration: 'none', color: 'inherit' }}>
                  Our Story
                </Link>
              </li>
              <li className={linkHoverClass}>Pricing</li>
              <li className={linkHoverClass}>Contact</li>
              <li className={linkHoverClass}>Event Buzz</li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="md:col-span-3">
            <h4 className={footerHeading}>POPULAR CITIES</h4>
            <ul className={footerLinkList}>
              <li className={linkHoverClass}>Kolkata</li>
              <li className={linkHoverClass}>Chennai</li>
              <li className={linkHoverClass}>Bengaluru</li>
              <li className={linkHoverClass}>Hyderabad</li>
              <li className={linkHoverClass}>Mumbai</li>
              <li className={linkHoverClass}>Goa</li>
            </ul>
          </div>

          {/* References */}
          <div className="md:col-span-2">
            <h4 className={footerHeading}>REFERENCES</h4>
            <ul className={footerLinkList}>
              <li className={linkHoverClass}>The Way It Works</li>
              <li className={linkHoverClass}>Terms of Use</li>
              <li className={linkHoverClass}>Privacy</li>
              <li className={linkHoverClass}>Refunds & Cancellations</li>
              <li className={linkHoverClass}>FAQs</li>
              <li className={linkHoverClass}>Raise a Concern</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Continuous Underlines */}
        <div className={footerBottomBar}>
          {/* Brand Logo with Left Underline */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start mb-4 md:mb-0">
            <div className="flex items-center space-x-2 shrink-0">
              <img src={LogoImg} alt="logo" className="h-8 w-auto object-contain rounded-md" />
              <span className="font-bold text-base text-slate-900 tracking-tight">ShowIsHere</span>
            </div>
            <div className="hidden md:block border-t border-slate-300 w-48 lg:w-72"></div>
          </div>

          {/* Social Media Circular Icons */}
          <div className={footerSocialIcons}>
            <div className={socialCircleBtn}>f</div>
            <div className={socialCircleBtn}>t</div>
            <div className={socialCircleBtn}>f</div>
            <div className={socialCircleBtn}>g+</div>
            <div className={socialCircleBtn}>••</div>
          </div>

          {/* Copyright with Right Underline */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
            <div className="hidden md:block border-t border-slate-300 w-32 lg:w-48"></div>
            <div className="text-xs text-slate-500 shrink-0">
              ShowIsHere © 2026 — All rights reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;