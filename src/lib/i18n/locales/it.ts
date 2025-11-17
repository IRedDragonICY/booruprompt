import { en } from './en';
import type { TranslationSchema } from './en';

export const it: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Estrattore di Tag Booru',
    language: 'Lingua',
    english: 'Inglese',
    indonesian: 'Indonesiano',
    chinese: 'Cinese',
    languageSwitcher: {
      title: 'Lingua dell\'interfaccia',
      description: 'Salvata nel tuo browser. La lingua predefinita è l\'inglese.',
      instantNotice: 'Le modifiche si applicano istantaneamente senza ricaricare.',
      searchPlaceholder: 'Cerca lingue...',
      noResults: 'Nessuna lingua trovata'
    },
    nav: {
      extractor: 'Tag',
      image: 'Immagine',
      booruList: 'Boorus',
      settings: 'Impostazioni'
    },
    actions: {
      ...en.common.actions,
      add: 'Aggiungi',
      apply: 'Applica',
      back: 'Indietro',
      cancel: 'Annulla',
      clear: 'Cancella',
      close: 'Chiudi',
      confirm: 'Conferma',
      copy: 'Copia',
      copied: 'Copiato!',
      delete: 'Elimina',
      save: 'Salva',
      search: 'Cerca',
      all: 'Tutto',
      none: 'Nessuno'
    }
  },
  settings: {
    ...en.settings
  }
};
