import { en } from './en';
import type { TranslationSchema } from './en';

export const cs: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Extraktor Tagů Booru',
    language: 'Jazyk',
    english: 'Angličtina',
    indonesian: 'Indonéština',
    chinese: 'Čínština',
    languageSwitcher: {
      title: 'Jazyk rozhraní',
      description: 'Uloženo ve vašem prohlížeči. Výchozí jazyk je angličtina.',
      instantNotice: 'Změny se použijí okamžitě bez opětovného načtení.',
      searchPlaceholder: 'Hledat jazyky...',
      noResults: 'Nebyly nalezeny žádné jazyky'
    },
    nav: {
      extractor: 'Tagy',
      image: 'Obrázek',
      booruList: 'Booru',
      settings: 'Nastavení'
    },
    actions: {
      ...en.common.actions,
      add: 'Přidat',
      apply: 'Použít',
      back: 'Zpět',
      cancel: 'Zrušit',
      clear: 'Vymazat',
      close: 'Zavřít',
      confirm: 'Potvrdit',
      copy: 'Kopírovat',
      copied: 'Zkopírováno!',
      delete: 'Smazat',
      save: 'Uložit',
      search: 'Hledat',
      all: 'Vše',
      none: 'Žádné'
    }
  },
  settings: {
    title: 'Nastavení',
    sections: {
      appearance: 'Vzhled',
      colorTheme: 'Barevný Motiv',
      dataFetch: 'Metoda Načítání Dat'
    },
    themeOptions: {
      system: 'Systém',
      light: 'Světlý',
      dark: 'Tmavý'
    },
    colorThemes: {
      blue: 'Modrá',
      orange: 'Oranžová',
      teal: 'Tyrkysová',
      rose: 'Růžová',
      purple: 'Fialová',
      green: 'Zelená',
      custom: 'Vlastní Barva'
    },
    customColor: {
      label: 'Vlastní Barva',
      pickerLabel: 'Vlastní výběr barvy',
      inputLabel: 'Hexadecimální kód vlastní barvy',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Serverová Proxy',
        description: 'Používá server této aplikace k načítání dat. Doporučeno, spolehlivější.'
      },
      clientProxy: {
        label: 'Klientská Proxy',
        description: 'Používá veřejnou CORS proxy ve vašem prohlížeči. Může být méně spolehlivá nebo omezená.'
      }
    },
    clientProxy: {
      selectLabel: 'Vyberte klientskou proxy službu:',
      ariaLabel: 'Výběr klientské proxy služby',
      helper: 'Výkon a spolehlivost se liší mezi proxy.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatická Extrakce',
        description: 'Extrahovat štítky automaticky po vložení/zadání platné URL.',
        tooltip: 'Zapnout nebo vypnout automatickou extrakci štítků při vložení/zadání platné URL'
      },
      previews: {
        label: 'Povolit Náhledy',
        description: 'Zobrazit náhledy obrázků/videí během extrakce a v historii.',
        tooltip: 'Zapnout nebo vypnout náhledy obrázků/videí pro úsporu šířky pásma nebo vyhnutí se potenciálním problémům',
        note: 'Obrázky jsou vždy načítány přes Serverovou Proxy.'
      },
      saveHistory: {
        label: 'Uložit Historii',
        description: 'Ukládat úspěšné extrakce lokálně ve vašem prohlížeči.',
        tooltip: 'Zapnout nebo vypnout ukládání historie extrakcí do lokálního úložiště prohlížeče'
      },
      unsupportedSites: {
        label: 'Povolit pro Nepodporované Stránky',
        description: 'Zkusit extrahovat z nepodporovaných stránek pomocí podobných vzorů stránek. Nemusí fungovat pro všechny stránky.',
        tooltip: 'Povolit extrakci pro nepodporované webové stránky pomocí podobných vzorů stránek'
      },
      blacklist: {
        label: 'Povolit Černou Listinu Klíčových Slov',
        description: 'Zadejte klíčová slova k blokování, oddělená čárkami, středníky nebo novými řádky.',
        tooltip: 'Blokovat nežádoucí štítky filtrováním konkrétních klíčových slov',
        placeholder: 'Zadejte klíčová slova k blokování…',
        ariaLabel: 'Klíčová slova černé listiny',
        reset: 'Obnovit Výchozí'
      }
    },
    historySize: {
      label: 'Maximální Velikost Historie',
      description: 'Nastavte maximální počet záznamů pro historii extrakce a obrázků.'
    },
    accessibility: {
      themeOption: 'Motiv {{label}}',
      colorThemeOption: 'Barevný motiv {{label}}',
      historySizeSelect: 'Maximální velikost historie'
    },
    historySizeOptions: {
      '10': '10 Záznamů',
      '30': '30 Záznamů',
      '50': '50 Záznamů',
      '100': '100 Záznamů',
      unlimited: 'Neomezeno'
    },
    support: {
      title: 'Podpora a Zpětná Vazba',
      cta: 'Nahlásit Problém na GitHub',
      description: 'Našli jste chybu nebo máte návrh? Dejte nám vědět!'
    },
    modal: {
      close: 'Zavřít Nastavení'
    }
  }
};
