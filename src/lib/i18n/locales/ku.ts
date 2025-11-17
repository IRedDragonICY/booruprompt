import { en } from './en';
import type { TranslationSchema } from './en';

export const ku: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Ziman',
    english: 'Îngilîzî',
    indonesian: 'Endonezî',
    chinese: 'Çînî',
    languageSwitcher: {
      title: 'Zimana navberîyê',
      description: 'Di geroka we de hatiye tomarkirin. Zimana bingehîn Îngilîzî ye.',
      instantNotice: 'Guhertin bêyî nûkirina rûpelê bi serfêkî tê sepandin.',
      searchPlaceholder: 'Li zimanan bigere...',
      noResults: 'Tu ziman nehate dîtin'
    },
    nav: {
      extractor: 'Tag',
      image: 'Wêne',
      booruList: 'Booru',
      settings: 'Mîhengên'
    },
    actions: {
      ...en.common.actions,
      add: 'Lê zêde bike',
      apply: 'Bisepîne',
      back: 'Vegere',
      cancel: 'Betal bike',
      clear: 'Paqij bike',
      close: 'Bigire',
      confirm: 'Piştrast bike',
      copy: 'Kopî bike',
      copied: 'Kopî kir!',
      delete: 'Jê bibe',
      save: 'Tomar bike',
      search: 'Lêgerîn',
      all: 'Hemû',
      none: 'Tu yek'
    }
  },
  settings: {
    title: 'Mîhengên',
    sections: {
      appearance: 'Xuyang',
      colorTheme: 'Mijarê Rengî',
      dataFetch: 'Rêbaza Wergirtina Daneyan'
    },
    themeOptions: {
      system: 'Sîstem',
      light: 'Ronî',
      dark: 'Tarî'
    },
    colorThemes: {
      blue: 'Şîn',
      orange: 'Pirteqalî',
      teal: 'Şînzebeş',
      rose: 'Pembe',
      purple: 'Mor',
      green: 'Kesk',
      custom: 'Renga Taybet'
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
