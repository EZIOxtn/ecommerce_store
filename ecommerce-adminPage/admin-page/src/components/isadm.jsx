import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    // If not admin, redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  // If admin, allow access
  return children;
};

export default RequireAdmin;
