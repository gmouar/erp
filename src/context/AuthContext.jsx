import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import authService from '../services/authService';
import sessionManager from '../utils/sessionManager';

// Create context with null default value
const AuthContext = createContext(null);

// Separate hook export
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { auth } = await import('../config/firebase');
        
        return onAuthStateChanged(auth, async (firebaseUser) => {
          setLoading(true);
          try {
            if (firebaseUser) {
              // Get complete user data including role
              const userData = await authService.getUserData(firebaseUser.uid);
              setUser({ ...firebaseUser, ...userData });
              sessionManager.initSession();
            } else {
              setUser(null);
              sessionManager.clearSession();
            }
          } catch (error) {
            console.error('Auth state change error:', error);
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

    const unsubscribe = initAuth();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      sessionManager.stopSessionMonitor();
    };
  }, []);

  // Memoize the context value to prevent unnecessary rerenders
  const value = useMemo(() => ({
    user,
    loading,
    roleUpdateLoading,
    isAuthenticated: !!user,
    role: user?.role || 'Unassigned',
    isAdmin: user?.role === 'HR' || user?.role === 'Superuser',
    login: async (credentials) => {
      try {
        const result = await authService.login(credentials);
        if (result.success) {
          setUser(result.user);
          sessionManager.initSession();
          return { 
            success: true, 
            requires2FA: result.requires2FA,
            role: result.user.role 
          };
        }
        return result;
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }
    },
    logout: async () => {
      try {
        await authService.logout();
        setUser(null);
        sessionManager.clearSession();
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
      }
    },
    register: async (userData) => {
      try {
        const result = await authService.register(userData);
        return { success: true, user: result.user };
      } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
      }
    },
    updateUserRole: async (userId, newRole) => {
      try {
        setRoleUpdateLoading(true);
        const result = await authService.updateUserRole(userId, newRole);
        if (userId === user?.id) {
          setUser(prev => ({ ...prev, role: newRole }));
        }
        return { success: true };
      } catch (error) {
        console.error('Role update error:', error);
        return { success: false, error: error.message };
      } finally {
        setRoleUpdateLoading(false);
      }
    }
  }), [user, loading, roleUpdateLoading]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export context and provider
export { AuthContext };
export default AuthProvider;
