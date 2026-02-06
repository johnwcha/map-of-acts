interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'location';
  className?: string;
}

const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => {
  const variants = {
    primary: 'text-primary text-xs font-bold tracking-wider uppercase',
    secondary: 'text-slate-500 dark:text-slate-400 text-xs font-medium',
    location: 'bg-white/90 dark:bg-slate-800/90 p-1.5 rounded-md shadow-md flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter'
  };

  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
