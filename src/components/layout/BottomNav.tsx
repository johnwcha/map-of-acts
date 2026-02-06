import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const BottomNav = () => {
  const { t } = useLanguage();

  const navItems = [
    {
      to: '/timeline',
      icon: 'route',
      label: t('nav.timeline'),
      fill: true
    },
    {
      to: '/map',
      icon: 'map',
      label: t('nav.map')
    },
    {
      to: '/read',
      icon: 'menu_book',
      label: t('nav.read')
    },
    {
      to: '/people',
      icon: 'person',
      label: t('nav.people')
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
      <div className="max-w-mobile md:max-w-desktop mx-auto flex justify-around items-center py-2 md:py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined ${isActive && item.fill ? 'fill-1' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] md:text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
};

export default BottomNav;
