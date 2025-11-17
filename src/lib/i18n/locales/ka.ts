import { en } from './en';
import type { TranslationSchema } from './en';

export const ka: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'ენა',
    english: 'ინგლისური',
    indonesian: 'ინდონეზიური',
    chinese: 'ჩინური',
    languageSwitcher: {
      title: 'ინტერფეისის ენა',
      description: 'შენახულია თქვენს ბრაუზერში. ნაგულისხმევი ენა არის ინგლისური.',
      instantNotice: 'ცვლილებები გამოიყენება დაუყოვნებლივ, თავიდან ჩატვირთვის გარეშე.',
      searchPlaceholder: 'ენების ძიება...',
      noResults: 'ენები ვერ მოიძებნა'
    },
    nav: {
      extractor: 'ტეგები',
      image: 'სურათი',
      booruList: 'Booru',
      settings: 'პარამეტრები'
    },
    actions: {
      ...en.common.actions,
      add: 'დამატება',
      apply: 'გამოყენება',
      back: 'უკან',
      cancel: 'გაუქმება',
      clear: 'გასუფთავება',
      close: 'დახურვა',
      confirm: 'დადასტურება',
      copy: 'კოპირება',
      copied: 'დაკოპირდა!',
      delete: 'წაშლა',
      save: 'შენახვა',
      search: 'ძიება',
      all: 'ყველა',
      none: 'არცერთი'
    }
  },
  settings: {
    ...en.settings,
    title: 'პარამეტრები',
    themeOptions: {
      system: 'სისტემური',
      light: 'ღია',
      dark: 'მუქი'
    }
  }
};
