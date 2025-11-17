import { en } from './en';
import type { TranslationSchema } from './en';

export const ml: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ടാഗ് എക്‌സ്ട്രാക്ടർ',
    language: 'ഭാഷ',
    english: 'ഇംഗ്ലീഷ്',
    indonesian: 'ഇൻഡോനേഷ്യൻ',
    chinese: 'ചൈനീസ്',
    languageSwitcher: {
      title: 'ഇന്റർഫേസ് ഭാഷ',
      description: 'നിങ്ങളുടെ ബ്രൗസറിൽ സംരക്ഷിച്ചു. സ്ഥിര ഭാഷ ഇംഗ്ലീഷ് ആണ്.',
      instantNotice: 'മാറ്റങ്ങൾ റീലോഡ് ചെയ്യാതെ പ്രയോഗിക്കുന്നു.',
      searchPlaceholder: 'ഭാഷകൾ തിരയുക...',
      noResults: 'ഭാഷകളൊന്നും കണ്ടെത്തിയില്ല'
    },
    nav: {
      extractor: 'ടാഗുകൾ',
      image: 'ചിത്രം',
      booruList: 'Booru',
      settings: 'ക്രമീകരണങ്ങൾ'
    },
    actions: {
      ...en.common.actions,
      add: 'ചേർക്കുക',
      apply: 'പ്രയോഗിക്കുക',
      back: 'തിരികെ',
      cancel: 'റദ്ദാക്കുക',
      clear: 'മായ്‌ക്കുക',
      close: 'അടയ്‌ക്കുക',
      confirm: 'സ്ഥിരീകരിക്കുക',
      copy: 'പകർത്തുക',
      copied: 'പകർത്തി!',
      delete: 'ഇല്ലാതാക്കുക',
      save: 'സംരക്ഷിക്കുക',
      search: 'തിരയുക',
      all: 'എല്ലാം',
      none: 'ഒന്നുമില്ല'
    }
  },
  settings: {
    title: 'ക്രമീകരണങ്ങൾ',
    sections: {
      appearance: 'രൂപം',
      colorTheme: 'നിറ തീം',
      dataFetch: 'ഡാറ്റ ലഭിക്കുന്ന രീതി'
    },
    themeOptions: {
      system: 'സിസ്റ്റം',
      light: 'വെളിച്ചം',
      dark: 'ഇരുട്ട്'
    },
    colorThemes: {
      blue: 'നീല',
      orange: 'ഓറഞ്ച്',
      teal: 'ടീൽ',
      rose: 'റോസ്',
      purple: 'ധൂമ്രനൂൽ',
      green: 'പച്ച',
      custom: 'ഇഷ്‌ടാനുസൃത നിറം'
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
