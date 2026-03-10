import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

interface LayoutProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showShare?: boolean;
  hideBottomNav?: boolean;
}

export interface SearchContext {
  searchQuery: string;
}

const Layout = ({
  title,
  showBack = false,
  showSearch = false,
  showShare = false,
  hideBottomNav = false
}: LayoutProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleToggleSearch = () => {
    setSearchOpen((prev) => {
      if (prev) setSearchQuery(''); // clear on close
      return !prev;
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <TopNav
        title={title}
        showBack={showBack}
        showSearch={showSearch}
        showShare={showShare}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        onToggleSearch={handleToggleSearch}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-mobile md:max-w-desktop mx-auto w-full pb-20">
        <Outlet context={{ searchQuery } satisfies SearchContext} />
      </main>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;
