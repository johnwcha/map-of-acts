import { useState, useEffect } from 'react';
import { Bookmark } from '../types';

const STORAGE_KEY = 'acts-bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Bookmark[] = JSON.parse(stored);
        setBookmarks(parsed);
      } catch (err) {
        console.error('Failed to parse bookmarks:', err);
        setBookmarks([]);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  /**
   * Add a new bookmark
   */
  const addBookmark = (chapter: number, verse?: number) => {
    const id = verse ? `acts-${chapter}-${verse}` : `acts-${chapter}`;

    // Check if bookmark already exists
    if (bookmarks.some(b => b.id === id)) {
      return;
    }

    const newBookmark: Bookmark = {
      id,
      chapter,
      verse,
      createdAt: Date.now(),
    };

    setBookmarks(prev => [...prev, newBookmark]);
  };

  /**
   * Remove a bookmark by ID
   */
  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  /**
   * Check if a chapter/verse is bookmarked
   */
  const isBookmarked = (chapter: number, verse?: number): boolean => {
    const id = verse ? `acts-${chapter}-${verse}` : `acts-${chapter}`;
    return bookmarks.some(b => b.id === id);
  };

  /**
   * Toggle bookmark on/off
   */
  const toggleBookmark = (chapter: number, verse?: number) => {
    const id = verse ? `acts-${chapter}-${verse}` : `acts-${chapter}`;

    if (isBookmarked(chapter, verse)) {
      removeBookmark(id);
    } else {
      addBookmark(chapter, verse);
    }
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
};
