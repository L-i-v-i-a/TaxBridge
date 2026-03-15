export interface FilingStats {
  total: number;
  pending: number;
  completed: number;
  underReview: number;
  rejected: number;
}

export interface FilingHistoryItem {
  id: string;
  filingId: string;
  status: string;
  type: string | null;
  amount: number | null;
  createdAt: string;
}