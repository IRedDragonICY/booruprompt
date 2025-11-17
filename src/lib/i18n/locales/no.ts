import { en } from './en';
import type { TranslationSchema } from './en';

export const no: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tagg-ekstraktor',
    language: 'Språk',
    english: 'Engelsk',
    indonesian: 'Indonesisk',
    chinese: 'Kinesisk',
    languageSwitcher: {
      title: 'Grensesnittspråk',
      description: 'Lagres i nettleseren din. Standardspråket er engelsk.',
      instantNotice: 'Endringer brukes umiddelbart uten oppdatering.',
      searchPlaceholder: 'Søk språk...',
      noResults: 'Ingen språk funnet'
    },
    nav: {
      extractor: 'Tagger',
      image: 'Bilde',
      booruList: 'Booru',
      settings: 'Innstillinger'
    },
    actions: {
      ...en.common.actions,
      add: 'Legg til',
      apply: 'Bruk',
      back: 'Tilbake',
      cancel: 'Avbryt',
      clear: 'Tøm',
      close: 'Lukk',
      confirm: 'Bekreft',
      copy: 'Kopier',
      copied: 'Kopiert!',
      delete: 'Slett',
      save: 'Lagre',
      search: 'Søk',
      all: 'Alle',
      none: 'Ingen'
    }
  },
  settings: {
    title: 'Innstillinger',
    sections: {
      appearance: 'Utseende',
      colorTheme: 'Fargetema',
      dataFetch: 'Datahentingsmetode'
    },
    themeOptions: {
      system: 'System',
      light: 'Lys',
      dark: 'Mørk'
    },
    colorThemes: {
      blue: 'Blå',
      orange: 'Oransje',
      teal: 'Turkis',
      rose: 'Rosa',
      purple: 'Lilla',
      green: 'Grønn',
      custom: 'Tilpasset Farge'
    },
    customColor: {
      label: 'Tilpasset Farge',
      pickerLabel: 'Tilpasset fargevelger',
      inputLabel: 'Tilpasset farge hex-kode',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Server Proxy',
        description: 'Bruker denne applikasjonens server til å hente data. Anbefalt, mer pålitelig.'
      },
      clientProxy: {
        label: 'Klient-side Proxy',
        description: 'Bruker en offentlig CORS-proxy i nettleseren din. Kan være mindre pålitelig eller hastighetsbegrenset.'
      }
    },
    clientProxy: {
      selectLabel: 'Velg klientproxy-tjeneste:',
      ariaLabel: 'Klientproxy-tjeneste Velger',
      helper: 'Ytelse og pålitelighet varierer mellom proxies.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatisk Uttrekking',
        description: 'Trekk ut tagger automatisk etter å ha limt inn/skrevet en gyldig URL.',
        tooltip: 'Aktiver eller deaktiver automatisk tagg-uttrekking ved å lime inn/skrive en gyldig URL'
      },
      previews: {
        label: 'Aktiver Forhåndsvisninger',
        description: 'Vis bilde-/videoforhåndsvisninger under uttrekking og i historikk.',
        tooltip: 'Aktiver eller deaktiver bilde-/videoforhåndsvisninger for å spare båndbredde eller unngå potensielle problemer',
        note: 'Bilder hentes alltid via Server Proxy.'
      },
      saveHistory: {
        label: 'Lagre Historikk',
        description: 'Lagre vellykkede uttrekkinger lokalt i nettleseren din.',
        tooltip: 'Aktiver eller deaktiver lagring av uttrekkingshistorikk til nettleserens lokale lagring'
      },
      unsupportedSites: {
        label: 'Aktiver for Ikke-støttede Nettsteder',
        description: 'Prøv å trekke ut fra ikke-støttede nettsteder ved hjelp av lignende nettstedmønstre. Fungerer kanskje ikke for alle nettsteder.',
        tooltip: 'Aktiver uttrekking for ikke-støttede nettsteder ved å bruke lignende nettstedmønstre'
      },
      blacklist: {
        label: 'Aktiver Nøkkelord Svarteliste',
        description: 'Skriv inn nøkkelord som skal blokkeres, atskilt med komma, semikolon eller nye linjer.',
        tooltip: 'Blokker uønskede tagger ved å filtrere spesifikke nøkkelord',
        placeholder: 'Skriv inn nøkkelord som skal blokkeres…',
        ariaLabel: 'Svarteliste nøkkelord',
        reset: 'Tilbakestill til Standard'
      }
    },
    historySize: {
      label: 'Maksimal Historikkstørrelse',
      description: 'Angi maksimalt antall oppføringer for både uttrekkings- og bildehistorikk.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Fargetema {{label}}',
      historySizeSelect: 'Maksimal historikkstørrelse'
    },
    historySizeOptions: {
      '10': '10 Oppføringer',
      '30': '30 Oppføringer',
      '50': '50 Oppføringer',
      '100': '100 Oppføringer',
      unlimited: 'Ubegrenset'
    },
    support: {
      title: 'Support & Tilbakemelding',
      cta: 'Rapporter et Problem på GitHub',
      description: 'Funnet en feil eller har et forslag? Gi oss beskjed!'
    },
    modal: {
      close: 'Lukk Innstillinger'
    }
  }
