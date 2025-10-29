'use server';

import { generatePlainLanguageSummary } from '@/ai/flows/generate-plain-language-summary';
import type { PerformanceData } from '@/lib/types';
import { translations } from '@/lib/locales';

export async function getAiSummaryAction(
  districtName: string,
  stateName: string,
  performanceData: PerformanceData,
  language: 'en' | 'hi' | 'mr'
) {
  try {
    // A simple mapping from locale code to full language name for the prompt
    const languageMap = {
      en: 'English',
      hi: 'Hindi',
      mr: 'Marathi',
    };
    const fullLanguageName = languageMap[language] || 'English';

    // Get translated metric titles
    const t = translations[language].dashboard.metrics;

    const { summary } = await generatePlainLanguageSummary({
      districtName,
      stateName,
      performanceData: JSON.stringify({
        [t.personDays.title]: performanceData.totalPersonDays.toLocaleString(language),
        [`${t.fundsUtilized.title} (Lakhs)`]: `${t.currency} ${performanceData.totalFundsUtilized.toLocaleString(language)}`,
        [t.averageWage.title]: `${t.currency} ${performanceData.averageWage.toLocaleString(language)}`,
        [t.worksCompleted.title]: performanceData.worksCompleted.toLocaleString(language),
      }),
      language: fullLanguageName,
    });
    return summary;
  } catch (error) {
    console.error('AI summary generation failed:', error);
    // Return a user-friendly error message
    return 'Sorry, the summary could not be generated at this time. Please check your connection and try again.';
  }
}
