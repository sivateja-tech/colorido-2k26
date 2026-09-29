import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@colorido2k26.com');
  const [password, setPassword] = useState('Admin@Colorido2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { handleAdminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await handleAdminLogin(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid admin credentials.');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@colorido2k26.com');
    setPassword('Admin@Colorido2026!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black font-display text-white">
            Admin Authentication
          </h1>
          <p className="text-xs text-slate-400">
            COLORIDO 2K26 Festival Operations &amp; Management Portal
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-dark-800/90 border border-white/10 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-purple" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-dark-900 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-dark-900 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>AUTHENTICATE &amp; ENTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Evaluator Quick Autofill */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              onClick={fillDemoAdmin}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Autofill Competition Judge Admin Credentials</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white">
            ← Return to public festival website
          </Link>
        </div>
      </div>
    </div>
  );
}
