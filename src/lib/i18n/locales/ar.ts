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
      label: 'لون مخصص',
      pickerLabel: 'منتقي اللون المخصص',
      inputLabel: 'كود اللون السداسي العشري المخصص',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'خادم وكيل',
        description: 'يستخدم خادم هذا التطبيق لجلب البيانات. موصى به، أكثر موثوقية.'
      },
      clientProxy: {
        label: 'وكيل جانب العميل',
        description: 'يستخدم وكيل CORS عام في متصفحك. قد يكون أقل موثوقية أو محدودًا.'
      }
    },
    clientProxy: {
      selectLabel: 'حدد خدمة الوكيل للعميل:',
      ariaLabel: 'محدد خدمة الوكيل للعميل',
      helper: 'يختلف الأداء والموثوقية بين الوكلاء.'
    },
    toggles: {
      autoExtract: {
        label: 'استخراج تلقائي',
        description: 'استخرج العلامات تلقائيًا بعد لصق/كتابة عنوان URL صالح.',
        tooltip: 'تفعيل أو تعطيل الاستخراج التلقائي للعلامات عند لصق/كتابة عنوان URL صالح'
      },
      previews: {
        label: 'تفعيل المعاينات',
        description: 'عرض معاينات الصور/الفيديو أثناء الاستخراج وفي السجل.',
        tooltip: 'تفعيل أو تعطيل معاينات الصور/الفيديو لتوفير النطاق الترددي أو تجنب المشاكل المحتملة',
        note: 'يتم جلب الصور دائمًا عبر خادم الوكيل.'
      },
      saveHistory: {
        label: 'حفظ السجل',
        description: 'تخزين عمليات الاستخراج الناجحة محليًا في متصفحك.',
        tooltip: 'تفعيل أو تعطيل حفظ سجل الاستخراج في التخزين المحلي لمتصفحك'
      },
      unsupportedSites: {
        label: 'تفعيل للمواقع غير المدعومة',
        description: 'حاول الاستخراج من المواقع غير المدعومة باستخدام أنماط مواقع مشابهة. قد لا يعمل مع جميع المواقع.',
        tooltip: 'تفعيل الاستخراج للمواقع غير المدعومة باستخدام أنماط مواقع مشابهة'
      },
      blacklist: {
        label: 'تفعيل القائمة السوداء للكلمات المفتاحية',
        description: 'أدخل الكلمات المفتاحية لحظرها، مفصولة بفواصل أو فواصل منقوطة أو أسطر جديدة.',
        tooltip: 'حظر العلامات غير المرغوب فيها من خلال تصفية كلمات مفتاحية محددة',
        placeholder: 'أدخل الكلمات المفتاحية لحظرها…',
        ariaLabel: 'الكلمات المفتاحية للقائمة السوداء',
        reset: 'إعادة تعيين إلى الافتراضي'
      }
    },
    historySize: {
      label: 'الحد الأقصى لحجم السجل',
      description: 'تعيين الحد الأقصى لعدد الإدخالات لكل من سجل الاستخراج والصور.'
    },
    accessibility: {
      themeOption: 'السمة {{label}}',
      colorThemeOption: 'سمة اللون {{label}}',
      historySizeSelect: 'الحد الأقصى لحجم السجل'
    },
    historySizeOptions: {
      '10': '10 إدخالات',
      '30': '30 إدخالات',
      '50': '50 إدخالات',
      '100': '100 إدخالات',
      unlimited: 'غير محدود'
    },
    support: {
      title: 'الدعم والملاحظات',
      cta: 'الإبلاغ عن مشكلة على GitHub',
      description: 'وجدت خطأ أو لديك اقتراح؟ أخبرنا!'
    },
    modal: {
      close: 'إغلاق الإعدادات'
    }
  }
};
