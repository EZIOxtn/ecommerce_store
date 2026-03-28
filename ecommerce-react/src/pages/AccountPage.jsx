import React, { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import {
  User,
  Package,
  Heart,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  ChevronRight,
  ShoppingCart,
  Check
} from 'lucide-react';
import {getinfoord, getuser, logout } from '../data/products';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Colors } from 'chart.js';

export default function AccountPage({ onAddToCart }) {
  const { t } = useSettings();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const handleLogout = async () => {
    const result = await logout();
    console.log('Logout result:', result);
    if (result?.success !== false) {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('google_id');
      localStorage.removeItem('user_photo_base64');
      toast.success('You have been logged out');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      toast.error('Logout failed. Please try again.');
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favourite') || '[]');
    setWishlistItems(storedFavorites);
  }, []);

  const handleRemoveFromWishlist = (productId) => {
    const updatedFavorites = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedFavorites);
    localStorage.setItem('favourite', JSON.stringify(updatedFavorites));
    toast.success('Item removed from wishlist!');
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
  
      const fallbackPhotos = [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
      ];
  
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
  
      async function getBase64FromUrl(imageUrl) {
        try {
          console.log('Trying main image URL:', imageUrl);
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error('Image fetch failed');
          const blob = await response.blob();
          return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.warn('Failed to convert main image to base64:', err);
          return null;
        }
      }
  
      function getRandomFallbackUrl() {
        return fallbackPhotos[Math.floor(Math.random() * fallbackPhotos.length)];
      }
  
      if (token || !token) {

        const result = await getuser();
  
        if (result.success) {
          // Check localStorage for cached photo base64
          let cachedPhoto = localStorage.getItem('user_photo_base64');
  
          if (cachedPhoto) {
            result.user.photo = cachedPhoto;
          } else {
            // Try to convert main photo to base64 and cache it
            const base64Photo = await getBase64FromUrl(result.user.photo);
            if (base64Photo) {
              localStorage.setItem('user_photo_base64', base64Photo);
              result.user.photo = base64Photo;
            } else {
              
              result.user.photo = getRandomFallbackUrl();
            }
          }
  
          setUser(result.user);
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');

          // Fetching orders using getinfoord
          try {
            const fetchedOrders = await getinfoord(result.endpoint? result.endpoint: '/test'); // Assuming '/orders' is the correct path for orders
            setOrders(fetchedOrders);
          } catch (orderError) {
            console.error('Error fetching orders:', orderError);
            setOrders([]); // Set to empty array on error
          }

        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
        }
      } else {
        const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (storedLoggedIn) {
          setIsLoggedIn(true);
          const storedGoogleId = localStorage.getItem('google_id');
  
          if (storedGoogleId) {
            const result = await getuser();
  
            if (result.success) {
              let storedBase64Photo = localStorage.getItem('user_photo_base64');
              if (storedBase64Photo) {
                result.user.photo = storedBase64Photo;
              } else {
                const base64Photo = await getBase64FromUrl(result.user.photo);
                if (base64Photo) {
                  localStorage.setItem('user_photo_base64', base64Photo);
                  result.user.photo = base64Photo;
                } else {
                  result.user.photo = getRandomFallbackUrl();
                }
              }
              setUser(result.user);
              // Fetching orders using getinfoord
              try {
                const fetchedOrders = await getinfoord(result.endpoint? result.endpoint : '/no'); // Assuming '/orders' is the correct path for orders
                setOrders(fetchedOrders);
              } catch (orderError) {
                console.error('Error fetching orders (stored login):', orderError);
                setOrders([]); 
              }
            } else {
              setIsLoggedIn(false);
              localStorage.removeItem('isLoggedIn');
              setUser(null);
            }
          }
        }
      }
  
      setLoading(false);
    };
  
    fetchUser();
  }, []);
  
  

  const menuItems = [
    { icon: Package, label: t('myOrders'), count: orders.length },
    { icon: Heart, label: t('wishlist'), count: wishlistItems.length },
    { icon: CreditCard, label: t('paymentMethods'), count: 2 },
    { icon: MapPin, label: t('addresses'), count: 4 },
    { icon: Bell, label: t('notifications'), count: 5 },
  ];

  const handleGoogleLogin = () => {
    window.location.href = 'https://localhost:4000/auth/google/';
  };

  const Skeleton = ({ width = '100%', height = '1rem', rounded = false }) => (
    <div style={{ width, height }} className={`bg-gray-300 dark:bg-gray-700 animate-pulse ${rounded ? 'rounded-full' : 'rounded-md'}`} />
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center space-y-4 px-4">
        <Skeleton width="6rem" height="6rem" rounded={true} />
        <Skeleton width="12rem" height="1.5rem" />
        <Skeleton width="8rem" height="1rem" />
        <Skeleton width="10rem" height="2.5rem" rounded />
      </div>
    );
  }

  const NotLoggedInView = () => (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <User className="w-16 h-16 text-primary dark:text-primary-light mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{t('loginmsg')}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('loginundermsg')}</p>
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow flex items-center space-x-3"
      >
        {/* Google Icon SVG */}
        <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.2 32.3 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C34.5 5.6 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"/>
          <path fill="#FF3D00" d="M6.3 14.6l6.6 4.8C14.1 16.1 18.7 13 24 13c3.1 0 5.9 1.2 8 3.1l6-6C34.5 5.6 29.5 3 24 3 16.3 3 9.7 7.6 6.3 14.6z"/>
          <path fill="#4CAF50" d="M24 43c5.1 0 9.7-2 13.1-5.3l-6.1-5.1C29.8 34.9 27 36 24 36c-5.1 0-9.4-3.3-11-8H6.2l-6 4.7C4.7 38.4 13.7 43 24 43z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.2 5.4-5.9 7l6.1 5.1C38.3 36.9 43 30.7 43 23c0-1.3-.1-2.7-.4-4z"/>
        </svg>
        <span>{t('logingoogle')}</span>
      </button>
    </div>
  );

  const AccountContent = () => (
    <div className="container mx-auto px-4 py-8">
      {/* Unified single-column layout for both mobile and desktop */}
      <div className="space-y-8"> {/* Use space-y to stack sections vertically */}
        {/* User Info and Menu Items Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex flex-col items-center border-b pb-6 border-gray-200 dark:border-gray-700">
            <img
              id="user-photo-mobile"
              className="w-16 h-16 rounded-full object-cover"
              src={user?.photo || 'https://i.pravatar.cc/150?img=0'}
              alt="User Photo"
              loading="lazy"
            />
          </div>
          <h2 id="username" className="text-lg font-bold text-gray-800 dark:text-white text-center mt-4">
            {user?.displayName || 'John Doe'}
          </h2>
          <p id="email" className="text-gray-500 dark:text-gray-400 text-center mb-6">
            {user?.email || 'john@example.com'}
          </p>
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={index === 0 
                  ? () => document.getElementById('orders-section')?.scrollIntoView({ behavior: 'smooth' })
                  : index === 1 
                  ? () => document.getElementById('wishlist-section')?.scrollIntoView({ behavior: 'smooth' })
                  : undefined
                }
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 rtl:rotate-180" />
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex justify-between items-center p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition mt-4"
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <LogOut className="w-5 h-5" />
                <span>{t('logout')}</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Orders Section */}
        <div id="orders-section" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
    {t('recentOrders')}
  </h3>

  {orders.length > 0 ? (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Order #{order.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
              }`}
            >
              {order.status}
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Total:&nbsp;
            <span className="font-semibold text-gray-900 dark:text-white">
              ${parseFloat(order.total_amount).toFixed(2)}
            </span>
          </p>

          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 pl-5 list-disc">
            {order.items.map((item) => (
              <li key={item.product_id}>
                <span className="font-medium">{item.quantity} × {item.name}</span>&nbsp;—&nbsp;
                ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>

          <button
            className="mt-4 inline-flex items-center text-sm font-medium text-primary dark:text-primary-light hover:underline focus:outline-none"
            aria-label={`View details of order #${order.id}`}
          >
            {t('viewDetails')}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 dark:text-gray-400 text-sm">{t('noOrders')}</p>
  )}
</div>


        {/* Placeholder for Wishlist Section */}
        <div id="wishlist-section" className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{t('wishlist')}</h3>
          {wishlistItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistItems.map((product) => (
                <WishlistItem
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return isLoggedIn ? <AccountContent /> : <NotLoggedInView />;
}

// New WishlistItem component
function WishlistItem({ product, onAddToCart, onRemoveFromWishlist, t }) {
  const [isAdding, setIsAdding] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || showAddedMessage) return;

    setIsAdding(true);

    try {
      if (typeof onAddToCart === 'function') {
        await onAddToCart(product);
      } else {
        console.error('onAddToCart is not a function in WishlistItem');
        throw new Error('onAddToCart is not a function');
      }

      setShowAddedMessage(true);
    } catch (error) {
      console.error('Failed to add to cart from wishlist:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col">
      <Link 
        to={`/product/${product.id}`} 
        className="flex flex-col flex-grow"
        onClick={(e) => {
          if (e.target.closest('button')) {
            e.preventDefault();
          }
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/500x500?text=No+Image';
          }}
        />
        <div className="p-3 flex-grow">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1">{product.name}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">${parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
      <div className="p-3 pt-0 flex justify-between gap-2">
        <button
          onClick={handleAddToCartClick}
          disabled={isAdding || showAddedMessage}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors
            ${showAddedMessage ? 'bg-green-500 text-white cursor-not-allowed'
             : isAdding ? 'bg-blue-400 text-white opacity-50 cursor-not-allowed'
             : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {isAdding ? (
            <span className="flex items-center justify-center"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>{t('addingToCart') || 'Adding...'}</span>
          ) : showAddedMessage ? (
            <>
              <Check size={20} className="inline-block mr-1" />
              <span className="inline-block">{t('addedToCart')}</span>
            </>
          ) : (
            <>
              <ShoppingCart size={20} className="inline-block mr-1" />
              {t('addToCart')}
            </>
          )}
        </button>
        <button
          onClick={() => onRemoveFromWishlist(product.id)}
          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

