import { en } from './en';
import type { TranslationSchema } from './en';

export const ca: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru extractor d\'etiquetes',
    language: 'Idioma',
    english: 'Anglès',
    indonesian: 'Indonesi',
    chinese: 'Xinès',
    languageSwitcher: {
      title: 'Idioma de la interfície',
      description: 'Desat al vostre navegador. L\'idioma predeterminat és l\'anglès.',
      instantNotice: 'Els canvis s\'apliquen immediatament sense recarregar.',
      searchPlaceholder: 'Cerca idiomes...',
      noResults: 'No s\'han trobat idiomes'
    },
    nav: {
      extractor: 'Etiquetes',
      image: 'Imatge',
      booruList: 'Booru',
      settings: 'Configuració'
    },
    actions: {
      ...en.common.actions,
      add: 'Afegeix',
      apply: 'Aplica',
      back: 'Enrere',
      cancel: 'Cancel·la',
      clear: 'Neteja',
      close: 'Tanca',
      confirm: 'Confirma',
      copy: 'Copia',
      copied: 'Copiat!',
      delete: 'Suprimeix',
      save: 'Desa',
      search: 'Cerca',
      all: 'Tot',
      none: 'Cap'
    }
  },
  settings: {
    title: 'Configuració',
    sections: {
      appearance: 'Aparença',
      colorTheme: 'Tema de color',
      dataFetch: 'Mètode d\'obtenció de dades'
    },
    themeOptions: {
      system: 'Sistema',
      light: 'Clar',
      dark: 'Fosc'
    },
    colorThemes: {
      blue: 'Blau',
      orange: 'Taronja',
      teal: 'Verd blavós',
      rose: 'Rosa',
      purple: 'Porpra',
      green: 'Verd',
      custom: 'Color personalitzat'
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
