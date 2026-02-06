import { useState, useEffect } from 'react';
import { Chapter, ChaptersData } from '../types';

// Global cache following useEvents pattern
let cachedChaptersData: ChaptersData | null = null;

export const useChapters = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // Use cached data if available
        if (cachedChaptersData) {
          setChapters(cachedChaptersData.chapters);
          setLoading(false);
          return;
        }

        const response = await fetch('/data/chapters.json');
        if (!response.ok) throw new Error('Failed to fetch chapters');

        const data: ChaptersData = await response.json();
        cachedChaptersData = data;

        setChapters(data.chapters);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  return { chapters, loading, error };
};

/**
 * Get a single chapter by chapter number
 */
export const useChapter = (chapterNum: number) => {
  const { chapters, loading, error } = useChapters();
  const chapter = chapters.find(c => c.chapter === chapterNum);

  return { chapter, loading, error };
};
