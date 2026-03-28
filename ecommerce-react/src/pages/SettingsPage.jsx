import React from 'react';
import { Moon, Sun, Bell, BellOff, Globe } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const languages = [
  { code: 'ar', name: 'العربية', localName: 'العربية' },
  { code: 'en', name: 'English', localName: 'English' },
  { code: 'de', name: 'German', localName: 'Deutsch' },
  { code: 'fr', name: 'French', localName: 'Français' },
];

export default function SettingsPage() {
  const { darkMode, toggleDarkMode, notifications, toggleNotifications, language, changeLanguage, t } = useSettings();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
        {t('settings')}
      </h1>

      <div className="space-y-6">
        {/* Dark Mode Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {darkMode ? (
                <Moon className="h-6 w-6 text-primary dark:text-primary-light" />
              ) : (
                <Sun className="h-6 w-6 text-primary dark:text-primary-light" />
              )}
              <span className="text-gray-800 dark:text-white font-medium">
                {t('darkMode')}
              </span>
            </div>
            <div className={`w-11 h-6 bg-gray-200 rounded-full px-1 flex items-center 
              ${darkMode ? 'bg-primary dark:bg-primary-light' : 'bg-gray-300'} transition-colors duration-300`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
                ${darkMode ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <button
            onClick={toggleNotifications}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {notifications ? (
                <Bell className="h-6 w-6 text-primary dark:text-primary-light" />
              ) : (
                <BellOff className="h-6 w-6 text-gray-400" />
              )}
              <span className="text-gray-800 dark:text-white font-medium">
                {t('notifications')}
              </span>
            </div>
            <div className={`w-11 h-6 bg-gray-200 rounded-full px-1 flex items-center 
              ${notifications ? 'bg-primary dark:bg-primary-light' : 'bg-gray-300'} transition-colors duration-300`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
                ${notifications ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>

        {/* Language Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Globe className="h-6 w-6 text-primary dark:text-primary-light" />
            <span className="text-gray-800 dark:text-white font-medium">
              {t('language')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300
                  ${language === lang.code
                    ? 'bg-primary dark:bg-primary-light text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <span className="block">{lang.localName}</span>
                <span className="block text-xs opacity-75">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 