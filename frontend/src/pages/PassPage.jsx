import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ticket, Search, AlertCircle, ShieldCheck } from 'lucide-react';
import { fetchPassById } from '../services/api';
import DigitalPass from '../components/DigitalPass';

export default function PassPage() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(routeId || '');
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async (codeToSearch) => {
    const code = (codeToSearch || searchId).trim().toUpperCase();
    if (!code) {
      setError('Please enter a valid Registration ID (e.g. COL26-XXXXX).');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetchPassById(code);
      if (res.data?.success) {
        setPass(res.data.data);
      } else {
        setPass(null);
        setError('Registration pass not found for the provided ID.');
      }
    } catch (err) {
      setPass(null);
      setError('Registration pass not found. Please double-check your Registration ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeId) {
      handleLookup(routeId);
    }
  }, [routeId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Ticket className="w-3.5 h-3.5" />
          <span>Pass Verification &amp; Entry Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
          Festival Registration Pass
        </h1>
        <p className="text-xs sm:text-sm text-dark-text-secondary max-w-lg mx-auto leading-relaxed">
          Lookup and download your official QR-verified admission pass for COLORIDO 2K26. Present this pass at security checkpoints.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="flex items-center gap-2 p-2 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-xl"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-dark-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. COL26-XXXXX"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              className="w-full pl-11 pr-3 py-2.5 rounded-xl bg-transparent text-xs sm:text-sm text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted font-mono focus:outline-none uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find Pass'}
          </button>
        </form>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-brand-error/15 border border-brand-error/30 text-brand-error flex items-start gap-3 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Verification Banner when pass is found */}
      {pass && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-300">Official Entry Pass Verified</p>
              <p className="text-xs text-emerald-400/80">Valid registration for COLORIDO 2K26 • Status: {pass.status || 'CONFIRMED'}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shrink-0">
            AUTHENTIC
          </span>
        </div>
      )}

      {/* Digital Pass Display */}
      {pass && (
        <div className="pt-2">
          <DigitalPass pass={pass} />
        </div>
      )}
    </div>
  );
}
