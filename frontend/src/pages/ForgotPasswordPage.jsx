import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, RotateCw, AlertCircle, KeyRound, Check, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [resendNotice, setResendNotice] = useState(null);
  const [devResetUrl, setDevResetUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResendNotice(null);
    setRedirecting(false);

    try {
      const res = await forgotPassword(cleanEmail);

      if (res.success) {
        setSubmitted(true);
        const resetLink = res.resetUrl || res.data?.resetUrl || res.data?.data?.resetUrl;
        if (resetLink) {
          setDevResetUrl(resetLink);
        }
      } else if (res.rateLimited) {
        setErrorMsg(res.message || 'Please wait a moment before requesting another reset link.');
      } else if (res.notFound || res.userNotFound) {
        // CASE: Email does not exist in DB -> redirect to Create Account
        setErrorMsg('No account found with this email address. Redirecting to Create Account...');
        setRedirecting(true);

        setTimeout(() => {
          navigate(`/auth?mode=signup&email=${encodeURIComponent(cleanEmail)}`, {
            state: {
              error: 'No account found with this email. Please register to create your account.',
              email: cleanEmail,
              mode: 'signup'
            }
          });
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Unable to process reset request. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'A network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setErrorMsg('');
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setResendNotice(`Reset link successfully resent to ${email}!`);
        if (res.data?.resetUrl) {
          setDevResetUrl(res.data.resetUrl);
        }
      } else if (res.notFound || res.userNotFound) {
        navigate(`/auth?mode=signup&email=${encodeURIComponent(email)}`, {
          state: {
            error: 'No account found with this email. Please register to create your account.',
            email,
            mode: 'signup'
          }
        });
      } else {
        setErrorMsg(res.message || 'Failed to resend reset link.');
      }
    } catch (err) {
      setErrorMsg('Failed to resend reset link. Please check your connection.');
    } finally {
      setResending(false);
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
          <div className="w-12 h-12 rounded-2xl bg-[#2980B9]/15 border border-[#2980B9]/30 text-[#2980B9] mx-auto flex items-center justify-center mb-3 shadow-md">
            <KeyRound className="w-6 h-6 text-[#2980B9]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Forgot Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your account email to receive secure password reset instructions.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface border border-dark-border shadow-2xl space-y-5">
          {errorMsg && !redirecting && (
            <div className="flex items-start justify-between gap-2.5 p-3.5 rounded-xl bg-brand-error/15 border border-brand-error/30 text-brand-error text-xs font-semibold animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg('')}
                className="text-brand-error/70 hover:text-brand-error text-xs font-bold px-1 shrink-0"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          )}

          {/* Account Not Found -> Redirect to Create Account Banner */}
          {redirecting && (
            <div className="p-4 rounded-2xl bg-[#E67E22]/15 border border-[#E67E22]/35 text-[#E67E22] space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <div className="w-4 h-4 border-2 border-[#E67E22] border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Account Not Found</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                No account exists for <strong className="text-white font-mono">{email}</strong>. Transferring you to Create Account with your email pre-filled...
              </p>
              <button
                type="button"
                onClick={() => navigate(`/auth?mode=signup&email=${encodeURIComponent(email)}`, {
                  state: { error: 'No account found with this email. Please register to create your account.', email, mode: 'signup' }
                })}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#E67E22] hover:bg-[#D35400] flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Go to Create Account Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {submitted ? (
            <div className="space-y-4">
              {/* Email Sent Confirmation Display */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Mail className="w-4 h-4" />
                  <span>Link Sent to Email</span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-300">
                    A secure password reset link has been dispatched to:
                  </p>
                  <p className="font-mono text-sm font-bold text-white bg-dark-elevated/80 border border-white/10 px-3.5 py-2 rounded-xl break-all">
                    {email}
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Please check your inbox (and spam or junk folder) for instructions to reset your password. The link expires in <strong>60 minutes</strong>.
                </p>
              </div>

              {/* Resend success alert */}
              {resendNotice && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#2980B9]/15 border border-[#2980B9]/30 text-xs font-semibold text-[#2980B9]">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{resendNotice}</span>
                </div>
              )}

              {/* Action Buttons: Resend Link & Change Email */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResend}
                  className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#2980B9] hover:bg-[#1F618D] flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {resending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Resend Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setResendNotice(null);
                  }}
                  className="py-3 px-4 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-dark-elevated hover:bg-dark-highest border border-dark-border transition-all"
                >
                  Change Email
                </button>
              </div>

              {/* Evaluator Direct Reset Link */}
              {devResetUrl && (
                <div className="p-3.5 rounded-xl bg-[#2980B9]/10 border border-[#2980B9]/30 text-xs space-y-2 mt-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#2980B9] text-[11px] uppercase tracking-wider">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Evaluator Direct Reset Link</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    For local testing, you can also click the link directly:
                  </p>
                  <Link
                    to={devResetUrl}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2980B9] hover:underline break-all"
                  >
                    <span>Proceed to Password Reset Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Return to Sign In */}
              <div className="pt-2">
                <Link
                  to="/auth"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-dark-elevated border border-dark-border flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2980B9]" />
                  <span>Registered Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="name@example.com or admin@colorido2k26.com"
                  className="w-full px-4 py-3 rounded-2xl bg-dark-elevated border border-dark-border text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2980B9]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || redirecting}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#2980B9] hover:bg-[#1F618D] shadow-lg shadow-[#2980B9]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
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
