import { ScriptureReference } from '../types';

/**
 * Builds Bible Gateway URL for a scripture reference
 */
export const buildBibleGatewayUrl = (
  scripture: ScriptureReference,
  version: string = 'ASV'
): string => {
  const { book, chapter, verseStart, verseEnd } = scripture;
  const verseRange = verseEnd ? `${verseStart}-${verseEnd}` : `${verseStart}`;
  const reference = `${book} ${chapter}:${verseRange}`;

  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=${version}`;
};

/**
 * Available Bible translations with display names
 */
export const BIBLE_VERSIONS = {
  en: [
    {
      code: 'ASV',
      name: 'American Standard Version (ASV)',
      description: 'Literal translation (embedded)'
    },
    {
      code: 'AMP',
      name: 'Amplified Bible (AMP)',
      description: 'Expanded meanings'
    },
    {
      code: 'KJV',
      name: 'King James Version (KJV)',
      description: 'Traditional English'
    },
    {
      code: 'NIV',
      name: 'New International Version (NIV)',
      description: 'Modern, readable'
    },
    {
      code: 'ESV',
      name: 'English Standard Version (ESV)',
      description: 'Literal, modern'
    },
  ],
  zh: [
    {
      code: 'CUV',
      name: '和合本 (CUV)',
      description: '傳統中文翻譯 (內嵌)'
    },
    {
      code: 'CUVS',
      name: '和合本简体 (CUVS)',
      description: '简体中文'
    },
    {
      code: 'CCB',
      name: '當代聖經 (CCB)',
      description: '現代中文'
    },
  ]
};

/**
 * Opens a Bible passage in a new tab
 */
export const openBiblePassage = (
  scripture: ScriptureReference,
  version: string = 'ASV'
): void => {
  const url = buildBibleGatewayUrl(scripture, version);
  window.open(url, '_blank', 'noopener,noreferrer');
};
