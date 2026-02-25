import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, logout, loginWithEmail, registerWithEmail, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isVerifiedVolunteer: boolean;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifiedVolunteer, setIsVerifiedVolunteer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Check user role in Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            setIsAdmin(role === 'admin');
            setIsVerifiedVolunteer(role === 'volunteer');
          } else {
            setIsAdmin(false);
            setIsVerifiedVolunteer(false);
          }
        } catch (e) {
          console.error("Error fetching user role", e);
          setIsAdmin(false);
          setIsVerifiedVolunteer(false);
        }
      } else {
        setIsAdmin(false);
        setIsVerifiedVolunteer(false);
      }

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
    <AuthContext.Provider value={{ user, isAdmin, isVerifiedVolunteer, loading, signInGoogle, signInEmail, signUpEmail, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};