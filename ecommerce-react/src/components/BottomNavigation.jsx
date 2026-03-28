import React from 'react';
import { User, ShoppingCart, Home, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
const AccountIcon = () => {
  const base64Photo = localStorage.getItem('user_photo_base64');

  return base64Photo ? (
    <img
      src={base64Photo}
      alt="User"
      className="h-5 w-5 md:h-6 md:w-6 rounded-full object-cover"
      loading="lazy"
    />
  ) : (
    <User className="h-5 w-5 md:h-6 md:w-6" />
  );
};
const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useSettings();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      icon: Home,
      label: 'home',
      path: '/',
    },
    {
      icon: ShoppingCart,
      label: 'products',
      path: '/products',
    },
    {
      icon: Settings,
      label: 'settings',
      path: '/settings',
    },
    {
      icon: AccountIcon,
      label: 'account',
      path: '/account',
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 md:hidden dark:bg-gray-800 dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isItemActive = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center transition-all duration-300 
                ${isItemActive 
                  ? 'text-primary dark:text-primary-light' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary/80 dark:hover:text-primary-light/80'}`}
            >
              <div className={`relative flex items-center justify-center
                ${isItemActive ? 'transform scale-110' : ''}`}>
                <div className={`absolute inset-0 bg-primary/10 dark:bg-primary-light/10 rounded-full 
                  transition-all duration-300 scale-0 
                  ${isItemActive ? 'scale-150 animate-pulse' : ''}`} />
                <Icon className={`h-5 w-5 transition-transform duration-300
                  ${isItemActive ? 'stroke-2' : 'stroke-1.5'}`} />
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-300
                ${isItemActive 
                  ? 'text-primary dark:text-primary-light' 
                  : 'text-gray-500 dark:text-gray-400'}`}>
                {t(item.label)}
              </span>
              {isItemActive && (
                <div className="absolute -bottom-0 w-1/3 h-0.5 bg-primary dark:bg-primary-light rounded-full 
                  transition-all duration-300 animate-fadeIn" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation; 