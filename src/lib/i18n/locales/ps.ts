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
    ...en.settings
  }
};
