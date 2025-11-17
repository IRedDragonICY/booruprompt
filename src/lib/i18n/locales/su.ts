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
      label: 'Warna Adat',
      pickerLabel: 'Pamilih warna adat',
      inputLabel: 'Kode hex warna adat',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Proxy Server',
        description: 'Ngagunakeun server aplikasi ieu pikeun nyokot data. Disarankeun, leuwih dipercaya.'
      },
      clientProxy: {
        label: 'Proxy di Sisi Klién',
        description: 'Ngagunakeun proxy CORS umum dina browser anjeun. Bisa jadi kurang dipercaya atawa diwatesan.'
      }
    },
    clientProxy: {
      selectLabel: 'Pilih Ladenan Proxy Klién:',
      ariaLabel: 'Pamilih Ladenan Proxy Klién',
      helper: 'Kinerja jeung kapercayaan béda-béda antara proxy.'
    },
    toggles: {
      autoExtract: {
        label: 'Ékstraksi Otomatis',
        description: 'Ékstrak tag sacara otomatis sanggeus nempelkeun/ngetik URL anu valid.',
        tooltip: 'Aktipkeun atawa mareuman ékstraksi tag otomatis sanggeus nempelkeun/ngetik URL anu valid'
      },
      previews: {
        label: 'Aktipkeun Pramidang',
        description: 'Témbongkeun pramidang gambar/video nalika ékstraksi jeung dina riwayat.',
        tooltip: 'Aktipkeun atawa mareuman pramidang gambar/video pikeun ngahémat data atawa nyingkahan masalah',
        note: 'Gambar sok dicokot ngaliwatan Proxy Server.'
      },
      saveHistory: {
        label: 'Simpen Riwayat',
        description: 'Simpen hasil ékstraksi anu suksés sacara lokal dina browser anjeun.',
        tooltip: 'Aktipkeun atawa mareuman nyimpen riwayat ékstraksi kana panyimpenan lokal browser'
      },
      unsupportedSites: {
        label: 'Aktipkeun pikeun Situs anu Teu Dirojong',
        description: 'Cobaan ékstrak tina situs anu teu dirojong nganggo pola situs anu sarupa. Bisa waé teu hasil pikeun sakabéh situs.',
        tooltip: 'Aktipkeun ékstraksi pikeun situs wéb anu teu dirojong ku cara maké pola situs anu sarupa'
      },
      blacklist: {
        label: 'Aktipkeun Daptar Hideung Kecap Konci',
        description: 'Lebetkeun kecap konci anu badé dipeungpeuk, dipisahkeun ku koma, titik koma, atawa baris énggal.',
        tooltip: 'Peungpeuk tag anu teu dipikahoyong ku cara nyaring kecap konci nu tangtu',
        placeholder: 'Lebetkeun kecap konci pikeun dipeungpeuk…',
        ariaLabel: 'Kecap Konci Daptar Hideung',
        reset: 'Reset ka Standar'
      }
    },
    historySize: {
      label: 'Watesan Riwayat Maksimal',
      description: 'Aturkeun jumlah éntri maksimal pikeun riwayat ékstraksi jeung gambar.'
    },
    accessibility: {
      themeOption: 'Téma {{label}}',
      colorThemeOption: 'Téma warna {{label}}',
      historySizeSelect: 'Watesan riwayat maksimal'
    },
    historySizeOptions: {
      '10': '10 Éntri',
      '30': '30 Éntri',
      '50': '50 Éntri',
      '100': '100 Éntri',
      unlimited: 'Tanpa Wates'
    },
    support: {
      title: 'Dukungan & Eupan Balik',
      cta: 'Laporkeun Masalah di GitHub',
      description: 'Kapendak bug atawa gaduh saran? Béjaan ka kami!'
    },
    modal: {
      close: 'Tutup Setélan'
    }
  }
};
