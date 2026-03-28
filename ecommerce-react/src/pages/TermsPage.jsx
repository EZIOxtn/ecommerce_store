import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function TermsPage() {
  const { isDarkMode, t } = useSettings();  // Assuming SettingsContext provides isDarkMode and t for translations

  return (
    <div className={`container mx-auto px-4 py-8 pt-20 ${isDarkMode ? 'dark' : ''}`}>
      <div className={`max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ${isDarkMode ? 'dark:text-gray-200' : 'text-gray-800'}`}>
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">Last updated: [Insert Date]</p>
        
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our app.</p>
        
        <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
        <p className="mb-4">You agree to use our services only for lawful purposes and in accordance with these terms. You are responsible for any content you submit and must not violate any applicable laws or third-party rights.</p>
        
        <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
        <p className="mb-4">All content and materials provided through our app are the property of [Your Company Name] or its licensors. You may not use, reproduce, or distribute them without permission.</p>
        
        <h2 className="text-2xl font-semibold mb-4">4. Termination</h2>
        <p className="mb-4">We reserve the right to terminate or suspend your access to our services at any time, without notice, for conduct that we believe violates these terms or is harmful to other users.</p>
        
        <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
        <p className="mb-4">To the fullest extent permitted by law, [Your Company Name] shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.</p>
        
        <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
        <p className="mb-4">We may update these terms periodically. Continued use of our services after changes are made constitutes your acceptance of the new terms.</p>
        
        <p className="mt-6 text-sm">If you have any questions, please contact us at terms@yourecommerceapp.com.</p>
      </div>
    </div>
  );
} 