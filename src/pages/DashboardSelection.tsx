import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const DashboardSelection: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-20 text-center animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.displayName?.split(' ')[0]}!</h2>
        <p className="text-gray-500 mb-12">How would you like to help today?</p>

        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/donate" className="group">
            <div className="border-2 border-green-600 bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all h-full flex flex-col items-center">
              <div className="bg-green-50 p-6 rounded-full text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <Heart size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Donate Food</h3>
              <p className="text-gray-500 text-sm">Scan and list surplus food.</p>
            </div>
          </Link>

          <Link to="/volunteer" className="group">
            <div className="border border-gray-200 bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-orange-300 transition-all h-full flex flex-col items-center">
              <div className="bg-orange-50 p-6 rounded-full text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Volunteer</h3>
              <p className="text-gray-500 text-sm">Find and deliver donations.</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardSelection;