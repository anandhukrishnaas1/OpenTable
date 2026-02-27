import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Heart, Truck, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Optionally auto-redirect admins, but giving them the choice might be better
  // we will just show the Admin Card if they are an admin.

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="w-24 h-24 rounded-[2rem] mx-auto mb-6 overflow-hidden shadow-md border border-gray-100 bg-white flex items-center justify-center">
          <img src="/logo.png" alt="OpenTable Logo" className="w-full h-full object-contain p-3" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          How do you want to help?
        </h1>
        <p className="text-gray-500 mb-12 text-lg">
          Choose your role to get started with OpenTable.
        </p>

        <div className={`grid gap-8 max-w-4xl mx-auto ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-2xl'}`}>
          {/* OPTION 1: DONOR */}
          <button
            onClick={() => navigate('/menu')} // <--- FIX: GO DIRECTLY TO MENU
            className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-transparent hover:border-green-500 hover:shadow-xl transition-all flex flex-col items-center gap-6 text-center cursor-pointer"
          >
            <div className="bg-green-100 p-6 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Heart size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Donate Food</h3>
              <p className="text-gray-500">I have surplus food to share with my community.</p>
            </div>
            <div className="mt-4 w-full bg-green-50 text-green-700 py-3 rounded-xl font-bold group-hover:bg-green-600 group-hover:text-white transition-colors">
              Continue as Donor
            </div>
          </button>

          {/* OPTION 2: VOLUNTEER */}
          <button
            onClick={() => navigate('/volunteer')} // <--- FIX: GO DIRECTLY TO VOLUNTEER
            className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all flex flex-col items-center gap-6 text-center cursor-pointer"
          >
            <div className="bg-blue-100 p-6 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Truck size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Volunteer</h3>
              <p className="text-gray-500">I can pick up food and deliver it to those in need.</p>
            </div>
            <div className="mt-4 w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
              Continue as Volunteer
            </div>
          </button>

          {/* OPTION 3: ADMIN (Only visible if isAdmin) */}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-green-500 ring-4 ring-green-50 hover:shadow-xl transition-all flex flex-col items-center gap-6 text-center cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-500 to-blue-500" />
              <div className="bg-gray-100 p-6 rounded-full text-gray-800 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                <Shield size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h3>
                <p className="text-gray-500">Review applications and manage platform trust.</p>
              </div>
              <div className="mt-4 w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold group-hover:bg-gray-800 group-hover:text-white transition-colors">
                Enter Dashboard
              </div>
            </button>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default RoleSelection;