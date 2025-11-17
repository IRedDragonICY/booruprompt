import { en } from './en';
import type { TranslationSchema } from './en';

export const ru: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Извлечение Тегов Booru',
    language: 'Язык',
    english: 'Английский',
    indonesian: 'Индонезийский',
    chinese: 'Китайский',
    languageSwitcher: {
      title: 'Язык интерфейса',
      description: 'Сохраняется в вашем браузере. Язык по умолчанию - английский.',
      instantNotice: 'Изменения применяются мгновенно без перезагрузки.',
      searchPlaceholder: 'Поиск языков...',
      noResults: 'Языки не найдены'
    },
    nav: {
      extractor: 'Теги',
      image: 'Изображение',
      booruList: 'Booru',
      settings: 'Настройки'
    },
    actions: {
      ...en.common.actions,
      add: 'Добавить',
      apply: 'Применить',
      back: 'Назад',
      cancel: 'Отмена',
      clear: 'Очистить',
      close: 'Закрыть',
      confirm: 'Подтвердить',
      copy: 'Копировать',
      copied: 'Скопировано!',
      delete: 'Удалить',
      save: 'Сохранить',
      search: 'Поиск',
      all: 'Все',
      none: 'Нет'
    }
  },
  settings: {
    ...en.settings
  }
};
