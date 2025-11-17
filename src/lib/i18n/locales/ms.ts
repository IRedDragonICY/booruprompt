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
      label: 'Warna Tersuai',
      pickerLabel: 'Pemilih warna tersuai',
      inputLabel: 'Kod hex warna tersuai',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Proksi Pelayan',
        description: 'Menggunakan pelayan aplikasi ini untuk mengambil data. Disyorkan, lebih dipercayai.'
      },
      clientProxy: {
        label: 'Proksi Sisi Klien',
        description: 'Menggunakan proksi CORS awam dalam pelayar anda. Mungkin kurang dipercayai atau terhad kadar.'
      }
    },
    clientProxy: {
      selectLabel: 'Pilih Perkhidmatan Proksi Klien:',
      ariaLabel: 'Pemilih Perkhidmatan Proksi Klien',
      helper: 'Prestasi dan kebolehpercayaan berbeza antara proksi.'
    },
    toggles: {
      autoExtract: {
        label: 'Pengekstrakan Automatik',
        description: 'Ekstrak tag secara automatik selepas menampal/menaip URL yang sah.',
        tooltip: 'Dayakan atau lumpuhkan pengekstrakan tag automatik apabila menampal/menaip URL yang sah'
      },
      previews: {
        label: 'Dayakan Pratonton',
        description: 'Tunjukkan pratonton imej/video semasa pengekstrakan dan dalam sejarah.',
        tooltip: 'Dayakan atau lumpuhkan pratonton imej/video untuk menjimatkan lebar jalur atau elakkan isu yang berpotensi',
        note: 'Imej sentiasa diambil melalui Proksi Pelayan.'
      },
      saveHistory: {
        label: 'Simpan Sejarah',
        description: 'Simpan pengekstrakan yang berjaya secara tempatan dalam pelayar anda.',
        tooltip: 'Dayakan atau lumpuhkan penyimpanan sejarah pengekstrakan ke storan tempatan pelayar anda'
      },
      unsupportedSites: {
        label: 'Dayakan untuk Tapak Tidak Disokong',
        description: 'Cuba ekstrak dari tapak tidak disokong menggunakan corak tapak serupa. Mungkin tidak berfungsi untuk semua tapak.',
        tooltip: 'Dayakan pengekstrakan untuk laman web tidak disokong dengan menggunakan corak tapak serupa'
      },
      blacklist: {
        label: 'Dayakan Senarai Hitam Kata Kunci',
        description: 'Masukkan kata kunci untuk disekat, dipisahkan dengan koma, koma bertitik, atau baris baru.',
        tooltip: 'Sekat tag yang tidak diingini dengan menapis kata kunci tertentu',
        placeholder: 'Masukkan kata kunci untuk disekat…',
        ariaLabel: 'Kata Kunci Senarai Hitam',
        reset: 'Tetapkan Semula ke Lalai'
      }
    },
    historySize: {
      label: 'Saiz Sejarah Maksimum',
      description: 'Tetapkan bilangan maksimum entri untuk kedua-dua sejarah pengekstrakan dan imej.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Tema warna {{label}}',
      historySizeSelect: 'Saiz sejarah maksimum'
    },
    historySizeOptions: {
      '10': '10 Entri',
      '30': '30 Entri',
      '50': '50 Entri',
      '100': '100 Entri',
      unlimited: 'Tanpa Had'
    },
    support: {
      title: 'Sokongan & Maklum Balas',
      cta: 'Laporkan Isu di GitHub',
      description: 'Jumpa pepijat atau ada cadangan? Beritahu kami!'
    },
    modal: {
      close: 'Tutup Tetapan'
    }
  }
};