,
  extractor: {
    header: {
      title: 'Booru Tagg-ekstraktor',
      subtitle: 'Trekk ut tagger fra booru bildetavler',
      supported: 'Støttede plattformer:',
      urlLabel: 'Booru Innleggs-URL',
      urlPlaceholder: 'Lim inn booru innleggs-URL her...',
      manualButton: 'Trekk Ut Manuelt',
      resetButton: 'Tilbakestill',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Booru Tagg-ekstraktor',
      heroSubtitle: 'Trekk ut, filtrer og kopier tagger fra boorusider øyeblikkelig',
      features: {
        smart: { title: 'Smart', subtitle: 'Auto-uttrekk' },
        fast: { title: 'Rask', subtitle: 'Øyeblikkelige resultater' },
        private: { title: 'Privat', subtitle: 'Klientsiden' },
        copy: { title: 'Kopier', subtitle: 'Ett klikk' }
      },
      cta: {
        paste: 'Lim inn',
        extract: 'Trekk ut',
        filter: 'Filtrer',
        copy: 'Kopier'
      },
      supportNotice: 'Støtter Danbooru, Gelbooru, Safebooru, Rule34, e621 og flere'
    },
    preview: {
      title: 'Forhåndsvisning'
    },
    status: {
      resultLabel: 'Resultat for:'
    },
    categories: {
      title: 'Filtrer Kategorier',
      enableAll: 'Alle',
      disableAll: 'Ingen',
      items: {
        copyright: 'Opphavsrett',
        character: 'Karakter',
        general: 'Generelt',
        meta: 'Meta',
        other: 'Annet'
      },
      count_one: '{{count}} tagg',
      count_other: '{{count}} tagger'
    },
    filteredTags: {
      label: 'Filtrerte Tagger',
      ariaLabel: 'Filtrerte tagger',
      empty: 'Ingen tagger å vise.',
      copy: 'Kopier Tagger',
      copied: 'Kopiert!'
    },
    history: {
      extractionTitle: 'Uttrekkingshistorikk',
      imageTitle: 'Bildehistorikk',
      searchExtraction: 'Søk tittel, url, tagger...',
      searchImages: 'Søk filnavn, oppfordringer, parametere...',
      emptySearch: 'Ingen oppføringer samsvarer med søket ditt.',
      clearTooltip: 'Tøm All Historikk',
      clearAction: 'Tøm Historikk',
      confirmMessage: 'Virkelig tømme?',
      confirmYes: 'Ja, Tøm',
      confirmCancel: 'Avbryt',
      searchAriaLabel: 'Søk {{context}}',
      searchFallback: 'historikk',
      clearSearchTooltip: 'Tøm Søk',
      clearSearchAria: 'Tøm søk'
    },
    mobile: {
      historyButton: 'Historikk',
      urlLabel: 'Booru Innleggs-URL',
      urlPlaceholder: 'Lim inn URL eller Dra & Slipp...',
      manualButton: 'Trekk Ut Manuelt',
      resetButton: 'Tilbakestill'
    }
  },
  imageTool: {
    title: 'Bildemetadata',
    dropCtaTitle: 'Dra & Slipp PNG Her',
    dropCtaSubtitle: 'eller klikk for å laste opp',
    selectButton: 'Velg PNG',
    statusProcessing: 'Behandler...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'Positiv Oppfordring',
    negativePrompt: 'Negativ Oppfordring',
    parameters: 'Parametere',
    copy: 'Kopier',
    copyAll: 'Kopier Alt',
    copySuccess: 'Kopiert!',
    noMetadata: 'Ingen genereringsmetadata funnet.',
    loadMetadata: 'Last Metadata',
    deleteEntry: 'Slett Oppføring',
    historyTitle: 'Bildehistorikk',
    historySearch: 'Søk filnavn, oppfordringer, parametere...',
    previewAlt: 'Forhåndsvisning',
    footer: {
      metadataNotice: "PNG-metadatauttrekking for 'parameters' tekstbit."
    }
  },
  historyItem: {
    load: 'Last denne historikkoppføringen',
    delete: 'Slett denne historikkoppføringen',
    previewAlt: 'Forhåndsvisning'
  },
  imagePreview: {
    loading: 'Laster forhåndsvisning...',
    error: 'Kunne ikke laste forhåndsvisning.',
    errorDetail: 'Serverproxyfeil eller ugyldig bilde',
    videoUnsupported: 'Nettleseren din støtter ikke video.',
    openFull: 'Åpne forhåndsvisning i full størrelse',
    close: 'Lukk',
    reset: 'Tilbakestill',
    openOriginal: 'Åpne original'
  },
  booruList: {
    pageTitle: 'Topp Booru Rangering',
    pageDescriptionShort: 'Utforsk de beste boorusidene rangert etter totalt antall bilder og aktivitet.',
    pageDescriptionLong: 'Oppdag de mest populære boorusidene fra hele nettet. Rangert etter totalt antall bilder, antall medlemmer og aktivitet med data fra Booru.org.',
    searchPlaceholder: 'Søk boorusider...',
    filter: {
      all: 'Alle',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Bilder',
      members: 'Medlemmer',
      owner: 'Eier'
    },
    sort: {
      label: 'Sorter etter:',
      rank: 'Rangering (Topp)',
      images: 'Bildeantall',
      members: 'Medlemsantall',
      asc: 'Stigende',
      desc: 'Synkende'
    },
    itemsPerPage: 'Per side:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> av {{total}}',
    pagination: {
      previous: 'Forrige',
      next: 'Neste',
      previousShort: 'Forr',
      nextShort: 'Neste'
    },
    emptyState: 'Ingen boorusider funnet',
    loading: 'Laster boorudata...',
    errorTitle: 'Feil ved Lasting av Data',
    errors: {
      fetchFailed: 'Kunne ikke hente boorudata.',
      unknown: 'Noe gikk galt under lasting av rangeringen.'
    },
    ownerLabel: 'Eier:',
    visit: 'Besøk {{name}}'
  },
  booruDetail: {
    backButton: 'Tilbake til Booruliste',
    notFoundTitle: 'Booru Ikke Funnet',
    notFoundDescription: 'Boorudomenet "{{domain}}" ble ikke funnet i databasen vår.',
    statistics: 'Statistikk',
    totalImages: 'Totalt Antall Bilder',
    totalMembers: 'Totalt Antall Medlemmer',
    shortName: 'Kortnavn',
    owner: 'Eier',
    hosted: 'Hostet av booru.org',
    protocol: 'Protokoll',
    yes: 'Ja',
    no: 'Nei',
    visit: 'Besøk {{name}}',
    loading: 'Laster...'
  }
};
