import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Heart } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

// Animation utility function
const createCartAnimation = (sourceElement, imageUrl) => {
  return new Promise((resolve) => {
    if (!sourceElement) {
      resolve();
      return;
    }

    // Get the source image position
    const imageRect = sourceElement.getBoundingClientRect();
    
    // Get the cart icon position
    const cartIcon = document.getElementById('cart-icon-container');
    if (!cartIcon) {
      resolve();
      return;
    }
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Create floating element
    const floatingImg = document.createElement('div');
    floatingImg.style.position = 'fixed';
    floatingImg.style.zIndex = '9999';
    floatingImg.style.pointerEvents = 'none';
    floatingImg.style.width = '50px';
    floatingImg.style.height = '50px';
    floatingImg.style.borderRadius = '50%';
    floatingImg.style.backgroundImage = `url(${imageUrl})`;
    floatingImg.style.backgroundSize = 'cover';
    floatingImg.style.backgroundPosition = 'center';
    floatingImg.style.left = `${imageRect.left + imageRect.width/2 - 25}px`;
    floatingImg.style.top = `${imageRect.top + imageRect.height/2 - 25}px`;
    
    // Calculate the distance to travel
    const deltaX = (cartRect.left + cartRect.width/2) - (imageRect.left + imageRect.width/2);
    const deltaY = (cartRect.top + cartRect.height/2) - (imageRect.top + imageRect.height/2);
    
    // Add animation class with custom properties
    floatingImg.style.setProperty('--target-x', `${deltaX}px`);
    floatingImg.style.setProperty('--target-y', `${deltaY}px`);
    floatingImg.className = 'floating-cart-animation';
    
    // Add the element to body
    document.body.appendChild(floatingImg);

    // Clean up and resolve
    setTimeout(() => {
      document.body.removeChild(floatingImg);
      resolve();
    }, 1000);
  });
};

// Add onAddToCart button in ProductCard itself to handle cart functionality
export default function ProductCard({ product, loading = false, onAddToCart }) {
  const { t } = useSettings();
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef();
  const buttonRef = useRef();

  const handleAddToCart = async (e) => {
    // Prevent any default behavior
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding || showAddedMessage) return;
    
    setIsAdding(true);
    setShowAnimation(true);
    
    try {
      // Get the product image element
      const productImage = cardRef.current.querySelector('img');
      
      // Create and play the animation
      await createCartAnimation(productImage, product.image);
      
      // Call onAddToCart and wait for it to complete
      if (typeof onAddToCart === 'function') {
        await onAddToCart(product);
      } else {
        console.error('onAddToCart is not a function');
        throw new Error('onAddToCart is not a function');
      }
      
      setShowAddedMessage(true);
      
      // Reset after animation
      setTimeout(() => {
        setShowAddedMessage(false);
        setShowAnimation(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setShowAnimation(false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem('favourite') || '[]');
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(favProduct => favProduct.id !== product.id);
    } else {
      updatedFavorites = [...favorites, product];
    }

    localStorage.setItem('favourite', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setIsTutorialActive(true);
    }
    const favorites = JSON.parse(localStorage.getItem('favourite') || '[]');
    setIsFavorite(favorites.some(favProduct => favProduct.id === product.id));
  }, [product.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading || !isVisible) {
    return (
      <div
        ref={cardRef}
        className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[180px] md:max-w-[240px] flex flex-col"
      >
        <div className="aspect-[4/3] bg-gray-200" />
        <div className="p-3 flex flex-col gap-2 flex-grow">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-2/3" />
          <div className="h-4 bg-gray-400 rounded w-1/2 mt-auto" />
        </div>
        <div className="p-3 pt-0">
          <div className="h-8 bg-gray-300 rounded" />
        </div>
      </div>
    );
  }

  const hasDiscount =
    Number(product.original_price) &&
    Number(product.price) < Number(product.original_price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.original_price) - Number(product.price)) /
          Number(product.original_price)) *
          100
      )
    : 0;

  const isExclusive = product.is_exclusive;

  return (
    <div
      ref={cardRef}
      id="product-card"
      className={`relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full h-full min-h-[300px] flex flex-col product-card
        ${isExclusive ? 'glow-border' : ''}`}
    >
      <Link 
        to={`/product/${product.id}`} 
        className="flex flex-col flex-grow"
        onClick={(e) => {
          // If clicking the button, prevent navigation
          if (e.target.closest('button')) {
            e.preventDefault();
          }
        }}
      >
        <div className="relative pt-[60%]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/500x500?text=No+Image';
            }}
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-md z-10">
              -{discountPercent}%
            </div>
          )}
          {isExclusive && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-md z-10">
              EXCLUSIVE
            </div>
          )}
        </div>

        <div className="p-2 md:p-3 flex flex-col flex-grow">
          <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2 hidden md:block">
            {product.shortDescription}
          </p>

          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs text-gray-700 font-medium">
              {parseFloat(product.rating).toFixed(2)}
            </span>
            {[1, 2, 3, 4, 5].map((star) => {
              const fill =
                product.rating >= star
                  ? 'text-yellow-400'
                  : product.rating >= star - 0.5
                  ? 'text-yellow-400 opacity-50'
                  : 'text-gray-300';
              return (
                <Star
                  key={star}
                  className={`h-3 w-3 md:h-4 md:w-4 ${fill} fill-current`}
                />
              );
            })}
          </div>

          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-gray-500 line-through mb-0.5">
                ${parseFloat(product.original_price).toFixed(2)}
              </span>
            )}
            <span className="text-xs md:text-sm font-bold text-gray-900">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-2 md:p-3 pt-0 flex flex-col items-end">
        <button 
            onClick={(e) => handleToggleFavorite(e)}
            className={`p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-all duration-300 z-10 mb-2
              ${isFavorite ? 'text-red-500 transform scale-110' : 'text-gray-400'}
            `}
            aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
          >
            <Heart size={20} className={`${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <button
          ref={buttonRef}
          onClick={handleAddToCart}
          disabled={isAdding || showAddedMessage}
          className={`
            w-full
            ${showAddedMessage ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
            text-white
            px-4
            py-2
            rounded-md
            text-sm
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            transition-all
            duration-300
            select-none
            disabled:opacity-50
            disabled:cursor-not-allowed
            transform
            ${showAnimation ? 'scale-105' : 'scale-100'}
            ${showAddedMessage ? 'animate-success' : ''}
          `}
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : showAddedMessage ? (
            <>
              <Check size={20} className="animate-bounce" />
              <span className="animate-fade-in">{t('addedToCart')}</span>
            </>
          ) : (
            <>
              <ShoppingCart size={20} className={showAnimation ? 'animate-wiggle' : ''} />
              {t('addToCart')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
