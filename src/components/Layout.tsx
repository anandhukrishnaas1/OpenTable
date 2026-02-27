import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { DoodleBackground } from './DoodleBackground';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Helper to scroll to section if on landing page, or go there
  const scrollToSection = (id: string) => {
    // Check if we are already on home page
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-gray-800 relative z-10">
      <DoodleBackground />
      {/* Navbar bg-gray-50/90 */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {!isHomePage && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors shadow-sm border border-gray-100"
                title="Go Back"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="OpenTable Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 tracking-tight">
                OpenTable
              </span>
            </Link>
          </div>

          {/* DROPDOWN NAVIGATION */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {/* About Us Dropdown */}
            <div className="relative group">
              <button className="hover:text-orange-500 flex items-center gap-1 py-2 font-bold transition-colors">
                About Us <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="flex flex-col p-2">
                  <button
                    onClick={() => scrollToSection('our-purpose')}
                    className="text-left px-4 py-2.5 hover:bg-orange-50 rounded-lg font-bold hover:text-orange-600 transition-colors"
                  >
                    Our Purpose
                  </button>
                  <button
                    onClick={() => scrollToSection('why-we-serve')}
                    className="text-left px-4 py-2.5 hover:bg-orange-50 rounded-lg font-bold hover:text-orange-600 transition-colors"
                  >
                    Why We Serve
                  </button>
                  <button
                    onClick={() => scrollToSection('why-freshlink')}
                    className="text-left px-4 py-2.5 hover:bg-orange-50 rounded-lg font-bold hover:text-orange-600 transition-colors"
                  >
                    Why OpenTable
                  </button>
                  <button
                    onClick={() => scrollToSection('annual-reports')}
                    className="text-left px-4 py-2.5 hover:bg-orange-50 rounded-lg font-bold hover:text-orange-600 transition-colors"
                  >
                    Annual Reports
                  </button>
                </div>
              </div>
            </div>

            {/* Help Now Dropdown */}
            <div className="relative group">
              <button className="hover:text-orange-500 flex items-center gap-1 py-2 font-bold transition-colors">
                Help Now <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="flex flex-col p-2">
                  <button
                    onClick={() => scrollToSection('major-donations')}
                    className="text-left px-4 py-2.5 hover:bg-orange-50 font-bold rounded-lg hover:text-orange-600 transition-colors"
                  >
                    Major Donations
                  </button>
                  <button
                    onClick={() => scrollToSection('how-we-help')}
                    className="text-left px-4 py-2.5 hover:bg-orange-50 font-bold rounded-lg hover:text-orange-600 transition-colors"
                  >
                    How We Help
                  </button>
                </div>
              </div>
            </div>

            <Link to="/ledger" className="hover:text-orange-600 font-bold py-2 transition-colors">
              Transparency Ledger
            </Link>
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden sm:block">
                  Hi, {user.displayName?.split(' ')[0]}
                </span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden md:flex text-sm bg-gray-800 text-white px-5 py-2 rounded-full font-bold hover:bg-gray-900 transition-colors shadow-sm"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  className="text-sm border border-gray-200 bg-white px-5 py-2 rounded-full font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to={user ? '/menu' : '/login'}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-md shadow-orange-500/30"
              >
                My Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-16 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="OpenTable Logo"
                className="w-8 h-8 object-contain rounded-lg shadow-sm bg-white"
              />
              <span className="font-bold text-lg">OpenTable</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Connecting surplus food with those in need. Together, we can end food waste and
              hunger.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li>
                <button
                  onClick={() => scrollToSection('our-purpose')}
                  className="hover:text-orange-500 transition-colors"
                >
                  Our Purpose
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('why-we-serve')}
                  className="hover:text-orange-500 transition-colors"
                >
                  Why We Serve
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Get Involved</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:text-orange-500 transition-colors"
                >
                  Donate Food
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:text-orange-500 transition-colors"
                >
                  Become a Volunteer
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li>hello@opentable.org</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-12">
          © 2026 OpenTable. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
