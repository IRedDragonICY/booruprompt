import { en } from './en';
import type { TranslationSchema } from './en';

export const sl: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ekstraktor oznak',
    language: 'Jezik',
    english: 'Angleščina',
    indonesian: 'Indonezijščina',
    chinese: 'Kitajščina',
    languageSwitcher: {
      title: 'Jezik vmesnika',
      description: 'Shranjeno v vašem brskalniku. Privzeti jezik je angleščina.',
      instantNotice: 'Spremembe se uporabijo takoj brez ponovnega nalaganja.',
      searchPlaceholder: 'Išči jezike...',
      noResults: 'Ni najdenih jezikov'
    },
    nav: {
      extractor: 'Oznake',
      image: 'Slika',
      booruList: 'Booru',
      settings: 'Nastavitve'
    },
    actions: {
      ...en.common.actions,
      add: 'Dodaj',
      apply: 'Uporabi',
      back: 'Nazaj',
      cancel: 'Prekliči',
      clear: 'Počisti',
      close: 'Zapri',
      confirm: 'Potrdi',
      copy: 'Kopiraj',
      copied: 'Kopirano!',
      delete: 'Izbriši',
      save: 'Shrani',
      search: 'Išči',
      all: 'Vse',
      none: 'Nič'
    }
  },
  settings: {
    title: 'Nastavitve',
    sections: {
      appearance: 'Videz',
      colorTheme: 'Barvna tema',
      dataFetch: 'Metoda pridobivanja podatkov'
    },
    themeOptions: {
      system: 'Sistemska',
      light: 'Svetla',
      dark: 'Temna'
    },
    colorThemes: {
      blue: 'Modra',
      orange: 'Oranžna',
      teal: 'Turkizna',
      rose: 'Rožnata',
      purple: 'Vijolična',
      green: 'Zelena',
      custom: 'Barva po meri'
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
