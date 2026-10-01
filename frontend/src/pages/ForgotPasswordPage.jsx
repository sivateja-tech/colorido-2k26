import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, ArrowLeft, ArrowRight, RotateCw, AlertCircle,
  KeyRound, CheckCircle2, Lock, Eye, EyeOff, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, resendResetCode, resetPassword } = useAuth();

  // Step 1 = Enter Email, Step 2 = Enter 6-digit code & new password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  // Step 2 Form fields
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendNotice, setResendNotice] = useState('');

  // 60s countdown timer for Resend Reset Code
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Request 6-digit Reset Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setResendNotice('');

    try {
      const res = await forgotPassword(cleanEmail);

      if (res.success) {
        setStep(2);
        setResendCooldown(60);
        setSuccessMsg(res.message || 'If an account exists with this email, a 6-digit reset code has been sent.');
      } else if (res.rateLimited) {
        setErrorMsg(res.message || `Please wait ${res.retryAfter || 60} seconds before requesting another code.`);
        setResendCooldown(res.retryAfter || 60);
      } else {
        setErrorMsg(res.message || 'Unable to process reset request. Please try again.');
      }
    } catch (err) {
      setErrorMsg('A connection error occurred. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Resend 6-digit Reset Code (Dedicated with 60s cooldown)
  const handleResendCode = async () => {
    if (resending || resendCooldown > 0) return;
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) return;

    setResending(true);
    setErrorMsg('');
    setResendNotice('');

    try {
      const res = await resendResetCode(cleanEmail);
      if (res.success) {
        setResendCooldown(60);
        setResendNotice('A fresh 6-digit code has been dispatched to your email.');
      } else if (res.rateLimited) {
        setResendCooldown(res.retryAfter || 60);
        setErrorMsg(res.message || `Please wait ${res.retryAfter || 60} seconds before requesting another code.`);
      } else {
        setErrorMsg(res.message || 'Failed to resend reset code.');
      }
    } catch (err) {
      setErrorMsg('Failed to resend reset code. Please check your connection.');
    } finally {
      setResending(false);
    }
  };

  // Step 2: Reset Password with 6-digit code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setResendNotice('');

    const cleanCode = code.replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({
        email: email.trim().toLowerCase(),
        code: cleanCode,
        newPassword,
        confirmPassword
      });

      if (res.success) {
        setSuccessMsg('Password has been successfully reset! Redirecting to Sign In...');
        setTimeout(() => {
          navigate('/auth', {
            state: {
              email: email.trim().toLowerCase(),
              message: 'Password reset successful! Please sign in with your new password.'
            }
          });
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Invalid or expired 6-digit reset code. Please try again.');
      }
    } catch (err) {
      setErrorMsg('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-16">
      <div className="max-w-md w-full space-y-6">
        <div className="flex items-center justify-start">
          <BackButton fallback="/auth" label="Back to Sign In" />
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <img src="/rvrjc_logo.png" alt="RVRJC Logo" className="w-10 h-10 object-contain" />
            <span className="font-display font-black text-2xl tracking-tight text-[#ECF0F1]">
              COLORIDO <span className="text-[#E67E22]">2K26</span>
            </span>
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-[#2980B9]/15 border border-[#2980B9]/30 text-[#2980B9] mx-auto flex items-center justify-center shadow-md">
            <KeyRound className="w-6 h-6 text-[#2980B9]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-[#ECF0F1]">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-xs sm:text-sm text-[#95A5A6]">
            {step === 1
              ? 'Enter your registered email to receive a secure 6-digit reset code.'
              : 'Enter the 6-digit code sent to your email and set your new password.'}
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50]/80 backdrop-blur-xl border border-[#95A5A6]/20 shadow-2xl space-y-5">
          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-start justify-between gap-2.5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg('')}
                className="text-red-400 hover:text-red-200 text-xs font-bold p-0.5 ml-1 shrink-0"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* Resend Notice */}
          {resendNotice && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#2980B9]/20 border border-[#2980B9]/40 text-xs font-semibold text-[#ECF0F1] animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#2980B9] shrink-0" />
              <span>{resendNotice}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
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
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs sm:text-sm text-[#ECF0F1] placeholder:text-[#95A5A6]/50 focus:outline-none focus:border-[#2980B9]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] shadow-lg shadow-[#2980B9]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#95A5A6] hover:text-[#ECF0F1] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: Enter 6-digit Code + New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Target Email Info & Change Email Button */}
              <div className="p-3.5 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 flex items-center justify-between gap-2">
                <div className="space-y-0.5 overflow-hidden">
                  <div className="text-[10px] uppercase font-bold text-[#95A5A6] tracking-wider">
                    Code Sent To
                  </div>
                  <div className="font-mono text-xs font-bold text-[#E67E22] truncate">
                    {email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setCode('');
                    setErrorMsg('');
                    setSuccessMsg('');
                    setResendNotice('');
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#95A5A6] hover:text-white bg-[#2C3E50] rounded-lg border border-[#95A5A6]/20 transition-colors shrink-0"
                >
                  Change Email
                </button>
              </div>

              {/* 6-Digit Verification Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#2980B9]" />
                    <span>6-Digit Reset Code *</span>
                  </span>
                  <span className="text-[11px] text-[#95A5A6]/70 lowercase font-normal">
                    expires in 10 mins
                  </span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(digitsOnly);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 text-center font-mono text-xl sm:text-2xl tracking-[0.4em] font-black text-[#ECF0F1] placeholder:text-[#95A5A6]/30 focus:outline-none focus:border-[#2980B9]"
                />
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2980B9]" />
                  <span>New Password *</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Min 6 characters"
                    className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs sm:text-sm text-[#ECF0F1] placeholder:text-[#95A5A6]/50 focus:outline-none focus:border-[#2980B9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#95A5A6] hover:text-[#ECF0F1]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2980B9]" />
                  <span>Confirm Password *</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Repeat new password"
                    className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs sm:text-sm text-[#ECF0F1] placeholder:text-[#95A5A6]/50 focus:outline-none focus:border-[#2980B9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#95A5A6] hover:text-[#ECF0F1]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Reset */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] shadow-lg shadow-[#2980B9]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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

              {/* Resend Reset Code Button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  disabled={resending || resendCooldown > 0}
                  onClick={handleResendCode}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E67E22] hover:text-[#d35400] transition-colors disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>
                    {resending
                      ? 'Sending fresh code...'
                      : resendCooldown > 0
                      ? `Resend Code in ${resendCooldown}s`
                      : 'Resend Reset Code'}
                  </span>
                </button>
              </div>

              <div className="text-center pt-2 border-t border-[#95A5A6]/10">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#95A5A6] hover:text-[#ECF0F1] transition-colors"
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
