import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import {
  Lock, Mail, User, Phone, Building, BookOpen,
  Calendar, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Shield,
  GraduationCap, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, role } = useAuth();

  // Mode: 'signin' or 'signup'
  const modeParam = searchParams.get('mode') || searchParams.get('tab');
  const initialMode = (modeParam === 'signup' || modeParam === 'register' || location.state?.mode === 'signup') ? 'signup' : 'signin';
  const [mode, setMode] = useState(initialMode);
  const redirectTarget = searchParams.get('redirect') || location.state?.from?.pathname;

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState(searchParams.get('email') || location.state?.email || '');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Create Account Form State
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: searchParams.get('email') || location.state?.email || '',
    phone: '',
    college: 'R V R & J C College of Engineering',
    course: 'B.Tech',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    password: '',
    confirmPassword: ''
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

  // General feedback state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(location.state?.error || '');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  const handleSignUpFieldChange = (field, value) => {
    setSignUpForm((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
  };

  // Sync mode and prefill email whenever searchParams or location.state change
  useEffect(() => {
    const m = searchParams.get('mode') || searchParams.get('tab');
    if (m === 'signup' || m === 'register' || location.state?.mode === 'signup') {
      setMode('signup');
    }
    const prefillEmail = searchParams.get('email') || location.state?.email;
    if (prefillEmail) {
      setSignUpForm((prev) => ({ ...prev, email: prefillEmail }));
      setSignInEmail(prefillEmail);
    }
    if (location.state?.error) {
      setErrorMsg(location.state.error);
    }
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
    }
  }, [searchParams, location.state]);

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
    if (loading) return; // Prevent double-click
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await login(signInEmail, signInPassword);
      if (res.success) {
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

  // Handle Create Account submission (Immediate activation)
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double-click
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
        setSuccessMsg(res.message || 'Account created successfully! Welcome to COLORIDO 2K26.');
        // User is immediately active and authenticated
        setTimeout(() => {
          navigate(redirectTarget || res.redirectTo || '/events', { replace: true });
        }, 700);
      } else {
        if (res.alreadyExists) {
          setErrorMsg('An account with this email is already registered. Please sign in instead.');
        } else {
          setErrorMsg(res.message || 'Registration failed. Please check your details and try again.');
        }
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
      course: 'B.Tech',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      password: 'Student@2026!',
      confirmPassword: 'Student@2026!'
    });
    setErrorMsg('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-16">
      <div className="max-w-xl w-full space-y-6 sm:space-y-8">
        <div className="flex items-center justify-start">
          <BackButton fallback="/" label="Back to Home" />
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <img src="/rvrjc_logo.png" alt="RVRJC Logo" className="w-10 h-10 object-contain" />
            <span className="font-display font-black text-2xl tracking-tight text-[#ECF0F1]">
              COLORIDO <span className="text-[#E67E22]">2K26</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-[#ECF0F1]">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create Festival Account'}
          </h1>
          <p className="text-xs sm:text-sm text-[#95A5A6] max-w-sm mx-auto">
            {mode === 'signin'
              ? 'Access your registrations, festival entry passes, schedules, or admin portal.'
              : 'Register for championships across Sports, Cultural, and Technical pillars.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50]/80 backdrop-blur-xl border border-[#95A5A6]/20 shadow-2xl space-y-6">

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-[#2980B9] text-white shadow-md'
                  : 'text-[#95A5A6] hover:text-[#ECF0F1]'
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
                  ? 'bg-[#2980B9] text-white shadow-md'
                  : 'text-[#95A5A6] hover:text-[#ECF0F1]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="flex-1 leading-relaxed">{errorMsg}</span>
              <button
                type="button"
                onClick={() => setErrorMsg('')}
                className="text-red-400 hover:text-red-200 transition-colors shrink-0 p-0.5 ml-1"
                title="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
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
                <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2980B9]" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => {
                    setSignInEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="name@example.com or admin@colorido2k26.com"
                  className="w-full px-4 py-3 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs sm:text-sm text-[#ECF0F1] placeholder:text-[#95A5A6]/50 focus:outline-none focus:border-[#2980B9]"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#2980B9]" />
                    <span>Password *</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#2980B9] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => {
                      setSignInPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs sm:text-sm text-[#ECF0F1] placeholder:text-[#95A5A6]/50 focus:outline-none focus:border-[#2980B9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#95A5A6] hover:text-[#ECF0F1]"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] shadow-lg shadow-[#2980B9]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#2980B9]" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={signUpForm.fullName}
                  onChange={(e) => handleSignUpFieldChange('fullName', e.target.value)}
                  placeholder="e.g. Venkata Sivateja Kodavatiganti"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs text-[#ECF0F1] focus:outline-none focus:border-[#2980B9]"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#2980B9]" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpForm.email}
                    onChange={(e) => handleSignUpFieldChange('email', e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs text-[#ECF0F1] focus:outline-none focus:border-[#2980B9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#2980B9]" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={signUpForm.phone}
                    onChange={(e) => handleSignUpFieldChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs text-[#ECF0F1] focus:outline-none focus:border-[#2980B9]"
                  />
                </div>
              </div>

              {/* College */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#2980B9]" />
                  <span>College / Institution *</span>
                </label>
                <input
                  type="text"
                  required
                  value={signUpForm.college}
                  onChange={(e) => handleSignUpFieldChange('college', e.target.value)}
                  placeholder="R V R & J C College of Engineering"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs text-[#ECF0F1] focus:outline-none focus:border-[#2980B9]"
                />
              </div>

              {/* Course & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#2980B9]" />
                    <span>Course *</span>
                  </label>
                  <select
                    value={signUpForm.course}
                    onChange={(e) => handleSignUpFieldChange('course', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs text-[#ECF0F1] focus:outline-none focus:border-[#2980B9]"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="B.Pharmacy">B.Pharmacy</option>
                    <option value="M.Pharmacy">M.Pharmacy</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2980B9]" />
                    <span>Academic Year *</span>
                  </label>
                  <select
                    value={signUpForm.year}
                    onChange={(e) => handleSignUpFieldChange('year', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs text-[#ECF0F1] focus:outline-none focus:border-[#2980B9]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2980B9]" />
                  <span>Department / Branch *</span>
                </label>
                <input
                  type="text"
                  required
                  value={signUpForm.department}
                  onChange={(e) => handleSignUpFieldChange('department', e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs text-[#ECF0F1] focus:outline-none focus:border-[#2980B9]"
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#2980B9]" />
                    <span>Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpForm.password}
                      onChange={(e) => handleSignUpFieldChange('password', e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs text-[#ECF0F1] focus:outline-none focus:border-[#2980B9]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#95A5A6] hover:text-[#ECF0F1]"
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A6] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#2980B9]" />
                    <span>Confirm Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpConfirmPassword ? 'text' : 'password'}
                      required
                      value={signUpForm.confirmPassword}
                      onChange={(e) => handleSignUpFieldChange('confirmPassword', e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/20 text-xs text-[#ECF0F1] focus:outline-none focus:border-[#2980B9]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#95A5A6] hover:text-[#ECF0F1]"
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
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] shadow-lg shadow-[#2980B9]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
          <div className="pt-4 border-t border-[#95A5A6]/20 space-y-2">
            <div className="text-[11px] font-bold text-[#95A5A6] uppercase tracking-wider text-center">
              Competition Evaluator Quick Fill
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#E67E22]/15 hover:bg-[#E67E22]/25 text-[#E67E22] border border-[#E67E22]/30 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3 h-3" />
                <span>Autofill Admin</span>
              </button>
              <button
                type="button"
                onClick={fillParticipantCredentials}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#2980B9]/15 hover:bg-[#2980B9]/25 text-[#2980B9] border border-[#2980B9]/30 transition-colors flex items-center gap-1.5"
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
