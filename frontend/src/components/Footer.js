import React from 'react';
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

  return (
    <footer className={footerWrapper}>
      {/* Top Bar */}
      <div className={footerTopBar}>
        <div className={footerTopItem}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.715m12 0v-.95a3 3 0 00-3-3h-6a3 3 0 00-3 3v.95M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>24/7 CUSTOMER SUPPORT</span>
        </div>
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
              <li className={footerLinkItem}>Our Story</li>
              <li className={footerLinkItem}>Pricing</li>
              <li className={footerLinkItem}>Contact</li>
              <li className={footerLinkItem}>Event Buzz</li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="md:col-span-3">
            <h4 className={footerHeading}>POPULAR CITIES</h4>
            <ul className={footerLinkList}>
              <li className={footerLinkItem}>Kolkata</li>
              <li className={footerLinkItem}>Chennai</li>
              <li className={footerLinkItem}>Bengaluru</li>
              <li className={footerLinkItem}>Hyderabad</li>
              <li className={footerLinkItem}>Mumbai</li>
              <li className={footerLinkItem}>Goa</li>
            </ul>
          </div>

          {/* References */}
          <div className="md:col-span-2">
            <h4 className={footerHeading}>REFERENCES</h4>
            <ul className={footerLinkList}>
              <li className={footerLinkItem}>The Way It Works</li>
              <li className={footerLinkItem}>Terms of Use</li>
              <li className={footerLinkItem}>Privacy</li>
              <li className={footerLinkItem}>Refunds & Cancellations</li>
              <li className={footerLinkItem}>FAQs</li>
              <li className={footerLinkItem}>Raise a Concern</li>
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