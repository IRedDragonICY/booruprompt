import { en } from './en';
import type { TranslationSchema } from './en';

export const hu: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Címke Kinyerő',
    language: 'Nyelv',
    english: 'Angol',
    indonesian: 'Indonéz',
    chinese: 'Kínai',
    languageSwitcher: {
      title: 'Felület nyelve',
      description: 'A böngészőben tárolva. Az alapértelmezett nyelv az angol.',
      instantNotice: 'A módosítások azonnal érvénybe lépnek újratöltés nélkül.',
      searchPlaceholder: 'Nyelvek keresése...',
      noResults: 'Nem találhatók nyelvek'
    },
    nav: {
      extractor: 'Címkék',
      image: 'Kép',
      booruList: 'Booru',
      settings: 'Beállítások'
    },
    actions: {
      ...en.common.actions,
      add: 'Hozzáadás',
      apply: 'Alkalmaz',
      back: 'Vissza',
      cancel: 'Mégse',
      clear: 'Törlés',
      close: 'Bezárás',
      confirm: 'Megerősítés',
      copy: 'Másolás',
      copied: 'Másolva!',
      delete: 'Törlés',
      save: 'Mentés',
      search: 'Keresés',
      all: 'Összes',
      none: 'Egyik sem'
    }
  },
  settings: {
    ...en.settings
  }
};
