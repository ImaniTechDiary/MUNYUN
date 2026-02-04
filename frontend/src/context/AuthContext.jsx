import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [demoMode, setDemoMode] = useState(
    () => localStorage.getItem('demoMode') === 'true'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const enableDemo = () => {
    localStorage.setItem('demoMode', 'true');
    setDemoMode(true);
  };

  const disableDemo = () => {
    localStorage.removeItem('demoMode');
    setDemoMode(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut: signOutUser, demoMode, enableDemo, disableDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
