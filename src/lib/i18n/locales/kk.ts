import { en } from './en';
import type { TranslationSchema } from './en';

export const kk: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Тіл',
    english: 'Ағылшын',
    indonesian: 'Индонезия',
    chinese: 'Қытай',
    languageSwitcher: {
      title: 'Интерфейс тілі',
      description: 'Браузеріңізде сақталған. Әдепкі тіл – ағылшын.',
      instantNotice: 'Өзгерістер қайта жүктемей-ақ бірден қолданылады.',
      searchPlaceholder: 'Тілдерді іздеу...',
      noResults: 'Тілдер табылмады'
    },
    nav: {
      extractor: 'Тегтер',
      image: 'Сурет',
      booruList: 'Booru',
      settings: 'Параметрлер'
    },
    actions: {
      ...en.common.actions,
      add: 'Қосу',
      apply: 'Қолдану',
      back: 'Артқа',
      cancel: 'Болдырмау',
      clear: 'Тазалау',
      close: 'Жабу',
      confirm: 'Растау',
      copy: 'Көшіру',
      copied: 'Көшірілді!',
      delete: 'Жою',
      save: 'Сақтау',
      search: 'Іздеу',
      all: 'Барлығы',
      none: 'Ешқандай'
    }
  },
  settings: {
    title: 'Параметрлер',
    sections: {
      appearance: 'Сыртқы түрі',
      colorTheme: 'Түс тақырыбы',
      dataFetch: 'Деректерді алу әдісі'
    },
    themeOptions: {
      system: 'Жүйе',
      light: 'Ашық',
      dark: 'Қараңғы'
    },
    colorThemes: {
      blue: 'Көк',
      orange: 'Қызғылт сары',
      teal: 'Көгілдір',
      rose: 'Қызғылт',
      purple: 'Күлгін',
      green: 'Жасыл',
      custom: 'Таңдалған түс'
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
