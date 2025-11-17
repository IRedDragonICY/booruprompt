import { en } from './en';
import type { TranslationSchema } from './en';

export const lt: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru žymų ekstraktorius',
    language: 'Kalba',
    english: 'Anglų',
    indonesian: 'Indoneziečių',
    chinese: 'Kinų',
    languageSwitcher: {
      title: 'Sąsajos kalba',
      description: 'Išsaugota jūsų naršyklėje. Numatytoji kalba yra anglų.',
      instantNotice: 'Pakeitimai taikomi iš karto be perkrovimo.',
      searchPlaceholder: 'Ieškoti kalbų...',
      noResults: 'Kalbų nerasta'
    },
    nav: {
      extractor: 'Žymos',
      image: 'Paveikslas',
      booruList: 'Booru',
      settings: 'Nustatymai'
    },
    actions: {
      ...en.common.actions,
      add: 'Pridėti',
      apply: 'Taikyti',
      back: 'Atgal',
      cancel: 'Atšaukti',
      clear: 'Išvalyti',
      close: 'Uždaryti',
      confirm: 'Patvirtinti',
      copy: 'Kopijuoti',
      copied: 'Nukopijuota!',
      delete: 'Ištrinti',
      save: 'Išsaugoti',
      search: 'Ieškoti',
      all: 'Visi',
      none: 'Nieko'
    }
  },
  settings: {
    title: 'Nustatymai',
    sections: {
      appearance: 'Išvaizda',
      colorTheme: 'Spalvų tema',
      dataFetch: 'Duomenų gavimo metodas'
    },
    themeOptions: {
      system: 'Sistema',
      light: 'Šviesi',
      dark: 'Tamsi'
    },
    colorThemes: {
      blue: 'Mėlyna',
      orange: 'Oranžinė',
      teal: 'Žydra',
      rose: 'Rožinė',
      purple: 'Violetinė',
      green: 'Žalia',
      custom: 'Pasirinktinė spalva'
    },
    customColor: {
      label: 'Pasirinktinė Spalva',
      pickerLabel: 'Pasirinktinės spalvos parinkiklis',
      inputLabel: 'Pasirinktinės spalvos hex kodas',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Serverio Tarpinis Serveris',
        description: 'Naudoja šios programos serverį duomenų gavimui. Rekomenduojama, patikimesnė.'
      },
      clientProxy: {
        label: 'Kliento Pusės Tarpinis Serveris',
        description: 'Naudoja viešąjį CORS tarpinį serverį jūsų naršyklėje. Gali būti mažiau patikimas arba ribotas.'
      }
    },
    clientProxy: {
      selectLabel: 'Pasirinkite kliento tarpinio serverio paslaugą:',
      ariaLabel: 'Kliento tarpinio serverio paslaugos parinkiklis',
      helper: 'Našumas ir patikimumas skiriasi tarp tarpinių serverių.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatinis Išskyrimas',
        description: 'Automatiškai išskirti žymes po tinkamo URL įklijavimo/įvedimo.',
        tooltip: 'Įjungti arba išjungti automatinį žymių išskyrimą įklijuojant/įvedant tinkamą URL'
      },
      previews: {
        label: 'Įjungti Peržiūras',
        description: 'Rodyti vaizdų/vaizdo įrašų peržiūras išskyrimo metu ir istorijoje.',
        tooltip: 'Įjungti arba išjungti vaizdų/vaizdo įrašų peržiūras, kad sutaupytumėte duomenų pralaidumą arba išvengtumėte galimų problemų',
        note: 'Vaizdai visada gaunami per Serverio Tarpinį Serverį.'
      },
      saveHistory: {
        label: 'Išsaugoti Istoriją',
        description: 'Saugoti sėkmingus išskyrimus vietoje jūsų naršyklėje.',
        tooltip: 'Įjungti arba išjungti išskyrimo istorijos išsaugojimą naršyklės vietinėje saugykloje'
      },
      unsupportedSites: {
        label: 'Įjungti Nepalaikomiems Svetainėms',
        description: 'Bandyti išskirti iš nepalaikomų svetainių naudojant panašius svetainių šablonus. Gali neveikti visoms svetainėms.',
        tooltip: 'Įjungti išskyrimą nepalaikomiems tinklalapiams naudojant panašius svetainių šablonus'
      },
      blacklist: {
        label: 'Įjungti Raktažodžių Juodąjį Sąrašą',
        description: 'Įveskite blokuojamus raktažodžius, atskirtus kableliais, kabliataškiais arba naujomis eilutėmis.',
        tooltip: 'Blokuoti nepageidaujamas žymes filtruojant konkrečius raktažodžius',
        placeholder: 'Įveskite blokuojamus raktažodžius…',
        ariaLabel: 'Juodojo sąrašo raktažodžiai',
        reset: 'Atkurti Numatytuosius'
      }
    },
    historySize: {
      label: 'Maksimalus Istorijos Dydis',
      description: 'Nustatykite maksimalų įrašų skaičių išskyrimo ir vaizdų istorijai.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Spalvų tema {{label}}',
      historySizeSelect: 'Maksimalus istorijos dydis'
    },
    historySizeOptions: {
      '10': '10 Įrašų',
      '30': '30 Įrašų',
      '50': '50 Įrašų',
      '100': '100 Įrašų',
      unlimited: 'Neribota'
    },
    support: {
      title: 'Palaikymas ir Atsiliepimai',
      cta: 'Pranešti apie Problemą GitHub',
      description: 'Radote klaidą arba turite pasiūlymą? Praneškite mums!'
    },
    modal: {
      close: 'Uždaryti Nustatymus'
    }
  }
};
