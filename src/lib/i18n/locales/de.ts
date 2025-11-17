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
    title: 'Einstellungen',
    sections: {
      appearance: 'Erscheinungsbild',
      colorTheme: 'Farbthema',
      dataFetch: 'Datenabrufmethode'
    },
    themeOptions: {
      system: 'System',
      light: 'Hell',
      dark: 'Dunkel'
    },
    colorThemes: {
      blue: 'Blau',
      orange: 'Orange',
      teal: 'Türkis',
      rose: 'Rosa',
      purple: 'Lila',
      green: 'Grün',
      custom: 'Benutzerdefinierte Farbe'
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
