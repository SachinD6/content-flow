type Translations = {
  [key: string]: {
    en: string
    hi: string
  }
}

export const translations: Translations = {
  // Navigation
  backToHome: {
    en: 'Back to Home',
    hi: 'होम पर वापस जाएं',
  },
  
  // Posts page
  allPosts: {
    en: 'All Posts',
    hi: 'सभी पोस्ट',
  },
  browseLatest: {
    en: 'Browse our latest articles and updates',
    hi: 'हमारे नवीनतम लेख और अपडेट देखें',
  },
  noPostsFound: {
    en: 'No posts found',
    hi: 'कोई पोस्ट नहीं मिली',
  },
  noPostsInLanguage: {
    en: 'There are no posts available in this language yet.',
    hi: 'इस भाषा में अभी कोई पोस्ट उपलब्ध नहीं है।',
  },
  
  // Homepage
  welcome: {
    en: 'Welcome',
    hi: 'स्वागत है',
  },
  startBuilding: {
    en: 'Start building your content in Sanity Studio.',
    hi: 'Sanity Studio में अपनी सामग्री बनाना शुरू करें।',
  },
  openStudio: {
    en: 'Open Studio',
    hi: 'स्टूडियो खोलें',
  },
  
  // Post detail
  readMore: {
    en: 'Read more articles',
    hi: 'और लेख पढ़ें',
  },
  minRead: {
    en: 'min read',
    hi: 'मिनट पढ़ें',
  },
  
  // Footer
  platform: {
    en: 'Platform',
    hi: 'प्लेटफॉर्म',
  },
  articles: {
    en: 'Articles',
    hi: 'लेख',
  },
  dashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
  },
  writeStory: {
    en: 'Write a story',
    hi: 'कहानी लिखें',
  },
  account: {
    en: 'Account',
    hi: 'खाता',
  },
  settings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
  },
  billing: {
    en: 'Billing',
    hi: 'बिलिंग',
  },
  helpCenter: {
    en: 'Help Center',
    hi: 'सहायता केंद्र',
  },
  stayInLoop: {
    en: 'Stay in the loop',
    hi: 'अपडेट रहें',
  },
  newsletterDescription: {
    en: 'Get the latest articles and updates delivered to your inbox.',
    hi: 'नवीनतम लेख और अपडेट अपने इनबॉक्स में प्राप्त करें।',
  },
  enterEmail: {
    en: 'Enter your email',
    hi: 'अपना ईमेल दर्ज करें',
  },
  subscribe: {
    en: 'Subscribe',
    hi: 'सदस्यता लें',
  },
  getStarted: {
    en: 'Get Started',
    hi: 'शुरू करें',
  },
  learnMore: {
    en: 'Learn more',
    hi: 'और जानें',
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    hi: 'गोपनीयता नीति',
  },
  termsOfService: {
    en: 'Terms of Service',
    hi: 'सेवा की शर्तें',
  },
  cookies: {
    en: 'Cookies',
    hi: 'कुकीज़',
  },
  
  // Preview mode
  previewMode: {
    en: 'Preview Mode — Draft content visible',
    hi: 'पूर्वावलोकन मोड — ड्राफ्ट सामग्री दृश्यमान',
  },
  exitPreview: {
    en: 'Exit Preview',
    hi: 'पूर्वावलोकन से बाहर',
  },
  
  // 404 page
  pageNotFound: {
    en: 'Page Not Found',
    hi: 'पृष्ठ नहीं मिला',
  },
  pageNotFoundDescription: {
    en: "Sorry, the page you're looking for doesn't exist or has been moved.",
    hi: 'क्षमा करें, आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है या स्थानांतरित हो गया है।',
  },
  goToHomepage: {
    en: 'Go to Homepage',
    hi: 'होमपेज पर जाएं',
  },
  viewInHindi: {
    en: 'View in Hindi',
    hi: 'हिंदी में देखें',
  },
}

export type TranslationKey = keyof typeof translations

export function t(key: TranslationKey, lang: string): string {
  const translation = translations[key]
  if (!translation) {
    console.warn(`Translation key "${key}" not found`)
    return String(key)
  }
  const langCode = lang as 'en' | 'hi'
  return translation[langCode] || translation.en
}

export function getLocalizedPath(path: string, lang: string): string {
  if (lang === 'en') return path
  return `/${lang}${path}`
}