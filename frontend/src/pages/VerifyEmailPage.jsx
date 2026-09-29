import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RotateCw, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { verifyEmail, resendEmailVerification } from '../services/api';
import BackButton from '../components/BackButton';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // verifying, success, already_verified, error
  const [message, setMessage] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided in the link. Please request a new activation link.');
      return;
    }

    async function handleVerification() {
      try {
        setStatus('verifying');
        const res = await verifyEmail(token);
        if (res.data?.success) {
          if (res.data.alreadyVerified) {
            setStatus('already_verified');
          } else {
            setStatus('success');
          }
          setMessage(res.data.message || 'Account activated successfully!');
          setVerifiedEmail(res.data.email || '');
        } else {
          setStatus('error');
          setMessage(res.data?.message || 'Invalid or expired activation link.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to verify email. The activation link may have expired.');
        if (err.response?.data?.email) {
          setResendEmail(err.response.data.email);
        }
      }
    }

    handleVerification();
  }, [token]);

  const handleResend = async (e) => {
    e?.preventDefault();
    if (!resendEmail) return;

    try {
      setResending(true);
      setResendNotice('');
      const res = await resendEmailVerification(resendEmail);
      setResendNotice(res.data?.message || 'A fresh activation link has been sent to your email.');
    } catch (err) {
      setResendNotice(err.response?.data?.message || 'Failed to resend activation link.');
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
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <img src="/rvrjc_logo.png" alt="RVRJC Logo" className="w-10 h-10 object-contain" />
            <span className="font-display font-black text-2xl tracking-tight text-[#ECF0F1]">
              COLORIDO <span className="text-[#E67E22]">2K26</span>
            </span>
          </Link>
          <p className="text-xs uppercase font-bold tracking-widest text-[#2980B9]">
            Account Activation Portal
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface border border-dark-border shadow-2xl space-y-6">
          {/* Status: Verifying */}
          {status === 'verifying' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 border-4 border-[#2980B9] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h2 className="text-lg font-bold text-[#ECF0F1]">Activating Your Account...</h2>
                <p className="text-xs text-[#BDC3C7] mt-1">Verifying your security token with COLORIDO 2K26.</p>
              </div>
            </div>
          )}

          {/* Status: Success (Account Activated!) */}
          {status === 'success' && (
            <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Account Activated
                </span>
                <h2 className="text-2xl font-black font-display text-[#ECF0F1]">
                  Email Verified!
                </h2>
                <p className="text-xs sm:text-sm text-[#BDC3C7] leading-relaxed max-w-sm mx-auto">
                  Your email {verifiedEmail && <strong>({verifiedEmail})</strong>} has been successfully verified. Your COLORIDO 2K26 account is now active and ready for event registrations.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to={`/auth?mode=signin${verifiedEmail ? `&email=${encodeURIComponent(verifiedEmail)}` : ''}`}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#2980B9] hover:bg-[#3498DB] flex items-center justify-center gap-2 shadow-lg shadow-[#2980B9]/20 transition-all hover:scale-[1.02]"
                >
                  <span>Proceed to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Status: Already Verified */}
          {status === 'already_verified' && (
            <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#2980B9]/15 border-2 border-[#2980B9]/30 text-[#3498DB] mx-auto flex items-center justify-center">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black font-display text-[#ECF0F1]">
                  Already Activated
                </h2>
                <p className="text-xs sm:text-sm text-[#BDC3C7] leading-relaxed">
                  This account has already been verified and is active. You can log in directly to view events and registrations.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/auth?mode=signin"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#2980B9] hover:bg-[#3498DB] flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Status: Error / Expired */}
          {status === 'error' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-brand-error/15 border border-brand-error/30 text-brand-error flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">Activation Link Expired or Invalid</p>
                  <p>{message}</p>
                </div>
              </div>

              {resendNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resendNotice}</span>
                </div>
              )}

              {/* Form to resend activation link */}
              <form onSubmit={handleResend} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#BDC3C7] mb-1.5">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#95A5A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. participant@domain.com"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1A252F] border border-dark-border text-xs text-[#ECF0F1] placeholder-[#95A5A6] focus:outline-none focus:border-[#2980B9]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resending || !resendEmail}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#2980B9] hover:bg-[#3498DB] flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {resending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Resend Activation Link</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center border-t border-dark-border">
                <Link
                  to="/auth?mode=signin"
                  className="text-xs font-semibold text-[#95A5A6] hover:text-[#ECF0F1] transition-colors"
                >
                  &larr; Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
