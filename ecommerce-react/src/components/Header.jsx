import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, Settings, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function Header({ cartItemsCount = 0, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);
  const searchPanelRef = useRef(null);
  const { t } = useSettings();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartItemsCount > 0) {
      setIsCartUpdated(true);
      const timer = setTimeout(() => setIsCartUpdated(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle category dropdown
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      // Handle search panel in mobile
      if (searchPanelRef.current && 
          !searchPanelRef.current.contains(event.target) && 
          !event.target.closest('[data-search-toggle]')) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.({ query: searchQuery, category });
    setIsSearchOpen(false);
    setIsCategoryOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isCategoryOpen) {
      setIsCategoryOpen(false);
    }
  };

  const toggleCategory = (e) => {
    e.stopPropagation();
    setIsCategoryOpen(!isCategoryOpen);
  };

  const categories = [
    { value: 'all', label: t('allCategories') },
    { value: 'audio', label: t('audio') },
    { value: 'wearables', label: t('wearables') },
    { value: 'cameras', label: t('cameras') },
    { value: 'gaming', label: t('gaming') },
  ];

  const handleCategorySelect = (value) => {
    navigate(`/category/${category.toLowerCase()}`);
    setCategory(value);
    setIsCategoryOpen(false);
    
    // Redirect to products page with category param
    if (value === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${value}`);
    }
  };

  return (
    <header  id="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg' 
          : 'bg-white dark:bg-gray-800'
      }`}
    >
      <div className="container mx-auto">
        <nav className="px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 dark:bg-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base md:text-xl">TS</span>
              </div>
              <span className="text-lg md:text-xl font-bold text-blue-500 dark:text-blue-400 hidden sm:inline">
                TechStore
              </span>
            </Link>

            {/* Mobile Search Toggle */}
            <button
              data-search-toggle
              onClick={toggleSearch}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Search Section - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                      dark:focus:ring-blue-400"
                  />
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                
                {/* Categories Dropdown */}
                <div className="relative" ref={categoryRef}>
                  <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 
                      dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <span className="text-gray-700 dark:text-gray-200">{categories.find(cat => cat.value === category)?.label}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200
                      ${isCategoryOpen ? 'transform rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border
                    border-gray-100 dark:border-gray-700 backdrop-blur-sm backdrop-filter
                    transition-all duration-200 transform origin-top
                    ${isCategoryOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                    z-50`}
                  >
                    <div className="py-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => handleCategorySelect(cat.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                            transition-colors duration-200
                            ${category === cat.value ? 'text-blue-500 dark:text-blue-400 font-medium' : 
                              'text-gray-700 dark:text-gray-300'}`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Navigation Links */}
            <div className="flex items-center gap-2 md:gap-8 rtl:space-x-reverse">
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-8">
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400
                    font-medium transition-colors duration-200"
                >
                  {t('home')}
                </Link>
                <Link 
                  to="/products"
                  className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400
                    font-medium transition-colors duration-200"
                >
                  {t('products')}
                </Link>
                <Link 
                  to="/settings"
                  className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400
                    font-medium transition-colors duration-200"
                >
                  <Settings className="h-5 w-5 inline-block mr-2" />
                  {t('settings')}
                </Link>
              </div>

              <Link 
                to="/cart" 
                className="relative p-2 text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <div id="cart-icon-container" className="relative w-6 h-6 md:w-7 md:h-7 flex items-center justify-center">
                  <ShoppingCart id="cart-button" className="h-5 w-5 md:h-6 md:w-6" />
                  {cartItemsCount > 0 && (
                    <span 
                      className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5
                        flex items-center justify-center transform transition-transform duration-300
                        ${isCartUpdated ? 'scale-125' : 'scale-100'}`}
                    >
                      {cartItemsCount}
                    </span>
                  )}
                </div>
              </Link>
              
              <Link 
              id="account-button"
              
                to="/account" 
                className="p-2 text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
              >
                {localStorage.getItem('user_photo_base64') ? (
        <img
          src={localStorage.getItem('user_photo_base64')}
          alt="User"
          className="h-5 w-5 md:h-6 md:w-6 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <User className="h-5 w-5 md:h-6 md:w-6" />
      )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Panel */}
          <div 
            ref={searchPanelRef}
            className={`md:hidden overflow-visible transition-all duration-300 absolute left-0 right-0 px-4 bg-white dark:bg-gray-800 shadow-lg
              ${isSearchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
              z-50`}
          >
            <form onSubmit={handleSearch} className="flex flex-col gap-2 py-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                    dark:focus:ring-blue-400"
                />
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              
              {/* Mobile Categories Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleCategory}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700
                    border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
                    transition-colors duration-200"
                >
                  <span className="text-gray-700 dark:text-gray-200">
                    {categories.find(cat => cat.value === category)?.label}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200
                    ${isCategoryOpen ? 'transform rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                  border border-gray-100 dark:border-gray-700 transition-all duration-200
                  ${isCategoryOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                  z-[60]`}
                >
                  <div className="py-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategorySelect(cat.value)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                          transition-colors duration-200
                          ${category === cat.value ? 'text-blue-500 dark:text-blue-400 font-medium bg-gray-50 dark:bg-gray-700/50' : 
                            'text-gray-700 dark:text-gray-300'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                  transition-colors duration-200 text-sm font-medium"
              >
                {t('search')}
              </button>
            </form>
          </div>
        </nav>
      </div>
    </header>
  );
} 