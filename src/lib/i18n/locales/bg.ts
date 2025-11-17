import { en } from './en';
import type { TranslationSchema } from './en';

export const bg: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru екстрактор на тагове',
    language: 'Език',
    english: 'Английски',
    indonesian: 'Индонезийски',
    chinese: 'Китайски',
    languageSwitcher: {
      title: 'Език на интерфейса',
      description: 'Запазено във вашия браузър. Езикът по подразбиране е английски.',
      instantNotice: 'Промените се прилагат веднага без презареждане.',
      searchPlaceholder: 'Търсене на езици...',
      noResults: 'Не са намерени езици'
    },
    nav: {
      extractor: 'Тагове',
      image: 'Изображение',
      booruList: 'Booru',
      settings: 'Настройки'
    },
    actions: {
      ...en.common.actions,
      add: 'Добави',
      apply: 'Приложи',
      back: 'Назад',
      cancel: 'Отказ',
      clear: 'Изчисти',
      close: 'Затвори',
      confirm: 'Потвърди',
      copy: 'Копирай',
      copied: 'Копирано!',
      delete: 'Изтрий',
      save: 'Запази',
      search: 'Търси',
      all: 'Всички',
      none: 'Нищо'
    }
  },
  settings: {
    title: 'Настройки',
    sections: {
      appearance: 'Външен вид',
      colorTheme: 'Цветна тема',
      dataFetch: 'Метод за извличане на данни'
    },
    themeOptions: {
      system: 'Системна',
      light: 'Светла',
      dark: 'Тъмна'
    },
    colorThemes: {
      blue: 'Синя',
      orange: 'Оранжева',
      teal: 'Тюркоазена',
      rose: 'Розова',
      purple: 'Лилава',
      green: 'Зелена',
      custom: 'Персонализиран цвят'
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
