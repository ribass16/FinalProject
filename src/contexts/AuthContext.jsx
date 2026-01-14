import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { getUserProfile } from '../services/userService';
import { app } from '../services/firebaseClient';

const auth = getAuth(app);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      
      if (u) {
        
        const profileResult = await getUserProfile(u.uid);
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    setUserProfile(null);
    return signOut(auth);
  };

  const refreshProfile = async () => {
    if (user) {
      const profileResult = await getUserProfile(user.uid);
      if (profileResult.success) {
        setUserProfile(profileResult.data);
      }
    }
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = { user, userProfile, loading, register, login, logout, refreshProfile, resetPassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
