import { en } from './en';
import type { TranslationSchema } from './en';

export const de: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extraktor',
    language: 'Sprache',
    english: 'Englisch',
    indonesian: 'Indonesisch',
    chinese: 'Chinesisch',
    languageSwitcher: {
      title: 'Oberflächensprache',
      description: 'In Ihrem Browser gespeichert. Standardsprache ist Englisch.',
      instantNotice: 'Änderungen werden sofort ohne Neuladen angewendet.',
      searchPlaceholder: 'Sprachen suchen...',
      noResults: 'Keine Sprachen gefunden'
    },
    nav: {
      extractor: 'Tags',
      image: 'Bild',
      booruList: 'Boorus',
      settings: 'Einstellungen'
    },
    actions: {
      ...en.common.actions,
      add: 'Hinzufügen',
      apply: 'Anwenden',
      back: 'Zurück',
      cancel: 'Abbrechen',
      clear: 'Löschen',
      close: 'Schließen',
      confirm: 'Bestätigen',
      copy: 'Kopieren',
      copied: 'Kopiert!',
      delete: 'Löschen',
      save: 'Speichern',
      search: 'Suchen',
      all: 'Alle',
      none: 'Keine'
    }
  },
  settings: {
    ...en.settings,
    title: 'Einstellungen',
    themeOptions: {
      system: 'System',
      light: 'Hell',
      dark: 'Dunkel'
    }
  }
};
