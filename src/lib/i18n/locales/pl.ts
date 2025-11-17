import { en } from './en';
import type { TranslationSchema } from './en';

export const pl: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Ekstraktor Tagów Booru',
    language: 'Język',
    english: 'Angielski',
    indonesian: 'Indonezyjski',
    chinese: 'Chiński',
    languageSwitcher: {
      title: 'Język interfejsu',
      description: 'Zapisane w przeglądarce. Domyślny język to angielski.',
      instantNotice: 'Zmiany są stosowane natychmiast bez przeładowania.',
      searchPlaceholder: 'Szukaj języków...',
      noResults: 'Nie znaleziono języków'
    },
    nav: {
      extractor: 'Tagi',
      image: 'Obraz',
      booruList: 'Booru',
      settings: 'Ustawienia'
    },
    actions: {
      ...en.common.actions,
      add: 'Dodaj',
      apply: 'Zastosuj',
      back: 'Wstecz',
      cancel: 'Anuluj',
      clear: 'Wyczyść',
      close: 'Zamknij',
      confirm: 'Potwierdź',
      copy: 'Kopiuj',
      copied: 'Skopiowano!',
      delete: 'Usuń',
      save: 'Zapisz',
      search: 'Szukaj',
      all: 'Wszystko',
      none: 'Brak'
    }
  },
  settings: {
    title: 'Ustawienia',
    sections: {
      appearance: 'Wygląd',
      colorTheme: 'Motyw Kolorystyczny',
      dataFetch: 'Metoda Pobierania Danych'
    },
    themeOptions: {
      system: 'Systemowy',
      light: 'Jasny',
      dark: 'Ciemny'
    },
    colorThemes: {
      blue: 'Niebieski',
      orange: 'Pomarańczowy',
      teal: 'Morski',
      rose: 'Różowy',
      purple: 'Fioletowy',
      green: 'Zielony',
      custom: 'Niestandardowy Kolor'
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
