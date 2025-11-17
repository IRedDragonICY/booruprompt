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
      label: 'رنگ سفارشی',
      pickerLabel: 'انتخاب‌کننده رنگ سفارشی',
      inputLabel: 'کد هگز رنگ سفارشی',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'پروکسی سرور',
        description: 'از سرور این برنامه برای دریافت داده استفاده می‌کند. توصیه می‌شود، قابل‌اعتمادتر است.'
      },
      clientProxy: {
        label: 'پروکسی سمت کلاینت',
        description: 'از پروکسی CORS عمومی در مرورگر شما استفاده می‌کند. ممکن است کمتر قابل‌اعتماد یا محدود باشد.'
      }
    },
    clientProxy: {
      selectLabel: 'انتخاب سرویس پروکسی کلاینت:',
      ariaLabel: 'انتخاب‌کننده سرویس پروکسی کلاینت',
      helper: 'عملکرد و قابلیت اعتماد بین پروکسی‌ها متفاوت است.'
    },
    toggles: {
      autoExtract: {
        label: 'استخراج خودکار',
        description: 'بعد از جای‌گذاری/تایپ یک URL معتبر، برچسب‌ها را به‌طور خودکار استخراج کنید.',
        tooltip: 'استخراج خودکار برچسب را هنگام جای‌گذاری/تایپ URL معتبر فعال یا غیرفعال کنید'
      },
      previews: {
        label: 'فعال کردن پیش‌نمایش',
        description: 'پیش‌نمایش تصاویر/ویدیوها را در حین استخراج و در تاریخچه نمایش دهید.',
        tooltip: 'پیش‌نمایش تصاویر/ویدیوها را برای صرفه‌جویی در پهنای باند یا جلوگیری از مشکلات احتمالی فعال یا غیرفعال کنید',
        note: 'تصاویر همیشه از طریق پروکسی سرور دریافت می‌شوند.'
      },
      saveHistory: {
        label: 'ذخیره تاریخچه',
        description: 'استخراج‌های موفق را به‌صورت محلی در مرورگر خود ذخیره کنید.',
        tooltip: 'ذخیره تاریخچه استخراج در حافظه محلی مرورگر را فعال یا غیرفعال کنید'
      },
      unsupportedSites: {
        label: 'فعال کردن برای سایت‌های پشتیبانی‌نشده',
        description: 'سعی کنید با استفاده از الگوهای سایت‌های مشابه از سایت‌های پشتیبانی‌نشده استخراج کنید. ممکن است برای همه سایت‌ها کار نکند.',
        tooltip: 'استخراج برای وب‌سایت‌های پشتیبانی‌نشده را با استفاده از الگوهای سایت‌های مشابه فعال کنید'
      },
      blacklist: {
        label: 'فعال کردن لیست سیاه کلمات کلیدی',
        description: 'کلمات کلیدی مورد نظر برای مسدود کردن را وارد کنید، با کاما، نقطه‌ویرگول یا خط جدید جدا شوند.',
        tooltip: 'برچسب‌های ناخواسته را با فیلتر کردن کلمات کلیدی خاص مسدود کنید',
        placeholder: 'کلمات کلیدی برای مسدود کردن را وارد کنید…',
        ariaLabel: 'کلمات کلیدی لیست سیاه',
        reset: 'بازنشانی به پیش‌فرض'
      }
    },
    historySize: {
      label: 'حداکثر اندازه تاریخچه',
      description: 'حداکثر تعداد ورودی‌ها را برای تاریخچه استخراج و تصویر تنظیم کنید.'
    },
    accessibility: {
      themeOption: 'تم {{label}}',
      colorThemeOption: 'تم رنگی {{label}}',
      historySizeSelect: 'حداکثر اندازه تاریخچه'
    },
    historySizeOptions: {
      '10': '۱۰ ورودی',
      '30': '۳۰ ورودی',
      '50': '۵۰ ورودی',
      '100': '۱۰۰ ورودی',
      unlimited: 'نامحدود'
    },
    support: {
      title: 'پشتیبانی و بازخورد',
      cta: 'گزارش مشکل در GitHub',
      description: 'باگی پیدا کردید یا پیشنهادی دارید؟ به ما اطلاع دهید!'
    },
    modal: {
      close: 'بستن تنظیمات'
    }
  }
};
