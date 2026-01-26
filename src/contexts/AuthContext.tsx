import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, logout, loginWithEmail, registerWithEmail } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInGoogle = async () => {
    await signInWithGoogle();
  };

  const signInEmail = async (email: string, pass: string) => {
    await loginWithEmail(email, pass);
  };

  const signUpEmail = async (email: string, pass: string, name: string, phone: string) => {
    await registerWithEmail(email, pass, name, phone);
  };

  const signOut = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInGoogle, signInEmail, signUpEmail, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};