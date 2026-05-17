import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
import { PageProvider, usePage } from './utils/inertia-compat';
import '../css/app.css';
import './bootstrap';

// Detect tenant subdomain
const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    if (parts[0] !== 'turfbook') {
      return parts[0];
    }
  }
  return null;
};

// Detect dynamic basename for subfolder hosting (e.g. XAMPP)
const getBasename = () => {
  if (window.APP_URL) {
    try {
      const url = new URL(window.APP_URL);
      const pathname = url.pathname.replace(/\/$/, '');
      return pathname;
    } catch (e) {
      return '';
    }
  }
  return '';
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

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0a0f16]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

// General Page Wrapper to inject Inertia compatibility props
const Page = ({ component: Component, extraProps = {} }) => {
  const { props } = usePage();
  return <Component {...props} {...extraProps} />;
};

// Wrapper for Welcome page
function WelcomeWrapper() {
  const [data, setData] = useState({ tenants: [], plans: [] });
  const [loading, setLoading] = useState(true);
  const { props } = usePage();

  useEffect(() => {
    api.get('/tenants-active')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return <Welcome {...props} tenants={data.tenants} plans={data.plans} />;
}

// Wrapper for Register page
function RegisterWrapper() {
  const [data, setData] = useState({ tenants: [], plans: [] });
  const [loading, setLoading] = useState(true);
  const { props } = usePage();

  useEffect(() => {
    api.get('/tenants-active')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return <Register {...props} tenants={data.tenants} plans={data.plans} />;
}

// Wrapper for TenantHome page
function TenantHomeWrapper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { props } = usePage();

  useEffect(() => {
    api.get('/details')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <TenantHome
      {...props}
      tenant={data?.tenant || {}}
      turfs={data?.turfs || []}
    />
  );
}

// Wrapper for TenantCheckout page
function TenantCheckoutWrapper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { props } = usePage();
  const { slot } = useParams();

  useEffect(() => {
    api.get(`/slot/${slot}/checkout`)
      .then(res => {
        // Inertia response contains properties in .props
        const responseData = res.data.props || res.data;
        setData(responseData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slot]);

  if (loading) return <LoadingSpinner />;

  return (
    <TenantCheckout
      {...props}
      tenant={data?.tenant || {}}
      slot={data?.slot || {}}
      razorpayOrder={data?.razorpayOrder || {}}
      razorpayKeyId={data?.razorpayKeyId || ''}
    />
  );
}

// Wrapper for TenantBookingSuccess page
function TenantBookingSuccessWrapper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { props } = usePage();
  const { booking } = useParams();

  useEffect(() => {
    api.get(`/booking/${booking}/success`)
      .then(res => {
        const responseData = res.data.props || res.data;
        setData(responseData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [booking]);

  if (loading) return <LoadingSpinner />;

  return (
    <TenantBookingSuccess
      {...props}
      booking={data?.booking || {}}
      tenant={data?.tenant || {}}
    />
  );
}

// Wrapper for OwnerDashboard page
function OwnerDashboardWrapper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { props } = usePage();

  useEffect(() => {
    api.get('/owner/dashboard-data')
      .then(res => {
        const responseData = res.data.props || res.data;
        setData(responseData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <OwnerDashboard
      {...props}
      tenant={data?.tenant || {}}
      bookings={data?.bookings || []}
      customers={data?.customers || []}
      payments={data?.payments || []}
      initialTab="dashboard"
    />
  );
}

// Wrapper for OwnerBilling page
function OwnerBillingWrapper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { props } = usePage();

  useEffect(() => {
    api.get('/owner/billing')
      .then(res => {
        const responseData = res.data.props || res.data;
        setData(responseData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <OwnerBilling
      {...props}
      plans={data?.plans || []}
      currentSubscription={data?.currentSubscription || null}
      tenant={data?.tenant || {}}
    />
  );
}

// Wrapper for CustomerDashboard page
function CustomerDashboardWrapper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { props } = usePage();

  useEffect(() => {
    api.get('/customer/dashboard-data')
      .then(res => {
        const responseData = res.data.props || res.data;
        setData(responseData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <CustomerDashboard
      {...props}
      bookings={data?.bookings || []}
    />
  );
}

// Wrapper for AdminDashboard page
function AdminDashboardWrapper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { props } = usePage();

  useEffect(() => {
    api.get('/admin/dashboard-data')
      .then(res => {
        const responseData = res.data.props || res.data;
        setData(responseData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <AdminDashboard
      {...props}
      platformStats={data?.platformStats || {}}
      tenants={data?.tenants || []}
      revenueData={data?.revenueData || []}
      globalConfig={data?.globalConfig || {}}
      initialTab="overview"
    />
  );
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const subdomain = getSubdomain();

  useEffect(() => {
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

  if (loading) return <LoadingSpinner />;

  const pageProps = {
    props: {
      auth: { user },
      errors: {},
      flash: {},
    }
  };

  return (
    <PageProvider value={pageProps}>
      <Router basename={getBasename()}>
        {subdomain ? (
          /* Tenant Subdomain SPA Routing */
          <Routes>
            <Route path="/" element={<TenantHomeWrapper />} />
            <Route path="/slot/:slot/checkout" element={<ProtectedRoute><TenantCheckoutWrapper /></ProtectedRoute>} />
            <Route path="/booking/:booking/success" element={<ProtectedRoute><TenantBookingSuccessWrapper /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          /* Main SaaS Platform SPA Routing */
          <Routes>
            <Route path="/" element={<WelcomeWrapper />} />
            <Route path="/login" element={<Page component={Login} />} />
            <Route path="/register" element={<RegisterWrapper />} />
            <Route path="/forgot-password" element={<Page component={ForgotPassword} />} />
            <Route path="/reset-password/:token" element={<Page component={ResetPassword} />} />
            <Route path="/verify-email" element={<Page component={VerifyEmail} />} />

            <Route path="/dashboard" element={<ProtectedRoute><Page component={Dashboard} /></ProtectedRoute>} />
            <Route path="/owner/setup" element={<ProtectedRoute allowedRoles={['owner']}><Page component={SetupTenant} /></ProtectedRoute>} />
            <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboardWrapper /></ProtectedRoute>} />
            <Route path="/owner/billing" element={<ProtectedRoute allowedRoles={['owner']}><OwnerBillingWrapper /></ProtectedRoute>} />
            <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboardWrapper /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboardWrapper /></ProtectedRoute>} />

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
