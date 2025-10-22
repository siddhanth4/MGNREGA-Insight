import type { State, District, PerformanceData, MonthlyData } from '@/lib/types';

const API_BASE_URL = 'https://api.data.gov.in/resource/9ba5948a-1977-45ea-853d-f2208a4a4325';
const API_KEY = process.env.DATA_GOV_API_KEY;

// Helper to generate mock historical data since the API doesn't provide it
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

// Helper to process raw API records into our structured format
const processRecords = (records: any[]): State[] => {
  const stateMap: Map<string, State> = new Map();

  records.forEach(record => {
    const stateName = record.state_name;
    const districtName = record.district_name;

    if (!stateName || !districtName) return;

    if (!stateMap.has(stateName)) {
      stateMap.set(stateName, { name: stateName, districts: [] });
    }

    const state = stateMap.get(stateName);
    if (state) {
      const totalPersonDays = parseInt(record.persondays_generated__000s, 10) * 1000;
      const totalFundsUtilized = parseFloat(record.total_expenditure_in_cr); // Assuming this is in Crores, converting to Lakhs
      
      const performance: PerformanceData = {
        totalPersonDays: totalPersonDays,
        totalFundsUtilized: totalFundsUtilized * 100, // Convert Crores to Lakhs
        averageWage: Math.round((totalFundsUtilized * 10000000) / totalPersonDays) || 250, // Calculate or fallback
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

export async function fetchMgnregaData(): Promise<State[]> {
  if (!API_KEY) {
    throw new Error('API key for data.gov.in is not configured. Please add it to your .env.local file.');
  }

  const url = `${API_BASE_URL}?api-key=${API_KEY}&format=json&limit=1000`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();

    if (!data.records) {
      throw new Error("No records found in the API response.");
    }
    
    return processRecords(data.records);
  } catch (error) {
    console.error("Failed to fetch or process MGNREGA data:", error);
    throw error;
  }
}
