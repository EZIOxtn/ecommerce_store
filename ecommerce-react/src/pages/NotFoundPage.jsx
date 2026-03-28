import React, { useMemo } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Link } from 'react-router-dom';
import { messages } from '../data/notfound';  // Updated to named import

export default function NotFoundPage() {
  const { isDarkMode } = useSettings();

  
  const message = useMemo(() => {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }, []);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div
        className={`
          max-w-md text-center rounded-lg p-8
          ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}
          shadow-lg
          animate-fadeIn
        `}
        style={{ animationDuration: '800ms', animationFillMode: 'forwards' }}
      >
        <h1 className="text-6xl font-extrabold mb-4 animate-bounce">404</h1>
        <p className="mb-6 text-lg tracking-wide">{message}</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
          style={{ willChange: 'transform' }}
        >
          Go Back Home
        </Link>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% {opacity: 0; transform: translateY(20px);}
          100% {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation-name: fadeIn;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce {
          animation-name: bounce;
          animation-duration: 1.2s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  );
}
