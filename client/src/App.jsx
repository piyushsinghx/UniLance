import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Gigs from './pages/Gigs';
import GigDetails from './pages/GigDetails';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import CreateGig from './pages/CreateGig';
import OrderDetails from './pages/OrderDetails';
import ProtectedRoute from './components/ProtectedRoute';

// New Pages
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import Categories from './pages/Categories';
import HelpCenter from './pages/HelpCenter';
import Blog from './pages/Blog';
import Community from './pages/Community';
import StudentGuide from './pages/StudentGuide';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import TrustSafety from './pages/TrustSafety';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#0f172a' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
              },
            }}
          />
          <Router>
            <Routes>
              {/* Public routes with MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/gigs" element={<Gigs />} />
                <Route path="/gigs/:id" element={<GigDetails />} />
                
                {/* Platform */}
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/categories" element={<Categories />} />
                
                {/* Resources */}
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/community" element={<Community />} />
                <Route path="/student-guide" element={<StudentGuide />} />
                
                {/* Legal */}
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/trust-safety" element={<TrustSafety />} />
                
                {/* Company */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/careers" element={<Careers />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/messages" element={<Messages />} />
                </Route>

                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/orders" element={<Dashboard />} />
                  <Route path="/dashboard/orders/:id" element={<OrderDetails />} />
                  <Route path="/dashboard/gigs" element={<Dashboard />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requireRole="seller" />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard/create-gig" element={<CreateGig />} />
                </Route>
              </Route>

              {/* Auth routes (no layout) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
