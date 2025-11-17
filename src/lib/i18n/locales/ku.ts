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
    ...en.settings,
    title: 'Mîhengên',
    themeOptions: {
      system: 'Pergal',
      light: 'Ronahî',
      dark: 'Tarî'
    }
  }
};
