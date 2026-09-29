import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles, Lock, Mail, User, Phone, Building, BookOpen,
  Calendar, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, role, user } = useAuth();

  // Mode: 'signin' or 'signup'
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState(initialMode);
  const redirectTarget = searchParams.get('redirect') || location.state?.from?.pathname;

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Create Account Form State
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: 'R V R & J C College of Engineering',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    password: '',
    confirmPassword: ''
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

  // State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(location.state?.error || '');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  // If already authenticated, redirect based on role
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(redirectTarget || '/events', { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate, redirectTarget]);

  // Handle Sign In submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await login(signInEmail, signInPassword);
      if (res.success) {
        // Redirection based on server-verified role
        if (res.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(redirectTarget || '/events', { replace: true });
        }
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Create Account submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your passwords.');
      return;
    }

    if (signUpForm.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(signUpForm);
      if (res.success) {
        // Account created with strict role = 'USER'
        navigate(redirectTarget || '/events', { replace: true });
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Evaluator Autofill Helpers
  const fillAdminCredentials = () => {
    setMode('signin');
    setSignInEmail('admin@colorido2k26.com');
    setSignInPassword('Admin@Colorido2026!');
    setErrorMsg('');
  };

  const fillParticipantCredentials = () => {
    setMode('signup');
    setSignUpForm({
      fullName: 'Venkata Sivateja Kodavatiganti',
      email: 'sivatejakodavatiganti@gmail.com',
      phone: '+91 98765 43210',
      college: 'R V R & J C College of Engineering',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      password: 'Student@2026!',
      confirmPassword: 'Student@2026!'
    });
    setErrorMsg('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-16">
      <div className="max-w-xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <img src="/rvrjc_logo.png" alt="RVRJC Logo" className="w-10 h-10 object-contain" />
            <span className="font-display font-black text-2xl tracking-tight text-dark-text dark:text-dark-text light:text-light-text">
              COLORIDO <span className="text-brand-purple dark:text-brand-accent">2K26</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create Festival Account'}
          </h1>
          <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary max-w-sm mx-auto">
            {mode === 'signin'
              ? 'Access your registrations, festival entry passes, schedules, or admin portal.'
              : 'Register for championships across Sports, Cultural, and Technical pillars.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-2xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-dark-bg dark:bg-dark-bg light:bg-slate-100 border border-dark-border dark:border-dark-border light:border-light-border">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
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

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="name@example.com or admin@colorido2k26.com"
                  className="w-full px-4 py-3 rounded-2xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs sm:text-sm text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Password *</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-brand-purple hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-4 pr-11 py-3 rounded-2xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs sm:text-sm text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-brand-purple/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* CREATE ACCOUNT FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={signUpForm.fullName}
                  onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                  placeholder="e.g. Venkata Sivateja Kodavatiganti"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    placeholder="name@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={signUpForm.phone}
                    onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* College */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-brand-purple" />
                  <span>College / Institution *</span>
                </label>
                <input
                  type="text"
                  required
                  value={signUpForm.college}
                  onChange={(e) => setSignUpForm({ ...signUpForm, college: e.target.value })}
                  placeholder="R V R & J C College of Engineering"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                />
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Department *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpForm.department}
                    onChange={(e) => setSignUpForm({ ...signUpForm, department: e.target.value })}
                    placeholder="Computer Science & Engineering"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Academic Year *</span>
                  </label>
                  <select
                    value={signUpForm.year}
                    onChange={(e) => setSignUpForm({ ...signUpForm, year: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-muted"
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Confirm Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpConfirmPassword ? 'text' : 'password'}
                      required
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      placeholder="Repeat password"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-muted"
                    >
                      {showSignUpConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-brand-purple/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Evaluator Autofill Toolbar */}
          <div className="pt-4 border-t border-dark-border dark:border-dark-border light:border-light-border space-y-2">
            <div className="text-[11px] font-bold text-dark-muted uppercase tracking-wider text-center">
              Competition Evaluator Quick Fill
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3 h-3" />
                <span>Autofill Admin</span>
              </button>
              <button
                type="button"
                onClick={fillParticipantCredentials}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple dark:text-brand-accent border border-brand-purple/30 transition-colors flex items-center gap-1.5"
              >
                <User className="w-3 h-3" />
                <span>Autofill Participant</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
