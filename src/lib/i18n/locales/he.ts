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
    ...en.settings,
    title: 'הגדרות',
    themeOptions: {
      system: 'מערכת',
      light: 'בהיר',
      dark: 'כהה'
    }
  }
};
