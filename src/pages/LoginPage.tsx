import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { Leaf } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await signIn();
    navigate('/menu'); // Redirect to the selection menu
  };

  return (
    <Layout>
      <div className="flex items-center justify-center py-20 px-6 bg-gray-50/50">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
            <Leaf size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to continue to FreshLink</p>

          <button 
            onClick={handleLogin}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
            Sign In with Google
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;