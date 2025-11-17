import type { TranslationSchema } from './en';

export const su: TranslationSchema = {
  common: {
    appName: 'Booru Tag Extractor',
    language: 'Basa',
    english: 'Inggris',
    indonesian: 'Indonesia',
    chinese: 'Tiongkok',
    author: 'IRedDragonICY',
    defaultDescription: 'Ékstrak, saring, jeung salin tag tina postingan booru sacara instan.',
    unknown: 'Teu dipikanyaho',
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
    navTooltip: {
      extractor: 'Ékstraktor Tag',
      image: 'Métadata Gambar',
      booruList: 'Papan Peringkat Booru',
      settings: 'Setélan'
    },
    dropOverlay: {
      url: 'Leupaskeun URL',
      png: 'Leupaskeun PNG'
    },
    actions: {
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
      done: 'Réngsé',
      edit: 'Édit',
      next: 'Salajengna',
      previous: 'Samemehna',
      refresh: 'Refresh',
      reset: 'Reset',
      retry: 'Coba Deui',
      save: 'Simpen',
      search: 'Paluruh',
      select: 'Pilih',
      submit: 'Kirim',
      all: 'Sadayana',
      none: 'Euweuh',
      visit: 'Buka',
      previousShort: 'Samem',
      nextShort: 'Salaj'
    },
    status: {
      loading: 'Nuju dimuat...',
      processing: 'Nuju diolah...'
    },
    footer: {
      madeWith: 'Didamel kalayan',
      by: 'ku'
    },
    statusBar: {
      serverProxy: 'Proxy Server.',
      clientProxy: 'Proxy Klién ({{proxy}}).',
      historyEnabled: 'Riwayat aktip ({{size}}).',
      historyDisabled: 'Riwayat teu aktip.',
      historyUnlimited: 'Tanpa wates',
      historyEntries: '{{count}} Éntri'
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
        tooltip: 'Aktipkeun atawa mareuhan pramidang gambar/video pikeun ngahémat data atawa nyingkahan masalah',
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
  },
  extractor: {
    header: {
      title: 'Booru Tag Extractor',
      subtitle: 'Ékstrak tag tina papan gambar booru',
      supported: 'Platform anu dirojong:',
      urlLabel: 'URL Postingan Booru',
      urlPlaceholder: 'Tempelkeun URL postingan booru di dieu...',
      manualButton: 'Ékstrak Manual',
      resetButton: 'Reset',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Booru Tag Extractor',
      heroSubtitle: 'Ékstrak, saring, jeung salin tag tina situs booru sacara instan',
      features: {
        smart: { title: 'Pinter', subtitle: 'Ékstrak otomatis' },
        fast: { title: 'Gancang', subtitle: 'Hasil instan' },
        private: { title: 'Pribadi', subtitle: 'Sisi klién' },
        copy: { title: 'Salin', subtitle: 'Hiji klik' }
      },
      cta: {
        paste: 'Tempelkeun',
        extract: 'Ékstrak',
        filter: 'Saring',
        copy: 'Salin'
      },
      supportNotice: 'Ngarojong Danbooru, Gelbooru, Safebooru, Rule34, e621, jeung lianna'
    },
    preview: {
      title: 'Pramidang'
    },
    status: {
      resultLabel: 'Hasil pikeun:'
    },
    categories: {
      title: 'Kategori Panyaring',
      enableAll: 'Sadayana',
      disableAll: 'Euweuh',
      items: {
        copyright: 'Hak cipta',
        character: 'Karakter',
        general: 'Umum',
        meta: 'Meta',
        other: 'Lianna'
      },
      count_one: '{{count}} tag',
      count_other: '{{count}} tag'
    },
    filteredTags: {
      label: 'Tag anu Disaring',
      ariaLabel: 'Tag anu disaring',
      empty: 'Teu aya tag pikeun ditémbongkeun.',
      copy: 'Salin Tag',
      copied: 'Geus disalin!'
    },
    history: {
      extractionTitle: 'Riwayat Ékstraksi',
      imageTitle: 'Riwayat Gambar',
      searchExtraction: 'Paluruh judul, url, tag...',
      searchImages: 'Paluruh ngaran file, prompt, param...',
      emptySearch: 'Teu aya éntri anu cocog jeung panyungsi anjeun.',
      clearTooltip: 'Beresihan Sakabéh Riwayat',
      clearAction: 'Beresihan Riwayat',
      confirmMessage: 'Yakin badé diberesihan?',
      confirmYes: 'Enya, Beresihan',
      confirmCancel: 'Bolay',
      searchAriaLabel: 'Paluruh {{context}}',
      searchFallback: 'riwayat',
      clearSearchTooltip: 'Beresihan Panyungsi',
      clearSearchAria: 'Beresihan panyungsi'
    },
    mobile: {
      historyButton: 'Riwayat',
      urlLabel: 'URL Postingan Booru',
      urlPlaceholder: 'Tempelkeun URL atawa Sered & Leupaskeun...',
      manualButton: 'Ékstrak Manual',
      resetButton: 'Reset'
    }
  },
  imageTool: {
    title: 'Métadata Gambar',
    dropCtaTitle: 'Sered & Leupaskeun PNG di Dieu',
    dropCtaSubtitle: 'atawa klik pikeun unggah',
    selectButton: 'Pilih PNG',
    statusProcessing: 'Nuju diolah...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'Prompt Positif',
    negativePrompt: 'Prompt Négatif',
    parameters: 'Paramétér',
    copy: 'Salin',
    copyAll: 'Salin Sadaya',
    copySuccess: 'Geus disalin!',
    noMetadata: 'Teu aya métadata generasi.',
    loadMetadata: 'Muat Métadata',
    deleteEntry: 'Hapus Éntri',
    historyTitle: 'Riwayat Gambar',
    historySearch: 'Paluruh ngaran file, prompt, param...',
    previewAlt: 'Pramidang',
    footer: {
      metadataNotice: "Ékstraksi métadata PNG pikeun potongan téks 'parameters'."
    }
  },
  historyItem: {
    load: 'Muat éntri riwayat ieu',
    delete: 'Hapus éntri riwayat ieu',
    previewAlt: 'Pramidang'
  },
  imagePreview: {
    loading: 'Nuju muat pramidang...',
    error: 'Teu tiasa muat pramidang.',
    errorDetail: 'Kasalahan proxy server atawa gambar teu valid',
    videoUnsupported: 'Browser anjeun teu ngarojong video.',
    openFull: 'Buka pramidang ukuran pinuh',
    close: 'Tutup',
    reset: 'Reset',
    openOriginal: 'Buka aslina'
  },
  booruList: {
    pageTitle: 'Papan Peringkat Booru Paling Luhur',
    pageDescriptionShort: 'Jelajah situs booru paling luhur anu dipereuntuk dumasar kana jumlah gambar jeung aktivitas.',
    pageDescriptionLong: 'Panggihan situs booru paling populér ti sakuliah web. Dipereuntuk dumasar kana jumlah gambar, anggota, jeung aktivitas kalayan data ti Booru.org.',
    searchPlaceholder: 'Paluruh situs booru...',
    filter: {
      all: 'Sadayana',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Gambar',
      members: 'Anggota',
      owner: 'Pamilik'
    },
    sort: {
      label: 'Urutkeun dumasar:',
      rank: 'Peringkat (Paling Luhur)',
      images: 'Jumlah Gambar',
      members: 'Jumlah Anggota',
      asc: 'Naék',
      desc: 'Turun'
    },
    itemsPerPage: 'Per kaca:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> tina {{total}}',
    pagination: {
      previous: 'Samemehna',
      next: 'Salajengna',
      previousShort: 'Samem',
      nextShort: 'Salaj'
    },
    emptyState: 'Teu aya situs booru anu kapendak',
    loading: 'Nuju muat data booru...',
    errorTitle: 'Kasalahan Muat Data',
    errors: {
      fetchFailed: 'Gagal nyokot data booru.',
      unknown: 'Aya kasalahan nalika muat papan peringkat.'
    },
    ownerLabel: 'Pamilik:',
    visit: 'Buka {{name}}'
  },
  booruDetail: {
    backButton: 'Balik ka Daptar Booru',
    notFoundTitle: 'Booru Teu Kapendak',
    notFoundDescription: 'Domain booru "{{domain}}" teu kapendak dina basis data kami.',
    statistics: 'Statistik',
    totalImages: 'Total Gambar',
    totalMembers: 'Total Anggota',
    shortName: 'Ngaran Pondok',
    owner: 'Pamilik',
    hosted: 'Di-host ku booru.org',
    protocol: 'Protokol',
    yes: 'Enya',
    no: 'Henteu',
    visit: 'Buka {{name}}',
    loading: 'Nuju dimuat...'
  }
};
