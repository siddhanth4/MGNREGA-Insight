import type { State } from '@/lib/types';

const generateHistoricalData = (basePersonDays: number, baseFunds: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  return months.map((month, i) => ({
    month,
    year: currentYear - 1,
    personDays: Math.floor(basePersonDays * (1 + Math.sin(i) * 0.2) * (Math.random() * 0.4 + 0.8)),
    fundsUtilized: Math.floor(baseFunds * (1 + Math.sin(i) * 0.2) * (Math.random() * 0.4 + 0.8)),
  }));
};

export const mgnregaData: State[] = [
  {
    name: 'Maharashtra',
    districts: [
      {
        name: 'Pune',
        performance: {
          totalPersonDays: 1250000,
          totalFundsUtilized: 3125,
          averageWage: 250,
          worksCompleted: 4500,
          historicalData: generateHistoricalData(100000, 250),
        },
      },
      {
        name: 'Mumbai',
        performance: {
          totalPersonDays: 800000,
          totalFundsUtilized: 2400,
          averageWage: 300,
          worksCompleted: 3200,
          historicalData: generateHistoricalData(65000, 200),
        },
      },
      {
        name: 'Nagpur',
        performance: {
          totalPersonDays: 1500000,
          totalFundsUtilized: 3600,
          averageWage: 240,
          worksCompleted: 5200,
          historicalData: generateHistoricalData(120000, 300),
        },
      },
      {
        name: 'Nashik',
        performance: {
          totalPersonDays: 1100000,
          totalFundsUtilized: 2750,
          averageWage: 250,
          worksCompleted: 4000,
          historicalData: generateHistoricalData(90000, 225),
        },
      },
    ],
  },
  {
    name: 'Karnataka',
    districts: [
      {
        name: 'Bengaluru',
        performance: {
          totalPersonDays: 950000,
          totalFundsUtilized: 2850,
          averageWage: 300,
          worksCompleted: 3800,
          historicalData: generateHistoricalData(78000, 235),
        },
      },
      {
        name: 'Mysuru',
        performance: {
          totalPersonDays: 1300000,
          totalFundsUtilized: 3250,
          averageWage: 250,
          worksCompleted: 4800,
          historicalData: generateHistoricalData(110000, 275),
        },
      },
      {
        name: 'Hubli',
        performance: {
          totalPersonDays: 1050000,
          totalFundsUtilized: 2520,
          averageWage: 240,
          worksCompleted: 4100,
          historicalData: generateHistoricalData(85000, 210),
        },
      },
    ],
  },
];
