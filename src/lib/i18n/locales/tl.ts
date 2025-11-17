import { en } from './en';
import type { TranslationSchema } from './en';

export const tl: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Wika',
    english: 'Ingles',
    indonesian: 'Indonesian',
    chinese: 'Intsik',
    languageSwitcher: {
      title: 'Wika ng interface',
      description: 'Naka-save sa iyong browser. Ang default na wika ay Ingles.',
      instantNotice: 'Agad na inilalapat ang mga pagbabago nang walang pag-reload.',
      searchPlaceholder: 'Maghanap ng wika...',
      noResults: 'Walang nakitang wika'
    },
    nav: {
      extractor: 'Mga Tag',
      image: 'Larawan',
      booruList: 'Booru',
      settings: 'Mga Setting'
    },
    actions: {
      ...en.common.actions,
      add: 'Idagdag',
      apply: 'Ilapat',
      back: 'Bumalik',
      cancel: 'Kanselahin',
      clear: 'Linisin',
      close: 'Isara',
      confirm: 'Kumpirmahin',
      copy: 'Kopyahin',
      copied: 'Nakopya!',
      delete: 'Tanggalin',
      save: 'I-save',
      search: 'Maghanap',
      all: 'Lahat',
      none: 'Wala'
    }
  },
  settings: {
    ...en.settings,
    title: 'Mga Setting',
    themeOptions: {
      system: 'Sistema',
      light: 'Maliwanag',
      dark: 'Madilim'
    }
  }
};
