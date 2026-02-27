import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  logout,
  loginWithEmail,
  registerWithEmail,
  db,
} from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

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
    let unsubscribeRole: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Clean up previous role listener
      if (unsubscribeRole) {
        unsubscribeRole();
        unsubscribeRole = null;
      }

      if (currentUser) {
        // Real-time listener on user document — role changes reflect instantly
        const userDocRef = doc(db, 'users', currentUser.uid);
        unsubscribeRole = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const role = docSnap.data().role;
              setIsAdmin(role === 'admin');
              setIsVerifiedVolunteer(role === 'volunteer');
            } else {
              setIsAdmin(false);
              setIsVerifiedVolunteer(false);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error listening to user role:', error);
            setIsAdmin(false);
            setIsVerifiedVolunteer(false);
            setLoading(false);
          }
        );
      } else {
        setIsAdmin(false);
        setIsVerifiedVolunteer(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeRole) unsubscribeRole();
    };
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
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isVerifiedVolunteer,
        loading,
        signInGoogle,
        signInEmail,
        signUpEmail,
        signOut,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
