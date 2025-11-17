import { en } from './en';
import type { TranslationSchema } from './en';

export const el: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Εξαγωγέας Ετικετών Booru',
    language: 'Γλώσσα',
    english: 'Αγγλικά',
    indonesian: 'Ινδονησιακά',
    chinese: 'Κινέζικα',
    languageSwitcher: {
      title: 'Γλώσσα διεπαφής',
      description: 'Αποθηκευμένο στον περιηγητή σας. Η προεπιλεγμένη γλώσσα είναι τα Αγγλικά.',
      instantNotice: 'Οι αλλαγές εφαρμόζονται αμέσως χωρίς επαναφόρτωση.',
      searchPlaceholder: 'Αναζήτηση γλωσσών...',
      noResults: 'Δεν βρέθηκαν γλώσσες'
    },
    nav: {
      extractor: 'Ετικέτες',
      image: 'Εικόνα',
      booruList: 'Booru',
      settings: 'Ρυθμίσεις'
    },
    actions: {
      ...en.common.actions,
      add: 'Προσθήκη',
      apply: 'Εφαρμογή',
      back: 'Πίσω',
      cancel: 'Ακύρωση',
      clear: 'Καθαρισμός',
      close: 'Κλείσιμο',
      confirm: 'Επιβεβαίωση',
      copy: 'Αντιγραφή',
      copied: 'Αντιγράφηκε!',
      delete: 'Διαγραφή',
      save: 'Αποθήκευση',
      search: 'Αναζήτηση',
      all: 'Όλα',
      none: 'Κανένα'
    }
  },
  settings: {
    title: 'Ρυθμίσεις',
    sections: {
      appearance: 'Εμφάνιση',
      colorTheme: 'Θέμα Χρώματος',
      dataFetch: 'Μέθοδος Λήψης Δεδομένων'
    },
    themeOptions: {
      system: 'Σύστημα',
      light: 'Φωτεινό',
      dark: 'Σκοτεινό'
    },
    colorThemes: {
      blue: 'Μπλε',
      orange: 'Πορτοκαλί',
      teal: 'Γαλαζοπράσινο',
      rose: 'Ροζ',
      purple: 'Μωβ',
      green: 'Πράσινο',
      custom: 'Προσαρμοσμένο Χρώμα'
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
