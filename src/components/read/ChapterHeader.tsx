import { useState, useRef, useCallback } from 'react';
import { Chapter } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface ChapterHeaderProps {
  chapter: Chapter;
  currentChapter: number;
  totalChapters: number;
  onNavigate: (chapter: number) => void;
}

const ChapterHeader = ({ chapter, currentChapter, totalChapters, onNavigate }: ChapterHeaderProps) => {
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';

  // dragChapter is the chapter shown while dragging (null when not dragging)
  const [dragChapter, setDragChapter] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

  const chapterFromEvent = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return currentChapter;
      const { left, width } = track.getBoundingClientRect();
      const ratio = clamp((clientX - left) / width, 0, 1);
      return clamp(Math.round(ratio * (totalChapters - 1)) + 1, 1, totalChapters);
    },
    [currentChapter, totalChapters]
  );

  // ── Pointer events (works for mouse + touch via pointer capture) ──────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    setDragChapter(chapterFromEvent(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    setDragChapter(chapterFromEvent(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const target = chapterFromEvent(e.clientX);
    setDragChapter(null);
    if (target !== currentChapter) {
      onNavigate(target);
    }
  };

  const displayChapter = dragChapter ?? currentChapter;
  const progress = ((displayChapter - 1) / (totalChapters - 1)) * 100;

  return (
    <div className="mb-6">
      {/* Chapter title and info */}
      <div className="text-center mb-4">
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-1">
          {t('read.chapterOf')
            .replace('{current}', displayChapter.toString())
            .replace('{total}', totalChapters.toString())}
        </p>

        <h1 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">
          {dragChapter ? `— ${t('read.navigation.goToChapter')} ${dragChapter} —` : chapter.title[lang]}
        </h1>

        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          {dragChapter ? '\u00a0' : `${chapter.verseCount} ${t('read.verses')}`}
        </p>
      </div>

      {/* Drag slider track */}
      <div className="relative py-3 -my-3 cursor-grab active:cursor-grabbing select-none touch-none">
        {/* Track */}
        <div
          ref={trackRef}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-visible relative"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Filled portion */}
          <div
            className="absolute left-0 top-0 h-full bg-primary rounded-full"
            style={{ width: `${progress}%`, transition: isDragging.current ? 'none' : 'width 0.3s' }}
          />

          {/* Thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-primary bg-white dark:bg-slate-900 shadow transition-transform ${dragChapter ? 'w-5 h-5 scale-125' : 'w-4 h-4 scale-100'
              }`}
            style={{ left: `${progress}%`, transition: isDragging.current ? 'none' : 'left 0.3s, transform 0.15s' }}
          />
        </div>

        {/* Chapter tick marks */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-[1px]">
          {Array.from({ length: totalChapters }, (_, i) => {
            const ch = i + 1;
            const isActive = ch <= displayChapter;
            // Show label only at chapters 1, 7, 14, 21, 28
            const showLabel = ch === 1 || ch === 7 || ch === 14 || ch === 21 || ch === 28;
            return (
              <div key={ch} className="flex flex-col items-center gap-0.5">
                <div
                  className={`w-0.5 rounded-full transition-colors ${isActive
                      ? 'bg-primary/40 h-1'
                      : 'bg-slate-300 dark:bg-slate-600 h-1'
                    }`}
                />
                {showLabel && (
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 leading-none mt-2">{ch}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChapterHeader;
