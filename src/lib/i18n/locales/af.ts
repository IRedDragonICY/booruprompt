import { en } from './en';
import type { TranslationSchema } from './en';

export const af: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru etiket onttrekker',
    language: 'Taal',
    english: 'Engels',
    indonesian: 'Indonesies',
    chinese: 'Chinees',
    languageSwitcher: {
      title: 'Koppelvlak taal',
      description: 'Gestoor in jou blaaier. Verstek taal is Engels.',
      instantNotice: 'Veranderinge word onmiddellik toegepas sonder herlaai.',
      searchPlaceholder: 'Soek tale...',
      noResults: 'Geen tale gevind nie'
    },
    nav: {
      extractor: 'Etikette',
      image: 'Beeld',
      booruList: 'Booru',
      settings: 'Instellings'
    },
    actions: {
      ...en.common.actions,
      add: 'Voeg by',
      apply: 'Pas toe',
      back: 'Terug',
      cancel: 'Kanselleer',
      clear: 'Maak skoon',
      close: 'Sluit',
      confirm: 'Bevestig',
      copy: 'Kopieer',
      copied: 'Gekopieer!',
      delete: 'Verwyder',
      save: 'Stoor',
      search: 'Soek',
      all: 'Alles',
      none: 'Geen'
    }
  },
  settings: {
    title: 'Instellings',
    sections: {
      appearance: 'Voorkoms',
      colorTheme: 'Kleurtema',
      dataFetch: 'Data verkrygingsmetode'
    },
    themeOptions: {
      system: 'Stelsel',
      light: 'Lig',
      dark: 'Donker'
    },
    colorThemes: {
      blue: 'Blou',
      orange: 'Oranje',
      teal: 'Blougroen',
      rose: 'Pienk',
      purple: 'Pers',
      green: 'Groen',
      custom: 'Aangepaste kleur'
    },
    customColor: {
      label: 'Aangepaste kleur',
      pickerLabel: 'Aangepaste kleurkieser',
      inputLabel: 'Aangepaste kleur heks kode',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Bediener instaanbediener',
        description: 'Gebruik hierdie toepassing se bediener om data te verkry. Aanbeveel, meer betroubaar.'
      },
      clientProxy: {
        label: 'Kliënt-kant instaanbediener',
        description: 'Gebruik \'n openbare CORS instaanbediener in jou blaaier. Kan minder betroubaar of beperk wees.'
      }
    },
    clientProxy: {
      selectLabel: 'Kies kliënt instaanbediener diens:',
      ariaLabel: 'Kliënt instaanbediener diens kieser',
      helper: 'Prestasie en betroubaarheid verskil tussen instaanbedieners.'
    },
    toggles: {
      autoExtract: {
        label: 'Outomatiese onttrekking',
        description: 'Onttrek etikette outomaties na plak/tik van \'n geldige URL.',
        tooltip: 'Aktiveer of deaktiveer outomatiese etiket onttrekking by plak/tik van \'n geldige URL'
      },
      previews: {
        label: 'Aktiveer voorvertonings',
        description: 'Wys beeld/video voorvertonings tydens onttrekking en in geskiedenis.',
        tooltip: 'Aktiveer of deaktiveer beeld/video voorvertonings om bandwydte te bespaar of potensiële probleme te vermy',
        note: 'Beelde word altyd deur die bediener instaanbediener verkry.'
      },
      saveHistory: {
        label: 'Stoor geskiedenis',
        description: 'Stoor suksesvolle onttrekkings plaaslik in jou blaaier.',
        tooltip: 'Aktiveer of deaktiveer stoor van onttrekkingsgeskiedenis na jou blaaier se plaaslike berging'
      },
      unsupportedSites: {
        label: 'Aktiveer vir ongesteunde webwerwe',
        description: 'Probeer om van ongesteunde webwerwe te onttrek deur soortgelyke werf patrone te gebruik. Werk dalk nie vir alle webwerwe nie.',
        tooltip: 'Aktiveer onttrekking vir ongesteunde webwerwe deur soortgelyke werf patrone te gebruik'
      },
      blacklist: {
        label: 'Aktiveer sleutelwoord swartlys',
        description: 'Voer sleutelwoorde in om te blokkeer, geskei deur kommas, kommapunte of nuwe reëls.',
        tooltip: 'Blokkeer ongewenste etikette deur spesifieke sleutelwoorde te filter',
        placeholder: 'Voer sleutelwoorde in om te blokkeer…',
        ariaLabel: 'Swartlys sleutelwoorde',
        reset: 'Herstel na verstek'
      }
    },
    historySize: {
      label: 'Maksimum geskiedenis grootte',
      description: 'Stel die maksimum aantal inskrywings vir beide onttrekking en beeld geskiedenis.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Kleurtema {{label}}',
      historySizeSelect: 'Maksimum geskiedenis grootte'
    },
    historySizeOptions: {
      '10': '10 inskrywings',
      '30': '30 inskrywings',
      '50': '50 inskrywings',
      '100': '100 inskrywings',
      unlimited: 'Onbeperk'
    },
    support: {
      title: 'Ondersteuning en terugvoer',
      cta: 'Rapporteer \'n probleem op GitHub',
      description: 'Het jy \'n fout gevind of \'n voorstel? Laat weet ons!'
    },
    modal: {
      close: 'Sluit instellings'
    }
  }
};
