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
    title: 'Impostazioni',
    sections: {
      appearance: 'Aspetto',
      colorTheme: 'Tema Colore',
      dataFetch: 'Metodo di Recupero Dati'
    },
    themeOptions: {
      system: 'Sistema',
      light: 'Chiaro',
      dark: 'Scuro'
    },
    colorThemes: {
      blue: 'Blu',
      orange: 'Arancione',
      teal: 'Turchese',
      rose: 'Rosa',
      purple: 'Viola',
      green: 'Verde',
      custom: 'Colore Personalizzato'
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
