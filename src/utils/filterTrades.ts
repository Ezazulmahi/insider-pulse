import { InsiderTrade } from '../types/trade';

export type TypeFilter = 'all' | 'purchase' | 'sale';
export type RoleFilter = 'all' | 'CEO' | 'CFO' | 'Director';
export type ValueFilter = 0 | 100_000 | 500_000 | 1_000_000;

export type TradeFilters = {
  query: string;
  type: TypeFilter;
  role: RoleFilter;
  minValue: ValueFilter;
};

export const DEFAULT_FILTERS: TradeFilters = {
  query: '',
  type: 'all',
  role: 'all',
  minValue: 0,
};

export function hasActiveFilters(filters: TradeFilters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.type !== 'all' ||
    filters.role !== 'all' ||
    filters.minValue !== 0
  );
}

/** Search (ticker or company, case-insensitive) is applied together with every filter. */
export function filterTrades(trades: InsiderTrade[], filters: TradeFilters): InsiderTrade[] {
  const query = filters.query.trim().toLowerCase();

  return trades.filter((trade) => {
    const matchesQuery =
      query === '' ||
      trade.ticker.toLowerCase().includes(query) ||
      trade.company.toLowerCase().includes(query);
    // "Officer" trades only appear under "All roles".
    const matchesType = filters.type === 'all' || trade.type === filters.type;
    const matchesRole = filters.role === 'all' || trade.role === filters.role;
    const matchesValue = trade.value >= filters.minValue;

    return matchesQuery && matchesType && matchesRole && matchesValue;
  });
}

/** Newest filing first. ISO strings sort lexicographically. */
export function sortByFiledDesc(trades: InsiderTrade[]): InsiderTrade[] {
  return [...trades].sort((a, b) => b.filedAt.localeCompare(a.filedAt));
}
