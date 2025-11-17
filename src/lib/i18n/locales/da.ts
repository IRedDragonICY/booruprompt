import { en } from './en';
import type { TranslationSchema } from './en';

export const da: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag-ekstraktor',
    language: 'Sprog',
    english: 'Engelsk',
    indonesian: 'Indonesisk',
    chinese: 'Kinesisk',
    languageSwitcher: {
      title: 'Grænsefladesprog',
      description: 'Gemt i din browser. Standardsprog er engelsk.',
      instantNotice: 'Ændringer anvendes øjeblikkeligt uden genindlæsning.',
      searchPlaceholder: 'Søg sprog...',
      noResults: 'Ingen sprog fundet'
    },
    nav: {
      extractor: 'Tags',
      image: 'Billede',
      booruList: 'Booru',
      settings: 'Indstillinger'
    },
    actions: {
      ...en.common.actions,
      add: 'Tilføj',
      apply: 'Anvend',
      back: 'Tilbage',
      cancel: 'Annuller',
      clear: 'Ryd',
      close: 'Luk',
      confirm: 'Bekræft',
      copy: 'Kopier',
      copied: 'Kopieret!',
      delete: 'Slet',
      save: 'Gem',
      search: 'Søg',
      all: 'Alle',
      none: 'Ingen'
    }
  },
  settings: {
    title: 'Indstillinger',
    sections: {
      appearance: 'Udseende',
      colorTheme: 'Farvetema',
      dataFetch: 'Datahentningsmetode'
    },
    themeOptions: {
      system: 'System',
      light: 'Lys',
      dark: 'Mørk'
    },
    colorThemes: {
      blue: 'Blå',
      orange: 'Orange',
      teal: 'Turkis',
      rose: 'Rosa',
      purple: 'Lilla',
      green: 'Grøn',
      custom: 'Brugerdefineret Farve'
    },
    customColor: {
      label: 'Brugerdefineret Farve',
      pickerLabel: 'Brugerdefineret farvevælger',
      inputLabel: 'Brugerdefineret farve hex-kode',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Server Proxy',
        description: 'Bruger denne applikations server til at hente data. Anbefalet, mere pålidelig.'
      },
      clientProxy: {
        label: 'Klient-side Proxy',
        description: 'Bruger en offentlig CORS-proxy i din browser. Kan være mindre pålidelig eller hastighedsbegrænset.'
      }
    },
    clientProxy: {
      selectLabel: 'Vælg klientproxy-tjeneste:',
      ariaLabel: 'Klientproxy-tjeneste Vælger',
      helper: 'Ydeevne og pålidelighed varierer mellem proxies.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatisk Udtrækning',
        description: 'Udtræk tags automatisk efter indsætning/indtastning af en gyldig URL.',
        tooltip: 'Aktiver eller deaktiver automatisk tag-udtrækning ved indsætning/indtastning af en gyldig URL'
      },
      previews: {
        label: 'Aktiver Forhåndsvisninger',
        description: 'Vis billede-/videoforhåndsvisninger under udtrækning og i historik.',
        tooltip: 'Aktiver eller deaktiver billede-/videoforhåndsvisninger for at spare båndbredde eller undgå potentielle problemer',
        note: 'Billeder hentes altid via Server Proxy.'
      },
      saveHistory: {
        label: 'Gem Historik',
        description: 'Gem vellykkede udtrækninger lokalt i din browser.',
        tooltip: 'Aktiver eller deaktiver gemning af udtrækningshistorik til din browsers lokale lager'
      },
      unsupportedSites: {
        label: 'Aktiver for Ikke-understøttede Sites',
        description: 'Forsøg at udtrække fra ikke-understøttede sites ved hjælp af lignende site-mønstre. Virker muligvis ikke for alle sites.',
        tooltip: 'Aktiver udtrækning for ikke-understøttede websteder ved at bruge lignende site-mønstre'
      },
      blacklist: {
        label: 'Aktiver Nøgleord Sortliste',
        description: 'Indtast nøgleord der skal blokeres, adskilt af kommaer, semikolon eller nye linjer.',
        tooltip: 'Bloker uønskede tags ved at filtrere specifikke nøgleord',
        placeholder: 'Indtast nøgleord der skal blokeres…',
        ariaLabel: 'Sortliste nøgleord',
        reset: 'Nulstil til Standard'
      }
    },
    historySize: {
      label: 'Maksimal Historikstørrelse',
      description: 'Indstil det maksimale antal poster for både udtræknings- og billedhistorik.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Farvetema {{label}}',
      historySizeSelect: 'Maksimal historikstørrelse'
    },
    historySizeOptions: {
      '10': '10 Poster',
      '30': '30 Poster',
      '50': '50 Poster',
      '100': '100 Poster',
      unlimited: 'Ubegrænset'
    },
    support: {
      title: 'Support & Feedback',
      cta: 'Rapporter et Problem på GitHub',
      description: 'Fandt en fejl eller har et forslag? Lad os vide det!'
    },
    modal: {
      close: 'Luk Indstillinger'
    }
  }
