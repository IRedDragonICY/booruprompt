import { en } from './en';
import type { TranslationSchema } from './en';

export const ps: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'ژبه',
    english: 'انګلیسي',
    indonesian: 'اندونیزیایی',
    chinese: 'چینایی',
    languageSwitcher: {
      title: 'د انٹرفیس ژبه',
      description: 'ستاسو په براوزر کې خوندي شوی. ډیفالټ ژبه انګلیسي ده.',
      instantNotice: 'بدلونونه د بیا لوډ کولو پرته سمدستي پلي کیږي.',
      searchPlaceholder: 'ژبې ولټوئ...',
      noResults: 'هیڅ ژبه ونه موندل شوه'
    },
    nav: {
      extractor: 'ټګونه',
      image: 'انځور',
      booruList: 'Booru',
      settings: 'تنظیمات'
    },
    actions: {
      ...en.common.actions,
      add: 'اضافه کړئ',
      apply: 'پلي کړئ',
      back: 'بیرته',
      cancel: 'لغوه کړئ',
      clear: 'پاکه کړئ',
      close: 'بنده کړئ',
      confirm: 'تایید کړئ',
      copy: 'کاپي کړئ',
      copied: 'کاپي شول!',
      delete: 'حذف کړئ',
      save: 'خوندي کړئ',
      search: 'ولټوئ',
      all: 'ټول',
      none: 'هیڅ'
    }
  },
  settings: {
    title: 'تنظیمات',
    sections: {
      appearance: 'بڼه',
      colorTheme: 'د رنګ موضوع',
      dataFetch: 'د معلوماتو ترلاسه کولو طریقه'
    },
    themeOptions: {
      system: 'سیسټم',
      light: 'روښانه',
      dark: 'تیاره'
    },
    colorThemes: {
      blue: 'نیلي',
      orange: 'نارنجي',
      teal: 'فیروزي',
      rose: 'ګلابي',
      purple: 'بنفش',
      green: 'زرغون',
      custom: 'دودیز رنګ'
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
