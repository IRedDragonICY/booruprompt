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
    ...en.settings
  }
};
