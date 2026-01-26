import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Leaf } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg text-white">
              <Leaf size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">FreshLink</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button className="hover:text-green-600 flex items-center gap-1">About Us</button>
            <button className="hover:text-green-600 flex items-center gap-1">Help Now</button>
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden sm:block">Hi, {user.displayName?.split(' ')[0]}</span>
                <button 
                  onClick={() => { signOut(); navigate('/'); }}
                  className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/role-selection"
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-200"
              >
                My Donations
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-1.5 rounded-lg text-white">
                <Leaf size={16} fill="currentColor" />
              </div>
              <span className="font-bold text-lg">FreshLink</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Connecting surplus food with those in need. Together, we can end food waste and hunger.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-green-600">Our Purpose</a></li>
              <li><a href="#" className="hover:text-green-600">Why We Serve</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Get Involved</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-green-600">Donate Food</a></li>
              <li><a href="#" className="hover:text-green-600">Become a Volunteer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>hello@freshlink.org</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-12">
          © 2026 FreshLink. All rights reserved.
        </div>
      </footer>
    </div>
  );
};