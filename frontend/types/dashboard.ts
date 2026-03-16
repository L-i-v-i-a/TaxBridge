export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netPosition: number;
  totalFilings: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface MonthlyData {
  month: string;
  filings: number;
}

export interface RecentActivity {
  id: string;
  filingId: string;
  date: string;
  status: string;
  amount: number | null;
  type: string | null;
}

export interface DashboardData {
  stats: DashboardStats;
  charts: {
    filingStatus: ChartData[];
    monthlyActivity: MonthlyData[];
  };
  recentActivity: RecentActivity[];
}