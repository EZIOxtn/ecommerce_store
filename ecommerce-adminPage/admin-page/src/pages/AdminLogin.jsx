import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleGoogleLogin = () => {
    window.location.href = 'https://localhost:4000/auth/google/?admin=true';
  };

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') !== 'true') {
      setLoading(false);
      return;
    }

    const verifyAdmin = async () => {
      toast.info('Verifying as Admin...', { autoClose: 2000 });
      try {
        const response = await fetch('https://localhost:4000/api/admin/givemetheroute', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (!active) return;

        if (data?.msg === 'success' && data.route) {
          toast.success('Welcome Admin!', { autoClose: 1500 });
          navigate(data.route);
        } else {
          toast.error('Unauthorized access', { autoClose: 3000 });
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        toast.error('Verification failed', { autoClose: 3000 });
        active && setLoading(false);
      }
    };

    verifyAdmin();
    return () => { active = false; };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-300 border-t-transparent rounded-full animate-spin" />
        <ToastContainer position="top-center" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <ToastContainer position="top-center" />
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">Admin Access</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in with Google to access your admin dashboard.
          </p>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-6 h-6 mr-3" />
          <span className="text-gray-700 dark:text-gray-200 font-medium">Continue with Google</span>
        </button>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          🚫 Only admins are allowed. Unauthorized attempts will be logged.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
