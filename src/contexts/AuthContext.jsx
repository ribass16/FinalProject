import React, { useEffect, useState } from 'react';
import { AuthContext } from './authContextObject';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { getUserProfile } from '../services/userService';
import { app } from '../services/firebaseClient';

const auth = getAuth(app);

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
    const actionCodeSettings = {
      url: `${window.location.origin}/__/auth/action`,
      handleCodeInApp: false,
    };
    return sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  const value = { user, userProfile, loading, register, login, logout, refreshProfile, resetPassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// `AuthContext` is intentionally not exported to keep this file exporting
// only the hook and provider (avoids react-refresh/only-export-components rule).
