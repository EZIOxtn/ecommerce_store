import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import MolliePayment from '../components/Mollie';
import PropTypes from 'prop-types';

const CartPage = ({ cart, onUpdateQuantity, onRemoveFromCart }) => {
  const { t } = useSettings();
  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);

  // Calculate subtotal, tax, and total with precision
  const taxRate = 0.21;
  const rawSubtotal = cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const subtotal = parseFloat(rawSubtotal.toFixed(2));
  const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
  const total = parseFloat((subtotal + taxAmount).toFixed(2));

  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    setIsUpdating(itemId);
    try {
      await onUpdateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm(t('confirmRemoveItem'))) {
      setIsRemoving(itemId);
      try {
        await onRemoveFromCart(itemId);
      } catch (error) {
        console.error('Failed to remove item:', error);
      } finally {
        setIsRemoving(null);
      }
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">{t('yourCartIsEmpty')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{t('browseOurProducts')}</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 transform hover:scale-105"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('shoppingCart')}</h1>
        <span className="text-gray-600 dark:text-gray-400">
          {cart.length} {cart.length === 1 ? t('item') : t('items')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md gap-4 transition duration-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/500x500?text=No+Image'; // Fallback image
                    }}
                  />
                  {item.original_price && item.price < item.original_price && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-md z-10">
                      -{Math.round(((item.original_price - item.price) / item.original_price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    {item.original_price && item.price < item.original_price && (
                      <span className="text-sm text-gray-500 line-through">
                        €{parseFloat(item.original_price).toFixed(2)}
                      </span>
                    )}
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      €{parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t('total')}: €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1">
                  <button
                    onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating === item.id}
                    className="px-2 text-lg font-bold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={t('decreaseQuantity')}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={item.quantity}
                    onChange={(e) => handleQuantityUpdate(item.id, parseInt(e.target.value, 10))}
                    className="w-12 text-center text-gray-800 dark:text-white font-medium bg-transparent border-none"
                    disabled={isUpdating === item.id}
                  />
                  <button
                    onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                    disabled={item.quantity >= 99 || isUpdating === item.id}
                    className="px-2 text-lg font-bold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={t('increaseQuantity')}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isRemoving === item.id}
                  className={`text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 text-2xl transition duration-200 ${
                    isRemoving === item.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label={t('removeItem')}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md sticky top-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('orderSummary')}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>{t('subtotal')}:</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>{t('tax')} (21%):</span>
                <span>€{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>{t('total')}:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <MolliePayment
              amount={rawSubtotal}
              currency="EUR"
              description={`Order payment - ${cart.length} items`}
              items={cart.map(item => ({ id: item.id, quantity: item.quantity }))}
              customerName={t('guest')}
              customerEmail=""
              onPaymentCreated={(data) => {
                console.log('Mollie payment initialized:', data);
                localStorage.setItem('lastOrderId', data.orderId);
              }}
              className="w-full"
            />

            <div className="mt-4">
              <Link
                to="/products"
                className="block text-center text-blue-600 dark:text-blue-400 hover:underline mt-4"
              >
                {t('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CartPage.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      original_price: PropTypes.number,
      quantity: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ),
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveFromCart: PropTypes.func.isRequired,
};

export default CartPage;
