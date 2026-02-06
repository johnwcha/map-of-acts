import { useState, useEffect } from 'react';
import { Location, ActsData } from '../types';

let cachedData: ActsData | null = null;

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        if (cachedData) {
          setLocations(cachedData.locations);
          setLoading(false);
          return;
        }

        const response = await fetch('/data/acts-data.json');
        if (!response.ok) throw new Error('Failed to fetch data');

        const data: ActsData = await response.json();
        cachedData = data;
        setLocations(data.locations);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
};

export const useLocation = (locationId: string) => {
  const { locations, loading, error } = useLocations();
  const location = locations.find(l => l.id === locationId);

  return { location, loading, error };
};
