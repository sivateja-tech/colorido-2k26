import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  forgotPassword as apiForgotPassword,
  resendResetCode as apiResendResetCode,
  verifyResetCode as apiVerifyResetCode,
  resetPassword as apiResetPassword,
  changePassword as apiChangePassword,
  logoutUserApi,
  fetchCurrentUser,
  fetchAdminMe
} from '../services/api';

const AuthContext = createContext();

const sanitizeAuthMessage = (rawMessage, fallback = 'Operation failed. Please try again.') => {
  if (!rawMessage || typeof rawMessage !== 'string') return fallback;
  const isTechnical = /prisma|findunique|findmany|invocation|column|database|relation|syntax error|constraint|foreign key/i.test(rawMessage);
  if (isTechnical) {
    return 'A service update is currently in progress. Please refresh the page and try again.';
  }
  return rawMessage;
};

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
        message: sanitizeAuthMessage(res.data?.message, 'Invalid email or password.')
      };
    } catch (err) {
      console.error('Login error:', err);
      const isConnectionIssue = err.message === 'Network Error' || !err.response;
      if (isConnectionIssue) {
        return {
          success: false,
          message: 'Cannot connect to COLORIDO festival servers. Please check your internet connection.'
        };
      }
      return {
        success: false,
        message: sanitizeAuthMessage(err.response?.data?.message, 'Invalid email or password.')
      };
    }
  };

  /**
   * User Registration (Public - role = 'USER', immediately active)
   * NO email verification, NO verification codes, NO verification links.
   * Immediately logs in and saves JWT.
   */
  const register = async (userData) => {
    try {
      const res = await apiRegister(userData);
      if (res.data?.success) {
        const { token, user: profile, redirectTo } = res.data;
        if (token && profile) {
          localStorage.setItem('colorido_token', token);
          localStorage.setItem('colorido_user_token', token);
          localStorage.setItem('colorido_user', JSON.stringify(profile));
          setUser(profile);
        }
        return {
          success: true,
          token,
          user: profile,
          redirectTo: redirectTo || '/events',
          message: res.data.message || 'Account created successfully! Welcome to COLORIDO 2K26.'
        };
      }

      return {
        success: false,
        message: sanitizeAuthMessage(res.data?.message, 'Registration failed.')
      };
    } catch (err) {
      console.error('Registration error:', err);
      const isConnectionIssue = err.message === 'Network Error' || !err.response;
      if (isConnectionIssue) {
        return {
          success: false,
          message: 'Cannot connect to COLORIDO festival servers. Please check your network connection.'
        };
      }
      const data = err.response?.data;
      return {
        success: false,
        alreadyExists: data?.alreadyExists || data?.code === 'USER_ALREADY_EXISTS',
        message: sanitizeAuthMessage(data?.message, 'Registration could not be completed. Please check your details and try again.')
      };
    }
  };

  /**
   * Forgot Password (Request 6-digit numeric reset code to email)
   */
  const forgotPassword = async (email) => {
    try {
      const res = await apiForgotPassword(email);
      return res.data;
    } catch (err) {
      const errData = err.response?.data;
      let errorMsg = 'Failed to process password reset request.';
      if (err.message === 'Network Error' || !err.response) {
        errorMsg = 'Cannot connect to COLORIDO festival servers. Please check your internet connection.';
      } else if (errData?.message) {
        errorMsg = errData.message;
      }
      return {
        success: false,
        rateLimited: Boolean(errData?.rateLimited || err.response?.status === 429),
        retryAfter: errData?.retryAfter || 60,
        message: errorMsg
      };
    }
  };

  /**
   * Resend Reset Code (Dedicated with 60s cooldown)
   */
  const resendResetCode = async (email) => {
    try {
      const res = await apiResendResetCode(email);
      return res.data;
    } catch (err) {
      const errData = err.response?.data;
      let errorMsg = 'Failed to resend reset code.';
      if (err.message === 'Network Error' || !err.response) {
        errorMsg = 'Cannot connect to COLORIDO festival servers. Please check your internet connection.';
      } else if (errData?.message) {
        errorMsg = errData.message;
      }
      return {
        success: false,
        rateLimited: Boolean(errData?.rateLimited || err.response?.status === 429),
        retryAfter: errData?.retryAfter || 60,
        message: errorMsg
      };
    }
  };

  /**
   * Verify 6-digit Reset Code
   */
  const verifyResetCode = async (email, code) => {
    try {
      const res = await apiVerifyResetCode(email, code);
      return res.data;
    } catch (err) {
      const errData = err.response?.data;
      return {
        success: false,
        message: errData?.message || 'Invalid or expired 6-digit verification code.'
      };
    }
  };

  /**
   * Reset Password (with 6-digit code)
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
        resendResetCode,
        verifyResetCode,
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
