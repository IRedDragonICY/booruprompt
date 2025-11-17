import { en } from './en';
import type { TranslationSchema } from './en';

export const cy: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Echdynnwr tagiau Booru',
    language: 'Iaith',
    english: 'Saesneg',
    indonesian: 'Indoneseg',
    chinese: 'Tsieineeg',
    languageSwitcher: {
      title: 'Iaith y rhyngwyneb',
      description: 'Wedi\'i gadw yn eich porwr. Saesneg yw\'r iaith ddiofyn.',
      instantNotice: 'Mae newidiadau\'n cael eu cymhwyso ar unwaith heb ail-lwytho.',
      searchPlaceholder: 'Chwilio am ieithoedd...',
      noResults: 'Dim ieithoedd wedi\'u canfod'
    },
    nav: {
      extractor: 'Tagiau',
      image: 'Delwedd',
      booruList: 'Booru',
      settings: 'Gosodiadau'
    },
    actions: {
      ...en.common.actions,
      add: 'Ychwanegu',
      apply: 'Cymhwyso',
      back: 'Yn ôl',
      cancel: 'Canslo',
      clear: 'Clirio',
      close: 'Cau',
      confirm: 'Cadarnhau',
      copy: 'Copïo',
      copied: 'Wedi copïo!',
      delete: 'Dileu',
      save: 'Cadw',
      search: 'Chwilio',
      all: 'Pob un',
      none: 'Dim'
    }
  },
  settings: {
    title: 'Gosodiadau',
    sections: {
      appearance: 'Ymddangosiad',
      colorTheme: 'Thema lliw',
      dataFetch: 'Dull nôl data'
    },
    themeOptions: {
      system: 'System',
      light: 'Golau',
      dark: 'Tywyll'
    },
    colorThemes: {
      blue: 'Glas',
      orange: 'Oren',
      teal: 'Glaswyrdd',
      rose: 'Rhosyn',
      purple: 'Porffor',
      green: 'Gwyrdd',
      custom: 'Lliw wedi\'i addasu'
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
