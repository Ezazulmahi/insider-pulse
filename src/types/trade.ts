export type InsiderRole = 'CEO' | 'CFO' | 'Director' | 'Officer';
export type TradeType = 'purchase' | 'sale';
export type SignalStrength = 'High' | 'Medium' | 'Low';

export type InsiderTrade = {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  insider: string;
  role: InsiderRole;
  type: TradeType;
  transactionCode: 'P' | 'S';
  shares: number;
  pricePerShare: number;
  value: number;
  /** ISO date, e.g. "2026-09-10" */
  transactionDate: string;
  /** ISO date-time without zone, e.g. "2026-09-11T09:24" */
  filedAt: string;
  signal: string;
  signalStrength: SignalStrength;
  /** Seven invented index points used only by the mock activity chart. */
  activity: number[];
};
