import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import BackButton from '../components/BackButton';

export default function VerifyEmailPage() {
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
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-[#ECF0F1]">
            Immediate Access Enabled
          </h1>
          <p className="text-xs sm:text-sm text-[#95A5A6]">
            Email verification is no longer required for COLORIDO 2K26. Accounts are active immediately upon registration.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50]/80 backdrop-blur-xl border border-[#95A5A6]/20 shadow-2xl space-y-5 text-center">
          <div className="p-4 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 space-y-2 text-xs text-[#95A5A6]">
            <div className="font-bold text-[#ECF0F1] flex items-center justify-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-[#2980B9]" />
              <span>Direct Sign In Ready</span>
            </div>
            <p className="leading-relaxed">
              You can log in directly with your email and password to view championships, register teams, and download festival passes.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/auth?mode=signin"
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-[#2980B9] hover:bg-[#2471A3] flex items-center justify-center gap-2 shadow-lg shadow-[#2980B9]/20 transition-all"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
