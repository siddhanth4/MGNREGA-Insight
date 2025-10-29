export const locales = ['en', 'hi', 'mr'] as const;
export type Locale = typeof locales[number];

export type Translations = {
  dashboard: {
    selectors: {
      state: string;
      selectState: string;
      district: string;
      selectDistrict: string;
    };
    noData: string;
    metrics: {
      personDays: { title: string; description: string };
      fundsUtilized: { title: string; description: string };
      averageWage: { title: string; description: string };
      worksCompleted: { title: string; description: string };
    };
    charts: {
      monthly: { title: string; description: string };
      comparison: { title: string; description: (district: string, state: string) => string };
      personDays: string;
      fundsUtilized: string;
    };
    aiSummary: {
      title: string;
      description: (district: string) => string;
      cta: string;
      generateButton: string;
      generatingButton: string;
    };
    location: {
      title: string;
      description: (district: string) => string;
      yesButton: (district: string) => string;
      noButton: string;
    };
    errors: {
      loadData: { title: string, description: string };
      generateSummary: { title: string, description: string };
    }
  };
};

export const translations: Record<Locale, Translations> = {
  en: {
    dashboard: {
      selectors: {
        state: 'State',
        selectState: 'Select a state',
        district: 'District',
        selectDistrict: 'Select a district',
      },
      noData: 'Please select a state and district to view performance data.',
      metrics: {
        personDays: { title: 'Person-Days', description: 'Total work days generated' },
        fundsUtilized: { title: 'Funds Utilized', description: 'Total funds spent' },
        averageWage: { title: 'Average Wage', description: 'Average daily wage paid' },
        worksCompleted: { title: 'Works Completed', description: 'Total projects finished' },
      },
      charts: {
        monthly: { title: 'Last 12 Months', description: 'How performance has changed over time.' },
        comparison: { title: 'District Comparison', description: (district, state) => `How ${district} compares to other districts in ${state}.` },
        personDays: 'Person-Days',
        fundsUtilized: 'Funds Utilized (Rs. Lakhs)',
      },
      aiSummary: {
        title: 'AI-Powered Summary',
        description: (district) => `An easy-to-understand summary of ${district}'s performance.`,
        cta: 'Click the button to get a simple summary of the data.',
        generateButton: 'Generate Simple Summary',
        generatingButton: 'Generating...',
      },
      location: {
        title: 'Location Suggestion',
        description: (district) => `We think you're in ${district}. Would you like to see data for this district?`,
        yesButton: (district) => `Yes, use ${district}`,
        noButton: 'No, thanks',
      },
      errors: {
        loadData: { title: 'Failed to load data', description: 'Could not fetch MGNREGA data. Please try again later.' },
        generateSummary: { title: 'Error', description: 'Failed to generate summary.' },
      }
    },
  },
  hi: {
    dashboard: {
      selectors: {
        state: 'राज्य',
        selectState: 'एक राज्य चुनें',
        district: 'ज़िला',
        selectDistrict: 'एक जिला चुनें',
      },
      noData: 'प्रदर्शन डेटा देखने के लिए कृपया एक राज्य और जिला चुनें।',
      metrics: {
        personDays: { title: 'व्यक्ति-दिन', description: 'कुल कार्य दिवस उत्पन्न हुए' },
        fundsUtilized: { title: 'उपयोग की गई धनराशि', description: 'कुल खर्च की गई धनराशि' },
        averageWage: { title: 'औसत मजदूरी', description: 'औसत दैनिक मजदूरी का भुगतान' },
        worksCompleted: { title: 'पूर्ण किए गए कार्य', description: 'कुल परियोजनाएं समाप्त हुईं' },
      },
      charts: {
        monthly: { title: 'पिछले 12 महीने', description: 'समय के साथ प्रदर्शन कैसे बदला है।' },
        comparison: { title: 'जिला तुलना', description: (district, state) => `${state} के अन्य जिलों की तुलना में ${district} कैसा है।` },
        personDays: 'व्यक्ति-दिन',
        fundsUtilized: 'उपयोग की गई धनराशि (लाख रुपये)',
      },
      aiSummary: {
        title: 'एआई-संचालित सारांश',
        description: (district) => `${district} के प्रदर्शन का समझने में आसान सारांश।`,
        cta: 'डेटा का सरल सारांश प्राप्त करने के लिए बटन पर क्लिक करें।',
        generateButton: 'सरल सारांश उत्पन्न करें',
        generatingButton: 'उत्पन्न हो रहा है...',
      },
      location: {
        title: 'स्थान सुझाव',
        description: (district) => `हमें लगता है कि आप ${district} में हैं। क्या आप इस जिले का डेटा देखना चाहेंगे?`,
        yesButton: (district) => `हाँ, ${district} का उपयोग करें`,
        noButton: 'नहीं, धन्यवाद',
      },
      errors: {
        loadData: { title: 'डेटा लोड करने में विफल', description: 'मनरेगा डेटा प्राप्त नहीं किया जा सका। कृपया बाद में पुनः प्रयास करें।' },
        generateSummary: { title: 'त्रुटि', description: 'सारांश उत्पन्न करने में विफल।' },
      }
    },
  },
  mr: {
    dashboard: {
      selectors: {
        state: 'राज्य',
        selectState: 'एक राज्य निवडा',
        district: 'जिल्हा',
        selectDistrict: 'एक जिल्हा निवडा',
      },
      noData: 'कामगिरी डेटा पाहण्यासाठी कृपया एक राज्य आणि जिल्हा निवडा.',
      metrics: {
        personDays: { title: 'मनुष्य-दिवस', description: 'एकूण कामाचे दिवस निर्माण झाले' },
        fundsUtilized: { title: 'वापरलेला निधी', description: 'एकूण खर्च केलेला निधी' },
        averageWage: { title: 'सरासरी मजुरी', description: 'सरासरी दररोज मजुरी दिली' },
        worksCompleted: { title: 'पूर्ण झालेली कामे', description: 'एकूण प्रकल्प पूर्ण झाले' },
      },
      charts: {
        monthly: { title: 'मागील १२ महिने', description: 'वेळेनुसार कामगिरी कशी बदलली आहे.' },
        comparison: { title: 'जिल्हा तुलना', description: (district, state) => `${state} मधील इतर जिल्ह्यांच्या तुलनेत ${district} कसे आहे.` },
        personDays: 'मनुष्य-दिवस',
        fundsUtilized: 'वापरलेला निधी (लाख रुपये)',
      },
      aiSummary: {
        title: 'एआय-आधारित सारांश',
        description: (district) => `${district} च्या कामगिरीचा समजण्यास सोपा सारांश.`,
        cta: 'डेटाचा सोपा सारांश मिळवण्यासाठी बटणावर क्लिक करा.',
        generateButton: 'सोपा सारांश तयार करा',
        generatingButton: 'तयार होत आहे...',
      },
      location: {
        title: 'स्थान सूचना',
        description: (district) => `आम्हाला वाटते की तुम्ही ${district} मध्ये आहात. तुम्हाला या जिल्ह्याचा डेटा पाहायला आवडेल का?`,
        yesButton: (district) => `होय, ${district} वापरा`,
        noButton: 'नाही, धन्यवाद',
      },
      errors: {
        loadData: { title: 'डेटा लोड करण्यात अयशस्वी', description: 'मनरेगा डेटा मिळू शकला नाही. कृपया नंतर पुन्हा प्रयत्न करा.' },
        generateSummary: { title: 'त्रुटी', description: 'सारांश तयार करण्यात अयशस्वी.' },
      }
    },
  },
};
