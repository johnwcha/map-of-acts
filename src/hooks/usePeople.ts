import { useState, useEffect } from 'react';
import { Person, ActsData } from '../types';

let cachedData: ActsData | null = null;

export const usePeople = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        if (cachedData) {
          setPeople(cachedData.people);
          setLoading(false);
          return;
        }

        const response = await fetch('/data/acts-data.json');
        if (!response.ok) throw new Error('Failed to fetch data');

        const data: ActsData = await response.json();
        cachedData = data;
        setPeople(data.people);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  return { people, loading, error };
};

export const usePerson = (personId: string) => {
  const { people, loading, error } = usePeople();
  const person = people.find(p => p.id === personId);

  return { person, loading, error };
};
