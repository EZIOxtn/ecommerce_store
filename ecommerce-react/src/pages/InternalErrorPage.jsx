import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Link } from 'react-router-dom';

export default function InternalErrorPage() {
  const { isDarkMode } = useSettings();  // For dark mode support

  return (
    <div className={`container mx-auto px-4 py-8 pt-20 text-center ${isDarkMode ? 'dark' : ''}`}>
      <div className={`max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ${isDarkMode ? 'dark:text-gray-200' : 'text-gray-800'}`}>
        <h1 className="text-4xl font-bold mb-4">500 - Internal Server Error</h1>
        <p className="mb-6 text-lg">Something went wrong on our end. We're sorry for the inconvenience.</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
} 