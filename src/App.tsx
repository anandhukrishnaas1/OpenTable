import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DonationProvider } from './contexts/DonationContext';

// Import your pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RoleSelection from './pages/RoleSelection'; // <--- IMPORT THIS
import DonorDashboard from './pages/DonorDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';

function App() {
  return (
    <DonationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* NEW ROUTE FOR ROLE SELECTION */}
            <Route path="/role-selection" element={<RoleSelection />} />
            
            <Route path="/menu" element={<DonorDashboard />} />
            <Route path="/volunteer" element={<VolunteerDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </DonationProvider>
  );
}

export default App;