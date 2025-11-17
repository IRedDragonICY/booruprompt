import { en } from './en';
import type { TranslationSchema } from './en';

export const af: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru etiket onttrekker',
    language: 'Taal',
    english: 'Engels',
    indonesian: 'Indonesies',
    chinese: 'Chinees',
    languageSwitcher: {
      title: 'Koppelvlak taal',
      description: 'Gestoor in jou blaaier. Verstek taal is Engels.',
      instantNotice: 'Veranderinge word onmiddellik toegepas sonder herlaai.',
      searchPlaceholder: 'Soek tale...',
      noResults: 'Geen tale gevind nie'
    },
    nav: {
      extractor: 'Etikette',
      image: 'Beeld',
      booruList: 'Booru',
      settings: 'Instellings'
    },
    actions: {
      ...en.common.actions,
      add: 'Voeg by',
      apply: 'Pas toe',
      back: 'Terug',
      cancel: 'Kanselleer',
      clear: 'Maak skoon',
      close: 'Sluit',
      confirm: 'Bevestig',
      copy: 'Kopieer',
      copied: 'Gekopieer!',
      delete: 'Verwyder',
      save: 'Stoor',
      search: 'Soek',
      all: 'Alles',
      none: 'Geen'
    }
  },
  settings: {
    title: 'Instellings',
    sections: {
      appearance: 'Voorkoms',
      colorTheme: 'Kleurtema',
      dataFetch: 'Data verkrygingsmetode'
    },
    themeOptions: {
      system: 'Stelsel',
      light: 'Lig',
      dark: 'Donker'
    },
    colorThemes: {
      blue: 'Blou',
      orange: 'Oranje',
      teal: 'Blougroen',
      rose: 'Pienk',
      purple: 'Pers',
      green: 'Groen',
      custom: 'Aangepaste kleur'
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
