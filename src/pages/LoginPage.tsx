import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { Leaf, Mail, Lock, Phone, User as UserIcon, Loader } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { signInGoogle, signInEmail, signUpEmail, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (user) navigate('/role-selection');
  }, [user, navigate]);

  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await signUpEmail(email, password, name, phone);
      } else {
        await signInEmail(email, password);
      }
      navigate('/role-selection');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInGoogle();
      navigate('/role-selection');
    } catch (err: any) {
      console.error(err);
      setError("Google Login Error: " + err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center py-16 px-6 bg-gray-50/50 min-h-[80vh]">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">

          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-4 overflow-hidden shadow-sm border border-gray-100 bg-white flex items-center justify-center">
              <img src="/logo.png" alt="OpenTable Logo" className="w-full h-full object-contain p-2" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isRegistering ? 'Join the movement to end food waste' : 'Sign in to continue to OpenTable'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 mt-2 flex justify-center items-center gap-2"
            >
              {loading && <Loader className="animate-spin" size={20} />}
              {isRegistering ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or continue with</span></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-200 text-gray-800 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
            Google
          </button>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              {isRegistering ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-green-600 font-bold ml-1 hover:underline"
              >
                {isRegistering ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;