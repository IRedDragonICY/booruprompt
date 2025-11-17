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
};
