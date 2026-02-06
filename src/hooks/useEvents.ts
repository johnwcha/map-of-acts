import { useState, useEffect } from 'react';
import { Event, ActsData } from '../types';

let cachedData: ActsData | null = null;

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (cachedData) {
          setEvents(cachedData.events);
          setLoading(false);
          return;
        }

        const response = await fetch('/data/acts-data.json');
        if (!response.ok) throw new Error('Failed to fetch data');

        const data: ActsData = await response.json();
        cachedData = data;

        // Sort events by date order
        const sortedEvents = [...data.events].sort((a, b) => a.date.order - b.date.order);
        setEvents(sortedEvents);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

export const useEvent = (eventId: string) => {
  const { events, loading, error } = useEvents();
  const event = events.find(e => e.id === eventId);

  return { event, loading, error };
};
