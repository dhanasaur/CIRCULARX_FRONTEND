import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { ToastProvider } from './components/ui/Toast';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import PricingPage from './pages/public/PricingPage';
import CompliancePage from './pages/public/CompliancePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerListings from './pages/seller/SellerListings';
import SellerTransactions from './pages/seller/SellerTransactions';
import SellerSubmitMaterial from './pages/seller/SellerSubmitMaterial';
import SellerCompliance from './pages/seller/SellerCompliance';
import SellerAnalytics from './pages/seller/SellerAnalytics';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerMarketplace from './pages/buyer/BuyerMarketplace';
import BuyerScope3 from './pages/buyer/BuyerScope3';
import BuyerRequests from './pages/buyer/BuyerRequests';

// QC Pages
import QCDashboard from './pages/qc/QCDashboard';
import QCInspections from './pages/qc/QCInspections';
import QCDisputes from './pages/qc/QCDisputes';

// Shared Pages
import SettingsPage from './pages/shared/SettingsPage';

// Placeholder (for remaining pages)
import PlaceholderPage from './pages/PlaceholderPage';

function ProtectedRoute({ role, children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to={`/${user?.role}/dashboard`} replace />;
  return children;
}

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Seller Dashboard */}
        <Route element={<ProtectedRoute role="seller"><DashboardLayout role="seller" /></ProtectedRoute>}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/listings" element={<SellerListings />} />
          <Route path="/seller/submit" element={<SellerSubmitMaterial />} />
          <Route path="/seller/transactions" element={<SellerTransactions />} />
          <Route path="/seller/compliance" element={<SellerCompliance />} />
          <Route path="/seller/analytics" element={<SellerAnalytics />} />
          <Route path="/seller/settings" element={<SettingsPage role="seller" />} />
        </Route>

        {/* Buyer Dashboard */}
        <Route element={<ProtectedRoute role="buyer"><DashboardLayout role="buyer" /></ProtectedRoute>}>
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/marketplace" element={<BuyerMarketplace />} />
          <Route path="/buyer/requests" element={<BuyerRequests />} />
          <Route path="/buyer/transactions" element={<SellerTransactions />} />
          <Route path="/buyer/scope3" element={<BuyerScope3 />} />
          <Route path="/buyer/analytics" element={<SellerAnalytics />} />
          <Route path="/buyer/settings" element={<SettingsPage role="buyer" />} />
        </Route>

        {/* QC Dashboard */}
        <Route element={<ProtectedRoute role="qc"><DashboardLayout role="qc" /></ProtectedRoute>}>
          <Route path="/qc/dashboard" element={<QCDashboard />} />
          <Route path="/qc/inspections" element={<QCInspections />} />
          <Route path="/qc/disputes" element={<QCDisputes />} />
          <Route path="/qc/transactions" element={<SellerTransactions />} />
          <Route path="/qc/settings" element={<SettingsPage role="qc" />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
