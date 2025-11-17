import { en } from './en';
import type { TranslationSchema } from './en';

export const ca: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru extractor d\'etiquetes',
    language: 'Idioma',
    english: 'Anglès',
    indonesian: 'Indonesi',
    chinese: 'Xinès',
    languageSwitcher: {
      title: 'Idioma de la interfície',
      description: 'Desat al vostre navegador. L\'idioma predeterminat és l\'anglès.',
      instantNotice: 'Els canvis s\'apliquen immediatament sense recarregar.',
      searchPlaceholder: 'Cerca idiomes...',
      noResults: 'No s\'han trobat idiomes'
    },
    nav: {
      extractor: 'Etiquetes',
      image: 'Imatge',
      booruList: 'Booru',
      settings: 'Configuració'
    },
    actions: {
      ...en.common.actions,
      add: 'Afegeix',
      apply: 'Aplica',
      back: 'Enrere',
      cancel: 'Cancel·la',
      clear: 'Neteja',
      close: 'Tanca',
      confirm: 'Confirma',
      copy: 'Copia',
      copied: 'Copiat!',
      delete: 'Suprimeix',
      save: 'Desa',
      search: 'Cerca',
      all: 'Tot',
      none: 'Cap'
    }
  },
  settings: {
    title: 'Configuració',
    sections: {
      appearance: 'Aparença',
      colorTheme: 'Tema de color',
      dataFetch: 'Mètode d\'obtenció de dades'
    },
    themeOptions: {
      system: 'Sistema',
      light: 'Clar',
      dark: 'Fosc'
    },
    colorThemes: {
      blue: 'Blau',
      orange: 'Taronja',
      teal: 'Verd blavós',
      rose: 'Rosa',
      purple: 'Porpra',
      green: 'Verd',
      custom: 'Color personalitzat'
    },
    customColor: {
      label: 'Color personalitzat',
      pickerLabel: 'Selector de color personalitzat',
      inputLabel: 'Codi hex del color personalitzat',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Servidor intermediari',
        description: 'Utilitza el servidor d\'aquesta aplicació per obtenir dades. Recomanat, més fiable.'
      },
      clientProxy: {
        label: 'Intermediari del costat del client',
        description: 'Utilitza un servidor intermediari CORS públic al navegador. Pot ser menys fiable o tenir limitacions.'
      }
    },
    clientProxy: {
      selectLabel: 'Selecciona el servei d\'intermediari del client:',
      ariaLabel: 'Selector del servei d\'intermediari del client',
      helper: 'El rendiment i la fiabilitat varien entre intermediaris.'
    },
    toggles: {
      autoExtract: {
        label: 'Extracció automàtica',
        description: 'Extreu etiquetes automàticament després d\'enganxar/escriure un URL vàlid.',
        tooltip: 'Activa o desactiva l\'extracció automàtica d\'etiquetes en enganxar/escriure un URL vàlid'
      },
      previews: {
        label: 'Activa les previsualitzacions',
        description: 'Mostra previsualitzacions d\'imatges/vídeos durant l\'extracció i a l\'historial.',
        tooltip: 'Activa o desactiva les previsualitzacions d\'imatges/vídeos per estalviar ample de banda o evitar possibles problemes',
        note: 'Les imatges sempre s\'obtenen mitjançant el servidor intermediari.'
      },
      saveHistory: {
        label: 'Desa l\'historial',
        description: 'Emmagatzema les extraccions reeixides localment al navegador.',
        tooltip: 'Activa o desactiva el desament de l\'historial d\'extraccions a l\'emmagatzematge local del navegador'
      },
      unsupportedSites: {
        label: 'Activa per a llocs no compatibles',
        description: 'Intenta extreure de llocs no compatibles utilitzant patrons de llocs similars. Pot no funcionar per a tots els llocs.',
        tooltip: 'Activa l\'extracció per a llocs web no compatibles utilitzant patrons de llocs similars'
      },
      blacklist: {
        label: 'Activa la llista negra de paraules clau',
        description: 'Introdueix paraules clau per bloquejar, separades per comes, punts i comes o línies noves.',
        tooltip: 'Bloqueja etiquetes no desitjades filtrant paraules clau específiques',
        placeholder: 'Introdueix paraules clau per bloquejar…',
        ariaLabel: 'Paraules clau de la llista negra',
        reset: 'Restaura als valors per defecte'
      }
    },
    historySize: {
      label: 'Mida màxima de l\'historial',
      description: 'Estableix el nombre màxim d\'entrades per a l\'historial d\'extracció i d\'imatges.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Tema de color {{label}}',
      historySizeSelect: 'Mida màxima de l\'historial'
    },
    historySizeOptions: {
      '10': '10 entrades',
      '30': '30 entrades',
      '50': '50 entrades',
      '100': '100 entrades',
      unlimited: 'Il·limitades'
    },
    support: {
      title: 'Suport i comentaris',
      cta: 'Informa d\'un problema a GitHub',
      description: 'Has trobat un error o tens un suggeriment? Fes-nos-ho saber!'
    },
    modal: {
      close: 'Tanca la configuració'
    }
  }
};
