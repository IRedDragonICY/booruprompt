import { en } from './en';
import type { TranslationSchema } from './en';

export const nl: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Taal',
    english: 'Engels',
    indonesian: 'Indonesisch',
    chinese: 'Chinees',
    languageSwitcher: {
      title: 'Interfacetaal',
      description: 'Opgeslagen in uw browser. Standaardtaal is Engels.',
      instantNotice: 'Wijzigingen worden direct toegepast zonder te herladen.',
      searchPlaceholder: 'Zoek talen...',
      noResults: 'Geen talen gevonden'
    },
    nav: {
      extractor: 'Tags',
      image: 'Afbeelding',
      booruList: 'Booru',
      settings: 'Instellingen'
    },
    actions: {
      ...en.common.actions,
      add: 'Toevoegen',
      apply: 'Toepassen',
      back: 'Terug',
      cancel: 'Annuleren',
      clear: 'Wissen',
      close: 'Sluiten',
      confirm: 'Bevestigen',
      copy: 'Kopiëren',
      copied: 'Gekopieerd!',
      delete: 'Verwijderen',
      save: 'Opslaan',
      search: 'Zoeken',
      all: 'Alles',
      none: 'Geen'
    }
  },
  settings: {
    title: 'Instellingen',
    sections: {
      appearance: 'Uiterlijk',
      colorTheme: 'Kleurthema',
      dataFetch: 'Gegevensophaalmethode'
    },
    themeOptions: {
      system: 'Systeem',
      light: 'Licht',
      dark: 'Donker'
    },
    colorThemes: {
      blue: 'Blauw',
      orange: 'Oranje',
      teal: 'Groenblauw',
      rose: 'Roze',
      purple: 'Paars',
      green: 'Groen',
      custom: 'Aangepaste Kleur'
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
