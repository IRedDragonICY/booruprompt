import { en } from './en';
import type { TranslationSchema } from './en';

export const sw: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Lugha',
    english: 'Kiingereza',
    indonesian: 'Kiindonesia',
    chinese: 'Kichina',
    languageSwitcher: {
      title: 'Lugha ya kiolesura',
      description: 'Imehifadhiwa kwenye kivinjari chako. Lugha chaguo-msingi ni Kiingereza.',
      instantNotice: 'Mabadiliko yanatekelezwa mara moja bila kupakia upya.',
      searchPlaceholder: 'Tafuta lugha...',
      noResults: 'Hakuna lugha zilizopatikana'
    },
    nav: {
      extractor: 'Lebo',
      image: 'Picha',
      booruList: 'Booru',
      settings: 'Mipangilio'
    },
    actions: {
      ...en.common.actions,
      add: 'Ongeza',
      apply: 'Tekeleza',
      back: 'Rudi',
      cancel: 'Ghairi',
      clear: 'Futa',
      close: 'Funga',
      confirm: 'Thibitisha',
      copy: 'Nakili',
      copied: 'Imenakiliwa!',
      delete: 'Futa',
      save: 'Hifadhi',
      search: 'Tafuta',
      all: 'Yote',
      none: 'Hamna'
    }
  },
  settings: {
    ...en.settings
  }
};
