import { en } from './en';
import type { TranslationSchema } from './en';

export const hr: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ekstraktor oznaka',
    language: 'Jezik',
    english: 'Engleski',
    indonesian: 'Indonezijski',
    chinese: 'Kineski',
    languageSwitcher: {
      title: 'Jezik sučelja',
      description: 'Spremljeno u vašem pregledniku. Zadani jezik je engleski.',
      instantNotice: 'Promjene se primjenjuju trenutno bez ponovnog učitavanja.',
      searchPlaceholder: 'Pretraži jezike...',
      noResults: 'Nema pronađenih jezika'
    },
    nav: {
      extractor: 'Oznake',
      image: 'Slika',
      booruList: 'Booru',
      settings: 'Postavke'
    },
    actions: {
      ...en.common.actions,
      add: 'Dodaj',
      apply: 'Primijeni',
      back: 'Natrag',
      cancel: 'Odustani',
      clear: 'Obriši',
      close: 'Zatvori',
      confirm: 'Potvrdi',
      copy: 'Kopiraj',
      copied: 'Kopirano!',
      delete: 'Izbriši',
      save: 'Spremi',
      search: 'Pretraži',
      all: 'Sve',
      none: 'Ništa'
    }
  },
  settings: {
    title: 'Postavke',
    sections: {
      appearance: 'Izgled',
      colorTheme: 'Tema boja',
      dataFetch: 'Metoda preuzimanja podataka'
    },
    themeOptions: {
      system: 'Sustav',
      light: 'Svijetla',
      dark: 'Tamna'
    },
    colorThemes: {
      blue: 'Plava',
      orange: 'Narančasta',
      teal: 'Tirkizna',
      rose: 'Ružičasta',
      purple: 'Ljubičasta',
      green: 'Zelena',
      custom: 'Prilagođena boja'
    },
    customColor: {
      label: 'Prilagođena boja',
      pickerLabel: 'Birač prilagođene boje',
      inputLabel: 'Hex kod prilagođene boje',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Serverski Proxy',
        description: 'Koristi poslužitelj ove aplikacije za preuzimanje podataka. Preporučeno, pouzdanije.'
      },
      clientProxy: {
        label: 'Klijentski Proxy',
        description: 'Koristi javni CORS proxy u vašem pregledniku. Može biti manje pouzdano ili ograničeno.'
      }
    },
    clientProxy: {
      selectLabel: 'Odaberite uslugu klijentskog proxy-ja:',
      ariaLabel: 'Birač usluge klijentskog proxy-ja',
      helper: 'Performanse i pouzdanost razlikuju se između proxy-ja.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatska Ekstrakcija',
        description: 'Automatski izdvoji oznake nakon lijepljenja/upisivanja važećeg URL-a.',
        tooltip: 'Uključi ili isključi automatsku ekstrakciju oznaka pri lijepljenju/upisivanju važećeg URL-a'
      },
      previews: {
        label: 'Omogući Preglede',
        description: 'Prikaži preglede slika/videozapisa tijekom ekstrakcije i u povijesti.',
        tooltip: 'Uključi ili isključi preglede slika/videozapisa radi uštede propusnosti ili izbjegavanja potencijalnih problema',
        note: 'Slike se uvijek preuzimaju preko Serverskog Proxy-ja.'
      },
      saveHistory: {
        label: 'Spremi Povijest',
        description: 'Spremi uspješne ekstrakcije lokalno u vašem pregledniku.',
        tooltip: 'Uključi ili isključi spremanje povijesti ekstrakcija u lokalno spremište preglednika'
      },
      unsupportedSites: {
        label: 'Omogući za Nepodržane Stranice',
        description: 'Pokušaj izdvojiti s nepodržanih stranica koristeći slične uzorke stranica. Možda neće raditi za sve stranice.',
        tooltip: 'Omogući ekstrakciju za nepodržane web stranice koristeći slične uzorke stranica'
      },
      blacklist: {
        label: 'Omogući Crnu Listu Ključnih Riječi',
        description: 'Unesite ključne riječi za blokiranje, odvojene zarezima, točka-zarezima ili novim redovima.',
        tooltip: 'Blokiraj neželjene oznake filtriranjem specifičnih ključnih riječi',
        placeholder: 'Unesite ključne riječi za blokiranje…',
        ariaLabel: 'Ključne riječi crne liste',
        reset: 'Vrati na Zadano'
      }
    },
    historySize: {
      label: 'Maksimalna Veličina Povijest',
      description: 'Postavite maksimalan broj unosa za povijest ekstrakcije i slika.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Tema boja {{label}}',
      historySizeSelect: 'Maksimalna veličina povijesti'
    },
    historySizeOptions: {
      '10': '10 Unosa',
      '30': '30 Unosa',
      '50': '50 Unosa',
      '100': '100 Unosa',
      unlimited: 'Neograničeno'
    },
    support: {
      title: 'Podrška i Povratne Informacije',
      cta: 'Prijavi Problem na GitHub',
      description: 'Našli ste grešku ili imate prijedlog? Javite nam!'
    },
    modal: {
      close: 'Zatvori Postavke'
    }
  }
};
