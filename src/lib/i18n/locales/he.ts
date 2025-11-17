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
      label: 'צבע מותאם אישית',
      pickerLabel: 'בורר צבע מותאם אישית',
      inputLabel: 'קוד הקסדצימלי לצבע מותאם אישית',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'פרוקסי שרת',
        description: 'משתמש בשרת האפליקציה הזו כדי לאחזר נתונים. מומלץ, אמין יותר.'
      },
      clientProxy: {
        label: 'פרוקסי צד לקוח',
        description: 'משתמש בפרוקסי CORS ציבורי בדפדפן שלך. עשוי להיות פחות אמין או מוגבל.'
      }
    },
    clientProxy: {
      selectLabel: 'בחר שירות פרוקסי לקוח:',
      ariaLabel: 'בורר שירות פרוקסי לקוח',
      helper: 'ביצועים ואמינות משתנים בין פרוקסים.'
    },
    toggles: {
      autoExtract: {
        label: 'חילוץ אוטומטי',
        description: 'חלץ תגיות אוטומטית לאחר הדבקה/הקלדה של כתובת URL תקפה.',
        tooltip: 'הפעל או השבת חילוץ תגיות אוטומטי בעת הדבקה/הקלדה של כתובת URL תקפה'
      },
      previews: {
        label: 'הפעל תצוגה מקדימה',
        description: 'הצג תצוגה מקדימה של תמונה/וידאו במהלך החילוץ ובהיסטוריה.',
        tooltip: 'הפעל או השבת תצוגה מקדימה של תמונה/וידאו כדי לחסוך ברוחב פס או למנוע בעיות אפשריות',
        note: 'תמונות תמיד נשלפות דרך פרוקסי השרת.'
      },
      saveHistory: {
        label: 'שמור היסטוריה',
        description: 'אחסן חילוצים מוצלחים באופן מקומי בדפדפן שלך.',
        tooltip: 'הפעל או השבת שמירת היסטוריית חילוץ באחסון המקומי של הדפדפן שלך'
      },
      unsupportedSites: {
        label: 'הפעל עבור אתרים לא נתמכים',
        description: 'נסה לחלץ מאתרים לא נתמכים באמצעות דפוסי אתרים דומים. עשוי לא לעבוד עבור כל האתרים.',
        tooltip: 'הפעל חילוץ עבור אתרים לא נתמכים על ידי שימוש בדפוסי אתרים דומים'
      },
      blacklist: {
        label: 'הפעל רשימה שחורה של מילות מפתח',
        description: 'הזן מילות מפתח לחסימה, מופרדות בפסיקים, נקודה-פסיק או שורות חדשות.',
        tooltip: 'חסום תגיות לא רצויות על ידי סינון מילות מפתח ספציפיות',
        placeholder: 'הזן מילות מפתח לחסימה…',
        ariaLabel: 'מילות מפתח ברשימה שחורה',
        reset: 'אפס לברירת מחדל'
      }
    },
    historySize: {
      label: 'גודל היסטוריה מקסימלי',
      description: 'הגדר את מספר הרשומות המקסימלי עבור היסטוריית חילוץ ותמונות.'
    },
    accessibility: {
      themeOption: 'ערכת נושא {{label}}',
      colorThemeOption: 'ערכת צבעים {{label}}',
      historySizeSelect: 'גודל היסטוריה מקסימלי'
    },
    historySizeOptions: {
      '10': '10 רשומות',
      '30': '30 רשומות',
      '50': '50 רשומות',
      '100': '100 רשומות',
      unlimited: 'ללא הגבלה'
    },
    support: {
      title: 'תמיכה ומשוב',
      cta: 'דווח על בעיה ב-GitHub',
      description: 'מצאת באג או יש לך הצעה? ספר לנו!'
    },
    modal: {
      close: 'סגור הגדרות'
    }
  }
};
