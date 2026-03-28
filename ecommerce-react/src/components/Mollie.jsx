import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPayment, getPaymentMethods } from '../services/paymentService';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const MolliePayment = ({ 
  amount, 
  currency = 'EUR', 
  description, 
  items,
  customerName,
  customerEmail,
  onPaymentCreated,
  className 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await getPaymentMethods();
        if (response.data) {
          setPaymentMethods(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Generate a unique order ID
      const orderId = `order-${uuidv4()}-${Date.now()}`;

      const paymentData = {
        orderId,
        amount: parseFloat(amount).toFixed(2),
        description,
        items: items || [],
        customerName,
        customerEmail
      };

      const response = await createPayment(paymentData);

      if (response.statusCode === 200 && response.data?.paymentUrl) {
        // Call the callback if provided
        if (onPaymentCreated) {
          onPaymentCreated(response.data);
        }

        // Store order info in localStorage for status checking
        localStorage.setItem('currentOrderId', orderId);
        
        // Redirect to Mollie checkout
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.message || 'Payment initialization failed');
      }
    } catch (error) {
      setError(error.message);
      console.error('Payment creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
          transition duration-200 transform hover:scale-105`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          'Pay Now'
        )}
      </button>

      {paymentMethods.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available payment methods:</p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map(method => (
              <span
                key={method.id}
                className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded"
              >
                {method.description}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

MolliePayment.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string,
  description: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  customerName: PropTypes.string,
  customerEmail: PropTypes.string,
  onPaymentCreated: PropTypes.func,
  className: PropTypes.string,
};

export default MolliePayment;
