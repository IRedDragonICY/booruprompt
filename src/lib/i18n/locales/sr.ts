import { en } from './en';
import type { TranslationSchema } from './en';

export const sr: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru екстрактор ознака',
    language: 'Језик',
    english: 'Енглески',
    indonesian: 'Индонежански',
    chinese: 'Кинески',
    languageSwitcher: {
      title: 'Језик интерфејса',
      description: 'Сачувано у вашем прегледачу. Подразумевани језик је енглески.',
      instantNotice: 'Промене се примењују тренутно без поновног учитавања.',
      searchPlaceholder: 'Претражи језике...',
      noResults: 'Нема пронађених језика'
    },
    nav: {
      extractor: 'Ознаке',
      image: 'Слика',
      booruList: 'Booru',
      settings: 'Подешавања'
    },
    actions: {
      ...en.common.actions,
      add: 'Додај',
      apply: 'Примени',
      back: 'Назад',
      cancel: 'Откажи',
      clear: 'Обриши',
      close: 'Затвори',
      confirm: 'Потврди',
      copy: 'Копирај',
      copied: 'Копирано!',
      delete: 'Избриши',
      save: 'Сачувај',
      search: 'Претражи',
      all: 'Све',
      none: 'Ништа'
    }
  },
  settings: {
    title: 'Подешавања',
    sections: {
      appearance: 'Изглед',
      colorTheme: 'Тема боја',
      dataFetch: 'Метод преузимања података'
    },
    themeOptions: {
      system: 'Систем',
      light: 'Светла',
      dark: 'Тамна'
    },
    colorThemes: {
      blue: 'Плава',
      orange: 'Наранџаста',
      teal: 'Тиркизна',
      rose: 'Ружичаста',
      purple: 'Љубичаста',
      green: 'Зелена',
      custom: 'Прилагођена боја'
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
