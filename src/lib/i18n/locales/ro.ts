import { en } from './en';
import type { TranslationSchema } from './en';

export const ro: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Extractor de Etichete Booru',
    language: 'Limbă',
    english: 'Engleză',
    indonesian: 'Indoneziană',
    chinese: 'Chineză',
    languageSwitcher: {
      title: 'Limba interfeței',
      description: 'Salvată în browser. Limba implicită este engleza.',
      instantNotice: 'Modificările se aplică instant fără reîncărcare.',
      searchPlaceholder: 'Caută limbi...',
      noResults: 'Nu s-au găsit limbi'
    },
    nav: {
      extractor: 'Etichete',
      image: 'Imagine',
      booruList: 'Booru',
      settings: 'Setări'
    },
    actions: {
      ...en.common.actions,
      add: 'Adaugă',
      apply: 'Aplică',
      back: 'Înapoi',
      cancel: 'Anulează',
      clear: 'Șterge',
      close: 'Închide',
      confirm: 'Confirmă',
      copy: 'Copiază',
      copied: 'Copiat!',
      delete: 'Șterge',
      save: 'Salvează',
      search: 'Caută',
      all: 'Toate',
      none: 'Niciuna'
    }
  },
  settings: {
    ...en.settings
  }
};
