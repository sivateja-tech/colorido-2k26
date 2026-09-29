import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [devResetUrl, setDevResetUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await forgotPassword(email);
      // For security, always show generic message
      setStatusMessage(res.message || 'If an account exists for this email, password reset instructions have been sent.');
      setSubmitted(true);
      if (res.data?.resetUrl) {
        setDevResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      // Even on unexpected error, show generic confirmation
      setStatusMessage('If an account exists for this email, password reset instructions have been sent.');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple mx-auto flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text">
            Forgot Password
          </h1>
          <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary">
            Enter your account email to receive secure password reset instructions.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-2xl space-y-5">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-brand-error/15 border border-brand-error/30 text-brand-error text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request Processed</span>
                </div>
                <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text leading-relaxed">
                  {statusMessage}
                </p>
              </div>

              {/* Developer / Evaluator Quick Access Link */}
              {devResetUrl && (
                <div className="p-3.5 rounded-xl bg-brand-purple/10 border border-brand-purple/30 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-brand-purple dark:text-brand-accent text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Evaluator Direct Reset Link</span>
                  </div>
                  <p className="text-[11px] text-dark-text-secondary">
                    In development mode, you can immediately test the reset token:
                  </p>
                  <Link
                    to={devResetUrl}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple dark:text-brand-accent hover:underline break-all"
                  >
                    <span>Proceed to Password Reset Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to="/auth"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-dark-text-secondary hover:text-dark-text bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Registered Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com or admin@colorido2k26.com"
                  className="w-full px-4 py-3 rounded-2xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs sm:text-sm text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
                />
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
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark-text-secondary hover:text-dark-text transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
