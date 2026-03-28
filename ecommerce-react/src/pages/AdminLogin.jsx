import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleGoogleLogin = () => {
    window.location.href = 'https://localhost:4000/auth/google/';
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin');

    if (isAdmin === 'true') {
      const verifyAdmin = async () => {
        try {
          toast.success('Welcome back, Admin!');
      
          const response = await fetch('https://localhost:4000/api/admin/givemetheroute', {
            method: 'GET',
            credentials: 'include', 
            headers: {
              'Content-Type': 'application/json',
            }
          });
      
          const res = await response.json();
      
          if (res && res.msg === 'success' && res.route) {
            navigate('https://localhost:4000'+res.route);
          } else {
            toast.error('Unauthorized access');
            setLoading(false);
          }
        } catch (error) {
          console.error('Admin verification failed:', error);
          toast.error('Authentication failed');
          setLoading(false);
        }
      };
      
      verifyAdmin();
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to access the admin dashboard</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-3 rounded-lg shadow-sm transition duration-200 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.2 32.3 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C34.5 5.6 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.6l6.6 4.8C14.1 16.1 18.7 13 24 13c3.1 0 5.9 1.2 8 3.1l6-6C34.5 5.6 29.5 3 24 3 16.3 3 9.7 7.6 6.3 14.6z"/>
            <path fill="#4CAF50" d="M24 43c5.1 0 9.7-2 13.1-5.3l-6.1-5.1C29.8 34.9 27 36 24 36c-5.1 0-9.4-3.3-11-8H6.2l-6 4.7C4.7 38.4 13.7 43 24 43z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.2 5.4-5.9 7l6.1 5.1C38.3 36.9 43 30.7 43 23c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This page is restricted to admin users only.
            <br />
            Unauthorized access attempts will be logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 