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
    ...en.settings
  }
};
