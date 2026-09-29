import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { verifyResetToken } from '../services/api';
import BackButton from '../components/BackButton';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Verify token on mount
  useEffect(() => {
    async function verify() {
      if (!token) {
        setErrorMsg('Password reset token is missing from the URL.');
        setVerifying(false);
        return;
      }

      try {
        const res = await verifyResetToken(token);
        if (res.data?.success) {
          setTokenValid(true);
        } else {
          setErrorMsg(res.data?.message || 'Invalid or expired password reset token.');
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Invalid or expired password reset token. Please request a new one.');
      } finally {
        setVerifying(false);
      }
    }

    verify();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({
        token,
        newPassword,
        confirmPassword
      });

      if (res.success) {
        setSuccessMsg(res.message || 'Password has been successfully reset!');
        setTimeout(() => {
          navigate('/auth', {
            state: { message: 'Password reset successful! Please sign in with your new password.' }
          });
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Failed to reset password.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="flex items-center justify-start">
          <BackButton fallback="/auth" label="Back to Sign In" />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple mx-auto flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text">
            Set New Password
          </h1>
          <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary">
            Create a strong new password for your COLORIDO 2K26 account.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-2xl space-y-5">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-brand-error/15 border border-brand-error/30 text-brand-error text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {verifying ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-dark-text-secondary">Verifying secure token...</p>
            </div>
          ) : !tokenValid ? (
            <div className="space-y-4 pt-2">
              <p className="text-xs text-dark-text-secondary leading-relaxed text-center">
                This reset token is invalid, expired, or has already been used. Please request a new link.
              </p>
              <Link
                to="/forgot-password"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover flex items-center justify-center gap-2 shadow-md"
              >
                <span>Request New Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-purple" />
                  <span>New Password *</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full pl-4 pr-11 py-3 rounded-2xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs sm:text-sm text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Confirm New Password *</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-4 pr-11 py-3 rounded-2xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs sm:text-sm text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-brand-purple/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <Link
              to="/auth"
              className="text-xs font-semibold text-dark-text-secondary hover:text-dark-text transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
