import type { State, District, PerformanceData, MonthlyData, LocalizedString } from '@/lib/types';

// Helper to generate mock historical data
const generateHistoricalData = (basePersonDays: number, baseFunds: number): MonthlyData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  // Generate data for the last 12 months, ending with the last full month
  const lastMonthIndex = new Date().getMonth() - 1;

  const data: MonthlyData[] = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = (lastMonthIndex - i + 12) % 12;
    const year = monthIndex > lastMonthIndex ? currentYear - 2 : currentYear -1;
    data.push({
        month: months[monthIndex],
        year: year,
        personDays: Math.floor(basePersonDays * (1 + Math.sin(i / 6 * Math.PI) * 0.3) * (Math.random() * 0.2 + 0.9)),
        fundsUtilized: Math.floor(baseFunds * (1 + Math.sin(i / 6 * Math.PI) * 0.3) * (Math.random() * 0.2 + 0.9)),
    });
  }
  return data.reverse();
};

const districtTranslations: Record<string, LocalizedString> = {
  'Pune': { en: 'Pune', hi: 'पुणे', mr: 'पुणे' },
  'Mumbai': { en: 'Mumbai', hi: 'मुंबई', mr: 'मुंबई' },
  'Nagpur': { en: 'Nagpur', hi: 'नागपुर', mr: 'नागपूर' },
  'Nashik': { en: 'Nashik', hi: 'नाशिक', mr: 'नाशिक' },
  'Thane': { en: 'Thane', hi: 'ठाणे', mr: 'ठाणे' },
};

// Main function to get mock data
export const getMockMgnregaData = (): State[] => {
  const mockRawData = [
    { state_name: 'Maharashtra', district_name: 'Pune', persondays_generated: 5432000, total_expenditure_in_cr: 135.8, total_no_of_works_completed: 890 },
    { state_name: 'Maharashtra', district_name: 'Mumbai', persondays_generated: 3210000, total_expenditure_in_cr: 96.3, total_no_of_works_completed: 450 },
    { state_name: 'Maharashtra', district_name: 'Nagpur', persondays_generated: 6789000, total_expenditure_in_cr: 169.7, total_no_of_works_completed: 1100 },
    { state_name: 'Maharashtra', district_name: 'Nashik', persondays_generated: 4890000, total_expenditure_in_cr: 122.2, total_no_of_works_completed: 950 },
    { state_name: 'Maharashtra', district_name: 'Thane', persondays_generated: 4120000, total_expenditure_in_cr: 103.0, total_no_of_works_completed: 670 },
  ];

  const stateMap: Map<string, State> = new Map();

  mockRawData.forEach(record => {
    const stateName = record.state_name;
    const districtName = record.district_name;

    if (!stateName || !districtName) return;

    if (!stateMap.has(stateName)) {
      stateMap.set(stateName, { 
        id: stateName.toLowerCase(),
        name: { en: 'Maharashtra', hi: 'महाराष्ट्र', mr: 'महाराष्ट्र' },
        districts: [] 
      });
    }

    const state = stateMap.get(stateName);
    if (state) {
      const totalPersonDays = record.persondays_generated;
      const totalFundsUtilizedInCrores = record.total_expenditure_in_cr; 
      const totalFundsUtilizedInLakhs = totalFundsUtilizedInCrores * 100;
      
      const performance: PerformanceData = {
        totalPersonDays: totalPersonDays,
        totalFundsUtilized: Math.round(totalFundsUtilizedInLakhs),
        averageWage: Math.round((totalFundsUtilizedInCrores * 10000000) / totalPersonDays) || 250, 
        worksCompleted: record.total_no_of_works_completed,
        historicalData: generateHistoricalData(totalPersonDays / 12, totalFundsUtilizedInLakhs / 12),
      };

      const district: District = {
        id: districtName.toLowerCase(),
        name: districtTranslations[districtName],
        performance: performance,
      };

      state.districts.push(district);
    }
  });

  return Array.from(stateMap.values()).map(state => {
    state.districts.sort((a, b) => a.name.en.localeCompare(b.name.en));
    return state;
  }).sort((a, b) => a.name.en.localeCompare(b.name.en));
};
