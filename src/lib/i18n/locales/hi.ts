import { en } from './en';
import type { TranslationSchema } from './en';

export const hi: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru टैग निष्कर्षक',
    language: 'भाषा',
    english: 'अंग्रेज़ी',
    indonesian: 'इंडोनेशियाई',
    chinese: 'चीनी',
    languageSwitcher: {
      title: 'इंटरफ़ेस भाषा',
      description: 'आपके ब्राउज़र में सहेजी गई। डिफ़ॉल्ट भाषा अंग्रेज़ी है।',
      instantNotice: 'परिवर्तन बिना पुनः लोड किए तुरंत लागू होते हैं।',
      searchPlaceholder: 'भाषाएं खोजें...',
      noResults: 'कोई भाषा नहीं मिली'
    },
    nav: {
      extractor: 'टैग',
      image: 'छवि',
      booruList: 'Booru',
      settings: 'सेटिंग्स'
    },
    actions: {
      ...en.common.actions,
      add: 'जोड़ें',
      apply: 'लागू करें',
      back: 'वापस',
      cancel: 'रद्द करें',
      clear: 'साफ़ करें',
      close: 'बंद करें',
      confirm: 'पुष्टि करें',
      copy: 'कॉपी',
      copied: 'कॉपी हो गया!',
      delete: 'हटाएं',
      save: 'सहेजें',
      search: 'खोजें',
      all: 'सभी',
      none: 'कोई नहीं'
    }
  },
  settings: {
    ...en.settings,
    title: 'सेटिंग्स',
    themeOptions: {
      system: 'सिस्टम',
      light: 'हल्का',
      dark: 'गहरा'
    }
  }
};
