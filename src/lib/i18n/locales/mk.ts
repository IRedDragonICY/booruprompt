import { en } from './en';
import type { TranslationSchema } from './en';

export const mk: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru екстрактор на ознаки',
    language: 'Јазик',
    english: 'Англиски',
    indonesian: 'Индонезиски',
    chinese: 'Кинески',
    languageSwitcher: {
      title: 'Јазик на интерфејсот',
      description: 'Зачувано во вашиот прелистувач. Стандардниот јазик е англиски.',
      instantNotice: 'Промените се применуваат веднаш без повторно вчитување.',
      searchPlaceholder: 'Барај јазици...',
      noResults: 'Нема пронајдени јазици'
    },
    nav: {
      extractor: 'Ознаки',
      image: 'Слика',
      booruList: 'Booru',
      settings: 'Поставки'
    },
    actions: {
      ...en.common.actions,
      add: 'Додади',
      apply: 'Примени',
      back: 'Назад',
      cancel: 'Откажи',
      clear: 'Избриши',
      close: 'Затвори',
      confirm: 'Потврди',
      copy: 'Копирај',
      copied: 'Копирано!',
      delete: 'Избриши',
      save: 'Зачувај',
      search: 'Барај',
      all: 'Сите',
      none: 'Ништо'
    }
  },
  settings: {
    title: 'Поставки',
    sections: {
      appearance: 'Изглед',
      colorTheme: 'Тема на бои',
      dataFetch: 'Метод за земање податоци'
    },
    themeOptions: {
      system: 'Систем',
      light: 'Светла',
      dark: 'Темна'
    },
    colorThemes: {
      blue: 'Сина',
      orange: 'Портокалова',
      teal: 'Тиркизна',
      rose: 'Розова',
      purple: 'Виолетова',
      green: 'Зелена',
      custom: 'Прилагодена боја'
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
