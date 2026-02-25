import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DonationProvider } from './contexts/DonationContext';
import { AdminProvider } from './contexts/AdminContext';

// Lazy-load all pages for code splitting & faster initial load
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OnboardingApplication = lazy(() => import('./pages/OnboardingApplication'));
const TransparencyLedger = lazy(() => import('./pages/TransparencyLedger'));

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <DonationProvider>
      <AuthProvider>
        <AdminProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* NEW ROUTE FOR ROLE SELECTION */}
                <Route path="/role-selection" element={<RoleSelection />} />

                <Route path="/menu" element={<DonorDashboard />} />
                <Route path="/volunteer" element={<VolunteerDashboard />} />

                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/onboarding" element={<OnboardingApplication />} />
                <Route path="/ledger" element={<TransparencyLedger />} />
              </Routes>
            </Suspense>
          </Router>
        </AdminProvider>
      </AuthProvider>
    </DonationProvider>
  );
}

export default App;