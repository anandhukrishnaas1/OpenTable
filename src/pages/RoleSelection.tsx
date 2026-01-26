import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Leaf } from 'lucide-react';
import { Layout } from '../components/Layout';

const RoleSelection: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-green-200">
          <Leaf size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FreshLink</h2>
        <p className="text-gray-500 mb-12">Choose how you want to make a difference</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Donor Card */}
          <div className="border-2 border-green-600 bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group flex flex-col items-center">
            <div className="bg-green-50 p-6 rounded-full text-green-600 mb-6 group-hover:scale-110 transition-transform">
              <Heart size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">I want to Donate</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
              Share excess food from your restaurant, store, or home and track your impact.
            </p>
            <Link 
              to="/login?role=donor"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold w-full hover:bg-green-700 transition-colors"
            >
              Continue as Donor
            </Link>
          </div>

          {/* Volunteer Card */}
          <div className="border border-gray-200 bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-green-200 transition-all group flex flex-col items-center">
            <div className="bg-orange-50 p-6 rounded-full text-orange-600 mb-6 group-hover:scale-110 transition-transform">
              <Users size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">I want to Volunteer</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
              Help deliver food donations to those in need and earn community rewards.
            </p>
            <Link 
              to="/login?role=volunteer"
              className="bg-green-50 text-green-700 px-8 py-3 rounded-lg font-bold w-full hover:bg-green-100 transition-colors"
            >
              Continue as Volunteer
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoleSelection;