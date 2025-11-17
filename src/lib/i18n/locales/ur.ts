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
      label: 'حسب ضرورت رنگ',
      pickerLabel: 'حسب ضرورت رنگ منتخب کنندہ',
      inputLabel: 'حسب ضرورت رنگ ہیکس کوڈ',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'سرور پراکسی',
        description: 'ڈیٹا حاصل کرنے کے لیے اس ایپلیکیشن کا سرور استعمال کرتا ہے۔ تجویز کردہ، زیادہ قابل اعتماد۔'
      },
      clientProxy: {
        label: 'کلائنٹ سائیڈ پراکسی',
        description: 'آپ کے براؤزر میں عوامی CORS پراکسی استعمال کرتا ہے۔ کم قابل اعتماد یا محدود ہو سکتا ہے۔'
      }
    },
    clientProxy: {
      selectLabel: 'کلائنٹ پراکسی سروس منتخب کریں:',
      ariaLabel: 'کلائنٹ پراکسی سروس منتخب کنندہ',
      helper: 'پراکسیوں کے درمیان کارکردگی اور وثوقیت مختلف ہوتی ہے۔'
    },
    toggles: {
      autoExtract: {
        label: 'خودکار نکالنا',
        description: 'ایک درست URL پیسٹ/ٹائپ کرنے کے بعد خودکار طور پر ٹیگز نکالیں۔',
        tooltip: 'درست URL پیسٹ/ٹائپ کرتے وقت خودکار ٹیگ نکالنا فعال یا غیر فعال کریں'
      },
      previews: {
        label: 'پیش منظر فعال کریں',
        description: 'نکالتے وقت اور تاریخ میں تصویر/ویڈیو پیش منظر دکھائیں۔',
        tooltip: 'بینڈوتھ بچانے یا ممکنہ مسائل سے بچنے کے لیے تصویر/ویڈیو پیش منظر فعال یا غیر فعال کریں',
        note: 'تصاویر ہمیشہ سرور پراکسی کے ذریعے حاصل کی جاتی ہیں۔'
      },
      saveHistory: {
        label: 'تاریخ محفوظ کریں',
        description: 'کامیاب نکالنے کو اپنے براؤزر میں مقامی طور پر محفوظ کریں۔',
        tooltip: 'براؤزر کی مقامی اسٹوریج میں نکالنے کی تاریخ محفوظ کرنا فعال یا غیر فعال کریں'
      },
      unsupportedSites: {
        label: 'غیر تعاون یافتہ سائٹس کے لیے فعال کریں',
        description: 'ملتی جلتی سائٹ پیٹرن استعمال کرکے غیر تعاون یافتہ سائٹس سے نکالنے کی کوشش کریں۔ تمام سائٹس کے لیے کام نہیں کر سکتا۔',
        tooltip: 'ملتی جلتی سائٹ پیٹرن استعمال کرکے غیر تعاون یافتہ ویب سائٹس کے لیے نکالنا فعال کریں'
      },
      blacklist: {
        label: 'مطلوبہ الفاظ کی بلیک لسٹ فعال کریں',
        description: 'بلاک کرنے کے لیے مطلوبہ الفاظ درج کریں، کوما، سیمی کولن، یا نئی لائن سے الگ کریں۔',
        tooltip: 'مخصوص مطلوبہ الفاظ کو فلٹر کرکے ناپسندیدہ ٹیگز بلاک کریں',
        placeholder: 'بلاک کرنے کے لیے مطلوبہ الفاظ درج کریں…',
        ariaLabel: 'بلیک لسٹ مطلوبہ الفاظ',
        reset: 'ڈیفالٹ پر دوبارہ سیٹ کریں'
      }
    },
    historySize: {
      label: 'زیادہ سے زیادہ تاریخ کا سائز',
      description: 'نکالنے اور تصویر دونوں کی تاریخ کے لیے زیادہ سے زیادہ اندراجات کی تعداد مقرر کریں۔'
    },
    accessibility: {
      themeOption: 'تھیم {{label}}',
      colorThemeOption: 'رنگ تھیم {{label}}',
      historySizeSelect: 'زیادہ سے زیادہ تاریخ کا سائز'
    },
    historySizeOptions: {
      '10': '۱۰ اندراجات',
      '30': '۳۰ اندراجات',
      '50': '۵۰ اندراجات',
      '100': '۱۰۰ اندراجات',
      unlimited: 'لامحدود'
    },
    support: {
      title: 'تعاون اور رائے',
      cta: 'GitHub پر مسئلہ رپورٹ کریں',
      description: 'کوئی بگ ملا یا تجویز ہے؟ ہمیں بتائیں!'
    },
    modal: {
      close: 'ترتیبات بند کریں'
    }
  }
};
