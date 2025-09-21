export type Language = 'en' | 'hi' | 'te';

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' }
];

export const translations = {
  en: {
    common: {
      language: 'Language',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next',
      home: 'Home'
    },
    navigation: {
      dashboard: 'Dashboard',
      cropPrediction: 'Crop Prediction',
      fertilizer: 'Fertilizer Recommendation',
      marketTrends: 'Market Trends',
      profile: 'Profile'
    },
    home: {
      title: 'CropWise AI Guidance',
      subtitle: 'Intelligent farming solutions powered by AI',
      description: 'Get AI-powered crop recommendations, yield predictions, and fertilizer suggestions to maximize your agricultural success.',
      getStarted: 'Get Started'
    },
    cropPrediction: {
      title: 'AI Crop Yield & Risk Prediction',
      subtitle: 'Get accurate predictions with confidence scores',
      temperature: 'Temperature (°C)',
      humidity: 'Humidity (%)',
      ph: 'pH Level',
      rainfall: 'Rainfall (mm)',
      nitrogen: 'Nitrogen (N)',
      phosphorus: 'Phosphorus (P)',
      potassium: 'Potassium (K)',
      predict: 'Predict Crop',
      riskLevel: 'Risk Level',
      yieldPrediction: 'Expected Yield',
      confidenceScore: 'Confidence Score',
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    },
    fertilizer: {
      title: 'Smart Fertilizer Recommendation',
      subtitle: 'Get personalized fertilizer suggestions based on soil analysis',
      soilAnalysis: 'Soil Analysis',
      recommendation: 'Recommendation',
      getRecommendation: 'Get Recommendation'
    },
    market: {
      title: 'Market Trends & Profitability',
      subtitle: 'Analyze market prices and profitability for better crop selection',
      pricePerKg: 'Price per kg',
      marketLocation: 'Market Location',
      priceDate: 'Price Date',
      profitability: 'Profitability Score'
    }
  },
  hi: {
    common: {
      language: 'भाषा',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      save: 'सेव करें',
      cancel: 'रद्द करें',
      back: 'वापस',
      next: 'अगला',
      home: 'होम'
    },
    navigation: {
      dashboard: 'डैशबोर्ड',
      cropPrediction: 'फसल भविष्यवाणी',
      fertilizer: 'उर्वरक सुझाव',
      marketTrends: 'बाजार के रुझान',
      profile: 'प्रोफ़ाइल'
    },
    home: {
      title: 'क्रॉपवाइज़ एआई गाइडेंस',
      subtitle: 'एआई द्वारा संचालित बुद्धिमान कृषि समाधान',
      description: 'अपनी कृषि सफलता को अधिकतम करने के लिए एआई-संचालित फसल सिफारिशें, उपज भविष्यवाणी और उर्वरक सुझाव प्राप्त करें।',
      getStarted: 'शुरू करें'
    },
    cropPrediction: {
      title: 'एआई फसल उपज और जोखिम भविष्यवाणी',
      subtitle: 'विश्वसनीयता स्कोर के साथ सटीक भविष्यवाणी प्राप्त करें',
      temperature: 'तापमान (°C)',
      humidity: 'आर्द्रता (%)',
      ph: 'पीएच स्तर',
      rainfall: 'वर्षा (मिमी)',
      nitrogen: 'नाइट्रोजन (N)',
      phosphorus: 'फास्फोरस (P)',
      potassium: 'पोटेशियम (K)',
      predict: 'फसल की भविष्यवाणी करें',
      riskLevel: 'जोखिम स्तर',
      yieldPrediction: 'अपेक्षित उपज',
      confidenceScore: 'विश्वसनीयता स्कोर',
      low: 'कम',
      medium: 'मध्यम',
      high: 'उच्च'
    },
    fertilizer: {
      title: 'स्मार्ट उर्वरक सिफारिश',
      subtitle: 'मिट्टी विश्लेषण के आधार पर व्यक्तिगत उर्वरक सुझाव प्राप्त करें',
      soilAnalysis: 'मिट्टी विश्लेषण',
      recommendation: 'सिफारिश',
      getRecommendation: 'सिफारिश प्राप्त करें'
    },
    market: {
      title: 'बाजार के रुझान और लाभप्रदता',
      subtitle: 'बेहतर फसल चयन के लिए बाजार कीमतों और लाभप्रदता का विश्लेषण करें',
      pricePerKg: 'प्रति किलो कीमत',
      marketLocation: 'बाजार स्थान',
      priceDate: 'कीमत की तारीख',
      profitability: 'लाभप्रदता स्कोर'
    }
  },
  te: {
    common: {
      language: 'భాష',
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం',
      success: 'విజయం',
      save: 'సేవ్ చేయండి',
      cancel: 'రద్దు చేయండి',
      back: 'వెనుకకు',
      next: 'తదుపరి',
      home: 'హోమ్'
    },
    navigation: {
      dashboard: 'డాష్‌బోర్డ్',
      cropPrediction: 'పంట అంచనా',
      fertilizer: 'ఎరువుల సిఫార్సు',
      marketTrends: 'మార్కెట్ ట్రెండ్స్',
      profile: 'ప్రొఫైల్'
    },
    home: {
      title: 'క్రాప్‌వైజ్ ఏఐ గైడెన్స్',
      subtitle: 'ఏఐ ద్వారా శక్తివంతమైన తెలివైన వ్యవసాయ పరిష్కారాలు',
      description: 'మీ వ్యవసాయ విజయాన్ని గరిష్టీకరించడానికి ఏఐ-శక్తితో కూడిన పంట సిఫార్సులు, దిగుబడి అంచనాలు మరియు ఎరువుల సలహాలు పొందండి.',
      getStarted: 'ప్రారంభించండి'
    },
    cropPrediction: {
      title: 'ఏఐ పంట దిగుబడి మరియు రిస్క్ అంచనా',
      subtitle: 'విశ్వాస స్కోర్‌లతో ఖచ్చితమైన అంచనాలు పొందండి',
      temperature: 'ఉష్ణోగ్రత (°C)',
      humidity: 'తేమ (%)',
      ph: 'పిహెచ్ స్థాయి',
      rainfall: 'వర్షపాతం (మిమీ)',
      nitrogen: 'నైట్రోజన్ (N)',
      phosphorus: 'ఫాస్ఫరస్ (P)',
      potassium: 'పొటాషియం (K)',
      predict: 'పంట అంచనా చేయండి',
      riskLevel: 'రిస్క్ స్థాయి',
      yieldPrediction: 'ఆశించిన దిగుబడి',
      confidenceScore: 'విశ్వాస స్కోర్',
      low: 'తక్కువ',
      medium: 'మధ్యస్థ',
      high: 'అధిక'
    },
    fertilizer: {
      title: 'స్మార్ట్ ఎరువుల సిఫార్సు',
      subtitle: 'మట్టి విశ్లేషణ ఆధారంగా వ్యక్తిగతీకరించిన ఎరువుల సలహాలు పొందండి',
      soilAnalysis: 'మట్టి విశ్లేషణ',
      recommendation: 'సిఫార్సు',
      getRecommendation: 'సిఫార్సు పొందండి'
    },
    market: {
      title: 'మార్కెట్ ట్రెండ్స్ మరియు లాభదాయకత',
      subtitle: 'మెరుగైన పంట ఎంపిక కోసం మార్కెట్ ధరలు మరియు లాభదాయకతను విశ్లేషించండి',
      pricePerKg: 'కిలోకు ధర',
      marketLocation: 'మార్కెట్ స్థానం',
      priceDate: 'ధర తేదీ',
      profitability: 'లాభదాయకత స్కోర్'
    }
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}