import { en } from './en';
import type { TranslationSchema } from './en';

export const ro: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Extractor de Etichete Booru',
    language: 'Limbă',
    english: 'Engleză',
    indonesian: 'Indoneziană',
    chinese: 'Chineză',
    languageSwitcher: {
      title: 'Limba interfeței',
      description: 'Salvată în browser. Limba implicită este engleza.',
      instantNotice: 'Modificările se aplică instant fără reîncărcare.',
      searchPlaceholder: 'Caută limbi...',
      noResults: 'Nu s-au găsit limbi'
    },
    nav: {
      extractor: 'Etichete',
      image: 'Imagine',
      booruList: 'Booru',
      settings: 'Setări'
    },
    actions: {
      ...en.common.actions,
      add: 'Adaugă',
      apply: 'Aplică',
      back: 'Înapoi',
      cancel: 'Anulează',
      clear: 'Șterge',
      close: 'Închide',
      confirm: 'Confirmă',
      copy: 'Copiază',
      copied: 'Copiat!',
      delete: 'Șterge',
      save: 'Salvează',
      search: 'Caută',
      all: 'Toate',
      none: 'Niciuna'
    }
  },
  settings: {
    title: 'Setări',
    sections: {
      appearance: 'Aspect',
      colorTheme: 'Temă de Culoare',
      dataFetch: 'Metodă de Obținere a Datelor'
    },
    themeOptions: {
      system: 'Sistem',
      light: 'Luminos',
      dark: 'Întunecat'
    },
    colorThemes: {
      blue: 'Albastru',
      orange: 'Portocaliu',
      teal: 'Turcoaz',
      rose: 'Roz',
      purple: 'Violet',
      green: 'Verde',
      custom: 'Culoare Personalizată'
    },
    customColor: {
      label: 'Culoare Personalizată',
      pickerLabel: 'Selector culoare personalizată',
      inputLabel: 'Cod hex culoare personalizată',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Proxy Server',
        description: 'Folosește serverul acestei aplicații pentru a prelua date. Recomandat, mai fiabil.'
      },
      clientProxy: {
        label: 'Proxy Client',
        description: 'Folosește un proxy CORS public în browser. Poate fi mai puțin fiabil sau limitat.'
      }
    },
    clientProxy: {
      selectLabel: 'Selectați serviciul proxy client:',
      ariaLabel: 'Selector serviciu proxy client',
      helper: 'Performanța și fiabilitatea variază între proxy-uri.'
    },
    toggles: {
      autoExtract: {
        label: 'Extracție Automată',
        description: 'Extrage etichete automat după lipirea/introducerea unui URL valid.',
        tooltip: 'Activează sau dezactivează extracția automată a etichetelor la lipirea/introducerea unui URL valid'
      },
      previews: {
        label: 'Activează Previzualizări',
        description: 'Afișează previzualizări imagine/video în timpul extracției și în istoric.',
        tooltip: 'Activează sau dezactivează previzualizările imagine/video pentru a economisi lățime de bandă sau a evita probleme potențiale',
        note: 'Imaginile sunt întotdeauna preluate prin Proxy Server.'
      },
      saveHistory: {
        label: 'Salvează Istoric',
        description: 'Stochează extracțiile reușite local în browser.',
        tooltip: 'Activează sau dezactivează salvarea istoricului extracțiilor în stocarea locală a browserului'
      },
      unsupportedSites: {
        label: 'Activează pentru Site-uri Nesuportate',
        description: 'Încercați să extrageți de pe site-uri nesuportate folosind modele de site-uri similare. Poate să nu funcționeze pentru toate site-urile.',
        tooltip: 'Activează extracția pentru site-uri web nesuportate folosind modele de site-uri similare'
      },
      blacklist: {
        label: 'Activează Listă Neagră Cuvinte Cheie',
        description: 'Introduceți cuvinte cheie de blocat, separate prin virgule, punct și virgulă sau linii noi.',
        tooltip: 'Blochează etichete nedorite prin filtrarea cuvintelor cheie specifice',
        placeholder: 'Introduceți cuvinte cheie de blocat…',
        ariaLabel: 'Cuvinte cheie listă neagră',
        reset: 'Resetare la Implicit'
      }
    },
    historySize: {
      label: 'Dimensiune Maximă Istoric',
      description: 'Setați numărul maxim de intrări pentru istoricul extracțiilor și imaginilor.'
    },
    accessibility: {
      themeOption: 'Temă {{label}}',
      colorThemeOption: 'Temă culoare {{label}}',
      historySizeSelect: 'Dimensiune maximă istoric'
    },
    historySizeOptions: {
      '10': '10 Intrări',
      '30': '30 Intrări',
      '50': '50 Intrări',
      '100': '100 Intrări',
      unlimited: 'Nelimitat'
    },
    support: {
      title: 'Suport și Feedback',
      cta: 'Raportați o Problemă pe GitHub',
      description: 'Ați găsit un bug sau aveți o sugestie? Anunțați-ne!'
    },
    modal: {
      close: 'Închide Setări'
    }
  }
};
