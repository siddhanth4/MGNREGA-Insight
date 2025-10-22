import type { State, District, PerformanceData, MonthlyData } from '@/lib/types';

// Helper to generate mock historical data
const generateHistoricalData = (basePersonDays: number, baseFunds: number): MonthlyData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  return months.map((month, i) => ({
    month,
    year: currentYear - 1,
    personDays: Math.floor(basePersonDays * (1 + Math.sin(i / 6 * Math.PI) * 0.3) * (Math.random() * 0.2 + 0.9)),
    fundsUtilized: Math.floor(baseFunds * (1 + Math.sin(i / 6 * Math.PI) * 0.3) * (Math.random() * 0.2 + 0.9)),
  }));
};

// Main function to get mock data
export const getMockMgnregaData = (): State[] => {
  const mockRawData = [
    { state_name: 'Maharashtra', district_name: 'Pune', persondays_generated__000s: '5432', total_expenditure_in_cr: '135.8', total_no_of_works_completed: '890' },
    { state_name: 'Maharashtra', district_name: 'Mumbai', persondays_generated__000s: '3210', total_expenditure_in_cr: '96.3', total_no_of_works_completed: '450' },
    { state_name: 'Maharashtra', district_name: 'Nagpur', persondays_generated__000s: '6789', total_expenditure_in_cr: '169.7', total_no_of_works_completed: '1100' },
    { state_name: 'Karnataka', district_name: 'Bengaluru', persondays_generated__000s: '7890', total_expenditure_in_cr: '236.7', total_no_of_works_completed: '1250' },
    { state_name: 'Karnataka', district_name: 'Mysuru', persondays_generated__000s: '4567', total_expenditure_in_cr: '114.2', total_no_of_works_completed: '780' },
    { state_name: 'Tamil Nadu', district_name: 'Chennai', persondays_generated__000s: '6543', total_expenditure_in_cr: '196.3', total_no_of_works_completed: '1050' },
  ];

  const stateMap: Map<string, State> = new Map();

  mockRawData.forEach(record => {
    const stateName = record.state_name;
    const districtName = record.district_name;

    if (!stateName || !districtName) return;

    if (!stateMap.has(stateName)) {
      stateMap.set(stateName, { name: stateName, districts: [] });
    }

    const state = stateMap.get(stateName);
    if (state) {
      const totalPersonDays = parseInt(record.persondays_generated__000s, 10) * 1000;
      const totalFundsUtilized = parseFloat(record.total_expenditure_in_cr); 
      
      const performance: PerformanceData = {
        totalPersonDays: totalPersonDays,
        totalFundsUtilized: totalFundsUtilized * 100, // Convert Crores to Lakhs
        averageWage: Math.round((totalFundsUtilized * 10000000) / totalPersonDays) || 250, 
        worksCompleted: parseInt(record.total_no_of_works_completed, 10),
        historicalData: generateHistoricalData(totalPersonDays / 12, (totalFundsUtilized * 100) / 12),
      };

      const district: District = {
        name: districtName,
        performance: performance,
      };

      state.districts.push(district);
    }
  });

  return Array.from(stateMap.values()).map(state => {
    state.districts.sort((a, b) => a.name.localeCompare(b.name));
    return state;
  }).sort((a, b) => a.name.localeCompare(b.name));
};
