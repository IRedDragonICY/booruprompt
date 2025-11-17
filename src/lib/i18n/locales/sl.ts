import { en } from './en';
import type { TranslationSchema } from './en';

export const sl: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ekstraktor oznak',
    language: 'Jezik',
    english: 'Angleščina',
    indonesian: 'Indonezijščina',
    chinese: 'Kitajščina',
    languageSwitcher: {
      title: 'Jezik vmesnika',
      description: 'Shranjeno v vašem brskalniku. Privzeti jezik je angleščina.',
      instantNotice: 'Spremembe se uporabijo takoj brez ponovnega nalaganja.',
      searchPlaceholder: 'Išči jezike...',
      noResults: 'Ni najdenih jezikov'
    },
    nav: {
      extractor: 'Oznake',
      image: 'Slika',
      booruList: 'Booru',
      settings: 'Nastavitve'
    },
    actions: {
      ...en.common.actions,
      add: 'Dodaj',
      apply: 'Uporabi',
      back: 'Nazaj',
      cancel: 'Prekliči',
      clear: 'Počisti',
      close: 'Zapri',
      confirm: 'Potrdi',
      copy: 'Kopiraj',
      copied: 'Kopirano!',
      delete: 'Izbriši',
      save: 'Shrani',
      search: 'Išči',
      all: 'Vse',
      none: 'Nič'
    }
  },
  settings: {
    title: 'Nastavitve',
    sections: {
      appearance: 'Videz',
      colorTheme: 'Barvna tema',
      dataFetch: 'Metoda pridobivanja podatkov'
    },
    themeOptions: {
      system: 'Sistemska',
      light: 'Svetla',
      dark: 'Temna'
    },
    colorThemes: {
      blue: 'Modra',
      orange: 'Oranžna',
      teal: 'Turkizna',
      rose: 'Rožnata',
      purple: 'Vijolična',
      green: 'Zelena',
      custom: 'Barva po meri'
    },
    customColor: {
      label: 'Barva po meri',
      pickerLabel: 'Izbirnik barve po meri',
      inputLabel: 'Heksadecimalna koda barve po meri',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Strežniški Proxy',
        description: 'Uporablja strežnik te aplikacije za pridobivanje podatkov. Priporočeno, bolj zanesljivo.'
      },
      clientProxy: {
        label: 'Odjemalski Proxy',
        description: 'Uporablja javni CORS proxy v vašem brskalniku. Lahko je manj zanesljiv ali omejen.'
      }
    },
    clientProxy: {
      selectLabel: 'Izberite storitev odjemalskega proxyja:',
      ariaLabel: 'Izbirnik storitve odjemalskega proxyja',
      helper: 'Zmogljivost in zanesljivost se razlikujeta med proxyji.'
    },
    toggles: {
      autoExtract: {
        label: 'Samodejno Pridobivanje',
        description: 'Samodejno pridobi oznake po prilepitvi/vnosu veljavnega URL-ja.',
        tooltip: 'Omogoči ali onemogoči samodejno pridobivanje oznak pri prilepitvi/vnosu veljavnega URL-ja'
      },
      previews: {
        label: 'Omogoči Predoglede',
        description: 'Prikaži predoglede slik/videoposnetkov med pridobivanjem in v zgodovini.',
        tooltip: 'Omogoči ali onemogoči predoglede slik/videoposnetkov za prihranek pasovne širine ali izogibanje morebitnim težavam',
        note: 'Slike se vedno pridobijo prek Strežniškega Proxyja.'
      },
      saveHistory: {
        label: 'Shrani Zgodovino',
        description: 'Shrani uspešna pridobivanja lokalno v vašem brskalniku.',
        tooltip: 'Omogoči ali onemogoči shranjevanje zgodovine pridobivanj v lokalno shrambo brskalnika'
      },
      unsupportedSites: {
        label: 'Omogoči za Nepodprte Strani',
        description: 'Poskusi pridobiti z nepodprtih strani z uporabo podobnih vzorcev strani. Morda ne deluje za vse strani.',
        tooltip: 'Omogoči pridobivanje za nepodprte spletne strani z uporabo podobnih vzorcev strani'
      },
      blacklist: {
        label: 'Omogoči Črni Seznam Ključnih Besed',
        description: 'Vnesite ključne besede za blokiranje, ločene z vejicami, podpičji ali novimi vrsticami.',
        tooltip: 'Blokirajte nezaželene oznake s filtriranjem določenih ključnih besed',
        placeholder: 'Vnesite ključne besede za blokiranje…',
        ariaLabel: 'Ključne besede črnega seznama',
        reset: 'Ponastavi na Privzeto'
      }
    },
    historySize: {
      label: 'Največja Velikost Zgodovine',
      description: 'Nastavite največje število vnosov za zgodovino pridobivanj in slik.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Barvna tema {{label}}',
      historySizeSelect: 'Največja velikost zgodovine'
    },
    historySizeOptions: {
      '10': '10 Vnosov',
      '30': '30 Vnosov',
      '50': '50 Vnosov',
      '100': '100 Vnosov',
      unlimited: 'Neomejeno'
    },
    support: {
      title: 'Podpora in Povratne Informacije',
      cta: 'Prijavite Težavo na GitHub',
      description: 'Našli ste napako ali imate predlog? Sporočite nam!'
    },
    modal: {
      close: 'Zapri Nastavitve'
    }
  }
};
