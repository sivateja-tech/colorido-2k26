import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithGoogle, loginAdmin, fetchCurrentUser, fetchAdminMe } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage on startup
  useEffect(() => {
    async function initAuth() {
      const savedUserToken = localStorage.getItem('colorido_user_token');
      const savedUserData = localStorage.getItem('colorido_user');
      const savedAdminToken = localStorage.getItem('colorido_admin_token');
      const savedAdminData = localStorage.getItem('colorido_admin');

      if (savedUserData) {
        try {
          setUser(JSON.parse(savedUserData));
        } catch (e) {
          localStorage.removeItem('colorido_user');
        }
      }

      if (savedAdminData) {
        try {
          setAdmin(JSON.parse(savedAdminData));
        } catch (e) {
          localStorage.removeItem('colorido_admin');
        }
      }

      // Background verify and refresh profiles if tokens exist
      if (savedUserToken) {
        fetchCurrentUser()
          .then((res) => {
            if (res.data?.success) {
              setUser(res.data.data);
              localStorage.setItem('colorido_user', JSON.stringify(res.data.data));
            }
          })
          .catch(() => {
            // Expired or invalid user token
            localStorage.removeItem('colorido_user_token');
            localStorage.removeItem('colorido_user');
            setUser(null);
          });
      }

      if (savedAdminToken) {
        fetchAdminMe()
          .then((res) => {
            if (res.data?.success) {
              setAdmin(res.data.data);
              localStorage.setItem('colorido_admin', JSON.stringify(res.data.data));
            }
          })
          .catch(() => {
            localStorage.removeItem('colorido_admin_token');
            localStorage.removeItem('colorido_admin');
            setAdmin(null);
          });
      }

      setLoading(false);
    }

    initAuth();
  }, []);

  // Google Sign-in for Normal Users (Section 42)
  const handleGoogleLogin = async (credential) => {
    try {
      const res = await loginWithGoogle(credential);
      if (res.data.success) {
        const { user: authedUser, token } = res.data.data;
        setUser(authedUser);
        localStorage.setItem('colorido_user_token', token);
        localStorage.setItem('colorido_user', JSON.stringify(authedUser));
        return { success: true, user: authedUser };
      }
      return { success: false, message: res.data.message || 'Google authentication failed' };
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Google Sign-in failed.'
      };
    }
  };

  // Admin Login with Email & Password (Section 49)
  const handleAdminLogin = async (email, password) => {
    try {
      const res = await loginAdmin(email, password);
      if (res.data.success) {
        const { admin: authedAdmin, token } = res.data.data;
        setAdmin(authedAdmin);
        localStorage.setItem('colorido_admin_token', token);
        localStorage.setItem('colorido_admin', JSON.stringify(authedAdmin));
        return { success: true, admin: authedAdmin };
      }
      return { success: false, message: res.data.message || 'Admin authentication failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid administrator email or password.'
      };
    }
  };

  // Logout normal user
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('colorido_user_token');
    localStorage.removeItem('colorido_user');
  };

  // Logout admin
  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('colorido_admin_token');
    localStorage.removeItem('colorido_admin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        isAdmin: !!admin,
        isAuthenticated: !!user,
        loading,
        handleGoogleLogin,
        handleAdminLogin,
        logoutUser,
        logoutAdmin,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
