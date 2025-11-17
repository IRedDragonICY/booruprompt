import { en } from './en';
import type { TranslationSchema } from './en';

export const cs: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Extraktor Tagů Booru',
    language: 'Jazyk',
    english: 'Angličtina',
    indonesian: 'Indonéština',
    chinese: 'Čínština',
    languageSwitcher: {
      title: 'Jazyk rozhraní',
      description: 'Uloženo ve vašem prohlížeči. Výchozí jazyk je angličtina.',
      instantNotice: 'Změny se použijí okamžitě bez opětovného načtení.',
      searchPlaceholder: 'Hledat jazyky...',
      noResults: 'Nebyly nalezeny žádné jazyky'
    },
    nav: {
      extractor: 'Tagy',
      image: 'Obrázek',
      booruList: 'Booru',
      settings: 'Nastavení'
    },
    actions: {
      ...en.common.actions,
      add: 'Přidat',
      apply: 'Použít',
      back: 'Zpět',
      cancel: 'Zrušit',
      clear: 'Vymazat',
      close: 'Zavřít',
      confirm: 'Potvrdit',
      copy: 'Kopírovat',
      copied: 'Zkopírováno!',
      delete: 'Smazat',
      save: 'Uložit',
      search: 'Hledat',
      all: 'Vše',
      none: 'Žádné'
    }
  },
  settings: {
    title: 'Nastavení',
    sections: {
      appearance: 'Vzhled',
      colorTheme: 'Barevný Motiv',
      dataFetch: 'Metoda Načítání Dat'
    },
    themeOptions: {
      system: 'Systém',
      light: 'Světlý',
      dark: 'Tmavý'
    },
    colorThemes: {
      blue: 'Modrá',
      orange: 'Oranžová',
      teal: 'Tyrkysová',
      rose: 'Růžová',
      purple: 'Fialová',
      green: 'Zelená',
      custom: 'Vlastní Barva'
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
