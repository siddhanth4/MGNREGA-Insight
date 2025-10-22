'use server';

import { generatePlainLanguageSummary } from '@/ai/flows/generate-plain-language-summary';
import type { PerformanceData, State } from '@/lib/types';
import { fetchMgnregaData as apiFetchMgnregaData } from '@/lib/api';

export async function getAiSummaryAction(
  districtName: string,
  stateName: string,
  performanceData: PerformanceData
) {
  try {
    const { summary } = await generatePlainLanguageSummary({
      districtName,
      stateName,
      performanceData: JSON.stringify({
        'Total Person-Days Generated': performanceData.totalPersonDays.toLocaleString(),
        'Total Funds Utilized (in Lakhs)': `Rs. ${performanceData.totalFundsUtilized.toLocaleString()}`,
        'Average Daily Wage': `Rs. ${performanceData.averageWage.toLocaleString()}`,
        'Number of Works Completed': performanceData.worksCompleted.toLocaleString(),
      }),
    });
    return summary;
  } catch (error) {
    console.error('AI summary generation failed:', error);
    return 'Sorry, we couldn\'t generate a summary at this time. Please try again later.';
  }
}

export async function fetchMgnregaDataAction(): Promise<State[]> {
    return await apiFetchMgnregaData();
}
