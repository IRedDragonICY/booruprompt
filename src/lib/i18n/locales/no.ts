import { en } from './en';
import type { TranslationSchema } from './en';

export const no: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tagg-ekstraktor',
    language: 'Språk',
    english: 'Engelsk',
    indonesian: 'Indonesisk',
    chinese: 'Kinesisk',
    languageSwitcher: {
      title: 'Grensesnittspråk',
      description: 'Lagres i nettleseren din. Standardspråket er engelsk.',
      instantNotice: 'Endringer brukes umiddelbart uten oppdatering.',
      searchPlaceholder: 'Søk språk...',
      noResults: 'Ingen språk funnet'
    },
    nav: {
      extractor: 'Tagger',
      image: 'Bilde',
      booruList: 'Booru',
      settings: 'Innstillinger'
    },
    actions: {
      ...en.common.actions,
      add: 'Legg til',
      apply: 'Bruk',
      back: 'Tilbake',
      cancel: 'Avbryt',
      clear: 'Tøm',
      close: 'Lukk',
      confirm: 'Bekreft',
      copy: 'Kopier',
      copied: 'Kopiert!',
      delete: 'Slett',
      save: 'Lagre',
      search: 'Søk',
      all: 'Alle',
      none: 'Ingen'
    }
  },
  settings: {
    ...en.settings
  }
};
