import { en } from './en';
import type { TranslationSchema } from './en';

export const ar: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'مستخرج علامات Booru',
    language: 'اللغة',
    english: 'الإنجليزية',
    indonesian: 'الإندونيسية',
    chinese: 'الصينية',
    languageSwitcher: {
      title: 'لغة الواجهة',
      description: 'محفوظ في متصفحك. اللغة الافتراضية هي الإنجليزية.',
      instantNotice: 'يتم تطبيق التغييرات فوراً دون إعادة التحميل.',
      searchPlaceholder: 'البحث عن اللغات...',
      noResults: 'لم يتم العثور على لغات'
    },
    nav: {
      extractor: 'العلامات',
      image: 'الصورة',
      booruList: 'Booru',
      settings: 'الإعدادات'
    },
    actions: {
      ...en.common.actions,
      add: 'إضافة',
      apply: 'تطبيق',
      back: 'رجوع',
      cancel: 'إلغاء',
      clear: 'مسح',
      close: 'إغلاق',
      confirm: 'تأكيد',
      copy: 'نسخ',
      copied: 'تم النسخ!',
      delete: 'حذف',
      save: 'حفظ',
      search: 'بحث',
      all: 'الكل',
      none: 'لا شيء'
    }
  },
  settings: {
    title: 'الإعدادات',
    sections: {
      appearance: 'المظهر',
      colorTheme: 'سمة اللون',
      dataFetch: 'طريقة جلب البيانات'
    },
    themeOptions: {
      system: 'النظام',
      light: 'فاتح',
      dark: 'داكن'
    },
    colorThemes: {
      blue: 'أزرق',
      orange: 'برتقالي',
      teal: 'أزرق مخضر',
      rose: 'وردي',
      purple: 'بنفسجي',
      green: 'أخضر',
      custom: 'لون مخصص'
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
