import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import shieldIcon from '../assets/shield.png';
import paymentIcon from '../assets/payment-protection.png';
import supportIcon from '../assets/customer-support.png';
import deliveryIcon from '../assets/courier.png';

export default function Footer() {
  const { t } = useSettings();

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
  ];

  const footerLinks = [
    { title: t('aboutUs'), href: '/about' },
    { title: t('contact'), href: '/contact' },
    { title: t('privacyPolicy'), href: '/privacy' },
    { title: t('termsOfService'), href: '/terms' },
  ];

  const infoCards = [
    {
      label: '100% ' + t('securityTitle'),
      icon: shieldIcon,
      description: t('securitymsg'),
    },
    {
      label: t('paymentTitle'),
      icon: paymentIcon,
      description: t('paymentmsg'),
    },
    {
      label: t('supportTitle'),
      icon: supportIcon,
      description: t('supportmsg'),
    },
    {
      label: t('deliveryTitle'),
      icon: deliveryIcon,
      description: t('deliverymsg'),
    },
  ];

  return (
    <footer className="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 py-12 mt-auto transition-colors duration-500">
      {/* Info Squares */}
      <div className="flex justify-center mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full px-4">
          {infoCards.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 text-center rounded-xl p-6 flex flex-col items-center shadow-lg w-full h-60 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <img
                src={item.icon}
                alt={item.label}
                loading="lazy"
                className="w-12 h-12 mb-3 object-contain dark:invert"
              />
              <div className="text-base font-semibold mb-2 text-gray-800 dark:text-white">
                {item.label}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Sections */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-black dark:text-white">TechStore</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('storeDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black dark:text-white">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black dark:text-white">
              {t('contactUs')}
            </h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Email: support@techstore.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Tech Street, Digital City</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black dark:text-white">
              {t('followUs')}
            </h4>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} TechStore. {t('allRightsReserved')}
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400">
              <a href="/privacy" className="hover:text-black dark:hover:text-white transition-colors duration-200">
                {t('privacy')}
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-black dark:hover:text-white transition-colors duration-200">
                {t('terms')}
              </a>
              <span>•</span>
              <a href="/sitemap" className="hover:text-black dark:hover:text-white transition-colors duration-200">
                {t('sitemap')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
