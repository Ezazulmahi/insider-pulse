import { InsiderTrade } from '../types/trade';
import { filterTrades, DEFAULT_FILTERS, TradeFilters } from './filterTrades';

export type FeedSummary = {
  transactionCount: number;
  purchaseCount: number;
  saleCount: number;
  purchaseValue: number;
  saleValue: number;
  highStrengthCount: number;
};

/** Totals are derived from the local array so Home and the Screener always agree. */
export function summarizeTrades(trades: InsiderTrade[]): FeedSummary {
  const purchases = trades.filter((trade) => trade.type === 'purchase');
  const sales = trades.filter((trade) => trade.type === 'sale');
  const sum = (list: InsiderTrade[]) => list.reduce((total, trade) => total + trade.value, 0);

  return {
    transactionCount: trades.length,
    purchaseCount: purchases.length,
    saleCount: sales.length,
    purchaseValue: sum(purchases),
    saleValue: sum(sales),
    highStrengthCount: trades.filter((trade) => trade.signalStrength === 'High').length,
  };
}

export type SignalTheme = {
  id: string;
  title: string;
  description: string;
  icon: 'person-circle-outline' | 'people-outline' | 'trending-down-outline';
  tone: 'purchase' | 'sale';
  preset: Omit<TradeFilters, 'query'>;
};

/** Original, fictional interface groupings. They are labels, not recommendations. */
export const SIGNAL_THEMES: SignalTheme[] = [
  {
    id: 'chief-buys',
    title: 'Chief buys',
    description: 'CEOs adding shares',
    icon: 'person-circle-outline',
    tone: 'purchase',
    preset: { ...DEFAULT_FILTERS, type: 'purchase', role: 'CEO' },
  },
  {
    id: 'board-buying',
    title: 'Board buying',
    description: 'Directors adding shares',
    icon: 'people-outline',
    tone: 'purchase',
    preset: { ...DEFAULT_FILTERS, type: 'purchase', role: 'Director' },
  },
  {
    id: 'big-ticket-sales',
    title: 'Big-ticket sales',
    description: 'Sales of $500K or more',
    icon: 'trending-down-outline',
    tone: 'sale',
    preset: { ...DEFAULT_FILTERS, type: 'sale', minValue: 500_000 },
  },
];

export function countForTheme(trades: InsiderTrade[], theme: SignalTheme): number {
  return filterTrades(trades, { ...theme.preset, query: '' }).length;
}
