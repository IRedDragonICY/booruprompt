import { en } from './en';
import type { TranslationSchema } from './en';

export const is: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru merkjaútdráttur',
    language: 'Tungumál',
    english: 'Enska',
    indonesian: 'Indónesíska',
    chinese: 'Kínverska',
    languageSwitcher: {
      title: 'Viðmótstungumál',
      description: 'Vistað í vafranum þínum. Sjálfgefið tungumál er enska.',
      instantNotice: 'Breytingar eru notaðar strax án þess að endurhlaða.',
      searchPlaceholder: 'Leita að tungumálum...',
      noResults: 'Engin tungumál fundust'
    },
    nav: {
      extractor: 'Merki',
      image: 'Mynd',
      booruList: 'Booru',
      settings: 'Stillingar'
    },
    actions: {
      ...en.common.actions,
      add: 'Bæta við',
      apply: 'Nota',
      back: 'Til baka',
      cancel: 'Hætta við',
      clear: 'Hreinsa',
      close: 'Loka',
      confirm: 'Staðfesta',
      copy: 'Afrita',
      copied: 'Afritað!',
      delete: 'Eyða',
      save: 'Vista',
      search: 'Leita',
      all: 'Allt',
      none: 'Ekkert'
    }
  },
  settings: {
    title: 'Stillingar',
    sections: {
      appearance: 'Útlit',
      colorTheme: 'Litaþema',
      dataFetch: 'Gagnaöflunaraðferð'
    },
    themeOptions: {
      system: 'Kerfi',
      light: 'Ljóst',
      dark: 'Dökkt'
    },
    colorThemes: {
      blue: 'Blár',
      orange: 'Appelsínugulur',
      teal: 'Grænblár',
      rose: 'Bleikur',
      purple: 'Fjólublár',
      green: 'Grænn',
      custom: 'Sérsniðinn litur'
    },
    customColor: {
      label: 'Sérsniðinn litur',
      pickerLabel: 'Sérsniðinn litaval',
      inputLabel: 'Sérsniðinn litur hex kóði',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Miðlara þjóns',
        description: 'Notar þjón þessa forrits til að sækja gögn. Mælt með, áreiðanlegra.'
      },
      clientProxy: {
        label: 'Miðlari biðlara',
        description: 'Notar opinberan CORS miðlara í vafranum þínum. Gæti verið minna áreiðanlegt eða takmarkað.'
      }
    },
    clientProxy: {
      selectLabel: 'Veldu miðlaraþjónustu biðlara:',
      ariaLabel: 'Val á miðlaraþjónustu biðlara',
      helper: 'Afköst og áreiðanleiki eru mismunandi milli miðlara.'
    },
    toggles: {
      autoExtract: {
        label: 'Sjálfvirk útdráttur',
        description: 'Draga út merki sjálfkrafa eftir að hafa límt/slegið inn gilt vefslóð.',
        tooltip: 'Virkja eða slökkva á sjálfvirkum merkjaútdrætti við að líma/slá inn gilda vefslóð'
      },
      previews: {
        label: 'Virkja forskoðun',
        description: 'Sýna forskoðun mynda/myndskeiða við útdrátt og í ferli.',
        tooltip: 'Virkja eða slökkva á forskoðun mynda/myndskeiða til að spara bandbreidd eða forðast hugsanleg vandamál',
        note: 'Myndir eru alltaf sóttar í gegnum miðlara þjóns.'
      },
      saveHistory: {
        label: 'Vista feril',
        description: 'Geyma vel heppnaðan útdrátt á staðnum í vafranum þínum.',
        tooltip: 'Virkja eða slökkva á vistun útdráttarferils í staðbundna geymslu vafrans'
      },
      unsupportedSites: {
        label: 'Virkja fyrir óstudd vefsvæði',
        description: 'Reyna að draga út af óstuðnum vefsvæðum með því að nota svipuð mynstur vefsvæða. Virkar kannski ekki fyrir öll vefsvæði.',
        tooltip: 'Virkja útdrátt fyrir óstudd vefsvæði með því að nota svipuð mynstur vefsvæða'
      },
      blacklist: {
        label: 'Virkja svartan lista lykilorða',
        description: 'Sláðu inn lykilorð til að loka á, aðskilin með kommum, semíkommu eða nýjum línum.',
        tooltip: 'Loka á óæskileg merki með því að sía út ákveðin lykilorð',
        placeholder: 'Sláðu inn lykilorð til að loka á…',
        ariaLabel: 'Lykilorð á svörtum lista',
        reset: 'Endurstilla á sjálfgefið'
      }
    },
    historySize: {
      label: 'Hámarks ferilsstærð',
      description: 'Stilla hámarksfjölda færslna fyrir bæði útdrátt og myndaferil.'
    },
    accessibility: {
      themeOption: 'Þema {{label}}',
      colorThemeOption: 'Litaþema {{label}}',
      historySizeSelect: 'Hámarks ferilsstærð'
    },
    historySizeOptions: {
      '10': '10 færslur',
      '30': '30 færslur',
      '50': '50 færslur',
      '100': '100 færslur',
      unlimited: 'Ótakmarkað'
    },
    support: {
      title: 'Stuðningur og ábendingar',
      cta: 'Tilkynna um vandamál á GitHub',
      description: 'Fannstu villu eða hefur ábendingu? Láttu okkur vita!'
    },
    modal: {
      close: 'Loka stillingum'
    }
  }
};
