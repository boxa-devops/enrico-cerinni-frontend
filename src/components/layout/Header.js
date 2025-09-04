/**
 * Header Component
 * 
 * Application header with navigation and mobile menu toggle.
 * Displays current page title and provides mobile navigation access.
 * 
 * @component
 * @example
 * <Header onMenuClick={handleMenuToggle} />
 */

'use client';

import { Menu, Bell, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';
import { cn } from '../../utils/cn';

const Header = ({ onMenuClick, className, ...props }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const getPageTitle = () => {
    const navItem = NAVIGATION_ITEMS.find(item => item.href === pathname);
    if (navItem) return navItem.name;
    
    // Dynamic route handling
    const routeMap = {
      '/settings/categories': 'Kategoriyalarni boshqarish',
      '/settings/attributes': 'Xususiyatlarni boshqarish',
      '/settings/brands': 'Brendlarni boshqarish',
      '/settings/colors': 'Ranglarni boshqarish',
      '/settings/sizes': 'O\'lchamlarni boshqarish',
      '/settings/seasons': 'Fasllarni boshqarish',
      '/inventory/': 'Mahsulot tafsilotlari',
      '/sales': 'Moliya',
    };

    for (const [route, title] of Object.entries(routeMap)) {
      if (pathname.includes(route)) return title;
    }
    
    return 'Boshqaruv paneli';
  };

  return (
    <header 
      className={cn(
        'px-4 sm:px-6 py-3',
        'flex items-center justify-between',
        'sticky top-0 z-40',
        className
      )}
      {...props}
    >
      {/* Left Section - Mobile Menu & Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden p-2"
          aria-label="Menyuni ochish"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;