import { en } from './en';
import type { TranslationSchema } from './en';

export const sv: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Taggextraktor',
    language: 'Språk',
    english: 'Engelska',
    indonesian: 'Indonesiska',
    chinese: 'Kinesiska',
    languageSwitcher: {
      title: 'Gränssnittsspråk',
      description: 'Sparas i din webbläsare. Standardspråk är engelska.',
      instantNotice: 'Ändringar tillämpas omedelbart utan omladdning.',
      searchPlaceholder: 'Sök språk...',
      noResults: 'Inga språk hittades'
    },
    nav: {
      extractor: 'Taggar',
      image: 'Bild',
      booruList: 'Booru',
      settings: 'Inställningar'
    },
    actions: {
      ...en.common.actions,
      add: 'Lägg till',
      apply: 'Tillämpa',
      back: 'Tillbaka',
      cancel: 'Avbryt',
      clear: 'Rensa',
      close: 'Stäng',
      confirm: 'Bekräfta',
      copy: 'Kopiera',
      copied: 'Kopierat!',
      delete: 'Ta bort',
      save: 'Spara',
      search: 'Sök',
      all: 'Alla',
      none: 'Inga'
    }
  },
  settings: {
    ...en.settings,
    title: 'Inställningar',
    themeOptions: {
      system: 'System',
      light: 'Ljust',
      dark: 'Mörkt'
    }
  }
};
