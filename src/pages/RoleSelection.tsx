import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Heart, Truck, Leaf } from 'lucide-react';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
          <Leaf size={32} />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          How do you want to help?
        </h1>
        <p className="text-gray-500 mb-12 text-lg">
          Choose your role to get started with FreshLink.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
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
        </div>
      </div>
    </Layout>
  );
};

export default RoleSelection;