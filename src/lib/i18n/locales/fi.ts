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
    ...en.settings,
    title: 'Asetukset',
    themeOptions: {
      system: 'Järjestelmä',
      light: 'Vaalea',
      dark: 'Tumma'
    }
  }
};
