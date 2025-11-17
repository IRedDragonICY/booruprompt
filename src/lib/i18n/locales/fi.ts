import { en } from './en';
import type { TranslationSchema } from './en';

export const fi: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru-taginpurkaja',
    language: 'Kieli',
    english: 'Englanti',
    indonesian: 'Indonesia',
    chinese: 'Kiina',
    languageSwitcher: {
      title: 'Käyttöliittymän kieli',
      description: 'Tallennettu selaimeesi. Oletuskieli on englanti.',
      instantNotice: 'Muutokset otetaan käyttöön heti ilman uudelleenlatausta.',
      searchPlaceholder: 'Hae kieliä...',
      noResults: 'Kieliä ei löytynyt'
    },
    nav: {
      extractor: 'Tagit',
      image: 'Kuva',
      booruList: 'Booru',
      settings: 'Asetukset'
    },
    actions: {
      ...en.common.actions,
      add: 'Lisää',
      apply: 'Käytä',
      back: 'Takaisin',
      cancel: 'Peruuta',
      clear: 'Tyhjennä',
      close: 'Sulje',
      confirm: 'Vahvista',
      copy: 'Kopioi',
      copied: 'Kopioitu!',
      delete: 'Poista',
      save: 'Tallenna',
      search: 'Hae',
      all: 'Kaikki',
      none: 'Ei mitään'
    }
  },
  settings: {
    title: 'Asetukset',
    sections: {
      appearance: 'Ulkoasu',
      colorTheme: 'Väriteema',
      dataFetch: 'Tietojen Hakumenetelmä'
    },
    themeOptions: {
      system: 'Järjestelmä',
      light: 'Vaalea',
      dark: 'Tumma'
    },
    colorThemes: {
      blue: 'Sininen',
      orange: 'Oranssi',
      teal: 'Turkoosi',
      rose: 'Ruusu',
      purple: 'Violetti',
      green: 'Vihreä',
      custom: 'Mukautettu Väri'
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
