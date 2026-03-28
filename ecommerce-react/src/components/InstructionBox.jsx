import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import '../data/InstructionAnimation.css';

export default function InstructionBox({ text, onNext, onPrev, onSkip, isLastStep, isFirstStep }) {
  const { isDarkMode, toggleDarkMode } = useSettings();
  const [animate, setAnimate] = useState(true);
  const { t } = useSettings();
  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 400);
    return () => clearTimeout(timeout);
  }, [text]);

  const handleNext = () => {
    onNext();
  };

  const handlePrev = () => {
    onPrev();
  };

  return (
    <div
      className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        p-6 rounded-xl shadow-2xl max-w-lg w-[90vw] z-50
        flex flex-col items-center text-center
        text-gray-900 dark:text-gray-200
        bg-transparent backdrop-blur-md
        transition-all duration-500 ease-in-out
        ${animate ? 'fade-slide' : ''}
      `}
      role="dialog"
      aria-modal="true"
    >
      <p id="cls" className="mb-6 text-base sm:text-lg font-semibold text-white">{text}</p>


      {/* Arrows and Skip layout */}
      <div className="flex justify-between items-center w-full max-w-md mb-6 px-4 sm:px-0">
        {/* Next Arrow */}
        <button
          id="next-button"
          onClick={handleNext}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none"
          aria-label="Next Step"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Skip */}
        {!isLastStep && (
          <button
            id="skip-button"
            onClick={onSkip}
            className="text-sm text-gray-500 dark:text-gray-400 hover:underline focus:outline-none"
          >
            {t('skiper')}
          </button>
        )}

        {/* Prev Arrow */}
        {!isFirstStep ? (
          <button
            id="prev-button"
            onClick={handlePrev}
            className="p-2 rounded-full bg-gray-400 hover:bg-gray-500 transition-colors focus:outline-none"
            aria-label="Previous Step"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        ) : (
          <div className="w-[40px]" />
        )}
      </div>

      {/* Dark Mode Toggle */}
      {isLastStep && (
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center space-x-2
            bg-gray-200 dark:bg-gray-700
            px-6 py-3 rounded-full shadow-md
            hover:bg-gray-300 dark:hover:bg-gray-600
            transition-colors focus:outline-none"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <>
              <Sun className="h-6 w-6 text-yellow-400" />
              <span className="text-gray-800 dark:text-gray-200 font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-6 w-6 text-gray-800" />
              <Sun className="h-6 w-6 text-yellow-400" />
              <span className="text-gray-800 dark:text-gray-200 font-medium">Dark / Light</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
