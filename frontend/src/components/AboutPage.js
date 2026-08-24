import React from 'react';
import Img1 from '../assets/aboutLogo/Img_1.png';
import Img2 from '../assets/aboutLogo/Img_2.png';
import Img3 from '../assets/aboutLogo/Img_3.png';
import {
  aboutContainer,
  aboutSectionGrid,
  aboutHeadingTitle,
  aboutSubHeadingTitle,
  aboutParagraph,
  aboutStatsBar,
  aboutStatNumber,
  aboutStatLabel
} from '../styles/MasterCSSClass';

const AboutPage = () => {
  return (
    <div className={`${aboutContainer} py-8`}>
      {/* Section 1 & Section 2 combined under Image 1 to reduce length */}
      <div className={`${aboutSectionGrid} mb-1`}>
        <div className="md:col-span-7 space-y-3">
          <h1 className={`${aboutHeadingTitle} mb-3`}>We believe,</h1>
          <p className={aboutParagraph}>
            an event is more than a date on a calendar. It is a moment of connection, a story waiting to unfold, a song that stays with you, and a memory you carry home.
          </p>
          <p className={aboutParagraph}>
            We created ShowIsHere with one simple idea — great experiences should be for everyone, without pinching pockets and walking on thin ice.
          </p>
          <p className={aboutParagraph}>
            From the first note of a concert to the excitement of a live show, from cultural celebrations and workshops to corporate gatherings and special occasions, we bring experiences together in one simple, accessible and hassle-free platform.
          </p>

          <div className="pt-4">
            <h2 className={`${aboutSubHeadingTitle} mb-1`}>Show is here!</h2>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">More Than Numbers. We Measure Moments.</h3>
            <p className={aboutParagraph}>
              ShowIsHere is an event ticketing and event management platform built for both sides of the experience. For audiences, we make discovering events, booking tickets and entering venues simple, secure and convenient.
            </p>
            <p className={aboutParagraph}>
              For organizers, we provide the tools, technology and support needed to promote events, reach the right audience, manage registrations and create seamless experiences from planning to execution. Because behind every great event is a great deal of planning — and we are here to make that journey easier.
            </p>
          </div>
        </div>

        <div className="md:col-span-5 flex justify-center">
          <img src={Img1} alt="Singer illustration" className="w-full max-w-sm object-contain rounded-2xl shadow-sm" />
        </div>
      </div>

      {/* Section 3: From the stage to the summit */}
      <div className={`${aboutSectionGrid} mb-12`}>
        <div className="md:col-span-5 flex justify-center">
          <img src={Img2} alt="Guitar performance illustration" className="w-full max-w-sm object-contain rounded-2xl shadow-sm" />
        </div>
        <div className="md:col-span-7 space-y-3">
          <h2 className={aboutSubHeadingTitle}>From the stage to the summit</h2>
          <p className={aboutParagraph}>
            Our world has no single stage.
          </p>
          <p className={aboutParagraph}>
            One day, it may be the soft rhythm of a classical performance echoing through an intimate hall. The next, it could be the energy of a rock concert, the colours of a cultural festival, the excitement of a sporting experience, or the quiet thrill of beginning a demanding adventure journey. Different places. Different people. Different passions.
          </p>
          <p className={aboutParagraph}>
            ShowIsHere exists to make that connection easier.
          </p>
        </div>
      </div>

      {/* Section 4: A platform with a heart */}
      <div className={`${aboutSectionGrid} mb-8`}>
        <div className="md:col-span-7 space-y-3">
          <h2 className={aboutSubHeadingTitle}>A platform with a heart</h2>
          <p className={aboutParagraph}>
            Our success isn't measured only by numbers.
          </p>
          <p className={aboutParagraph}>
            It is measured by the organizer who says, <span className="italic font-semibold text-slate-800">“You made it easier.”</span> By the audience who says, <span className="italic font-semibold text-slate-800">“That was unforgettable.”</span>
          </p>
          <p className={aboutParagraph}>
            By the artist who reaches a new audience. And by the moment when the lights go down, the music begins, the crowd rises — and everything comes together exactly as it should.
          </p>
        </div>
        <div className="md:col-span-5 flex justify-center">
          <img src={Img3} alt="Santoor artist illustration" className="w-full max-w-sm object-contain rounded-2xl shadow-sm" />
        </div>
      </div>

  
     {/* Statistics Bar - Compact Ticket Notch Style */}
      <div className="bg-[#1f242d] text-white py-0.5 px-4 my-1 grid grid-cols-1 md:grid-cols-3 text-center rounded-2xl shadow-lg relative overflow-hidden">
        
        {/* Stat 1 */}
        <div className="relative py-2">
          <div className={aboutStatNumber}>0+</div>
          <div className={aboutStatLabel}>Eventful States</div>
          {/* Right vertical dashed divider */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-8 border-r border-dashed border-slate-600"></div>
          {/* Right semi-circle cutout overlapping edge */}
          <div className="hidden md:block absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#f4f5f7] z-10"></div>
          <div className="hidden md:block absolute -right-3 -bottom-3 w-6 h-6 rounded-full bg-[#f4f5f7] z-10"></div>
        </div>

        {/* Stat 2 */}
        <div className="relative py-2 border-t md:border-t-0 border-dashed border-slate-700">
          <div className={aboutStatNumber}>15+</div>
          <div className={aboutStatLabel}>Experiences & Events</div>
          {/* Right vertical dashed divider */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-8 border-r border-dashed border-slate-600"></div>
          {/* Right semi-circle cutout overlapping edge */}
          <div className="hidden md:block absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#f4f5f7] z-10"></div>
          <div className="hidden md:block absolute -right-3 -bottom-3 w-6 h-6 rounded-full bg-[#f4f5f7] z-10"></div>
        </div>

        {/* Stat 3 */}
        <div className="relative py-2 border-t md:border-t-0 border-dashed border-slate-700">
          <div className={aboutStatNumber}>01+</div>
          <div className={aboutStatLabel}>Event Makers</div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;