import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Building, Sparkles, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchLeaderboard } from '../services/api';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchLeaderboard();
      if (res.data?.success) {
        setLeaderboard(res.data.data);
      }
    } catch (err) {
      setError('Could not calculate championship points table.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Championship Tally</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
            Overall College Standings
          </h1>
          <p className="text-xs sm:text-sm text-dark-text-secondary max-w-xl leading-relaxed">
            Overall points calculated on tournament podium finishes (Gold: 10 pts, Silver: 7 pts, Bronze: 5 pts).
          </p>
        </div>

        <Link
          to="/results"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-dark-elevated hover:bg-dark-highest border border-dark-border text-dark-text transition-all shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Event Results</span>
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-6 rounded-2xl bg-brand-error/15 border border-brand-error/30 text-center space-y-3">
          <p className="text-xs font-semibold text-brand-error">{error}</p>
          <button
            onClick={loadLeaderboard}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-error inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && leaderboard.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-dark-surface border border-dark-border space-y-2">
          <Trophy className="w-10 h-10 text-dark-muted mx-auto opacity-50" />
          <h3 className="text-base font-bold text-dark-text">No points scored yet</h3>
          <p className="text-xs text-dark-text-secondary">Points will be updated once results are published.</p>
        </div>
      )}

      {/* Leaderboard Table / Cards */}
      {!loading && !error && leaderboard.length > 0 && (
        <div className="rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border bg-dark-elevated/40 dark:bg-dark-elevated/40 light:bg-light-surface-secondary text-[11px] font-bold uppercase tracking-wider text-dark-muted">
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">College / Institution</th>
                  <th className="py-4 px-4 text-center text-amber-400">🥇 Gold</th>
                  <th className="py-4 px-4 text-center text-slate-300">🥈 Silver</th>
                  <th className="py-4 px-4 text-center text-amber-600">🥉 Bronze</th>
                  <th className="py-4 px-6 text-right font-black text-brand-purple">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border text-xs">
                {leaderboard.map((item, index) => {
                  const isFirst = index === 0;
                  return (
                    <tr
                      key={item.college}
                      className={`hover:bg-dark-elevated/40 transition-colors ${
                        isFirst ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-4 px-6 text-center font-mono font-bold">
                        {index === 0 ? (
                          <span className="inline-flex w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 items-center justify-center border border-amber-500/40">
                            1
                          </span>
                        ) : index === 1 ? (
                          <span className="inline-flex w-7 h-7 rounded-full bg-slate-400/20 text-slate-300 items-center justify-center border border-slate-400/40">
                            2
                          </span>
                        ) : index === 2 ? (
                          <span className="inline-flex w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 items-center justify-center border border-amber-700/40">
                            3
                          </span>
                        ) : (
                          <span className="text-dark-muted">{index + 1}</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-dark-text dark:text-dark-text light:text-light-text flex items-center gap-2">
                          <Building className="w-4 h-4 text-dark-muted shrink-0" />
                          <span>{item.college}</span>
                        </div>
                        {item.eventsWon?.length > 0 && (
                          <p className="text-[11px] text-dark-muted mt-0.5 truncate max-w-md">
                            Podiums: {item.eventsWon.join(', ')}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-bold text-amber-400">
                        {item.gold}
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-300">
                        {item.silver}
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-amber-600">
                        {item.bronze}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-black text-base text-brand-purple dark:text-brand-accent light:text-brand-light-primary">
                        {item.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
