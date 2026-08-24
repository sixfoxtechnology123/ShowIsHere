import React, { useState } from 'react';
import {
  heroBannerWrapper,
  ticketBannerContainer,
  heroContentArea,
  heroEventTitle,
  heroEventMetaRow,
  heroMetaItem,
  heroTierGrid,
  heroTierCardActive,
  heroTierCardInactive,
  heroTierName,
  heroTierPrice,
  heroActionRow,
  seatSelectorBox,
  primaryButton,
  detailsButton,
  heroArtSection
} from '../styles/MasterCSSClass';

const FeaturedEventBanner = () => {
  const [selectedTier, setSelectedTier] = useState('ROYAL');
  const seatCount = 2;

  const tiers = [
    { name: 'ROYAL', price: 'INR 3000', icon: '👑' },
    { name: 'VIP', price: 'INR 2500', icon: '⭐' },
    { name: 'PLATINUM', price: 'INR 2000', icon: '💎' },
    { name: 'DIAMOND', price: 'INR 1500', icon: '💎' },
    { name: 'GOLD', price: 'INR 1200', icon: '🏅' },
  ];

  return (
    <div className={heroBannerWrapper}>
      <div className={ticketBannerContainer}>
        <div className={heroContentArea}>
          <div>
            <h1 className={heroEventTitle}>Gaaner Khata O Praner Kobita</h1>
            
            <div className={heroEventMetaRow}>
              <div className={heroMetaItem}>
                <span>📅</span>
                <span>Saturday, Aug 22nd '26 at 6:00pm</span>
              </div>
              <div className={heroMetaItem}>
                <span>📍</span>
                <span>G D BIRLA SABHA GHAR</span>
              </div>
            </div>

            <div className={heroTierGrid}>
              {tiers.map((tier) => {
                const isSelected = selectedTier === tier.name;
                return (
                  <div 
                    key={tier.name} 
                    onClick={() => setSelectedTier(tier.name)}
                    className={isSelected ? heroTierCardActive : heroTierCardInactive}
                  >
                    <span className={heroTierName}>{tier.name} {tier.icon}</span>
                    <span className={heroTierPrice}>{tier.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={heroActionRow}>
            <div className={seatSelectorBox}>
              <span>Seats</span>
              <span className="text-blue-600 text-base">{seatCount}</span>
            </div>
            <button className={primaryButton}>🎟️ Book Tickets</button>
            <button className={detailsButton}>Details</button>
          </div>
        </div>

        <div className={heroArtSection}>
          <div className="text-white text-center font-serif italic">
            <div className="text-5xl mb-2">📖🎶</div>
            <p className="text-sm tracking-wider opacity-80">GKPK2220-008245</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEventBanner;