import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';
import OnboardingTutorial from './components/OnboardingTutorial';
import { SettingsProvider } from './contexts/SettingsContext';
import './index.css';
import AdminLogin from './pages/AdminLogin';


const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const InternalErrorPage = lazy(() => import('./pages/InternalErrorPage'));
const Administrator = lazy(() => import('./pages/AdminLogin'));

function AnimatedRoutes({ cart, addToCart, updateQuantity, removeFromCart }) {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [renderPage, setRenderPage] = useState(true);
  const [sessionError, setSessionError] = useState(null);
  useEffect(() => {
    if (location.pathname !== currentPath) {
      setRenderPage(false);
      const timeout = setTimeout(() => {
        setCurrentPath(location.pathname);
        setRenderPage(true);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [location, currentPath]);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        

        const res = await fetch('https://localhost:4000/api/session/getSessionToken', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Token fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        if (!data.token) {
          throw new Error('Response missing token');
        }

        sessionStorage.setItem('session_token', data.token);
        sessionStorage.setItem('session_token_time', Date.now().toString());
        setSessionError(null);
      } catch (err) {
        console.error('Error fetching session token:', err);
        setSessionError('Unable to verify your session. Please try again or refresh.');
      }
    };

    fetchToken();
  }, []);


  return (
    <div className={`transition-opacity duration-300 ${renderPage ? 'opacity-100' : 'opacity-0'}`}>
      <Suspense fallback={
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
  </div>
}>

        <Routes location={{ pathname: currentPath }}>
          <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
          <Route path="/products" element={<ProductsPage onAddToCart={addToCart} />} />
          <Route path="/category/:categoryName" element={<ProductsPage onAddToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetailPage onAddToCart={addToCart} />} />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
              />
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/account" element={<AccountPage onAddToCart={addToCart} />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin" element={<Administrator />} />
          <Route path="/500" element={<InternalErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
          
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  return (
    <SettingsProvider>
      <Router>
        <OnboardingTutorial>
          <div className="min-h-screen flex flex-col">
            <Header cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
            <main className="flex-1 w-full pt-[60px] md:pt-[72px] overflow-hidden">
              <AnimatedRoutes
                cart={cart}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            </main>
            <Footer />
            <BottomNavigation className="md:hidden" />
          </div>
        </OnboardingTutorial>
      </Router>
    </SettingsProvider>
  );
}
