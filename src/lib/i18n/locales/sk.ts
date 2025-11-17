import { en } from './en';
import type { TranslationSchema } from './en';

export const sk: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru extraktor značiek',
    language: 'Jazyk',
    english: 'Angličtina',
    indonesian: 'Indonézština',
    chinese: 'Čínština',
    languageSwitcher: {
      title: 'Jazyk rozhrania',
      description: 'Uložené vo vašom prehliadači. Predvolený jazyk je angličtina.',
      instantNotice: 'Zmeny sa aplikujú okamžite bez opätovného načítania.',
      searchPlaceholder: 'Hľadať jazyky...',
      noResults: 'Žiadne jazyky nenájdené'
    },
    nav: {
      extractor: 'Značky',
      image: 'Obrázok',
      booruList: 'Booru',
      settings: 'Nastavenia'
    },
    actions: {
      ...en.common.actions,
      add: 'Pridať',
      apply: 'Použiť',
      back: 'Späť',
      cancel: 'Zrušiť',
      clear: 'Vymazať',
      close: 'Zavrieť',
      confirm: 'Potvrdiť',
      copy: 'Kopírovať',
      copied: 'Skopírované!',
      delete: 'Vymazať',
      save: 'Uložiť',
      search: 'Hľadať',
      all: 'Všetko',
      none: 'Nič'
    }
  },
  settings: {
    title: 'Nastavenia',
    sections: {
      appearance: 'Vzhľad',
      colorTheme: 'Farebná téma',
      dataFetch: 'Metóda získavania dát'
    },
    themeOptions: {
      system: 'Systémová',
      light: 'Svetlá',
      dark: 'Tmavá'
    },
    colorThemes: {
      blue: 'Modrá',
      orange: 'Oranžová',
      teal: 'Tyrkysová',
      rose: 'Ružová',
      purple: 'Fialová',
      green: 'Zelená',
      custom: 'Vlastná farba'
    },
    customColor: {
      label: 'Vlastná farba',
      pickerLabel: 'Vlastný výber farby',
      inputLabel: 'Hexadecimálny kód vlastnej farby',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Serverová Proxy',
        description: 'Používa server tejto aplikácie na získavanie dát. Odporúčané, spoľahlivejšie.'
      },
      clientProxy: {
        label: 'Klientská Proxy',
        description: 'Používa verejnú CORS proxy vo vašom prehliadači. Môže byť menej spoľahlivá alebo obmedzená.'
      }
    },
    clientProxy: {
      selectLabel: 'Vyberte klientsku proxy službu:',
      ariaLabel: 'Výber klientskej proxy služby',
      helper: 'Výkon a spoľahlivosť sa líšia medzi proxy.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatická Extrakcia',
        description: 'Extrahovať štítky automaticky po vložení/zadaní platnej URL.',
        tooltip: 'Zapnúť alebo vypnúť automatickú extrakciu štítkov pri vložení/zadaní platnej URL'
      },
      previews: {
        label: 'Povoliť Náhľady',
        description: 'Zobraziť náhľady obrázkov/videí počas extrakcie a v histórii.',
        tooltip: 'Zapnúť alebo vypnúť náhľady obrázkov/videí pre úsporu šírky pásma alebo vyhnutie sa potenciálnym problémom',
        note: 'Obrázky sa vždy načítavajú cez Serverovú Proxy.'
      },
      saveHistory: {
        label: 'Uložiť Históriu',
        description: 'Ukladať úspešné extrakcie lokálne vo vašom prehliadači.',
        tooltip: 'Zapnúť alebo vypnúť ukladanie histórie extrakcií do lokálneho úložiska prehliadača'
      },
      unsupportedSites: {
        label: 'Povoliť pre Nepodporované Stránky',
        description: 'Skúsiť extrahovať z nepodporovaných stránok pomocou podobných vzorov stránok. Nemusí fungovať pre všetky stránky.',
        tooltip: 'Povoliť extrakciu pre nepodporované webové stránky pomocou podobných vzorov stránok'
      },
      blacklist: {
        label: 'Povoliť Čiernu Listinu Kľúčových Slov',
        description: 'Zadajte kľúčové slová na blokovanie, oddelené čiarkami, bodkočiarkami alebo novými riadkami.',
        tooltip: 'Blokovať nežiaduce štítky filtrovaním konkrétnych kľúčových slov',
        placeholder: 'Zadajte kľúčové slová na blokovanie…',
        ariaLabel: 'Kľúčové slová čiernej listiny',
        reset: 'Obnoviť Predvolené'
      }
    },
    historySize: {
      label: 'Maximálna Veľkosť Histórie',
      description: 'Nastavte maximálny počet záznamov pre históriu extrakcie a obrázkov.'
    },
    accessibility: {
      themeOption: 'Téma {{label}}',
      colorThemeOption: 'Farebná téma {{label}}',
      historySizeSelect: 'Maximálna veľkosť histórie'
    },
    historySizeOptions: {
      '10': '10 Záznamov',
      '30': '30 Záznamov',
      '50': '50 Záznamov',
      '100': '100 Záznamov',
      unlimited: 'Neobmedzené'
    },
    support: {
      title: 'Podpora a Spätná Väzba',
      cta: 'Nahlásiť Problém na GitHub',
      description: 'Našli ste chybu alebo máte návrh? Dajte nám vedieť!'
    },
    modal: {
      close: 'Zavrieť Nastavenia'
    }
  }
};
