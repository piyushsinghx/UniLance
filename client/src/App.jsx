import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/gigs/:id" element={<GigDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
          </Route>

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/orders" element={<Dashboard />} />
            <Route path="/dashboard/gigs" element={<Dashboard />} />
            <Route path="/dashboard/create-gig" element={<Dashboard />} />
          </Route>

          {/* Auth routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
