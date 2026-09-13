const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function withCommas(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 2400000 -> "$2.40M", 680000 -> "$680K" */
export function formatCompactUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${withCommas(value)}`;
}

/** 62.5 -> "$62.50" */
export function formatUsd(value: number): string {
  const [whole, cents] = value.toFixed(2).split('.');
  return `$${withCommas(Number(whole))}.${cents}`;
}

export function formatShares(value: number): string {
  return `${withCommas(value)} shares`;
}

/** "2026-09-10" -> "Sep 10, 2026". Parsed by hand so no timezone shifts. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/** "2026-09-11T09:24" -> "Sep 11, 2026 · 09:24" */
export function formatDateTime(isoDateTime: string): string {
  return `${formatDate(isoDateTime)} · ${isoDateTime.slice(11, 16)}`;
}

/** "2026-09-11T09:24" -> "Sep 11 · 09:24" */
export function formatShortDateTime(isoDateTime: string): string {
  const [, month, day] = isoDateTime.slice(0, 10).split('-').map(Number);
  return `${MONTHS[month - 1]} ${day} · ${isoDateTime.slice(11, 16)}`;
}

export function tradeTypeLabel(type: 'purchase' | 'sale'): string {
  return type === 'purchase' ? 'Purchase' : 'Sale';
}
