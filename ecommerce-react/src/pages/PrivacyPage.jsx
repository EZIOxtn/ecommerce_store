import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function PrivacyPage() {
  const { isDarkMode, t } = useSettings();  // Assuming SettingsContext provides isDarkMode and t for translations

  return (
    <div className={`container mx-auto px-4 py-8 pt-20 ${isDarkMode ? 'dark' : ''}`}>
      <div className={`max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ${isDarkMode ? 'dark:text-gray-200' : 'text-gray-800'}`}>
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Last updated: [Insert Date]</p>
        
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">We collect information you provide directly, such as when you create an account or leave a comment. This may include your name, email address, and other details. We also automatically collect data about your device and usage for analytics purposes.</p>
        
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">Your information is used to provide and improve our services, process transactions, and communicate with you. We may also use it for personalized advertising and to comply with legal obligations.</p>
        
        <h2 className="text-2xl font-semibold mb-4">3. Data Sharing and Disclosure</h2>
        <p className="mb-4">We do not sell your personal data. However, we may share it with third-party service providers for specific purposes, such as payment processing or analytics, and as required by law.</p>
        
        <h2 className="text-2xl font-semibold mb-4">4. Your Rights and Choices</h2>
        <p className="mb-4">You have the right to access, update, or delete your information. You can also opt-out of marketing communications. For more details, contact us at [Insert Contact Email].</p>
        
        <h2 className="text-2xl font-semibold mb-4">5. Security</h2>
        <p className="mb-4">We implement appropriate security measures to protect your data, but no method is 100% secure. We encourage you to use strong passwords and be cautious with your information.</p>
        
        <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
        <p className="mb-4">We may update this privacy policy periodically. We will notify you of any changes by posting the new policy on this page.</p>
        
        <p className="mt-6 text-sm">If you have any questions, please contact us at privacy@yourecommerceapp.com.</p>
      </div>
    </div>
  );
} 