,
  extractor: {
    header: {
      title: 'Booru Tag-ekstraktor',
      subtitle: 'Udtræk tags fra booru billedtavler',
      supported: 'Understøttede platforme:',
      urlLabel: 'Booru Indlægs-URL',
      urlPlaceholder: 'Indsæt din booru indlægs-URL her...',
      manualButton: 'Udtræk Manuelt',
      resetButton: 'Nulstil',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Booru Tag-ekstraktor',
      heroSubtitle: 'Udtræk, filtrer og kopier tags fra boorusites øjeblikkelig',
      features: {
        smart: { title: 'Smart', subtitle: 'Auto-udtræk' },
        fast: { title: 'Hurtig', subtitle: 'Øjeblikkelige resultater' },
        private: { title: 'Privat', subtitle: 'Klientsiden' },
        copy: { title: 'Kopier', subtitle: 'Et klik' }
      },
      cta: {
        paste: 'Indsæt',
        extract: 'Udtræk',
        filter: 'Filtrer',
        copy: 'Kopier'
      },
      supportNotice: 'Understøtter Danbooru, Gelbooru, Safebooru, Rule34, e621 og flere'
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
        copyright: 'Ophavsret',
        character: 'Karakter',
        general: 'Generelt',
        meta: 'Meta',
        other: 'Andet'
      },
      count_one: '{{count}} tag',
      count_other: '{{count}} tags'
    },
    filteredTags: {
      label: 'Filtrerede Tags',
      ariaLabel: 'Filtrerede tags',
      empty: 'Ingen tags at vise.',
      copy: 'Kopier Tags',
      copied: 'Kopieret!'
    },
    history: {
      extractionTitle: 'Udtrækningshistorik',
      imageTitle: 'Billedhistorik',
      searchExtraction: 'Søg titel, url, tags...',
      searchImages: 'Søg filnavn, prompts, parametre...',
      emptySearch: 'Ingen poster matcher din søgning.',
      clearTooltip: 'Ryd Al Historik',
      clearAction: 'Ryd Historik',
      confirmMessage: 'Virkelig rydde?',
      confirmYes: 'Ja, Ryd',
      confirmCancel: 'Annuller',
      searchAriaLabel: 'Søg {{context}}',
      searchFallback: 'historik',
      clearSearchTooltip: 'Ryd Søgning',
      clearSearchAria: 'Ryd søgning'
    },
    mobile: {
      historyButton: 'Historik',
      urlLabel: 'Booru Indlægs-URL',
      urlPlaceholder: 'Indsæt URL eller Træk & Slip...',
      manualButton: 'Udtræk Manuelt',
      resetButton: 'Nulstil'
    }
  },
  imageTool: {
    title: 'Billedmetadata',
    dropCtaTitle: 'Træk & Slip PNG Her',
    dropCtaSubtitle: 'eller klik for at uploade',
    selectButton: 'Vælg PNG',
    statusProcessing: 'Behandler...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'Positiv Prompt',
    negativePrompt: 'Negativ Prompt',
    parameters: 'Parametre',
    copy: 'Kopier',
    copyAll: 'Kopier Alt',
    copySuccess: 'Kopieret!',
    noMetadata: 'Ingen genereringsmetadata fundet.',
    loadMetadata: 'Indlæs Metadata',
    deleteEntry: 'Slet Post',
    historyTitle: 'Billedhistorik',
    historySearch: 'Søg filnavn, prompts, parametre...',
    previewAlt: 'Forhåndsvisning',
    footer: {
      metadataNotice: "PNG-metadataudtrækning for 'parameters' tekstblok."
    }
  },
  historyItem: {
    load: 'Indlæs denne historikpost',
    delete: 'Slet denne historikpost',
    previewAlt: 'Forhåndsvisning'
  },
  imagePreview: {
    loading: 'Indlæser forhåndsvisning...',
    error: 'Kunne ikke indlæse forhåndsvisning.',
    errorDetail: 'Serverproxyfejl eller ugyldigt billede',
    videoUnsupported: 'Din browser understøtter ikke video.',
    openFull: 'Åbn fuldstørrelse forhåndsvisning',
    close: 'Luk',
    reset: 'Nulstil',
    openOriginal: 'Åbn original'
  },
  booruList: {
    pageTitle: 'Top Booru Rangering',
    pageDescriptionShort: 'Udforsk de bedste boorusites rangeret efter totalt antal billeder og aktivitet.',
    pageDescriptionLong: 'Opdag de mest populære boorusites fra hele nettet. Rangeret efter totalt antal billeder, antal medlemmer og aktivitet med data fra Booru.org.',
    searchPlaceholder: 'Søg boorusites...',
    filter: {
      all: 'Alle',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Billeder',
      members: 'Medlemmer',
      owner: 'Ejer'
    },
    sort: {
      label: 'Sorter efter:',
      rank: 'Rangering (Top)',
      images: 'Antal Billeder',
      members: 'Antal Medlemmer',
      asc: 'Stigende',
      desc: 'Faldende'
    },
    itemsPerPage: 'Per side:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> af {{total}}',
    pagination: {
      previous: 'Forrige',
      next: 'Næste',
      previousShort: 'Forr',
      nextShort: 'Næste'
    },
    emptyState: 'Ingen boorusites fundet',
    loading: 'Indlæser boorudata...',
    errorTitle: 'Fejl ved Indlæsning af Data',
    errors: {
      fetchFailed: 'Kunne ikke hente boorudata.',
      unknown: 'Noget gik galt under indlæsning af rangeringen.'
    },
    ownerLabel: 'Ejer:',
    visit: 'Besøg {{name}}'
  },
  booruDetail: {
    backButton: 'Tilbage til Booruliste',
    notFoundTitle: 'Booru Ikke Fundet',
    notFoundDescription: 'Boorudomænet "{{domain}}" blev ikke fundet i vores database.',
    statistics: 'Statistik',
    totalImages: 'Totalt Antal Billeder',
    totalMembers: 'Totalt Antal Medlemmer',
    shortName: 'Kortnavn',
    owner: 'Ejer',
    hosted: 'Hostet af booru.org',
    protocol: 'Protokol',
    yes: 'Ja',
    no: 'Nej',
    visit: 'Besøg {{name}}',
    loading: 'Indlæser...'
  }
};
