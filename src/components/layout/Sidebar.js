'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  Settings, 
  LogOut,
  X,
  Receipt,
  MessageSquare,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NAVIGATION_ITEMS, SETTINGS_ITEMS, ROUTES } from '../../utils/constants';


const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const iconMap = {
    Home,
    ShoppingCart,
    Package,
    Users,
    DollarSign,
    Settings,
    Receipt,
    MessageSquare,
    AlertCircle,
    BarChart3,
  };

  const handleNavigation = (href) => {
    router.push(href);
    onClose();
  };

  const handleLogout = () => {
    logout();
  };

  const handleSettingsAction = (action) => {
    switch (action) {
      case 'settings':
        router.push(ROUTES.SETTINGS);
        break;
      case 'systemConfig':
        alert('System Configuration page - to be implemented');
        break;
      case 'userManagement':
        alert('User Management page - to be implemented');
        break;
      default:
        break;
    }
    onClose();
  };

  const getPageTitle = () => {
    const navItem = NAVIGATION_ITEMS.find(item => item.href === pathname);
    if (navItem) return navItem.name;
    
    if (pathname.includes('/settings')) return 'Sozlamalar';
    if (pathname.includes('/sales')) return 'Sotuvlar tarixi';
    if (pathname.includes('/debts')) return 'Qarzdorliklar';
    if (pathname.includes('/reports')) return 'Hisobotlar';
    
    return 'Boshqaruv paneli';
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-48 bg-white text-gray-600 flex flex-col fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-200 shadow-xl overflow-hidden md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <h1 className="m-0 text-base font-bold text-gray-900">Enrico Cerrini</h1>
          </div>
          <button 
            className="bg-transparent border-none text-gray-400 cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-white/80 hover:text-gray-600 md:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
          {/* Main Navigation */}
          <div className="px-3 space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href;
              
              return (
                <button
                  key={item.name}
                  className={`flex items-center gap-2 px-2 py-2 w-full text-left rounded-lg transition-all duration-200 border-none cursor-pointer text-sm font-medium group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon 
                    size={18} 
                    className={`transition-transform duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} 
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Section */}
          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="px-3">
              <button
                className={`flex items-center gap-2 px-2 py-2 w-full text-left rounded-lg transition-all duration-200 border-none cursor-pointer text-sm font-medium group ${
                  pathname === ROUTES.SETTINGS 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => handleNavigation(ROUTES.SETTINGS)}
              >
                <Settings 
                  size={18} 
                  className={`transition-transform duration-200 ${pathname === ROUTES.SETTINGS ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} 
                />
                <span className="font-medium">Sozlamalar</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 shrink-0">
          <div className="mb-3 px-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="block font-semibold text-gray-900 text-sm truncate">{user?.name || 'Foydalanuvchi'}</span>
                <span className="block text-xs text-gray-500 truncate">{user?.email || 'email@example.com'}</span>
              </div>
            </div>
          </div>
          <button 
            className="flex items-center justify-center gap-2 w-full px-2 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white border-none rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium hover:from-red-600 hover:to-red-700 hover:shadow-md active:scale-95"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;