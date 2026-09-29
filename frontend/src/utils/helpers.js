// Format currency (INR)
export function formatCurrency(amount) {
  if (!amount) return 'Free';
  if (typeof amount === 'string' && amount.startsWith('₹')) return amount;
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Category Badge Color Helper supporting SPORTS, CULTURAL, TECHNICAL mapped to #2C3E50, #2980B9, #E67E22, #ECF0F1, #95A5A6
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
      bg: 'bg-[#2980B9]/15 text-[#3498DB] light:text-[#2980B9] light:bg-[#2980B9]/10 light:border-[#2980B9]/40 border-[#2980B9]/30 font-semibold',
      dot: 'bg-[#2980B9] light:bg-[#2980B9]',
      label: 'Technical'
    };
  }
  return {
    bg: 'bg-[#E67E22]/15 text-[#E67E22] light:text-[#D35400] light:bg-[#E67E22]/10 light:border-[#E67E22]/40 border-[#E67E22]/30 font-semibold',
    dot: 'bg-[#E67E22] light:bg-[#E67E22]',
    label: 'Cultural'
  };
}

// Status Badge Helper using palette colors
export function getStatusBadge(status) {
  switch (status?.toUpperCase()) {
    case 'UPCOMING':
      return 'bg-[#2980B9]/15 text-[#3498DB] light:bg-[#2980B9]/10 light:text-[#2980B9] light:border-[#2980B9]/30 border-[#2980B9]/30';
    case 'LIVE':
      return 'bg-[#E67E22]/20 text-[#E67E22] light:bg-[#E67E22]/10 light:text-[#D35400] light:border-[#E67E22]/30 border-[#E67E22]/40 animate-pulse';
    case 'FULL':
      return 'bg-[#E67E22]/15 text-[#E67E22] light:bg-[#E67E22]/10 light:text-[#D35400] light:border-[#E67E22]/30 border-[#E67E22]/30';
    case 'COMPLETED':
      return 'bg-[#95A5A6]/15 text-[#95A5A6] light:bg-[#95A5A6]/10 light:text-[#7F8C8D] light:border-[#95A5A6]/30 border-[#95A5A6]/30';
    case 'CONFIRMED':
      return 'bg-emerald-500/15 text-emerald-400 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200 border-emerald-500/30';
    case 'PENDING':
      return 'bg-[#E67E22]/15 text-[#E67E22] light:bg-[#E67E22]/10 light:text-[#D35400] light:border-[#E67E22]/30 border-[#E67E22]/30';
    case 'REJECTED':
    case 'CANCELLED':
      return 'bg-rose-500/15 text-rose-400 light:bg-rose-50 light:text-rose-700 light:border-rose-200 border-rose-500/30';
    case 'ATTENDED':
      return 'bg-[#2980B9]/15 text-[#3498DB] light:bg-[#2980B9]/10 light:text-[#2980B9] light:border-[#2980B9]/30 border-[#2980B9]/30';
    default:
      return 'bg-[#2C3E50] text-[#ECF0F1] light:bg-[#ECF0F1] light:text-[#2C3E50] light:border-[#95A5A6]/40 border-[#95A5A6]/25';
  }
}

// Truncate text
export function truncate(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}
