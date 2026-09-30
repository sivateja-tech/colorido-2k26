import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  changePassword as apiChangePassword,
  logoutUserApi,
  fetchCurrentUser,
  fetchAdminMe
} from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage on startup
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('colorido_token') || localStorage.getItem('colorido_user_token') || localStorage.getItem('colorido_admin_token');
      const savedUserData = localStorage.getItem('colorido_user');
      const savedAdminData = localStorage.getItem('colorido_admin');

      if (savedUserData) {
        try {
          const parsed = JSON.parse(savedUserData);
          setUser(parsed);
          if (parsed.role === 'ADMIN') {
            setAdmin(parsed);
          }
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

      // Verify token in background
      if (savedToken) {
        fetchCurrentUser()
          .then((res) => {
            if (res.data?.success) {
              const profile = res.data.data;
              setUser(profile);
              localStorage.setItem('colorido_user', JSON.stringify(profile));
              if (profile.role === 'ADMIN') {
                setAdmin(profile);
                localStorage.setItem('colorido_admin', JSON.stringify(profile));
              }
            }
          })
          .catch(() => {
            // Token expired or invalid
            clearSession();
          });
      }

      setLoading(false);
    }

    initAuth();
  }, []);

  const clearSession = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('colorido_token');
    localStorage.removeItem('colorido_user_token');
    localStorage.removeItem('colorido_admin_token');
    localStorage.removeItem('colorido_user');
    localStorage.removeItem('colorido_admin');
  };

  /**
   * Unified Login (Email + Password for BOTH User and Admin)
   * Backend returns role ('USER' or 'ADMIN') and redirectTo ('/events' or '/admin/dashboard')
   */
  const login = async (email, password) => {
    try {
      const res = await apiLogin(email, password);
      if (res.data?.success) {
        const { token, role, redirectTo, user: profile } = res.data;

        // Persist token
        localStorage.setItem('colorido_token', token);
        localStorage.setItem('colorido_user', JSON.stringify(profile));

        setUser(profile);

        if (role === 'ADMIN') {
          setAdmin(profile);
          localStorage.setItem('colorido_admin_token', token);
          localStorage.setItem('colorido_admin', JSON.stringify(profile));
        } else {
          setAdmin(null);
          localStorage.setItem('colorido_user_token', token);
          localStorage.removeItem('colorido_admin_token');
          localStorage.removeItem('colorido_admin');
        }

        return {
          success: true,
          role,
          redirectTo: redirectTo || (role === 'ADMIN' ? '/admin/dashboard' : '/events'),
          user: profile
        };
      }

      return {
        success: false,
        message: res.data?.message || 'Authentication failed.'
      };
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.requiresVerification || err.response?.status === 403) {
        return {
          success: false,
          requiresVerification: true,
          email: err.response?.data?.email || email,
          message: err.response?.data?.message || 'Your account is not activated yet. Please verify your email before logging in.'
        };
      }
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password.'
      };
    }
  };

  /**
   * User Registration (Public - Strictly role = 'USER', unverified)
   */
  const register = async (userData) => {
    try {
      const res = await apiRegister(userData);
      if (res.data?.success) {
        return {
          success: true,
          unverified: true,
          requiresVerification: true,
          email: res.data.email || userData.email,
          message: res.data.message || 'Account created successfully! Please check your email to activate your account.'
        };
      }

      return {
        success: false,
        message: res.data?.message || 'Registration failed.'
      };
    } catch (err) {
      console.error('Registration error:', err);
      const data = err.response?.data;
      return {
        success: false,
        alreadyExists: data?.alreadyExists,
        isVerified: data?.isVerified,
        rateLimited: data?.rateLimited,
        requiresVerification: data?.requiresVerification,
        email: data?.email || userData.email,
        message: data?.message || 'Registration failed. Please check your data and retry.'
      };
    }
  };

  /**
   * Forgot Password
   */
  const forgotPassword = async (email) => {
    try {
      const res = await apiForgotPassword(email);
      return res.data;
    } catch (err) {
      const errData = err.response?.data;
      let errorMsg = 'Failed to process password reset request.';

      if (err.message === 'Network Error' || !err.response) {
        errorMsg = 'Cannot connect to COLORIDO festival servers. Please check your internet connection or verify the backend server is running.';
      } else if (typeof errData === 'string' && (errData.includes('ECONNREFUSED') || errData.includes('proxy error'))) {
        errorMsg = 'Backend server is offline (Port 5000 not reachable). Please start the backend service.';
      } else if (typeof errData === 'string' && errData.includes('<!DOCTYPE')) {
        errorMsg = 'Festival API server error. The server returned an HTML error response.';
      } else if (errData?.message) {
        errorMsg = errData.message;
      } else if (errData?.error) {
        errorMsg = errData.error;
      } else if (err.message) {
        errorMsg = err.message;
      }

      return {
        success: false,
        notFound: Boolean(errData?.notFound || errData?.userNotFound || err.response?.status === 404),
        userNotFound: Boolean(errData?.userNotFound || errData?.notFound || err.response?.status === 404),
        rateLimited: Boolean(errData?.rateLimited || err.response?.status === 429),
        retryAfter: errData?.retryAfter,
        redirectTo: errData?.redirectTo,
        message: errorMsg
      };
    }
  };

  /**
   * Reset Password
   */
  const resetPassword = async (payload) => {
    try {
      const res = await apiResetPassword(payload);
      return res.data;
    } catch (err) {
      const errData = err.response?.data;
      const errorMsg = errData?.message || (err.message === 'Network Error' ? 'Cannot connect to COLORIDO festival servers. Please check your connection.' : 'Failed to reset password.');
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  /**
   * Change Password (Authenticated)
   */
  const changePassword = async (payload) => {
    try {
      const res = await apiChangePassword(payload);
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to change password.'
      };
    }
  };

  /**
   * Unified Logout
   */
  const logout = () => {
    try {
      logoutUserApi().catch(() => {});
    } finally {
      clearSession();
    }
  };

  const isAdmin = user?.role === 'ADMIN' || admin?.role === 'ADMIN';
  const isAuthenticated = Boolean(user || admin);
  const currentRole = isAdmin ? 'ADMIN' : (user ? 'USER' : null);

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        role: currentRole,
        isAdmin,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,

        // Backward compatibility aliases
        handleAdminLogin: (email, pwd) => login(email, pwd),
        handleEmailLogin: (data) => login(data.email, data.password || data),
        handleGoogleLogin: (data) => login(data.email, data.password),
        logoutUser: logout,
        logoutAdmin: logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
