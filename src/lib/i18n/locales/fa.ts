import { en } from './en';
import type { TranslationSchema } from './en';

export const fa: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'استخراج‌کننده برچسب Booru',
    language: 'زبان',
    english: 'انگلیسی',
    indonesian: 'اندونزیایی',
    chinese: 'چینی',
    languageSwitcher: {
      title: 'زبان رابط کاربری',
      description: 'در مرورگر شما ذخیره شده است. زبان پیش‌فرض انگلیسی است.',
      instantNotice: 'تغییرات بلافاصله بدون بارگذاری مجدد اعمال می‌شوند.',
      searchPlaceholder: 'جستجوی زبان‌ها...',
      noResults: 'هیچ زبانی یافت نشد'
    },
    nav: {
      extractor: 'برچسب‌ها',
      image: 'تصویر',
      booruList: 'Booru',
      settings: 'تنظیمات'
    },
    actions: {
      ...en.common.actions,
      add: 'افزودن',
      apply: 'اعمال',
      back: 'بازگشت',
      cancel: 'لغو',
      clear: 'پاک کردن',
      close: 'بستن',
      confirm: 'تأیید',
      copy: 'کپی',
      copied: 'کپی شد!',
      delete: 'حذف',
      save: 'ذخیره',
      search: 'جستجو',
      all: 'همه',
      none: 'هیچ‌کدام'
    }
  },
  settings: {
    title: 'تنظیمات',
    sections: {
      appearance: 'ظاهر',
      colorTheme: 'تم رنگی',
      dataFetch: 'روش دریافت داده'
    },
    themeOptions: {
      system: 'سیستم',
      light: 'روشن',
      dark: 'تیره'
    },
    colorThemes: {
      blue: 'آبی',
      orange: 'نارنجی',
      teal: 'فیروزه‌ای',
      rose: 'صورتی',
      purple: 'بنفش',
      green: 'سبز',
      custom: 'رنگ سفارشی'
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
