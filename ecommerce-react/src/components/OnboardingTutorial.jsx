import React, { useState, useEffect, useRef } from 'react';
import TutorialOverlay from './TutorialOverlay';  // Import the subcomponent
import { useSettings } from '../contexts/SettingsContext';  // Import for dark mode toggle
import { Moon, Sun } from 'lucide-react';  // Icons for dark/light mode



export default function OnboardingTutorial({ children }) {
  
  const { t, setLanguage,changeLanguage } = useSettings();  // Include setLanguage if available
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { isDarkMode, toggleDarkMode } = useSettings();  // Access dark mode state and toggle
  const languages = [
    { code: 'ar', name: 'العربية', localName: 'العربية' },
    { code: 'en', name: 'English', localName: 'English' },
    { code: 'de', name: 'German', localName: 'Deutsch' },
    { code: 'fr', name: 'French', localName: 'Français' },
  ];
  
  const steps = [
    {
      targetSelector: '#starter',
      text: (
        <>
          {t('langBox')}
          <br />
          <div className="w-32 h-32 overflow-hidden rounded-full my-2">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
              alt="Premium Wireless Headphones"
              className="w-full h-full object-cover"
            />
          </div>
  
          <div className="grid grid-cols-2 gap-2 mt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="px-2 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                {lang.localName}
              </button>
            ))}
          </div>
        </>
      ),
    },
    {
      targetSelector: '#account-button',
      text: (
        <>
          {t('step1') }
          <br />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline ml-2 lucide lucide-user"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </>
      ),
    },
    {
      targetSelector: '#product-card',
      text: (
        <>
    {t('step2')}
    <br />
    <img
      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
      alt="Premium Wireless Headphones"
      className="w-full h-full object-cover"
    />
  </>
      ),
    },
    {
      targetSelector: '#cart-button',
      text: (
        <>
          {t('step3')}
          <br />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart h-5 w-5 md:h-6 md:w-6" aria-hidden="true" id="cart-button"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
        </>
      ),
    },
    {
      targetSelector: '#nothing',
      text: t('step4'),
    },
  ];
  
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setIsTutorialActive(true);
    }
  }, []);
  const handleLast = () => {
    document.getElementById('next-button').textContent = 'End';
    document.getElementById('skip-button').style.display = 'none';
  }
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (currentStep === steps.length - 1) {
       
        //add a buton in the  of the page to enable dark mode
        const darkModeButton = document.createElement('button');
        darkModeButton.id = 'dark-mode-button';
        darkModeButton.textContent = 'Dark  / Light';
        darkModeButton.addEventListener('click', () => {
            endTutorial();
        });
      }
      endTutorial();
    }
  };

  const handleSkip = () => {
    endTutorial();
  };

  const endTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsTutorialActive(false);
  };

  const isLastStep = currentStep === steps.length - 1;  // Determine if it's the last step

  return (
    <>
      {isTutorialActive && (
        <TutorialOverlay
  steps={steps}
  currentStep={currentStep}
  onNext={handleNext}
  onPrev={handlePrev}
  onSkip={handleSkip}
  onlast={handleLast}
  isLastStep={isLastStep}
  isDarkMode={isDarkMode}
  toggleDarkMode={toggleDarkMode}
/>
      )}
      <div className={isTutorialActive ? 'blur-sm pointer-events-none' : ''}>
        {children}  {/* Your app's content goes here */}
      </div>
      
      
     
    </>
  );
} 