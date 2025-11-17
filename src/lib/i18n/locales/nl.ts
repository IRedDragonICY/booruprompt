import { en } from './en';
import type { TranslationSchema } from './en';

export const nl: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Taal',
    english: 'Engels',
    indonesian: 'Indonesisch',
    chinese: 'Chinees',
    languageSwitcher: {
      title: 'Interfacetaal',
      description: 'Opgeslagen in uw browser. Standaardtaal is Engels.',
      instantNotice: 'Wijzigingen worden direct toegepast zonder te herladen.',
      searchPlaceholder: 'Zoek talen...',
      noResults: 'Geen talen gevonden'
    },
    nav: {
      extractor: 'Tags',
      image: 'Afbeelding',
      booruList: 'Booru',
      settings: 'Instellingen'
    },
    actions: {
      ...en.common.actions,
      add: 'Toevoegen',
      apply: 'Toepassen',
      back: 'Terug',
      cancel: 'Annuleren',
      clear: 'Wissen',
      close: 'Sluiten',
      confirm: 'Bevestigen',
      copy: 'Kopiëren',
      copied: 'Gekopieerd!',
      delete: 'Verwijderen',
      save: 'Opslaan',
      search: 'Zoeken',
      all: 'Alles',
      none: 'Geen'
    }
  },
  settings: {
    title: 'Instellingen',
    sections: {
      appearance: 'Uiterlijk',
      colorTheme: 'Kleurthema',
      dataFetch: 'Gegevensophaalmethode'
    },
    themeOptions: {
      system: 'Systeem',
      light: 'Licht',
      dark: 'Donker'
    },
    colorThemes: {
      blue: 'Blauw',
      orange: 'Oranje',
      teal: 'Groenblauw',
      rose: 'Roze',
      purple: 'Paars',
      green: 'Groen',
      custom: 'Aangepaste Kleur'
    },
    customColor: {
      label: 'Aangepaste Kleur',
      pickerLabel: 'Aangepaste kleurkiezer',
      inputLabel: 'Aangepaste kleur hexcode',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Serverproxy',
        description: 'Gebruikt de server van deze applicatie om gegevens op te halen. Aanbevolen, betrouwbaarder.'
      },
      clientProxy: {
        label: 'Client-side Proxy',
        description: 'Gebruikt een openbare CORS-proxy in uw browser. Kan minder betrouwbaar of beperkt zijn.'
      }
    },
    clientProxy: {
      selectLabel: 'Selecteer clientproxyservice:',
      ariaLabel: 'Clientproxyservice Selector',
      helper: 'Prestaties en betrouwbaarheid variëren tussen proxies.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatische Extractie',
        description: 'Tags automatisch extraheren na het plakken/typen van een geldige URL.',
        tooltip: 'Schakel automatische tag-extractie in of uit bij het plakken/typen van een geldige URL'
      },
      previews: {
        label: 'Voorvertoningen Inschakelen',
        description: 'Toon afbeeldings-/videovoorvertoningen tijdens extractie en in geschiedenis.',
        tooltip: 'Schakel afbeeldings-/videovoorvertoningen in of uit om bandbreedte te besparen of potentiële problemen te voorkomen',
        note: 'Afbeeldingen worden altijd via de Serverproxy opgehaald.'
      },
      saveHistory: {
        label: 'Geschiedenis Opslaan',
        description: 'Sla succesvolle extracties lokaal op in uw browser.',
        tooltip: 'Schakel het opslaan van extractiegeschiedenis in de lokale opslag van de browser in of uit'
      },
      unsupportedSites: {
        label: 'Inschakelen voor Niet-ondersteunde Sites',
        description: 'Probeer te extraheren van niet-ondersteunde sites met vergelijkbare sitepatronen. Werkt mogelijk niet voor alle sites.',
        tooltip: 'Schakel extractie in voor niet-ondersteunde websites door vergelijkbare sitepatronen te gebruiken'
      },
      blacklist: {
        label: 'Sleutelwoord Zwarte Lijst Inschakelen',
        description: 'Voer sleutelwoorden in om te blokkeren, gescheiden door komma\'s, puntkomma\'s of nieuwe regels.',
        tooltip: 'Blokkeer ongewenste tags door specifieke sleutelwoorden te filteren',
        placeholder: 'Voer sleutelwoorden in om te blokkeren…',
        ariaLabel: 'Zwarte lijst sleutelwoorden',
        reset: 'Standaard Herstellen'
      }
    },
    historySize: {
      label: 'Maximale Geschiedenisgrootte',
      description: 'Stel het maximale aantal vermeldingen in voor zowel extractie- als afbeeldingsgeschiedenis.'
    },
    accessibility: {
      themeOption: 'Thema {{label}}',
      colorThemeOption: 'Kleurthema {{label}}',
      historySizeSelect: 'Maximale geschiedenisgrootte'
    },
    historySizeOptions: {
      '10': '10 Vermeldingen',
      '30': '30 Vermeldingen',
      '50': '50 Vermeldingen',
      '100': '100 Vermeldingen',
      unlimited: 'Onbeperkt'
    },
    support: {
      title: 'Ondersteuning & Feedback',
      cta: 'Meld een Probleem op GitHub',
      description: 'Een bug gevonden of een suggestie? Laat het ons weten!'
    },
    modal: {
      close: 'Instellingen Sluiten'
    }
  }
};
