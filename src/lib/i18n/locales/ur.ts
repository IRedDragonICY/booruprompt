import { en } from './en';
import type { TranslationSchema } from './en';

export const ur: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'زبان',
    english: 'انگریزی',
    indonesian: 'انڈونیشین',
    chinese: 'چینی',
    languageSwitcher: {
      title: 'انٹرفیس کی زبان',
      description: 'آپ کے براؤزر میں محفوظ ہے۔ ڈیفالٹ زبان انگریزی ہے۔',
      instantNotice: 'تبدیلیاں دوبارہ لوڈ کیے بغیر فوری طور پر لاگو ہوتی ہیں۔',
      searchPlaceholder: 'زبانیں تلاش کریں...',
      noResults: 'کوئی زبان نہیں ملی'
    },
    nav: {
      extractor: 'ٹیگز',
      image: 'تصویر',
      booruList: 'Booru',
      settings: 'ترتیبات'
    },
    actions: {
      ...en.common.actions,
      add: 'شامل کریں',
      apply: 'لاگو کریں',
      back: 'واپس',
      cancel: 'منسوخ کریں',
      clear: 'صاف کریں',
      close: 'بند کریں',
      confirm: 'تصدیق کریں',
      copy: 'کاپی کریں',
      copied: 'کاپی ہو گیا!',
      delete: 'حذف کریں',
      save: 'محفوظ کریں',
      search: 'تلاش کریں',
      all: 'سب',
      none: 'کوئی نہیں'
    }
  },
  settings: {
    title: 'ترتیبات',
    sections: {
      appearance: 'ظاہری شکل',
      colorTheme: 'رنگ تھیم',
      dataFetch: 'ڈیٹا حاصل کرنے کا طریقہ'
    },
    themeOptions: {
      system: 'سسٹم',
      light: 'روشن',
      dark: 'تاریک'
    },
    colorThemes: {
      blue: 'نیلا',
      orange: 'نارنجی',
      teal: 'فیروزی',
      rose: 'گلابی',
      purple: 'جامنی',
      green: 'سبز',
      custom: 'حسب ضرورت رنگ'
    },
    customColor: {
      ...en.settings.customColor
    },
    fetchModes: {
      ...en.settings.fetchModes
    },
    clientProxy: {
      ...en.settings.clientProxy
    },
    toggles: {
      ...en.settings.toggles
    },
    historySize: {
      ...en.settings.historySize
    },
    accessibility: {
      ...en.settings.accessibility
    },
    historySizeOptions: {
      ...en.settings.historySizeOptions
    },
    support: {
      ...en.settings.support
    },
    modal: {
      ...en.settings.modal
    }
  }
};
