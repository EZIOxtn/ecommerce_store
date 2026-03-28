import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
// import {Home} from './pages/Home'; // Commenting out as Home page was not requested
// import {About} from './pages/About'; // Commenting out as About page was not requested
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import RequireAdmin from './components/RequireAdmin.jsx';
import './App.css';

function App() {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            {/* Add a link to admin login */}
            <li><Link to="/admin/login">Admin Login</Link></li>
          </ul>
        </nav>

        <Routes>
          {/* ✅ Redirect root ("/") to Admin Login */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Admin login and dashboard */}
          <Route path="/admin/login" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }/>

          {/* Optional public routes (if needed later) */}
          {/* <Route path="/home" element={<Home />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
