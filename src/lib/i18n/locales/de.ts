import { en } from './en';
import type { TranslationSchema } from './en';

export const de: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extraktor',
    language: 'Sprache',
    english: 'Englisch',
    indonesian: 'Indonesisch',
    chinese: 'Chinesisch',
    languageSwitcher: {
      title: 'Oberflächensprache',
      description: 'In Ihrem Browser gespeichert. Standardsprache ist Englisch.',
      instantNotice: 'Änderungen werden sofort ohne Neuladen angewendet.',
      searchPlaceholder: 'Sprachen suchen...',
      noResults: 'Keine Sprachen gefunden'
    },
    nav: {
      extractor: 'Tags',
      image: 'Bild',
      booruList: 'Boorus',
      settings: 'Einstellungen'
    },
    actions: {
      ...en.common.actions,
      add: 'Hinzufügen',
      apply: 'Anwenden',
      back: 'Zurück',
      cancel: 'Abbrechen',
      clear: 'Löschen',
      close: 'Schließen',
      confirm: 'Bestätigen',
      copy: 'Kopieren',
      copied: 'Kopiert!',
      delete: 'Löschen',
      save: 'Speichern',
      search: 'Suchen',
      all: 'Alle',
      none: 'Keine'
    }
  },
  settings: {
    title: 'Einstellungen',
    sections: {
      appearance: 'Erscheinungsbild',
      colorTheme: 'Farbthema',
      dataFetch: 'Datenabrufmethode'
    },
    themeOptions: {
      system: 'System',
      light: 'Hell',
      dark: 'Dunkel'
    },
    colorThemes: {
      blue: 'Blau',
      orange: 'Orange',
      teal: 'Türkis',
      rose: 'Rosa',
      purple: 'Lila',
      green: 'Grün',
      custom: 'Benutzerdefinierte Farbe'
    },
    customColor: {
      label: 'Benutzerdefinierte Farbe',
      pickerLabel: 'Benutzerdefinierter Farbwähler',
      inputLabel: 'Benutzerdefinierter Farb-Hex-Code',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Server-Proxy',
        description: 'Verwendet den Server dieser Anwendung zum Abrufen von Daten. Empfohlen, zuverlässiger.'
      },
      clientProxy: {
        label: 'Client-seitiger Proxy',
        description: 'Verwendet einen öffentlichen CORS-Proxy in Ihrem Browser. Kann weniger zuverlässig oder ratenbegrenzt sein.'
      }
    },
    clientProxy: {
      selectLabel: 'Client-Proxy-Dienst auswählen:',
      ariaLabel: 'Client-Proxy-Dienst-Auswahl',
      helper: 'Leistung und Zuverlässigkeit variieren zwischen Proxies.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatische Extraktion',
        description: 'Tags automatisch nach dem Einfügen/Eingeben einer gültigen URL extrahieren.',
        tooltip: 'Automatische Tag-Extraktion beim Einfügen/Eingeben einer gültigen URL aktivieren oder deaktivieren'
      },
      previews: {
        label: 'Vorschauen Aktivieren',
        description: 'Bild-/Videovorschauen während der Extraktion und im Verlauf anzeigen.',
        tooltip: 'Bild-/Videovorschauen aktivieren oder deaktivieren, um Bandbreite zu sparen oder potenzielle Probleme zu vermeiden',
        note: 'Bilder werden immer über den Server-Proxy abgerufen.'
      },
      saveHistory: {
        label: 'Verlauf Speichern',
        description: 'Erfolgreiche Extraktionen lokal in Ihrem Browser speichern.',
        tooltip: 'Speichern des Extraktionsverlaufs im lokalen Speicher des Browsers aktivieren oder deaktivieren'
      },
      unsupportedSites: {
        label: 'Für Nicht Unterstützte Seiten Aktivieren',
        description: 'Versuchen, von nicht unterstützten Seiten mit ähnlichen Seitenmustern zu extrahieren. Funktioniert möglicherweise nicht bei allen Seiten.',
        tooltip: 'Extraktion für nicht unterstützte Websites durch Verwendung ähnlicher Seitenmuster aktivieren'
      },
      blacklist: {
        label: 'Stichwort-Blacklist Aktivieren',
        description: 'Geben Sie Stichwörter zum Blockieren ein, getrennt durch Kommas, Semikolons oder neue Zeilen.',
        tooltip: 'Unerwünschte Tags blockieren durch Filtern bestimmter Stichwörter',
        placeholder: 'Stichwörter zum Blockieren eingeben…',
        ariaLabel: 'Blacklist-Stichwörter',
        reset: 'Auf Standard Zurücksetzen'
      }
    },
    historySize: {
      label: 'Maximale Verlaufsgröße',
      description: 'Maximale Anzahl von Einträgen für Extraktions- und Bildverlauf festlegen.'
    },
    accessibility: {
      themeOption: 'Thema {{label}}',
      colorThemeOption: 'Farbthema {{label}}',
      historySizeSelect: 'Maximale Verlaufsgröße'
    },
    historySizeOptions: {
      '10': '10 Einträge',
      '30': '30 Einträge',
      '50': '50 Einträge',
      '100': '100 Einträge',
      unlimited: 'Unbegrenzt'
    },
    support: {
      title: 'Support & Feedback',
      cta: 'Problem auf GitHub Melden',
      description: 'Haben Sie einen Fehler gefunden oder haben Sie einen Vorschlag? Lassen Sie es uns wissen!'
    },
    modal: {
      close: 'Einstellungen Schließen'
    }
  }
};
