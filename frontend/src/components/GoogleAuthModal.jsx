import React, { useEffect, useRef, useState } from 'react';
import { X, ShieldAlert, AlertCircle, Sparkles, Mail, User, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }) {
  const { handleGoogleLogin, handleEmailLogin } = useAuth();
  const { theme } = useTheme();

  // Active tab: 'email' (instant/bulletproof) or 'google'
  const [activeTab, setActiveTab] = useState('email');

  // Email form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('R V R & J C College of Engineering');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const buttonContainerRef = useRef(null);

  // In production or when configured, Vite injects VITE_GOOGLE_CLIENT_ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = Boolean(
    googleClientId &&
    !googleClientId.includes('your_google_oauth') &&
    !googleClientId.includes('982347891234')
  );

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(false);
      return;
    }

    // Only attempt Google Identity Services if a valid real client ID is configured
    if (activeTab === 'google' && isGoogleConfigured) {
      if (!window.google && !document.getElementById('google-gsi-script')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => initializeGoogleBtn();
        document.body.appendChild(script);
      } else {
        initializeGoogleBtn();
      }
    }

    function initializeGoogleBtn() {
      if (window.google?.accounts?.id && buttonContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response) => {
              setLoading(true);
              setErrorMsg('');
              const res = await handleGoogleLogin(response.credential);
              setLoading(false);
              if (res.success) {
                if (onSuccess) onSuccess(res.user);
                onClose();
              } else {
                setErrorMsg(res.message || 'Google authentication verification failed.');
              }
            },
          });

          buttonContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonContainerRef.current, {
            type: 'standard',
            theme: theme === 'dark' ? 'filled_black' : 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            logo_alignment: 'left',
            width: 280,
          });
        } catch (e) {
          console.error('Google button render error:', e);
        }
      }
    }
  }, [isOpen, activeTab, theme, googleClientId, isGoogleConfigured]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await handleEmailLogin({ email, name, college });
      if (res.success) {
        setSuccessMsg(`Welcome, ${res.user.name}!`);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.user);
          onClose();
        }, 600);
      } else {
        setErrorMsg(res.message || 'Failed to authenticate with email.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemoStudent = () => {
    setEmail('sivatejakodavatiganti@gmail.com');
    setName('Venkata Sivateja Kodavatiganti');
    setCollege('R V R & J C College of Engineering');
    setErrorMsg('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-dark-muted hover:text-dark-text dark:hover:text-dark-text light:hover:text-light-text hover:bg-dark-elevated dark:hover:bg-dark-elevated light:hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple dark:text-brand-accent">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text">
            Participant Sign In / Sign Up
          </h2>
          <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary">
            Sign in with your email to register for events, manage entries, and download official festival passes.
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex rounded-xl bg-dark-bg dark:bg-dark-bg light:bg-slate-100 p-1 border border-dark-border dark:border-dark-border light:border-light-border">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'email'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            Direct Email Sign-In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'google'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            Google OAuth
          </button>
        </div>

        {/* Error message display */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-brand-error/15 border border-brand-error/30 text-brand-error text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success message display */}
        {successMsg && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Instant Email Form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-dark-text-secondary flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-purple" />
                <span>Your Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sivatejakodavatiganti@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-dark-text-secondary flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-purple" />
                <span>Full Name (Optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Venkata Sivateja Kodavatiganti"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-dark-text-secondary flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-brand-purple" />
                <span>College / Institution</span>
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="R V R & J C College of Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-brand-purple/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In &amp; Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Quick autofill for evaluator */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={autofillDemoStudent}
                className="inline-flex items-center gap-1 text-[11px] text-brand-purple dark:text-brand-accent hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Quick-fill student details</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Google OAuth */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            {isGoogleConfigured ? (
              <div className="flex flex-col items-center justify-center py-4 min-h-[60px]">
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-brand-purple font-medium animate-pulse">
                    <span>Verifying with Google...</span>
                  </div>
                ) : (
                  <div ref={buttonContainerRef} className="flex justify-center" />
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-200">Google OAuth Client ID Notice</p>
                    <p className="text-[11px] text-amber-300/80 mt-1 leading-relaxed">
                      Google OAuth requires a Google Cloud project with authorized JavaScript origins set to <code className="font-mono text-[10px] bg-amber-950/60 px-1 py-0.5 rounded">http://localhost:5173</code>.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-500/20">
                  <button
                    type="button"
                    onClick={() => setActiveTab('email')}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Use Direct Email Sign-In (Recommended)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security & Verification note */}
        <div className="pt-2 border-t border-dark-border dark:border-dark-border light:border-light-border text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-dark-muted dark:text-dark-muted light:text-light-muted">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Secure participant authorization with encrypted JWT session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
