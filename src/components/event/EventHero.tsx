import { Event } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface EventHeroProps {
  event: Event;
}

const EventHero = ({ event }: EventHeroProps) => {
  const { language } = useLanguage();
  const lang = language === 'zh-TW' ? 'zh' : 'en';

  return (
    <div className="@container">
      <div className="@[480px]:px-4 @[480px]:py-3">
        <div
          className="relative bg-cover bg-center flex flex-col justify-end overflow-hidden bg-slate-200 @[480px]:rounded-xl min-h-[320px] shadow-lg"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%), url(${event.primaryImage})`
          }}
        >
          <div className="p-6">
            {/* Badges */}
            <div className="flex gap-2 mb-2">
              <span className="bg-primary text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {event.date.displayText[lang]}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {lang === 'en' ? `Chapter ${event.scripture.chapter}` : `第${event.scripture.chapter}章`}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight font-serif">
              {event.title[lang]}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHero;
