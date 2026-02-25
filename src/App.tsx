import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DonationProvider } from './contexts/DonationContext';
import { AdminProvider } from './contexts/AdminContext';

// Import your pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RoleSelection from './pages/RoleSelection'; // <--- IMPORT THIS
import DonorDashboard from './pages/DonorDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OnboardingApplication from './pages/OnboardingApplication';
import TransparencyLedger from './pages/TransparencyLedger';

function App() {
  return (
    <DonationProvider>
      <AuthProvider>
        <AdminProvider>
          <Router>
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
          </Router>
        </AdminProvider>
      </AuthProvider>
    </DonationProvider>
  );
}

export default App;