import { en } from './en';
import type { TranslationSchema } from './en';

export const da: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag-ekstraktor',
    language: 'Sprog',
    english: 'Engelsk',
    indonesian: 'Indonesisk',
    chinese: 'Kinesisk',
    languageSwitcher: {
      title: 'Grænsefladesprog',
      description: 'Gemt i din browser. Standardsprog er engelsk.',
      instantNotice: 'Ændringer anvendes øjeblikkeligt uden genindlæsning.',
      searchPlaceholder: 'Søg sprog...',
      noResults: 'Ingen sprog fundet'
    },
    nav: {
      extractor: 'Tags',
      image: 'Billede',
      booruList: 'Booru',
      settings: 'Indstillinger'
    },
    actions: {
      ...en.common.actions,
      add: 'Tilføj',
      apply: 'Anvend',
      back: 'Tilbage',
      cancel: 'Annuller',
      clear: 'Ryd',
      close: 'Luk',
      confirm: 'Bekræft',
      copy: 'Kopier',
      copied: 'Kopieret!',
      delete: 'Slet',
      save: 'Gem',
      search: 'Søg',
      all: 'Alle',
      none: 'Ingen'
    }
  },
  settings: {
    ...en.settings
  }
};
