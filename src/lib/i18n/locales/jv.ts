import { en } from './en';
import type { TranslationSchema } from './en';

export const jv: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Basa',
    english: 'Inggris',
    indonesian: 'Indonesia',
    chinese: 'Tionghoa',
    languageSwitcher: {
      title: 'Basa antarmuka',
      description: 'Disimpen ing browser sampeyan. Basa gawan yaiku Inggris.',
      instantNotice: 'Owah-owahan ditrapake langsung tanpa reload.',
      searchPlaceholder: 'Goleki basa...',
      noResults: 'Ora ana basa sing ketemu'
    },
    nav: {
      extractor: 'Tag',
      image: 'Gambar',
      booruList: 'Booru',
      settings: 'Pangaturan'
    },
    actions: {
      ...en.common.actions,
      add: 'Tambah',
      apply: 'Trapake',
      back: 'Bali',
      cancel: 'Batal',
      clear: 'Resiki',
      close: 'Tutup',
      confirm: 'Konfirmasi',
      copy: 'Salin',
      copied: 'Wis disalin!',
      delete: 'Busek',
      save: 'Simpen',
      search: 'Goleki',
      all: 'Kabeh',
      none: 'Ora ana'
    },
    status: {
      loading: 'Lagi dimuat...',
      processing: 'Lagi diproses...'
    },
    footer: {
      madeWith: 'Digawe nganggo',
      by: 'dening'
    }
  },
  settings: {
    ...en.settings,
    title: 'Pangaturan',
    themeOptions: {
      system: 'Sistem',
      light: 'Padhang',
      dark: 'Peteng'
    },
    colorThemes: {
      blue: 'Biru',
      orange: 'Oranye',
      teal: 'Toska',
      rose: 'Mawar',
      purple: 'Ungu',
      green: 'Ijo',
      custom: 'Werna Adat'
    }
  }
};
