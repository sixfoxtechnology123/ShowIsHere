import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/Logo.jpeg';
import PerformingartImg from '../assets/footerimage/betterTogether.png';
import ArtsCultureImg from '../assets/footerimage/createEvent.png';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white text-slate-800 font-sans ">
      
    {/* ================= 1. BETTER TOGETHER BANNER ================= */}
      <div className="w-full bg-[#708296] text-white py-10 px-8 md:px-24 lg:px-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Content Area */}
          <div className="max-w-xl text-center md:text-left z-10">
            <h2 className="text-4xl lg:text-5xl font-light tracking-wide mb-3">Better <span className='font-normal'>Together.</span></h2>
            <p className="text-sm lg:text-base text-slate-100 opacity-90 mb-6 font-light">Together, We Shape Moments Into Memories.</p>
           <a
                      href="https://wa.me/919432326904?text=Hi%20ShowIsHere,%20I%E2%80%99m%20interested%20in%20becoming%20a%20partner.%20Please%20share%20more%20details%20about%20the%20partnership%20opportunities."
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={scrollToTop}
                      className="inline-block bg-[#d9d9d9] text-slate-800 font-medium text-xs px-6 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
                      style={{ textDecoration: 'none' }}
                    >
                      Become a Partner
                    </a>
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
    <div className="w-full bg-[#333333] text-white py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-5 md:gap-10 text-center md:text-left">
      
      {/* Left Section: Icon & Description */}
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
        <img 
      src={ArtsCultureImg}  // Notice .src if importing local files in some setups
      alt="Arts & Culture" 
      className="w-10 h-10 object-contain filter brightness-0 invert opacity-90 shrink-0" 
    />
        <p className="text-xs lg:text-sm text-slate-300 font-normal whitespace-nowrap">
          Have an upcoming event, show, or experience? Give it the spotlight it deserves and invite your audience to be part of it.
        </p>
      </div>

      {/* Right Section: Button */}
      <Link 
        to="/loginPage" 
        onClick={scrollToTop} 
        className="border border-slate-300 tracking-widest text-white text-xs font-medium px-4 py-2 rounded-md transition-all shrink-0 cursor-pointer"
        style={{ textDecoration: 'none' }}
      >
        Create Event
      </Link>
      
    </div>

      {/* ================= 3. MAIN FOOTER CONTENT ================= */}
      <div className="max-w-full bg-[e8f2fe] mx-auto px-28 pt-10 pb-8">
        
       {/* Top Header Row with Logo and Exact Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-6">
          <div className="flex items-center space-x-2">
            <img src={LogoImg} alt="logo" className="h-10 w-auto object-contain rounded-md" />
            <span className="font-medium text-lg text-slate-900 tracking-tight">showishere</span>
          </div>

          {/* Social Icons (Black SVGs, no wrapper backgrounds) */}
          <div className="flex items-center space-x-5 text-slate-900">
            {/* Facebook */}
            <a  className="hover:opacity-75 transition">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
            </svg>
            </a>
            {/* Twitter */}
            <a  className="hover:opacity-75 transition">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
            </svg>
            </a>
            {/* Instagram */}
            <a  className="hover:opacity-75 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 px-12 items-start">
          
          {/* Left Description Column */}
          <div className="md:col-span-5 pr-4">
            <p className="text-sm text-[#5e5c5d] leading-relaxed max-w-sm">
              Where ideas become events, moments become memories, and people come together to experience something extraordinary.
            </p>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2">
            <ul className="space-y-1 text-[14px] text-black">
              <li><Link to="/about" onClick={scrollToTop} className="transition" style={{ textDecoration: 'none', color: 'inherit' }}>Our Story</Link></li>
              <li><Link  onClick={scrollToTop} className="transition" style={{ textDecoration: 'none', color: 'inherit' }}>The Way It Works</Link></li>
              <li><Link  onClick={scrollToTop} className="transition" style={{ textDecoration: 'none', color: 'inherit' }}>Check-in</Link></li>
              <li><a  className="transition">Blog</a></li>
              <li><a  className="transition">Contact</a></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="md:col-span-2">
            <ul className="space-y-1 text-[14px] text-black">
              <li><a  className="transition">Kolkata</a></li>
              <li><a  className="transition">Chennai</a></li>
              <li><a  className="transition">Bengaluru</a></li>
              <li><a  className="transition">Hyderabad</a></li>
              <li><a  className="transition">Mumbai</a></li>
              <li><a  className="transition">Goa</a></li>
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
              <button className="bg-black text-white px-4 py-2.5 transition flex items-center justify-center cursor-pointer shrink-0">
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
          <div className="w-full max-w-4xl bg-[#d4e6fa] rounded-full  py-8 px-10 flex items-center justify-center gap-6">
            <span className="text-sm font-semibold text-slate-800">Need Help?</span>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-[13px] text-slate-800">
              {/* Phone Support */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-2xs">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
               <a 
                  href="tel:9432326904" 
                  className="font-medium  cursor-pointer"
                >
                  9432326904
                </a>
              </div>

              {/* WhatsApp Support */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-2xs">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <a 
                href="https://wa.me/919432326904?text=Hi%20ShowIsHere,%20I%E2%80%99m%20interested%20in%20becoming%20a%20partner.%20Please%20share%20more%20details%20about%20the%20partnership%20opportunities." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium  cursor-pointer"
              >
                9432326904
              </a>
              </div>

              {/* Email Support */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-2xs">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope text-blue-500" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
              </svg>
             <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=showishereofficial@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium  cursor-pointer"
            >
              showishereofficial@gmail.com
            </a>
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
          <span className='text-[#828689]'>By using our platform, you agree to our</span>
          <Link to="/terms" onClick={scrollToTop} className="font-medium hover:text-slate-800" style={{ textDecoration: 'none', color: '#5e5c5d' }}>Terms of Use</Link>,
          <Link to="/privacy-policy" onClick={scrollToTop} className="font-medium hover:text-slate-800" style={{ textDecoration: 'none', color: '#5e5c5d' }}>Privacy Policy</Link>, and
          <Link to="/refund-policy" onClick={scrollToTop} className="font-medium hover:text-slate-800" style={{ textDecoration: 'none', color: '#5e5c5d' }}>Refund Policy</Link>.
        </div>

      </div>
    </footer>
  );
};

export default Footer;