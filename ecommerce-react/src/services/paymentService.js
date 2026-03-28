import axios from 'axios';

const API_BASE_URL =  'https://localhost:4000';

export const createPayment = async ({
  orderId,
  amount,
  description,
  items,
  customerName,
  customerEmail
}) => {
  try {
    
    const response = await axios.post(`${API_BASE_URL}/api/payments`, {
      orderId,
      amount,
      description,
      items,
      customerName,
      customerEmail
    }, {
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Payment creation failed');
    }
    throw new Error('Network error while creating payment');
  }
};

export const getPaymentStatus = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/status/${orderId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Failed to get payment status');
    }
    throw new Error('Network error while checking payment status');
  }
};

export const getPaymentMethods = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/methods`);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Failed to get payment methods');
    }
    throw new Error('Network error while fetching payment methods');
  }
}; 