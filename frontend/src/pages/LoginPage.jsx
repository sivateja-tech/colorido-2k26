import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * LoginPage fallback: Redirects to HomePage where authentication modal is available,
 * or allows quick direct sign-in for users.
 */
export default function LoginPage() {
  return <Navigate to="/" replace />;
}
