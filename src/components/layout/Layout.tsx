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

const Layout = ({
  title,
  showBack = false,
  showSearch = false,
  showShare = false,
  hideBottomNav = false
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <TopNav
        title={title}
        showBack={showBack}
        showSearch={showSearch}
        showShare={showShare}
      />

      <main className="flex-1 max-w-mobile md:max-w-desktop mx-auto w-full pb-20">
        <Outlet />
      </main>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;
