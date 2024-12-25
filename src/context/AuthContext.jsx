import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import authService from '../services/authService';
import sessionManager from '../utils/sessionManager';

export const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    
    const initAuth = async () => {
      try {
        const { auth, db } = await import('../config/firebase');
        
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setLoading(true);
          try {
            if (firebaseUser) {
              // Initialize session before setting user
              sessionManager.initSession();
              // User data will be set by authService.login
            } else {
              setUser(null);
              sessionManager.clearSession();
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            setUser(null);
            sessionManager.clearSession();
          } finally {
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setLoading(false);
      }
    };

    initAuth();
    return () => {
      unsubscribe();
      sessionManager.stopSessionMonitor();
    };
  }, []);

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      return { success: true, requires2FA: result.userData?.has2FAEnabled || false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const user = await authService.register(userData);
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    logout,
    register, // Added register to context
    loading,
    isAuthenticated: !!user,
    role: user?.role || 'Unassigned'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
