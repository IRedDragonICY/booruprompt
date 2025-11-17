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
    title: 'Pangaturan',
    sections: {
      appearance: 'Tampilan',
      colorTheme: 'Tema Werna',
      dataFetch: 'Cara Njupuk Data'
    },
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
    },
    customColor: {
      label: 'Werna Adat',
      pickerLabel: 'Pamilih werna adat',
      inputLabel: 'Kode hex werna adat',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Proxy Server',
        description: 'Nggunakake server aplikasi iki kanggo njupuk data. Direkomendasikake, luwih dipercaya.'
      },
      clientProxy: {
        label: 'Proxy Sisih Klien',
        description: 'Nggunakake proxy CORS umum ing browser sampeyan. Bisa kurang dipercaya utawa diwatesi.'
      }
    },
    clientProxy: {
      selectLabel: 'Pilih Layanan Proxy Klien:',
      ariaLabel: 'Pamilih Layanan Proxy Klien',
      helper: 'Kinerja lan kapercayan beda-beda ing antarane proxy.'
    },
    toggles: {
      autoExtract: {
        label: 'Ekstraksi Otomatis',
        description: 'Ekstrak tag kanthi otomatis sawise nempel/ngetik URL sing valid.',
        tooltip: 'Aktifake utawa nonaktifake ekstraksi tag otomatis nalika nempel/ngetik URL sing valid'
      },
      previews: {
        label: 'Aktifake Pratinjau',
        description: 'Tampilake pratinjau gambar/video nalika ekstraksi lan ing riwayat.',
        tooltip: 'Aktifake utawa nonaktifake pratinjau gambar/video kanggo ngirit bandwidth utawa ngindhari masalah',
        note: 'Gambar tansah dijupuk liwat Proxy Server.'
      },
      saveHistory: {
        label: 'Simpen Riwayat',
        description: 'Simpen ekstraksi sing sukses sacara lokal ing browser sampeyan.',
        tooltip: 'Aktifake utawa nonaktifake nyimpen riwayat ekstraksi ing panyimpenan lokal browser'
      },
      unsupportedSites: {
        label: 'Aktifake kanggo Situs sing Ora Didhukung',
        description: 'Coba ekstrak saka situs sing ora didhukung nggunakake pola situs sing padha. Bisa uga ora bisa kanggo kabeh situs.',
        tooltip: 'Aktifake ekstraksi kanggo situs web sing ora didhukung nggunakake pola situs sing padha'
      },
      blacklist: {
        label: 'Aktifake Daftar Ireng Tembung Kunci',
        description: 'Lebokake tembung kunci sing arep diblokir, dipisahake nganggo koma, titik koma, utawa baris anyar.',
        tooltip: 'Blokir tag sing ora dikarepake kanthi nyaring tembung kunci tartamtu',
        placeholder: 'Lebokake tembung kunci sing arep diblokir…',
        ariaLabel: 'Tembung Kunci Daftar Ireng',
        reset: 'Reset menyang Gawan'
      }
    },
    historySize: {
      label: 'Ukuran Riwayat Maksimal',
      description: 'Setel jumlah maksimal entri kanggo riwayat ekstraksi lan gambar.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Tema werna {{label}}',
      historySizeSelect: 'Ukuran riwayat maksimal'
    },
    historySizeOptions: {
      '10': '10 Entri',
      '30': '30 Entri',
      '50': '50 Entri',
      '100': '100 Entri',
      unlimited: 'Tanpa Wates'
    },
    support: {
      title: 'Dhukungan & Masukan',
      cta: 'Laporake Masalah ing GitHub',
      description: 'Nemokake bug utawa duwe saran? Kabari kita!'
    },
    modal: {
      close: 'Tutup Pangaturan'
    }
  }
};
