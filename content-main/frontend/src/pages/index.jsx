import { Suspense, lazy, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Added import

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Import all pages
import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard";
import Generate from "./Generate";
import Profile from "./Profile";
import Pricing from "./Pricing";
import PaymentSuccess from "./PaymentSuccess";
import Calendar from "./Calendar";
import Library from "./Library";
import Analytics from "./Analytics";
import Landing from "./Landing";
import Agents from "./Agents";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import AuthCallback from "./AuthCallback.jsx";
import LeadMagnet from "./LeadMagnet.jsx";
import Welcome from "./Welcome.jsx"; // Import the new Welcome page
import ProtectedRouteAdmin from '../components/common/ProtectedRouteAdmin.jsx';

// Admin pages (lazy-loaded)
const AdminLayout = lazy(() => import('./Admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./Admin/Dashboard.jsx'));
const Users = lazy(() => import('./Admin/Users.jsx'));
const PromoCodes = lazy(() => import('./Admin/PromoCodes.jsx'));
const AuditLog = lazy(() => import('./Admin/AuditLog.jsx'));
const AiContent = lazy(() => import('./Admin/AiContent.jsx'));
const Payments = lazy(() => import('./Admin/Payments.jsx'));

// --- Auth Helper & Protected Route ---
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // current time in seconds
    // Check if token is expired
    if (decoded.exp < currentTime) {
      localStorage.removeItem('authToken'); // Remove expired token
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error decoding or validating token:', error);
    localStorage.removeItem('authToken'); // Remove invalid token
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      if (!isAuthenticated()) { // Re-check authentication on page show
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    // Initial check
    if (!authenticated) {
      checkAuthAndRedirect();
    }

    // Add event listener for pageshow to handle bfcache
    window.addEventListener('pageshow', checkAuthAndRedirect);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('pageshow', checkAuthAndRedirect);
    };
  }, [authenticated, location, navigate]);

  return authenticated ? children : null; 
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// --- Page Name Logic ---
const PAGES = {
    Dashboard, Generate, Profile, Pricing, PaymentSuccess, Calendar, Library, Analytics, Landing, Agents, Login, Register, AuthCallback, LeadMagnet, Welcome
};

function _getCurrentPage(url) {
    if (url.startsWith('/admin')) return 'Admin';
    if (url === '/' || url.toLowerCase() === '/landing') return 'Landing';
    if (url.toLowerCase() === '/login') return 'Login';
    if (url.toLowerCase() === '/register') return 'Register';
    if (url.toLowerCase().startsWith('/auth')) return 'AuthCallback';
    if (url.toLowerCase() === '/lead-magnet') return 'LeadMagnet';
    if (url.toLowerCase() === '/welcome-to-impulse') return 'Welcome';
    
    if (url.endsWith('/')) url = url.slice(0, -1);
    let urlLastPart = url.split('/').pop().split('?')[0].replace(/-/g, '');
    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || 'Dashboard';
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/success" element={<AuthCallback />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/lead-magnet" element={<LeadMagnet />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/welcome-to-impulse" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
            <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/agents" element={<ProtectedRoute><Agents /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRouteAdmin>
                <Suspense fallback={<div>Loading...</div>}>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<Users />} />
                      <Route path="promo-codes" element={<PromoCodes />} />
                      <Route path="audit-log" element={<AuditLog />} />
                      <Route path="ai-content" element={<AiContent />} />
                      <Route path="payments" element={<Payments />} />
                      <Route index element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </AdminLayout>
                </Suspense>
              </ProtectedRouteAdmin>
            } />

            {/* Fallback for any other path */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

// This component determines the current page and wraps the Routes with the Layout
function AppWithLayout() {
    const location = useLocation();
    const currentPageName = _getCurrentPage(location.pathname);

    if (currentPageName === 'Admin') {
        return <AppRoutes />;
    }

    return (
        <Layout currentPageName={currentPageName}>
            <AppRoutes />
        </Layout>
    );
}

// The root component that provides the Router context
export default function Pages() {
    return (
        <Router>
            <ScrollToTop />
            <Suspense fallback={<div>Loading...</div>}>
              <AppWithLayout />
            </Suspense>
        </Router>
    );
}
