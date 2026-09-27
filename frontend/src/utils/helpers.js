// Format currency (INR)
export function formatCurrency(amount) {
  if (!amount) return 'Free';
  if (typeof amount === 'string' && amount.startsWith('₹')) return amount;
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Category Badge Color Helper supporting SPORTS, CULTURAL, TECHNICAL
export function getCategoryBadge(category) {
  const norm = category?.toUpperCase() || 'SPORTS';
  if (norm === 'SPORTS') {
    return {
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      label: 'Sports'
    };
  }
  if (norm === 'TECHNICAL') {
    return {
      bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      dot: 'bg-blue-400',
      label: 'Technical'
    };
  }
  return {
    bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    dot: 'bg-purple-400',
    label: 'Cultural'
  };
}

// Status Badge Helper
export function getStatusBadge(status) {
  switch (status?.toUpperCase()) {
    case 'UPCOMING':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'LIVE':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
    case 'FULL':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'COMPLETED':
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    case 'CONFIRMED':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'PENDING':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'REJECTED':
    case 'CANCELLED':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    case 'ATTENDED':
      return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}

// Truncate text
export function truncate(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
