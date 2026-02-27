/**
 * Root application component for OpenTable.
 *
 * Sets up React Router, Context Providers, Error Boundary,
 * and lazy-loaded route definitions with code splitting.
 *
 * @module App
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DonationProvider } from './contexts/DonationContext';
import { AdminProvider } from './contexts/AdminContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ROUTES } from './constants';

/** Lazy-load all pages for code splitting & faster initial load */
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OnboardingApplication = lazy(() => import('./pages/OnboardingApplication'));
const TransparencyLedger = lazy(() => import('./pages/TransparencyLedger'));

/** Minimal loading fallback displayed while lazy-loaded pages are fetched */
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

/**
 * Root application component.
 * Wraps all providers, error boundary, and route definitions.
 */
function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <DonationProvider>
        <AuthProvider>
          <AdminProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path={ROUTES.HOME} element={<LandingPage />} />
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.ROLE_SELECTION} element={<RoleSelection />} />
                  <Route path={ROUTES.DONOR_DASHBOARD} element={<DonorDashboard />} />
                  <Route path={ROUTES.VOLUNTEER_DASHBOARD} element={<VolunteerDashboard />} />
                  <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                  <Route path={ROUTES.ONBOARDING} element={<OnboardingApplication />} />
                  <Route path={ROUTES.LEDGER} element={<TransparencyLedger />} />
                </Routes>
              </Suspense>
            </Router>
          </AdminProvider>
        </AuthProvider>
      </DonationProvider>
    </ErrorBoundary>
  );
}

export default App;
