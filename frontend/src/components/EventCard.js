import React from 'react';
import {
  eventCard,
  eventThumbnail,
  eventTitle,
  eventSubText,
  cardFooter,
  salesBadge,
  primaryButton,
  redSticker,
  trendingBadge
} from '../styles/MasterCSSClass';

const EventCard = ({ event }) => {
  const soldPercentage = event.totalTickets ? (event.soldTickets / event.totalTickets) * 100 : 0;

  return (
    <div className={eventCard}>
      {event.isPromoted && <span className={redSticker}>Promoted</span>}
      {event.isTrending && <span className={trendingBadge}>Trending</span>}
      
      <img 
        src={event.thumbnail || "https://via.placeholder.com/300"} 
        alt={event.title} 
        className={eventThumbnail} 
      />
      
      <h3 className={eventTitle}>{event.title}</h3>
      <p className={eventSubText}>
        {event.venue} • {event.date ? new Date(event.date).toLocaleDateString() : ''}
      </p>
      
      <div className={cardFooter}>
        <span className={salesBadge}>
          {soldPercentage >= 80 ? 'Sales End Soon' : event.priceType === 'Paid' ? 'Going Fast' : 'Free'}
        </span>
        <button className={primaryButton}>Book</button>
      </div>
    </div>
  );
};

export default EventCard;