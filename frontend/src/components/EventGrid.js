import React from 'react';
import EventCard from './EventCard';
import { eventGrid, emptyState } from '../styles/MasterCSSClass';

const EventGrid = ({ events, loading, location, activeTab }) => {
  return (
    <div className={eventGrid}>
      {loading ? (
        <div className={emptyState}>Loading events...</div>
      ) : events.length > 0 ? (
        events.map((event) => (
          <EventCard key={event._id || Math.random()} event={event} />
        ))
      ) : (
        <div className={emptyState}>
          No events found for {location} under "{activeTab}". Make sure your backend server is running on port 5005!
        </div>
      )}
    </div>
  );
};

export default EventGrid;