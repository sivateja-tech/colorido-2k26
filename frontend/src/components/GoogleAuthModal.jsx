import React, { useEffect, useRef, useState } from 'react';
import { X, ShieldAlert, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }) {
  const { handleGoogleLogin } = useAuth();
  const { theme } = useTheme();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const buttonContainerRef = useRef(null);

  // In production, Vite injects VITE_GOOGLE_CLIENT_ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '982347891234-colorido2026.apps.googleusercontent.com';

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg('');
      return;
    }

    // Load Google Identity Services script if not already loaded
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
  }, [isOpen, theme, googleClientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
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
            Sign in to COLORIDO 2K26
          </h2>
          <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary">
            Use your official Google account to register for events, manage entries, and download your festival pass.
          </p>
        </div>

        {/* Error message display */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-brand-error/15 border border-brand-error/30 text-brand-error text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Render Container */}
        <div className="flex flex-col items-center justify-center py-2 min-h-[50px]">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-brand-purple font-medium animate-pulse">
              <span>Verifying with Google...</span>
            </div>
          ) : (
            <div ref={buttonContainerRef} className="flex justify-center" />
          )}
        </div>

        {/* Security & Verification note */}
        <div className="pt-2 border-t border-dark-border dark:border-dark-border light:border-light-border text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-dark-muted dark:text-dark-muted light:text-light-muted">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Authenticated securely via Google Identity Services &amp; JWT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
