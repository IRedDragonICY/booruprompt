import { en } from './en';
import type { TranslationSchema } from './en';

export const he: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'מחלץ תגיות Booru',
    language: 'שפה',
    english: 'אנגלית',
    indonesian: 'אינדונזית',
    chinese: 'סינית',
    languageSwitcher: {
      title: 'שפת הממשק',
      description: 'נשמר בדפדפן שלך. שפת ברירת המחדל היא אנגלית.',
      instantNotice: 'השינויים חלים באופן מיידי ללא רענון.',
      searchPlaceholder: 'חיפוש שפות...',
      noResults: 'לא נמצאו שפות'
    },
    nav: {
      extractor: 'תגיות',
      image: 'תמונה',
      booruList: 'Booru',
      settings: 'הגדרות'
    },
    actions: {
      ...en.common.actions,
      add: 'הוסף',
      apply: 'החל',
      back: 'חזור',
      cancel: 'ביטול',
      clear: 'נקה',
      close: 'סגור',
      confirm: 'אישור',
      copy: 'העתק',
      copied: 'הועתק!',
      delete: 'מחק',
      save: 'שמור',
      search: 'חיפוש',
      all: 'הכל',
      none: 'ללא'
    }
  },
  settings: {
    title: 'הגדרות',
    sections: {
      appearance: 'מראה',
      colorTheme: 'ערכת צבעים',
      dataFetch: 'שיטת אחזור נתונים'
    },
    themeOptions: {
      system: 'מערכת',
      light: 'בהיר',
      dark: 'כהה'
    },
    colorThemes: {
      blue: 'כחול',
      orange: 'כתום',
      teal: 'טורקיז',
      rose: 'ורוד',
      purple: 'סגול',
      green: 'ירוק',
      custom: 'צבע מותאם אישית'
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
