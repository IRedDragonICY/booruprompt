import { en } from './en';
import type { TranslationSchema } from './en';

export const bn: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ট্যাগ এক্সট্র্যাক্টর',
    language: 'ভাষা',
    english: 'ইংরেজি',
    indonesian: 'ইন্দোনেশীয়',
    chinese: 'চীনা',
    languageSwitcher: {
      title: 'ইন্টারফেস ভাষা',
      description: 'আপনার ব্রাউজারে সংরক্ষিত। ডিফল্ট ভাষা ইংরেজি।',
      instantNotice: 'পরিবর্তনগুলি রিলোড ছাড়াই তাত্ক্ষণিকভাবে প্রয়োগ হয়।',
      searchPlaceholder: 'ভাষা অনুসন্ধান করুন...',
      noResults: 'কোন ভাষা পাওয়া যায়নি'
    },
    nav: {
      extractor: 'ট্যাগ',
      image: 'ছবি',
      booruList: 'Booru',
      settings: 'সেটিংস'
    },
    actions: {
      ...en.common.actions,
      add: 'যোগ করুন',
      apply: 'প্রয়োগ করুন',
      back: 'ফিরে যান',
      cancel: 'বাতিল',
      clear: 'মুছুন',
      close: 'বন্ধ করুন',
      confirm: 'নিশ্চিত করুন',
      copy: 'কপি',
      copied: 'কপি হয়েছে!',
      delete: 'মুছে ফেলুন',
      save: 'সংরক্ষণ',
      search: 'খুঁজুন',
      all: 'সব',
      none: 'কোনটিই নয়'
    }
  },
  settings: {
    title: 'সেটিংস',
    sections: {
      appearance: 'চেহারা',
      colorTheme: 'রঙের থিম',
      dataFetch: 'ডেটা আনার পদ্ধতি'
    },
    themeOptions: {
      system: 'সিস্টেম',
      light: 'হালকা',
      dark: 'গাঢ়'
    },
    colorThemes: {
      blue: 'নীল',
      orange: 'কমলা',
      teal: 'টিল',
      rose: 'গোলাপী',
      purple: 'বেগুনি',
      green: 'সবুজ',
      custom: 'কাস্টম রঙ'
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
