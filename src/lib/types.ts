export type LocalizedString = {
  en: string;
  hi: string;
  mr: string;
};

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
  id: string;
  name: LocalizedString;
  performance: PerformanceData;
}

export interface State {
  id: string;
  name: LocalizedString;
  districts: District[];
}
