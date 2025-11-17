import { en } from './en';
import type { TranslationSchema } from './en';

export const lv: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru birku ekstraktors',
    language: 'Valoda',
    english: 'Angļu',
    indonesian: 'Indonēziešu',
    chinese: 'Ķīniešu',
    languageSwitcher: {
      title: 'Saskarnes valoda',
      description: 'Saglabāts jūsu pārlūkprogrammā. Noklusējuma valoda ir angļu.',
      instantNotice: 'Izmaiņas tiek piemērotas uzreiz bez pārlādēšanas.',
      searchPlaceholder: 'Meklēt valodas...',
      noResults: 'Nav atrasta neviena valoda'
    },
    nav: {
      extractor: 'Birkas',
      image: 'Attēls',
      booruList: 'Booru',
      settings: 'Iestatījumi'
    },
    actions: {
      ...en.common.actions,
      add: 'Pievienot',
      apply: 'Lietot',
      back: 'Atpakaļ',
      cancel: 'Atcelt',
      clear: 'Notīrīt',
      close: 'Aizvērt',
      confirm: 'Apstiprināt',
      copy: 'Kopēt',
      copied: 'Nokopēts!',
      delete: 'Dzēst',
      save: 'Saglabāt',
      search: 'Meklēt',
      all: 'Visi',
      none: 'Nekas'
    }
  },
  settings: {
    title: 'Iestatījumi',
    sections: {
      appearance: 'Izskats',
      colorTheme: 'Krāsu tēma',
      dataFetch: 'Datu iegūšanas metode'
    },
    themeOptions: {
      system: 'Sistēma',
      light: 'Gaišs',
      dark: 'Tumšs'
    },
    colorThemes: {
      blue: 'Zils',
      orange: 'Oranžs',
      teal: 'Zilganzaļš',
      rose: 'Rozā',
      purple: 'Violets',
      green: 'Zaļš',
      custom: 'Pielāgota krāsa'
    },
    customColor: {
      label: 'Pielāgota Krāsa',
      pickerLabel: 'Pielāgotas krāsas izvēlētājs',
      inputLabel: 'Pielāgotas krāsas hex kods',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Servera Starpniekserveris',
        description: 'Izmanto šīs lietotnes serveri datu iegūšanai. Ieteicams, uzticamāks.'
      },
      clientProxy: {
        label: 'Klienta Puses Starpniekserveris',
        description: 'Izmanto publisku CORS starpniekserveri jūsu pārlūkprogrammā. Var būt mazāk uzticams vai ierobežots.'
      }
    },
    clientProxy: {
      selectLabel: 'Izvēlieties klienta starpniekservera pakalpojumu:',
      ariaLabel: 'Klienta starpniekservera pakalpojuma atlasītājs',
      helper: 'Veiktspēja un uzticamība atšķiras starp starpniekserveriem.'
    },
    toggles: {
      autoExtract: {
        label: 'Automātiskā Iegūšana',
        description: 'Automātiski iegūt tagus pēc derīga URL ielīmēšanas/ierakstīšanas.',
        tooltip: 'Iespējot vai atspējot automātisko tagu iegūšanu, ielīmējot/ierakstot derīgu URL'
      },
      previews: {
        label: 'Iespējot Priekšskatījumus',
        description: 'Rādīt attēlu/video priekšskatījumus iegūšanas laikā un vēsturē.',
        tooltip: 'Iespējot vai atspējot attēlu/video priekšskatījumus, lai taupītu joslas platumu vai izvairītos no iespējamām problēmām',
        note: 'Attēli vienmēr tiek iegūti, izmantojot Servera Starpniekserveri.'
      },
      saveHistory: {
        label: 'Saglabāt Vēsturi',
        description: 'Saglabāt veiksmīgas iegūšanas lokāli jūsu pārlūkprogrammā.',
        tooltip: 'Iespējot vai atspējot iegūšanas vēstures saglabāšanu pārlūkprogrammas lokālajā krātuvē'
      },
      unsupportedSites: {
        label: 'Iespējot Neatbalstītām Vietnēm',
        description: 'Mēģiniet iegūt no neatbalstītām vietnēm, izmantojot līdzīgus vietnes modeļus. Var nedarboties visās vietnēs.',
        tooltip: 'Iespējot iegūšanu neatbalstītām tīmekļa vietnēm, izmantojot līdzīgus vietnes modeļus'
      },
      blacklist: {
        label: 'Iespējot Atslēgvārdu Melno Sarakstu',
        description: 'Ievadiet atslēgvārdus bloķēšanai, atdalītus ar komatu, semikolu vai jaunām rindām.',
        tooltip: 'Bloķēt nevēlamus tagus, filtrējot konkrētus atslēgvārdus',
        placeholder: 'Ievadiet atslēgvārdus bloķēšanai…',
        ariaLabel: 'Melnā saraksta atslēgvārdi',
        reset: 'Atiestatīt uz Noklusējumu'
      }
    },
    historySize: {
      label: 'Maksimālais Vēstures Izmērs',
      description: 'Iestatiet maksimālo ierakstu skaitu iegūšanas un attēlu vēsturei.'
    },
    accessibility: {
      themeOption: 'Tēma {{label}}',
      colorThemeOption: 'Krāsu tēma {{label}}',
      historySizeSelect: 'Maksimālais vēstures izmērs'
    },
    historySizeOptions: {
      '10': '10 Ieraksti',
      '30': '30 Ieraksti',
      '50': '50 Ieraksti',
      '100': '100 Ieraksti',
      unlimited: 'Neierobežots'
    },
    support: {
      title: 'Atbalsts un Atgriezeniskā Saite',
      cta: 'Ziņot par Problēmu GitHub',
      description: 'Atradāt kļūdu vai jums ir ieteikums? Paziņojiet mums!'
    },
    modal: {
      close: 'Aizvērt Iestatījumus'
    }
  }
};
