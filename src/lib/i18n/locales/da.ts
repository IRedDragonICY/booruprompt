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
};
