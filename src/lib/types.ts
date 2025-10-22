export interface MonthlyData {
  month: string;
  year: number;
  personDays: number;
  fundsUtilized: number; // in Lakhs
}

export interface PerformanceData {
  totalPersonDays: number;
  totalFundsUtilized: number; // in Lakhs
  averageWage: number;
  worksCompleted: number;
  historicalData: MonthlyData[];
}

export interface District {
  name: string;
  performance: PerformanceData;
}

export interface State {
  name: string;
  districts: District[];
}
