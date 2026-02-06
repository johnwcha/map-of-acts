import { useLanguage } from '../../hooks/useLanguage';
import { Event } from '../../types';

interface SectionDividerProps {
  category: Event['category'];
}

const SectionDivider = ({ category }: SectionDividerProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-[40px_1fr] gap-x-4 my-6">
      <div className="flex flex-col items-center">
        <div className="w-[2px] bg-primary/30 h-full" />
      </div>
      <div className="py-4">
        <h2 className="font-serif text-slate-700 dark:text-slate-300 text-sm font-bold tracking-wide uppercase">
          {t(`categories.${category}`)}
        </h2>
      </div>
    </div>
  );
};

export default SectionDivider;
