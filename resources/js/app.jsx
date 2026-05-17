import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import VerifyEmail from './Pages/Auth/VerifyEmail';
import Dashboard from './Pages/Dashboard';
import SetupTenant from './Pages/Owner/SetupTenant';
import OwnerDashboard from './Pages/Owner/Dashboard';
import OwnerBilling from './Pages/Owner/Billing';
import CustomerDashboard from './Pages/Customer/Dashboard';
import AdminDashboard from './Pages/Admin/Dashboard';
import TenantHome from './Pages/Tenant/Home';
import TenantCheckout from './Pages/Tenant/Checkout';
import TenantBookingSuccess from './Pages/Tenant/BookingSuccess';
import api from './utils/api';
import { PageProvider } from './utils/inertia-compat';
import '../css/app.css';
import './bootstrap';

// Detect tenant subdomain
const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    // Modify this if your main domain prefix is different
    if (parts[0] !== 'turfbook') {
      return parts[0];
    }
  }
  return null;
};

// Route protection component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('auth_token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const subdomain = getSubdomain();

  useEffect(() => {
    // Fetch authenticated user context if token exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.get('/user')
        .then(res => {
          localStorage.setItem('user', JSON.stringify(res.data));
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f16]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Value provided for Inertia `usePage()` compatibility hook
  const pageProps = {
    props: {
      auth: { user },
      errors: {},
      flash: {},
    }
  };

  return (
    <PageProvider value={pageProps}>
      <Router>
        {subdomain ? (
          /* Tenant Subdomain SPA Routing */
          <Routes>
            <Route path="/" element={<TenantHome />} />
            <Route path="/slot/:slot/checkout" element={<ProtectedRoute><TenantCheckout /></ProtectedRoute>} />
            <Route path="/booking/:booking/success" element={<ProtectedRoute><TenantBookingSuccess /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          /* Main SaaS Platform SPA Routing */
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/owner/setup" element={<ProtectedRoute allowedRoles={['owner']}><SetupTenant /></ProtectedRoute>} />
            <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/owner/billing" element={<ProtectedRoute allowedRoles={['owner']}><OwnerBilling /></ProtectedRoute>} />
            <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Router>
    </PageProvider>
  );
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
