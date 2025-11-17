import { en } from './en';
import type { TranslationSchema } from './en';

export const ms: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Pengekstrak Tag Booru',
    language: 'Bahasa',
    english: 'Inggeris',
    indonesian: 'Indonesia',
    chinese: 'Cina',
    languageSwitcher: {
      title: 'Bahasa antara muka',
      description: 'Disimpan dalam pelayar anda. Bahasa lalai ialah Inggeris.',
      instantNotice: 'Perubahan digunakan serta-merta tanpa memuatkan semula.',
      searchPlaceholder: 'Cari bahasa...',
      noResults: 'Tiada bahasa dijumpai'
    },
    nav: {
      extractor: 'Tag',
      image: 'Imej',
      booruList: 'Booru',
      settings: 'Tetapan'
    },
    actions: {
      ...en.common.actions,
      add: 'Tambah',
      apply: 'Guna',
      back: 'Kembali',
      cancel: 'Batal',
      clear: 'Kosongkan',
      close: 'Tutup',
      confirm: 'Sahkan',
      copy: 'Salin',
      copied: 'Disalin!',
      delete: 'Padam',
      save: 'Simpan',
      search: 'Cari',
      all: 'Semua',
      none: 'Tiada'
    }
  },
  settings: {
    title: 'Tetapan',
    sections: {
      appearance: 'Penampilan',
      colorTheme: 'Tema Warna',
      dataFetch: 'Kaedah Pengambilan Data'
    },
    themeOptions: {
      system: 'Sistem',
      light: 'Cerah',
      dark: 'Gelap'
    },
    colorThemes: {
      blue: 'Biru',
      orange: 'Oren',
      teal: 'Hijau Kebiruan',
      rose: 'Merah Jambu',
      purple: 'Ungu',
      green: 'Hijau',
      custom: 'Warna Tersuai'
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
