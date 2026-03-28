import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getPaymentStatus } from '../services/paymentService';
import { useSettings } from '../contexts/SettingsContext';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useSettings();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const orderId = searchParams.get('order_id') || localStorage.getItem('currentOrderId');
        
        if (!orderId) {
          setError('No order ID found');
          setStatus('error');
          return;
        }

        const response = await getPaymentStatus(orderId);
        
        if (response.statusCode === 200) {
          setPaymentDetails(response.data);
          setStatus(response.data.status);
          
          // Clear the order ID from localStorage if payment is completed
          if (response.data.isPaid) {
            localStorage.removeItem('currentOrderId');
          }
        } else {
          throw new Error(response.message || 'Failed to get payment status');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setError(error.message);
        setStatus('error');
      }
    };

    checkPaymentStatus();
    
    // Poll for status updates every 3 seconds if payment is pending
    const intervalId = setInterval(() => {
      if (status === 'pending') {
        checkPaymentStatus();
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [searchParams, status]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3">{t('checkingPaymentStatus')}</span>
          </div>
        );
      
      case 'paid':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('paymentSuccessful')}</h2>
            <p className="text-gray-600 mb-6">{t('orderConfirmed')}</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t('viewOrder')}
            </button>
          </div>
        );
      
      case 'failed':
      case 'expired':
      case 'canceled':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('paymentFailed')}</h2>
            <p className="text-gray-600 mb-6">{t('paymentFailedMessage')}</p>
            <button
              onClick={() => navigate('/cart')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t('returnToCart')}
            </button>
          </div>
        );
      
      case 'pending':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('processingPayment')}</h2>
            <p className="text-gray-600">{t('pleaseWait')}</p>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('error')}</h2>
            <p className="text-gray-600 mb-6">{error || t('generalError')}</p>
            <button
              onClick={() => navigate('/cart')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t('returnToCart')}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
        {getStatusDisplay()}
        
        {paymentDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">{t('orderNumber')}:</dt>
                <dd className="font-medium text-gray-900">{paymentDetails.orderId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t('amount')}:</dt>
                <dd className="font-medium text-gray-900">€{paymentDetails.amount}</dd>
              </div>
              {paymentDetails.method && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">{t('paymentMethod')}:</dt>
                  <dd className="font-medium text-gray-900">{paymentDetails.method}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResult; 