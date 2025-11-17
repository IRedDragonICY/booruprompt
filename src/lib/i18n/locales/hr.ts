import { en } from './en';
import type { TranslationSchema } from './en';

export const hr: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ekstraktor oznaka',
    language: 'Jezik',
    english: 'Engleski',
    indonesian: 'Indonezijski',
    chinese: 'Kineski',
    languageSwitcher: {
      title: 'Jezik sučelja',
      description: 'Spremljeno u vašem pregledniku. Zadani jezik je engleski.',
      instantNotice: 'Promjene se primjenjuju trenutno bez ponovnog učitavanja.',
      searchPlaceholder: 'Pretraži jezike...',
      noResults: 'Nema pronađenih jezika'
    },
    nav: {
      extractor: 'Oznake',
      image: 'Slika',
      booruList: 'Booru',
      settings: 'Postavke'
    },
    actions: {
      ...en.common.actions,
      add: 'Dodaj',
      apply: 'Primijeni',
      back: 'Natrag',
      cancel: 'Odustani',
      clear: 'Obriši',
      close: 'Zatvori',
      confirm: 'Potvrdi',
      copy: 'Kopiraj',
      copied: 'Kopirano!',
      delete: 'Izbriši',
      save: 'Spremi',
      search: 'Pretraži',
      all: 'Sve',
      none: 'Ništa'
    }
  },
  settings: {
    title: 'Postavke',
    sections: {
      appearance: 'Izgled',
      colorTheme: 'Tema boja',
      dataFetch: 'Metoda preuzimanja podataka'
    },
    themeOptions: {
      system: 'Sustav',
      light: 'Svijetla',
      dark: 'Tamna'
    },
    colorThemes: {
      blue: 'Plava',
      orange: 'Narančasta',
      teal: 'Tirkizna',
      rose: 'Ružičasta',
      purple: 'Ljubičasta',
      green: 'Zelena',
      custom: 'Prilagođena boja'
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
