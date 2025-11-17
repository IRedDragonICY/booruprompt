import { en } from './en';
import type { TranslationSchema } from './en';

export const gu: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ટૅગ એક્સ્ટ્રૅક્ટર',
    language: 'ભાષા',
    english: 'અંગ્રેજી',
    indonesian: 'ઇન્ડોનેશિયન',
    chinese: 'ચાઇનીઝ',
    languageSwitcher: {
      title: 'ઇન્ટરફેસ ભાષા',
      description: 'તમારા બ્રાઉઝરમાં સાચવેલ. ડિફોલ્ટ ભાષા અંગ્રેજી છે.',
      instantNotice: 'ફેરફારો રીલોડ કર્યા વિના લાગુ થાય છે.',
      searchPlaceholder: 'ભાષાઓ શોધો...',
      noResults: 'કોઈ ભાષાઓ મળી નથી'
    },
    nav: {
      extractor: 'ટૅગ્સ',
      image: 'છબી',
      booruList: 'Booru',
      settings: 'સેટિંગ્સ'
    },
    actions: {
      ...en.common.actions,
      add: 'ઉમેરો',
      apply: 'લાગુ કરો',
      back: 'પાછળ',
      cancel: 'રદ કરો',
      clear: 'સાફ કરો',
      close: 'બંધ કરો',
      confirm: 'પુષ્ટિ કરો',
      copy: 'કૉપિ કરો',
      copied: 'કૉપિ થયું!',
      delete: 'કાઢી નાખો',
      save: 'સાચવો',
      search: 'શોધો',
      all: 'બધા',
      none: 'કંઈ નહીં'
    }
  },
  settings: {
    title: 'સેટિંગ્સ',
    sections: {
      appearance: 'દેખાવ',
      colorTheme: 'રંગ થીમ',
      dataFetch: 'ડેટા મેળવવાની પદ્ધતિ'
    },
    themeOptions: {
      system: 'સિસ્ટમ',
      light: 'પ્રકાશ',
      dark: 'ઘેરો'
    },
    colorThemes: {
      blue: 'વાદળી',
      orange: 'નારંગી',
      teal: 'ટીલ',
      rose: 'ગુલાબી',
      purple: 'જાંબલી',
      green: 'લીલો',
      custom: 'કસ્ટમ રંગ'
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
