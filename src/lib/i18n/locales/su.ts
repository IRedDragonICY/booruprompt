import { en } from './en';
import type { TranslationSchema } from './en';

export const su: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Basa',
    english: 'Inggris',
    indonesian: 'Indonesia',
    chinese: 'Tiongkok',
    languageSwitcher: {
      title: 'Basa antarmuka',
      description: 'Disimpen dina browser anjeun. Basa standar nyaéta Inggris.',
      instantNotice: 'Parobahan langsung diterapkeun tanpa reload.',
      searchPlaceholder: 'Paluruh basa...',
      noResults: 'Teu aya basa anu kapendak'
    },
    nav: {
      extractor: 'Tag',
      image: 'Gambar',
      booruList: 'Booru',
      settings: 'Setélan'
    },
    actions: {
      ...en.common.actions,
      add: 'Tambahkeun',
      apply: 'Terapkeun',
      back: 'Balik',
      cancel: 'Bolay',
      clear: 'Beresihan',
      close: 'Tutup',
      confirm: 'Konfirmasi',
      copy: 'Salin',
      copied: 'Geus disalin!',
      delete: 'Hapus',
      save: 'Simpen',
      search: 'Paluruh',
      all: 'Sadayana',
      none: 'Euweuh'
    }
  },
  settings: {
    title: 'Setélan',
    sections: {
      appearance: 'Tampilan',
      colorTheme: 'Téma Warna',
      dataFetch: 'Métode Nyokot Data'
    },
    themeOptions: {
      system: 'Sistem',
      light: 'Caang',
      dark: 'Poék'
    },
    colorThemes: {
      blue: 'Biru',
      orange: 'Oranyeu',
      teal: 'Toska',
      rose: 'Pinkeun',
      purple: 'Ungu',
      green: 'Héjo',
      custom: 'Warna Adat'
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
