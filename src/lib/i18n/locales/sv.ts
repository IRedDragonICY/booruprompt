import { en } from './en';
import type { TranslationSchema } from './en';

export const sv: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Taggextraktor',
    language: 'Språk',
    english: 'Engelska',
    indonesian: 'Indonesiska',
    chinese: 'Kinesiska',
    languageSwitcher: {
      title: 'Gränssnittsspråk',
      description: 'Sparas i din webbläsare. Standardspråk är engelska.',
      instantNotice: 'Ändringar tillämpas omedelbart utan omladdning.',
      searchPlaceholder: 'Sök språk...',
      noResults: 'Inga språk hittades'
    },
    nav: {
      extractor: 'Taggar',
      image: 'Bild',
      booruList: 'Booru',
      settings: 'Inställningar'
    },
    actions: {
      ...en.common.actions,
      add: 'Lägg till',
      apply: 'Tillämpa',
      back: 'Tillbaka',
      cancel: 'Avbryt',
      clear: 'Rensa',
      close: 'Stäng',
      confirm: 'Bekräfta',
      copy: 'Kopiera',
      copied: 'Kopierat!',
      delete: 'Ta bort',
      save: 'Spara',
      search: 'Sök',
      all: 'Alla',
      none: 'Inga'
    }
  },
  settings: {
    title: 'Inställningar',
    sections: {
      appearance: 'Utseende',
      colorTheme: 'Färgtema',
      dataFetch: 'Datahämtningsmetod'
    },
    themeOptions: {
      system: 'System',
      light: 'Ljust',
      dark: 'Mörkt'
    },
    colorThemes: {
      blue: 'Blå',
      orange: 'Orange',
      teal: 'Turkos',
      rose: 'Rosa',
      purple: 'Lila',
      green: 'Grön',
      custom: 'Anpassad Färg'
    },
    customColor: {
      label: 'Anpassad Färg',
      pickerLabel: 'Anpassad färgväljare',
      inputLabel: 'Anpassad färg hex-kod',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Server Proxy',
        description: 'Använder den här applikationens server för att hämta data. Rekommenderas, mer pålitlig.'
      },
      clientProxy: {
        label: 'Klient-side Proxy',
        description: 'Använder en offentlig CORS-proxy i din webbläsare. Kan vara mindre pålitlig eller hastighetsbegränsad.'
      }
    },
    clientProxy: {
      selectLabel: 'Välj klientproxy-tjänst:',
      ariaLabel: 'Klientproxy-tjänst Väljare',
      helper: 'Prestanda och pålitlighet varierar mellan proxies.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatisk Extrahering',
        description: 'Extrahera taggar automatiskt efter att ha klistrat in/skrivit en giltig URL.',
        tooltip: 'Aktivera eller inaktivera automatisk taggextrahering vid inklistring/skrivning av en giltig URL'
      },
      previews: {
        label: 'Aktivera Förhandsvisningar',
        description: 'Visa bild-/videoförhandsvisningar under extrahering och i historik.',
        tooltip: 'Aktivera eller inaktivera bild-/videoförhandsvisningar för att spara bandbredd eller undvika potentiella problem',
        note: 'Bilder hämtas alltid via Server Proxy.'
      },
      saveHistory: {
        label: 'Spara Historik',
        description: 'Lagra lyckade extraheringar lokalt i din webbläsare.',
        tooltip: 'Aktivera eller inaktivera sparande av extraheringshistorik till webbläsarens lokala lagring'
      },
      unsupportedSites: {
        label: 'Aktivera för Ej Stödda Webbplatser',
        description: 'Försök extrahera från ej stödda webbplatser med liknande webbplatsmönster. Kanske inte fungerar för alla webbplatser.',
        tooltip: 'Aktivera extrahering för ej stödda webbplatser genom att använda liknande webbplatsmönster'
      },
      blacklist: {
        label: 'Aktivera Nyckelord Svartlista',
        description: 'Ange nyckelord att blockera, åtskilda med kommatecken, semikolon eller nya rader.',
        tooltip: 'Blockera oönskade taggar genom att filtrera specifika nyckelord',
        placeholder: 'Ange nyckelord att blockera…',
        ariaLabel: 'Svartlista nyckelord',
        reset: 'Återställ till Standard'
      }
    },
    historySize: {
      label: 'Maximal Historikstorlek',
      description: 'Ange maximalt antal poster för både extraherings- och bildhistorik.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Färgtema {{label}}',
      historySizeSelect: 'Maximal historikstorlek'
    },
    historySizeOptions: {
      '10': '10 Poster',
      '30': '30 Poster',
      '50': '50 Poster',
      '100': '100 Poster',
      unlimited: 'Obegränsat'
    },
    support: {
      title: 'Support & Feedback',
      cta: 'Rapportera ett Problem på GitHub',
      description: 'Hittade en bugg eller har ett förslag? Låt oss veta!'
    },
    modal: {
      close: 'Stäng Inställningar'
    }
  },
  extractor: {
    header: {
      title: 'Booru Taggextraktor',
      subtitle: 'Extrahera taggar från booru bildtavlor',
      supported: 'Stödda plattformar:',
      urlLabel: 'Booru Inläggs-URL',
      urlPlaceholder: 'Klistra in din booru inläggs-URL här...',
      manualButton: 'Extrahera Manuellt',
      resetButton: 'Återställ',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Booru Taggextraktor',
      heroSubtitle: 'Extrahera, filtrera och kopiera taggar från boorusajter omedelbart',
      features: {
        smart: { title: 'Smart', subtitle: 'Auto-extrahering' },
        fast: { title: 'Snabb', subtitle: 'Omedelbara resultat' },
        private: { title: 'Privat', subtitle: 'Klientsidan' },
        copy: { title: 'Kopiera', subtitle: 'Ett klick' }
      },
      cta: {
        paste: 'Klistra in',
        extract: 'Extrahera',
        filter: 'Filtrera',
        copy: 'Kopiera'
      },
      supportNotice: 'Stöder Danbooru, Gelbooru, Safebooru, Rule34, e621 och fler'
    },
    preview: {
      title: 'Förhandsvisning'
    },
    status: {
      resultLabel: 'Resultat för:'
    },
    categories: {
      title: 'Filtrera Kategorier',
      enableAll: 'Alla',
      disableAll: 'Inga',
      items: {
        copyright: 'Upphovsrätt',
        character: 'Karaktär',
        general: 'Allmänt',
        meta: 'Meta',
        other: 'Övrigt'
      },
      count_one: '{{count}} tagg',
      count_other: '{{count}} taggar'
    },
    filteredTags: {
      label: 'Filtrerade Taggar',
      ariaLabel: 'Filtrerade taggar',
      empty: 'Inga taggar att visa.',
      copy: 'Kopiera Taggar',
      copied: 'Kopierat!'
    },
    history: {
      extractionTitle: 'Extraheringshistorik',
      imageTitle: 'Bildhistorik',
      searchExtraction: 'Sök titel, url, taggar...',
      searchImages: 'Sök filnamn, uppmaningar, parametrar...',
      emptySearch: 'Inga poster matchar din sökning.',
      clearTooltip: 'Rensa All Historik',
      clearAction: 'Rensa Historik',
      confirmMessage: 'Verkligen rensa?',
      confirmYes: 'Ja, Rensa',
      confirmCancel: 'Avbryt',
      searchAriaLabel: 'Sök {{context}}',
      searchFallback: 'historik',
      clearSearchTooltip: 'Rensa Sökning',
      clearSearchAria: 'Rensa sökning'
    },
    mobile: {
      historyButton: 'Historik',
      urlLabel: 'Booru Inläggs-URL',
      urlPlaceholder: 'Klistra in URL eller Dra & Släpp...',
      manualButton: 'Extrahera Manuellt',
      resetButton: 'Återställ'
    }
  },
  imageTool: {
    title: 'Bildmetadata',
    dropCtaTitle: 'Dra & Släpp PNG Här',
    dropCtaSubtitle: 'eller klicka för att ladda upp',
    selectButton: 'Välj PNG',
    statusProcessing: 'Bearbetar...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'Positiv Uppmaning',
    negativePrompt: 'Negativ Uppmaning',
    parameters: 'Parametrar',
    copy: 'Kopiera',
    copyAll: 'Kopiera Allt',
    copySuccess: 'Kopierat!',
    noMetadata: 'Ingen genereringsmetadata hittades.',
    loadMetadata: 'Ladda Metadata',
    deleteEntry: 'Radera Post',
    historyTitle: 'Bildhistorik',
    historySearch: 'Sök filnamn, uppmaningar, parametrar...',
    previewAlt: 'Förhandsvisning',
    footer: {
      metadataNotice: "PNG-metadataextrahering för 'parameters' textchunk."
    }
  },
  historyItem: {
    load: 'Ladda denna historikpost',
    delete: 'Radera denna historikpost',
    previewAlt: 'Förhandsvisning'
  },
  imagePreview: {
    loading: 'Laddar förhandsvisning...',
    error: 'Kunde inte ladda förhandsvisning.',
    errorDetail: 'Serverproxyfel eller ogiltig bild',
    videoUnsupported: 'Din webbläsare stöder inte video.',
    openFull: 'Öppna fullstor förhandsvisning',
    close: 'Stäng',
    reset: 'Återställ',
    openOriginal: 'Öppna original'
  },
  booruList: {
    pageTitle: 'Topp Booru Rankingstabell',
    pageDescriptionShort: 'Utforska de bästa boorusajterna rankade efter totalt antal bilder och aktivitet.',
    pageDescriptionLong: 'Upptäck de mest populära boorusajterna från hela webben. Rankade efter totalt antal bilder, antal medlemmar och aktivitet med data från Booru.org.',
    searchPlaceholder: 'Sök boorusajter...',
    filter: {
      all: 'Alla',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Bilder',
      members: 'Medlemmar',
      owner: 'Ägare'
    },
    sort: {
      label: 'Sortera efter:',
      rank: 'Ranking (Topp)',
      images: 'Antal Bilder',
      members: 'Antal Medlemmar',
      asc: 'Stigande',
      desc: 'Fallande'
    },
    itemsPerPage: 'Per sida:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> av {{total}}',
    pagination: {
      previous: 'Föregående',
      next: 'Nästa',
      previousShort: 'Föreg',
      nextShort: 'Nästa'
    },
    emptyState: 'Inga boorusajter hittades',
    loading: 'Laddar boorudata...',
    errorTitle: 'Fel vid Laddning av Data',
    errors: {
      fetchFailed: 'Misslyckades med att hämta boorudata.',
      unknown: 'Något gick fel vid laddning av rankingslistan.'
    },
    ownerLabel: 'Ägare:',
    visit: 'Besök {{name}}'
  },
  booruDetail: {
    backButton: 'Tillbaka till Boorulista',
    notFoundTitle: 'Booru Hittades Inte',
    notFoundDescription: 'Boorudomänen "{{domain}}" hittades inte i vår databas.',
    statistics: 'Statistik',
    totalImages: 'Totalt Antal Bilder',
    totalMembers: 'Totalt Antal Medlemmar',
    shortName: 'Kortnamn',
    owner: 'Ägare',
    hosted: 'Hostad av booru.org',
    protocol: 'Protokoll',
    yes: 'Ja',
    no: 'Nej',
    visit: 'Besök {{name}}',
    loading: 'Laddar...'
  }
};
