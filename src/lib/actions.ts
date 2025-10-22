'use server';

import { generatePlainLanguageSummary } from '@/ai/flows/generate-plain-language-summary';
import type { PerformanceData } from '@/lib/types';

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
    // Return a user-friendly error message
    return 'Sorry, the summary could not be generated at this time. Please check your connection and try again.';
  }
}
