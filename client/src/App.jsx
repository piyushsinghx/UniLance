import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { PageLoader } from './components/Loader';

// Eagerly loaded pages (above the fold / critical path)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy-loaded pages (code split for performance)
const Gigs = lazy(() => import('./pages/Gigs'));
const GigDetails = lazy(() => import('./pages/GigDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Messages = lazy(() => import('./pages/Messages'));
const Profile = lazy(() => import('./pages/Profile'));
const CreateGig = lazy(() => import('./pages/CreateGig'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Static/info pages (lazy — rarely visited)
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Categories = lazy(() => import('./pages/Categories'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Blog = lazy(() => import('./pages/Blog'));
const Community = lazy(() => import('./pages/Community'));
const StudentGuide = lazy(() => import('./pages/StudentGuide'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const TrustSafety = lazy(() => import('./pages/TrustSafety'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Careers = lazy(() => import('./pages/Careers'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                },
                success: {
                  iconTheme: { primary: '#43E97B', secondary: '#0F0F1A' },
                  style: { borderLeft: '3px solid #43E97B' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#0F0F1A' },
                  style: { borderLeft: '3px solid #ef4444' },
                },
              }}
            />
            <Router>
              <Suspense fallback={<PageLoader />}>
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

                  <Route element={<ProtectedRoute requireRole="admin" />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                  </Route>

                  {/* Auth routes (no layout) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </Suspense>
            </Router>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
