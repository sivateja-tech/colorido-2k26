// Format currency (INR)
export function formatCurrency(amount) {
  if (!amount) return 'Free';
  if (typeof amount === 'string' && amount.startsWith('₹')) return amount;
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Category Badge Color Helper supporting SPORTS, CULTURAL, TECHNICAL with high contrast in both themes
export function getCategoryBadge(category) {
  const norm = category?.toUpperCase() || 'SPORTS';
  if (norm === 'SPORTS') {
    return {
      bg: 'bg-emerald-500/15 text-emerald-400 light:text-emerald-700 light:bg-emerald-500/10 light:border-emerald-400/40 border-emerald-500/30 font-semibold',
      dot: 'bg-emerald-400 light:bg-emerald-600',
      label: 'Sports'
    };
  }
  if (norm === 'TECHNICAL') {
    return {
      bg: 'bg-blue-500/15 text-blue-400 light:text-blue-700 light:bg-blue-500/10 light:border-blue-400/40 border-blue-500/30 font-semibold',
      dot: 'bg-blue-400 light:bg-blue-600',
      label: 'Technical'
    };
  }
  return {
    bg: 'bg-purple-500/15 text-purple-400 light:text-purple-700 light:bg-purple-500/10 light:border-purple-400/40 border-purple-500/30 font-semibold',
    dot: 'bg-purple-400 light:bg-purple-600',
    label: 'Cultural'
  };
}

// Status Badge Helper with crisp contrast for dark and light modes
export function getStatusBadge(status) {
  switch (status?.toUpperCase()) {
    case 'UPCOMING':
      return 'bg-blue-500/15 text-blue-400 light:bg-blue-50 light:text-blue-700 light:border-blue-200 border-blue-500/30';
    case 'LIVE':
      return 'bg-rose-500/20 text-rose-400 light:bg-rose-50 light:text-rose-700 light:border-rose-200 border-rose-500/40 animate-pulse';
    case 'FULL':
      return 'bg-amber-500/15 text-amber-400 light:bg-amber-50 light:text-amber-800 light:border-amber-200 border-amber-500/30';
    case 'COMPLETED':
      return 'bg-slate-500/15 text-slate-400 light:bg-slate-100 light:text-slate-700 light:border-slate-300 border-slate-500/30';
    case 'CONFIRMED':
      return 'bg-emerald-500/15 text-emerald-400 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200 border-emerald-500/30';
    case 'PENDING':
      return 'bg-amber-500/15 text-amber-400 light:bg-amber-50 light:text-amber-800 light:border-amber-200 border-amber-500/30';
    case 'REJECTED':
    case 'CANCELLED':
      return 'bg-rose-500/15 text-rose-400 light:bg-rose-50 light:text-rose-700 light:border-rose-200 border-rose-500/30';
    case 'ATTENDED':
      return 'bg-purple-500/15 text-purple-400 light:bg-purple-50 light:text-purple-700 light:border-purple-200 border-purple-500/30';
    default:
      return 'bg-slate-800 text-slate-300 light:bg-slate-100 light:text-slate-700 light:border-slate-200 border-slate-700';
  }
}

// Truncate text
export function truncate(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}
