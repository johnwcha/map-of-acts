import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event, Location } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import Badge from '../shared/Badge';
import TimelineConnector from './TimelineConnector';

interface TimelineItemProps {
  event: Event;
  location?: Location;
  isLast?: boolean;
}

const TimelineItem = ({ event, location, isLast = false }: TimelineItemProps) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';
  const [imageError, setImageError] = React.useState(false);

  const handleClick = () => {
    navigate(`/event/${event.id}`);
  };

  const handleViewRoute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.journeyId) {
      navigate('/map', { state: { journeyId: event.journeyId, eventId: event.id } });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="grid grid-cols-[40px_1fr] gap-x-4">
      <TimelineConnector isLast={isLast} />

      <div
        className="flex flex-col py-4 bg-white dark:bg-slate-900/50 rounded-xl p-4 mb-4 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleClick}
      >
        {/* Scripture Reference Badge */}
        <Badge variant="primary" className="mb-1">
          {event.scripture.display}
        </Badge>

        {/* Title */}
        <h3 className="font-serif text-slate-900 dark:text-white text-lg md:text-2xl font-bold leading-tight">
          {event.title[lang]}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-2 leading-relaxed">
          {event.description[lang]}
        </p>

        {/* Image with location badge */}
        {event.primaryImage && !imageError && (
          <div className="mt-4 relative group">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors rounded-lg" />
            <img
              src={event.primaryImage}
              alt={event.title[lang]}
              onError={handleImageError}
              className="aspect-[16/7] w-full rounded-lg object-cover border border-slate-200 dark:border-slate-700"
              loading="lazy"
            />
            {location && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="location">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>{location.name[lang]}</span>
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Fallback gradient for missing images */}
        {event.primaryImage && imageError && (
          <div className="mt-4 relative group">
            <div className="aspect-[16/7] w-full rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-slate-100 dark:from-primary/30 dark:via-primary/20 dark:to-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-primary/40">image</span>
            </div>
            {location && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="location">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>{location.name[lang]}</span>
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* View Route button for journey events */}
        {event.journeyId && (
          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={handleViewRoute}
              className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
            >
              {t('timeline.viewRoute')}
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Special badge for significant events */}
        {event.category === 'early-church' && event.id === 'pentecost' && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">
              {lang === 'en' ? 'Birth of the Global Church' : '全球教會的誕生'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
