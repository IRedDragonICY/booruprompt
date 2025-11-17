import { en } from './en';
import type { TranslationSchema } from './en';

export const hy: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Լեզու',
    english: 'Անգլերեն',
    indonesian: 'Ինդոնեզերեն',
    chinese: 'Չինարեն',
    languageSwitcher: {
      title: 'Ինտերֆեյսի լեզու',
      description: 'Պահվում է ձեր զննարկիչում։ Լռելյայն լեզուն անգլերենն է։',
      instantNotice: 'Փոփոխությունները կիրառվում են անմիջապես՝ առանց վերաբեռնման։',
      searchPlaceholder: 'Փնտրել լեզուներ...',
      noResults: 'Լեզուներ չեն գտնվել'
    },
    nav: {
      extractor: 'Թեգեր',
      image: 'Նկար',
      booruList: 'Booru',
      settings: 'Կարգավորումներ'
    },
    actions: {
      ...en.common.actions,
      add: 'Ավելացնել',
      apply: 'Կիրառել',
      back: 'Հետ',
      cancel: 'Չեղարկել',
      clear: 'Մաքրել',
      close: 'Փակել',
      confirm: 'Հաստատել',
      copy: 'Պատճենել',
      copied: 'Պատճենված է!',
      delete: 'Ջնջել',
      save: 'Պահպանել',
      search: 'Փնտրել',
      all: 'Բոլորը',
      none: 'Ոչ մեկը'
    }
  },
  settings: {
    ...en.settings
  }
};
