import { en } from './en';
import type { TranslationSchema } from './en';

export const am: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'ቋንቋ',
    english: 'እንግሊዝኛ',
    indonesian: 'ኢንዶኔዥያኛ',
    chinese: 'ቻይንኛ',
    languageSwitcher: {
      title: 'የበይነገጽ ቋንቋ',
      description: 'በአሳሽዎ ውስጥ ተቀምጧል። ነባሪው ቋንቋ እንግሊዝኛ ነው።',
      instantNotice: 'ለውጦች እንደገና ሳይጫን ወዲያውኑ ይተገበራሉ።',
      searchPlaceholder: 'ቋንቋዎችን ይፈልጉ...',
      noResults: 'ምንም ቋንቋዎች አልተገኙም'
    },
    nav: {
      extractor: 'መለያዎች',
      image: 'ምስል',
      booruList: 'Booru',
      settings: 'ቅንብሮች'
    },
    actions: {
      ...en.common.actions,
      add: 'ጨምር',
      apply: 'ተግብር',
      back: 'ተመለስ',
      cancel: 'ሰርዝ',
      clear: 'አጽዳ',
      close: 'ዝጋ',
      confirm: 'አረጋግጥ',
      copy: 'ቅዳ',
      copied: 'ተቀድቷል!',
      delete: 'ሰርዝ',
      save: 'አስቀምጥ',
      search: 'ፈልግ',
      all: 'ሁሉም',
      none: 'ምንም'
    }
  },
  settings: {
    title: 'ቅንብሮች',
    sections: {
      appearance: 'ገጽታ',
      colorTheme: 'የቀለም ጭብጥ',
      dataFetch: 'የመረጃ ማግኛ ዘዴ'
    },
    themeOptions: {
      system: 'ስርዓት',
      light: 'ብርሃን',
      dark: 'ጨለማ'
    },
    colorThemes: {
      blue: 'ሰማያዊ',
      orange: 'ብርቱካናማ',
      teal: 'አረንጓዴ ሰማያዊ',
      rose: 'ሮዝ',
      purple: 'ወይንጠጅ',
      green: 'አረንጓዴ',
      custom: 'ብጁ ቀለም'
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
