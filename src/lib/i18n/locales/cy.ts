import { en } from './en';
import type { TranslationSchema } from './en';

export const cy: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Echdynnwr tagiau Booru',
    language: 'Iaith',
    english: 'Saesneg',
    indonesian: 'Indoneseg',
    chinese: 'Tsieineeg',
    languageSwitcher: {
      title: 'Iaith y rhyngwyneb',
      description: 'Wedi\'i gadw yn eich porwr. Saesneg yw\'r iaith ddiofyn.',
      instantNotice: 'Mae newidiadau\'n cael eu cymhwyso ar unwaith heb ail-lwytho.',
      searchPlaceholder: 'Chwilio am ieithoedd...',
      noResults: 'Dim ieithoedd wedi\'u canfod'
    },
    nav: {
      extractor: 'Tagiau',
      image: 'Delwedd',
      booruList: 'Booru',
      settings: 'Gosodiadau'
    },
    actions: {
      ...en.common.actions,
      add: 'Ychwanegu',
      apply: 'Cymhwyso',
      back: 'Yn ôl',
      cancel: 'Canslo',
      clear: 'Clirio',
      close: 'Cau',
      confirm: 'Cadarnhau',
      copy: 'Copïo',
      copied: 'Wedi copïo!',
      delete: 'Dileu',
      save: 'Cadw',
      search: 'Chwilio',
      all: 'Pob un',
      none: 'Dim'
    }
  },
  settings: {
    title: 'Gosodiadau',
    sections: {
      appearance: 'Ymddangosiad',
      colorTheme: 'Thema lliw',
      dataFetch: 'Dull nôl data'
    },
    themeOptions: {
      system: 'System',
      light: 'Golau',
      dark: 'Tywyll'
    },
    colorThemes: {
      blue: 'Glas',
      orange: 'Oren',
      teal: 'Glaswyrdd',
      rose: 'Rhosyn',
      purple: 'Porffor',
      green: 'Gwyrdd',
      custom: 'Lliw wedi\'i addasu'
    },
    customColor: {
      label: 'Lliw wedi\'i addasu',
      pickerLabel: 'Dewisydd lliw wedi\'i addasu',
      inputLabel: 'Cod hecs lliw wedi\'i addasu',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Dirprwy gweinydd',
        description: 'Yn defnyddio gweinydd y rhaglen hon i nôl data. Argymellir, mwy dibynadwy.'
      },
      clientProxy: {
        label: 'Dirprwy ochr y cleient',
        description: 'Yn defnyddio dirprwy CORS cyhoeddus yn eich porwr. Gall fod yn llai dibynadwy neu gyfyngedig.'
      }
    },
    clientProxy: {
      selectLabel: 'Dewis gwasanaeth dirprwy cleient:',
      ariaLabel: 'Dewisydd gwasanaeth dirprwy cleient',
      helper: 'Mae perfformiad a dibynadwyedd yn amrywio rhwng dirprwyon.'
    },
    toggles: {
      autoExtract: {
        label: 'Echdynnu awtomatig',
        description: 'Echdynnu tagiau yn awtomatig ar ôl gludo/teipio URL dilys.',
        tooltip: 'Galluogi neu analluogi echdynnu tagiau awtomatig wrth ludo/teipio URL dilys'
      },
      previews: {
        label: 'Galluogi rhagolygon',
        description: 'Dangos rhagolygon delwedd/fideo yn ystod echdynnu ac yn yr hanes.',
        tooltip: 'Galluogi neu analluogi rhagolygon delwedd/fideo i arbed lled band neu osgoi problemau posibl',
        note: 'Caiff delweddau eu nôl bob amser trwy\'r dirprwy gweinydd.'
      },
      saveHistory: {
        label: 'Cadw hanes',
        description: 'Storio echdynniadau llwyddiannus yn lleol yn eich porwr.',
        tooltip: 'Galluogi neu analluogi cadw hanes echdynnu i storfa leol eich porwr'
      },
      unsupportedSites: {
        label: 'Galluogi ar gyfer safleoedd heb eu cefnogi',
        description: 'Ceisio echdynnu o safleoedd heb eu cefnogi gan ddefnyddio patrymau safleoedd tebyg. Efallai na fydd yn gweithio ar gyfer pob safle.',
        tooltip: 'Galluogi echdynnu ar gyfer gwefannau heb eu cefnogi gan ddefnyddio patrymau safleoedd tebyg'
      },
      blacklist: {
        label: 'Galluogi rhestr ddu geiriau allweddol',
        description: 'Rhowch eiriau allweddol i\'w rhwystro, wedi\'u gwahanu gan gomas, hanner colons neu linellau newydd.',
        tooltip: 'Rhwystro tagiau diangen trwy hidlo geiriau allweddol penodol',
        placeholder: 'Rhowch eiriau allweddol i\'w rhwystro…',
        ariaLabel: 'Geiriau allweddol rhestr ddu',
        reset: 'Ailosod i\'r rhagosodiad'
      }
    },
    historySize: {
      label: 'Maint hanes uchaf',
      description: 'Gosod uchafswm nifer y cofnodion ar gyfer hanes echdynnu a delweddau.'
    },
    accessibility: {
      themeOption: 'Thema {{label}}',
      colorThemeOption: 'Thema lliw {{label}}',
      historySizeSelect: 'Maint hanes uchaf'
    },
    historySizeOptions: {
      '10': '10 cofnod',
      '30': '30 cofnod',
      '50': '50 cofnod',
      '100': '100 cofnod',
      unlimited: 'Diderfyn'
    },
    support: {
      title: 'Cymorth ac adborth',
      cta: 'Adrodd problem ar GitHub',
      description: 'Wedi dod o hyd i nam neu awgrym? Rhowch wybod i ni!'
    },
    modal: {
      close: 'Cau gosodiadau'
    }
  }
};
