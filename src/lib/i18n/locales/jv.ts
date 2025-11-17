import type { TranslationSchema } from './en';

export const jv: TranslationSchema = {
  common: {
    appName: 'Booru Tag Extractor',
    language: 'Basa',
    english: 'Inggris',
    indonesian: 'Indonesia',
    chinese: 'Tionghoa',
    author: 'IRedDragonICY',
    defaultDescription: 'Ekstrak, saring, lan salin tag saka postingan booru kanthi cepet.',
    unknown: 'Ora dingerteni',
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
    navTooltip: {
      extractor: 'Ekstraktor Tag',
      image: 'Metadata Gambar',
      booruList: 'Papan Peringkat Booru',
      settings: 'Pangaturan'
    },
    dropOverlay: {
      url: 'Selehake URL',
      png: 'Selehake PNG'
    },
    actions: {
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
      done: 'Rampung',
      edit: 'Sunting',
      next: 'Sabanjure',
      previous: 'Sadurunge',
      refresh: 'Refresh',
      reset: 'Reset',
      retry: 'Coba Maneh',
      save: 'Simpen',
      search: 'Goleki',
      select: 'Pilih',
      submit: 'Kirim',
      all: 'Kabeh',
      none: 'Ora ana',
      visit: 'Bukak',
      previousShort: 'Sadur',
      nextShort: 'Sabanj'
    },
    status: {
      loading: 'Lagi dimuat...',
      processing: 'Lagi diproses...'
    },
    footer: {
      madeWith: 'Digawe nganggo',
      by: 'dening'
    },
    statusBar: {
      serverProxy: 'Proxy Server.',
      clientProxy: 'Proxy Klien ({{proxy}}).',
      historyEnabled: 'Riwayat aktif ({{size}}).',
      historyDisabled: 'Riwayat ora aktif.',
      historyUnlimited: 'Tanpa wates',
      historyEntries: '{{count}} Entri'
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
  },
  extractor: {
    header: {
      title: 'Booru Tag Extractor',
      subtitle: 'Ekstrak tag saka papan gambar booru',
      supported: 'Platform sing didhukung:',
      urlLabel: 'URL Postingan Booru',
      urlPlaceholder: 'Tempelake URL postingan booru ing kene...',
      manualButton: 'Ekstrak Manual',
      resetButton: 'Reset',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Booru Tag Extractor',
      heroSubtitle: 'Ekstrak, saring, lan salin tag saka situs booru kanthi cepet',
      features: {
        smart: { title: 'Pinter', subtitle: 'Ekstrak otomatis' },
        fast: { title: 'Cepet', subtitle: 'Asil langsung' },
        private: { title: 'Pribadi', subtitle: 'Sisih klien' },
        copy: { title: 'Salin', subtitle: 'Seklik' }
      },
      cta: {
        paste: 'Tempel',
        extract: 'Ekstrak',
        filter: 'Saring',
        copy: 'Salin'
      },
      supportNotice: 'Ndhukung Danbooru, Gelbooru, Safebooru, Rule34, e621, lan liyane'
    },
    preview: {
      title: 'Pratinjau'
    },
    status: {
      resultLabel: 'Asil kanggo:'
    },
    categories: {
      title: 'Kategori Filter',
      enableAll: 'Kabeh',
      disableAll: 'Ora ana',
      items: {
        copyright: 'Hak cipta',
        character: 'Karakter',
        general: 'Umum',
        meta: 'Meta',
        other: 'Liyane'
      },
      count_one: '{{count}} tag',
      count_other: '{{count}} tag'
    },
    filteredTags: {
      label: 'Tag Sing Disaring',
      ariaLabel: 'Tag sing disaring',
      empty: 'Ora ana tag kanggo ditampilake.',
      copy: 'Salin Tag',
      copied: 'Wis disalin!'
    },
    history: {
      extractionTitle: 'Riwayat Ekstraksi',
      imageTitle: 'Riwayat Gambar',
      searchExtraction: 'Goleki judhul, url, tag...',
      searchImages: 'Goleki jeneng file, prompt, param...',
      emptySearch: 'Ora ana entri sing cocok karo panelusuran sampeyan.',
      clearTooltip: 'Resiki Kabeh Riwayat',
      clearAction: 'Resiki Riwayat',
      confirmMessage: 'Yakin arep diresiki?',
      confirmYes: 'Ya, Resiki',
      confirmCancel: 'Batal',
      searchAriaLabel: 'Goleki {{context}}',
      searchFallback: 'riwayat',
      clearSearchTooltip: 'Resiki Panelusuran',
      clearSearchAria: 'Resiki panelusuran'
    },
    mobile: {
      historyButton: 'Riwayat',
      urlLabel: 'URL Postingan Booru',
      urlPlaceholder: 'Tempelake URL utawa Tarik & Selehake...',
      manualButton: 'Ekstrak Manual',
      resetButton: 'Reset'
    }
  },
  imageTool: {
    title: 'Metadata Gambar',
    dropCtaTitle: 'Tarik & Selehake PNG ing Kene',
    dropCtaSubtitle: 'utawa klik kanggo ngunggah',
    selectButton: 'Pilih PNG',
    statusProcessing: 'Lagi diproses...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'Prompt Positif',
    negativePrompt: 'Prompt Negatif',
    parameters: 'Parameter',
    copy: 'Salin',
    copyAll: 'Salin Kabeh',
    copySuccess: 'Wis disalin!',
    noMetadata: 'Ora ana metadata pembuatan.',
    loadMetadata: 'Muat Metadata',
    deleteEntry: 'Busek Entri',
    historyTitle: 'Riwayat Gambar',
    historySearch: 'Goleki jeneng file, prompt, param...',
    previewAlt: 'Pratinjau',
    footer: {
      metadataNotice: "Ekstraksi metadata PNG kanggo potongan teks 'parameters'."
    }
  },
  historyItem: {
    load: 'Muat entri riwayat iki',
    delete: 'Busek entri riwayat iki',
    previewAlt: 'Pratinjau'
  },
  imagePreview: {
    loading: 'Lagi muat pratinjau...',
    error: 'Ora bisa muat pratinjau.',
    errorDetail: 'Kesalahan proxy server utawa gambar ora valid',
    videoUnsupported: 'Browser sampeyan ora ndhukung video.',
    openFull: 'Bukak pratinjau ukuran penuh',
    close: 'Tutup',
    reset: 'Reset',
    openOriginal: 'Bukak asli'
  },
  booruList: {
    pageTitle: 'Papan Peringkat Booru Paling Dhuwur',
    pageDescriptionShort: 'Jelajahi situs booru paling dhuwur sing diperingkat miturut jumlah gambar lan aktivitas.',
    pageDescriptionLong: 'Temokake situs booru paling populer saka saindenging web. Diperingkat miturut jumlah gambar, anggota, lan aktivitas kanthi data saka Booru.org.',
    searchPlaceholder: 'Goleki situs booru...',
    filter: {
      all: 'Kabeh',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Gambar',
      members: 'Anggota',
      owner: 'Pemilik'
    },
    sort: {
      label: 'Urutake miturut:',
      rank: 'Peringkat (Paling Dhuwur)',
      images: 'Jumlah Gambar',
      members: 'Jumlah Anggota',
      asc: 'Mundhak',
      desc: 'Mudhun'
    },
    itemsPerPage: 'Per kaca:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> saka {{total}}',
    pagination: {
      previous: 'Sadurunge',
      next: 'Sabanjure',
      previousShort: 'Sadur',
      nextShort: 'Sabanj'
    },
    emptyState: 'Ora ana situs booru sing ditemokake',
    loading: 'Lagi muat data booru...',
    errorTitle: 'Kesalahan Muat Data',
    errors: {
      fetchFailed: 'Gagal njupuk data booru.',
      unknown: 'Ana masalah nalika muat papan peringkat.'
    },
    ownerLabel: 'Pemilik:',
    visit: 'Bukak {{name}}'
  },
  booruDetail: {
    backButton: 'Bali menyang Daftar Booru',
    notFoundTitle: 'Booru Ora Ditemokake',
    notFoundDescription: 'Domain booru "{{domain}}" ora ditemokake ing basis data kita.',
    statistics: 'Statistik',
    totalImages: 'Total Gambar',
    totalMembers: 'Total Anggota',
    shortName: 'Jeneng Cendhak',
    owner: 'Pemilik',
    hosted: 'Di-host dening booru.org',
    protocol: 'Protokol',
    yes: 'Ya',
    no: 'Ora',
    visit: 'Bukak {{name}}',
    loading: 'Lagi dimuat...'
  }
};
