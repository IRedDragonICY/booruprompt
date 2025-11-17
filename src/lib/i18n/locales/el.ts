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
    ...en.settings
  }
};
