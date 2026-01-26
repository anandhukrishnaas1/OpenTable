import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import { Layout } from '../components/Layout';

const LandingPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Text */}
        <div className="space-y-6 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Leaf size={12} />
            AI-Powered Food Rescue
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Every Meal Matters. <br />
            <span className="text-green-600">Share Freshness,</span> <br />
            <span className="text-green-600">Share Hope.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-md leading-relaxed">
            FreshLink connects surplus food from restaurants, stores, and households with NGOs and food banks in your community. Our AI instantly analyzes food safety so you can donate with confidence.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <Link 
              to="/login"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <button className="px-8 py-4 rounded-lg font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative animate-in slide-in-from-right duration-700">
           <img 
            src="/restaurant.jpeg" 
            alt="Food Donation Illustration" 
            className="w-full rounded-2xl shadow-2xl border-4 border-white"
          />
          
          
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;