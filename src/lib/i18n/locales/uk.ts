import { en } from './en';
import type { TranslationSchema } from './en';

export const uk: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Вилучення Тегів Booru',
    language: 'Мова',
    english: 'Англійська',
    indonesian: 'Індонезійська',
    chinese: 'Китайська',
    languageSwitcher: {
      title: 'Мова інтерфейсу',
      description: 'Зберігається у вашому браузері. Мова за замовчуванням - англійська.',
      instantNotice: 'Зміни застосовуються миттєво без перезавантаження.',
      searchPlaceholder: 'Пошук мов...',
      noResults: 'Мови не знайдено'
    },
    nav: {
      extractor: 'Теги',
      image: 'Зображення',
      booruList: 'Booru',
      settings: 'Налаштування'
    },
    actions: {
      ...en.common.actions,
      add: 'Додати',
      apply: 'Застосувати',
      back: 'Назад',
      cancel: 'Скасувати',
      clear: 'Очистити',
      close: 'Закрити',
      confirm: 'Підтвердити',
      copy: 'Копіювати',
      copied: 'Скопійовано!',
      delete: 'Видалити',
      save: 'Зберегти',
      search: 'Пошук',
      all: 'Усе',
      none: 'Нічого'
    }
  },
  settings: {
    title: 'Налаштування',
    sections: {
      appearance: 'Зовнішній вигляд',
      colorTheme: 'Кольорова тема',
      dataFetch: 'Метод отримання даних'
    },
    themeOptions: {
      system: 'Системна',
      light: 'Світла',
      dark: 'Темна'
    },
    colorThemes: {
      blue: 'Синій',
      orange: 'Помаранчевий',
      teal: 'Бірюзовий',
      rose: 'Рожевий',
      purple: 'Фіолетовий',
      green: 'Зелений',
      custom: 'Користувацький колір'
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
