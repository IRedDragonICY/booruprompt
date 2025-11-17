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
    title: 'Կարգավորումներ',
    sections: {
      appearance: 'Արտաքին տեսք',
      colorTheme: 'Գունային թեմա',
      dataFetch: 'Տվյալների ստացման մեթոդ'
    },
    themeOptions: {
      system: 'Համակարգ',
      light: 'Բաց',
      dark: 'Մուգ'
    },
    colorThemes: {
      blue: 'Կապույտ',
      orange: 'Նարնջագույն',
      teal: 'Փիրուզագույն',
      rose: 'Վարդագույն',
      purple: 'Մանուշակագույն',
      green: 'Կանաչ',
      custom: 'Անհատական գույն'
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
