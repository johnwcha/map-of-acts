import { useState, useEffect } from 'react';
import { Journey, ActsData } from '../types';

let cachedData: ActsData | null = null;

export const useJourneys = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        if (cachedData) {
          setJourneys(cachedData.journeys);
          setLoading(false);
          return;
        }

        const response = await fetch('/data/acts-data.json');
        if (!response.ok) throw new Error('Failed to fetch data');

        const data: ActsData = await response.json();
        cachedData = data;
        setJourneys(data.journeys);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchJourneys();
  }, []);

  return { journeys, loading, error };
};

export const useJourney = (journeyId: string) => {
  const { journeys, loading, error } = useJourneys();
  const journey = journeys.find(j => j.id === journeyId);

  return { journey, loading, error };
};
