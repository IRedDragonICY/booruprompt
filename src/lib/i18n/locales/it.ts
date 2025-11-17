import { en } from './en';
import type { TranslationSchema } from './en';

export const it: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Estrattore di Tag Booru',
    language: 'Lingua',
    english: 'Inglese',
    indonesian: 'Indonesiano',
    chinese: 'Cinese',
    languageSwitcher: {
      title: 'Lingua dell\'interfaccia',
      description: 'Salvata nel tuo browser. La lingua predefinita è l\'inglese.',
      instantNotice: 'Le modifiche si applicano istantaneamente senza ricaricare.',
      searchPlaceholder: 'Cerca lingue...',
      noResults: 'Nessuna lingua trovata'
    },
    nav: {
      extractor: 'Tag',
      image: 'Immagine',
      booruList: 'Boorus',
      settings: 'Impostazioni'
    },
    actions: {
      ...en.common.actions,
      add: 'Aggiungi',
      apply: 'Applica',
      back: 'Indietro',
      cancel: 'Annulla',
      clear: 'Cancella',
      close: 'Chiudi',
      confirm: 'Conferma',
      copy: 'Copia',
      copied: 'Copiato!',
      delete: 'Elimina',
      save: 'Salva',
      search: 'Cerca',
      all: 'Tutto',
      none: 'Nessuno'
    }
  },
  settings: {
    title: 'Impostazioni',
    sections: {
      appearance: 'Aspetto',
      colorTheme: 'Tema Colore',
      dataFetch: 'Metodo di Recupero Dati'
    },
    themeOptions: {
      system: 'Sistema',
      light: 'Chiaro',
      dark: 'Scuro'
    },
    colorThemes: {
      blue: 'Blu',
      orange: 'Arancione',
      teal: 'Turchese',
      rose: 'Rosa',
      purple: 'Viola',
      green: 'Verde',
      custom: 'Colore Personalizzato'
    },
    customColor: {
      label: 'Colore Personalizzato',
      pickerLabel: 'Selettore colore personalizzato',
      inputLabel: 'Codice esadecimale colore personalizzato',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Proxy Server',
        description: 'Utilizza il server di questa applicazione per recuperare i dati. Consigliato, più affidabile.'
      },
      clientProxy: {
        label: 'Proxy Lato Client',
        description: 'Utilizza un proxy CORS pubblico nel tuo browser. Può essere meno affidabile o limitato.'
      }
    },
    clientProxy: {
      selectLabel: 'Seleziona servizio proxy client:',
      ariaLabel: 'Selettore servizio proxy client',
      helper: 'Prestazioni e affidabilità variano tra i proxy.'
    },
    toggles: {
      autoExtract: {
        label: 'Estrazione Automatica',
        description: 'Estrae i tag automaticamente dopo aver incollato/digitato un URL valido.',
        tooltip: 'Abilita o disabilita l\'estrazione automatica dei tag quando si incolla/digita un URL valido'
      },
      previews: {
        label: 'Abilita Anteprime',
        description: 'Mostra anteprime di immagini/video durante l\'estrazione e nella cronologia.',
        tooltip: 'Abilita o disabilita le anteprime di immagini/video per risparmiare banda o evitare problemi potenziali',
        note: 'Le immagini vengono sempre recuperate tramite il Proxy Server.'
      },
      saveHistory: {
        label: 'Salva Cronologia',
        description: 'Memorizza le estrazioni riuscite localmente nel tuo browser.',
        tooltip: 'Abilita o disabilita il salvataggio della cronologia delle estrazioni nello storage locale del browser'
      },
      unsupportedSites: {
        label: 'Abilita per Siti Non Supportati',
        description: 'Prova ad estrarre da siti non supportati usando schemi di siti simili. Potrebbe non funzionare per tutti i siti.',
        tooltip: 'Abilita l\'estrazione per siti web non supportati usando schemi di siti simili'
      },
      blacklist: {
        label: 'Abilita Lista Nera Parole Chiave',
        description: 'Inserisci le parole chiave da bloccare, separate da virgole, punto e virgola o a capo.',
        tooltip: 'Blocca tag indesiderati filtrando parole chiave specifiche',
        placeholder: 'Inserisci parole chiave da bloccare…',
        ariaLabel: 'Parole chiave lista nera',
        reset: 'Ripristina Predefinito'
      }
    },
    historySize: {
      label: 'Dimensione Massima Cronologia',
      description: 'Imposta il numero massimo di voci per la cronologia di estrazione e immagini.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Tema colore {{label}}',
      historySizeSelect: 'Dimensione massima cronologia'
    },
    historySizeOptions: {
      '10': '10 Voci',
      '30': '30 Voci',
      '50': '50 Voci',
      '100': '100 Voci',
      unlimited: 'Illimitato'
    },
    support: {
      title: 'Supporto e Feedback',
      cta: 'Segnala un Problema su GitHub',
      description: 'Hai trovato un bug o hai un suggerimento? Faccelo sapere!'
    },
    modal: {
      close: 'Chiudi Impostazioni'
    }
  },
  extractor: {
    header: {
      title: 'Estrattore di Tag Booru',
      subtitle: 'Estrai tag dalle bacheche di immagini booru',
      supported: 'Piattaforme supportate:',
      urlLabel: 'URL Post Booru',
      urlPlaceholder: 'Incolla qui l\'URL del tuo post booru...',
      manualButton: 'Estrai Manualmente',
      resetButton: 'Ripristina',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Estrattore di Tag Booru',
      heroSubtitle: 'Estrai, filtra e copia i tag dai siti booru istantaneamente',
      features: {
        smart: { title: 'Intelligente', subtitle: 'Auto-estrazione' },
        fast: { title: 'Veloce', subtitle: 'Risultati istantanei' },
        private: { title: 'Privato', subtitle: 'Lato client' },
        copy: { title: 'Copia', subtitle: 'Un clic' }
      },
      cta: {
        paste: 'Incolla',
        extract: 'Estrai',
        filter: 'Filtra',
        copy: 'Copia'
      },
      supportNotice: 'Supporta Danbooru, Gelbooru, Safebooru, Rule34, e621 e altro'
    },
    preview: {
      title: 'Anteprima'
    },
    status: {
      resultLabel: 'Risultato per:'
    },
    categories: {
      title: 'Filtra Categorie',
      enableAll: 'Tutto',
      disableAll: 'Nessuno',
      items: {
        copyright: 'Copyright',
        character: 'Personaggio',
        general: 'Generale',
        meta: 'Meta',
        other: 'Altro'
      },
      count_one: '{{count}} tag',
      count_other: '{{count}} tag'
    },
    filteredTags: {
      label: 'Tag Filtrati',
      ariaLabel: 'Tag filtrati',
      empty: 'Nessun tag da visualizzare.',
      copy: 'Copia Tag',
      copied: 'Copiato!'
    },
    history: {
      extractionTitle: 'Cronologia Estrazione',
      imageTitle: 'Cronologia Immagini',
      searchExtraction: 'Cerca titolo, url, tag...',
      searchImages: 'Cerca nome file, prompt, parametri...',
      emptySearch: 'Nessuna voce corrisponde alla tua ricerca.',
      clearTooltip: 'Cancella Tutta la Cronologia',
      clearAction: 'Cancella Cronologia',
      confirmMessage: 'Cancellare davvero?',
      confirmYes: 'Sì, Cancella',
      confirmCancel: 'Annulla',
      searchAriaLabel: 'Cerca {{context}}',
      searchFallback: 'cronologia',
      clearSearchTooltip: 'Cancella Ricerca',
      clearSearchAria: 'Cancella ricerca'
    },
    mobile: {
      historyButton: 'Cronologia',
      urlLabel: 'URL Post Booru',
      urlPlaceholder: 'Incolla URL o Trascina e Rilascia...',
      manualButton: 'Estrai Manualmente',
      resetButton: 'Ripristina'
    }
  },
  imageTool: {
    title: 'Metadati Immagine',
    dropCtaTitle: 'Trascina e Rilascia PNG Qui',
    dropCtaSubtitle: 'o clicca per caricare',
    selectButton: 'Seleziona PNG',
    statusProcessing: 'Elaborazione...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'Prompt Positivo',
    negativePrompt: 'Prompt Negativo',
    parameters: 'Parametri',
    copy: 'Copia',
    copyAll: 'Copia Tutto',
    copySuccess: 'Copiato!',
    noMetadata: 'Nessun metadato di generazione trovato.',
    loadMetadata: 'Carica Metadati',
    deleteEntry: 'Elimina Voce',
    historyTitle: 'Cronologia Immagini',
    historySearch: 'Cerca nome file, prompt, parametri...',
    previewAlt: 'Anteprima',
    footer: {
      metadataNotice: 'Estrazione metadati PNG per blocco di testo "parameters".'
    }
  },
  historyItem: {
    load: 'Carica questa voce della cronologia',
    delete: 'Elimina questa voce della cronologia',
    previewAlt: 'Anteprima'
  },
  imagePreview: {
    loading: 'Caricamento anteprima...',
    error: 'Impossibile caricare l\'anteprima.',
    errorDetail: 'Errore proxy server o immagine non valida',
    videoUnsupported: 'Il tuo browser non supporta i video.',
    openFull: 'Apri anteprima a grandezza naturale',
    close: 'Chiudi',
    reset: 'Ripristina',
    openOriginal: 'Apri originale'
  },
  booruList: {
    pageTitle: 'Classifica Top Booru',
    pageDescriptionShort: 'Esplora i migliori siti booru classificati per immagini totali e attività.',
    pageDescriptionLong: 'Scopri i siti booru più popolari del web. Classificati per immagini totali, numero di membri e attività con dati da Booru.org.',
    searchPlaceholder: 'Cerca siti booru...',
    filter: {
      all: 'Tutto',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Immagini',
      members: 'Membri',
      owner: 'Proprietario'
    },
    sort: {
      label: 'Ordina per:',
      rank: 'Classifica (Top)',
      images: 'Numero Immagini',
      members: 'Numero Membri',
      asc: 'Cresc',
      desc: 'Decresc'
    },
    itemsPerPage: 'Per pagina:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> di {{total}}',
    pagination: {
      previous: 'Precedente',
      next: 'Successivo',
      previousShort: 'Prec',
      nextShort: 'Succ'
    },
    emptyState: 'Nessun sito booru trovato',
    loading: 'Caricamento dati booru...',
    errorTitle: 'Errore Caricamento Dati',
    errors: {
      fetchFailed: 'Recupero dati booru fallito.',
      unknown: 'Si è verificato un errore durante il caricamento della classifica.'
    },
    ownerLabel: 'Proprietario:',
    visit: 'Visita {{name}}'
  },
  booruDetail: {
    backButton: 'Torna alla Lista Booru',
    notFoundTitle: 'Booru Non Trovato',
    notFoundDescription: 'Il dominio booru "{{domain}}" non è stato trovato nel nostro database.',
    statistics: 'Statistiche',
    totalImages: 'Immagini Totali',
    totalMembers: 'Membri Totali',
    shortName: 'Nome Breve',
    owner: 'Proprietario',
    hosted: 'Ospitato da booru.org',
    protocol: 'Protocollo',
    yes: 'Sì',
    no: 'No',
    visit: 'Visita {{name}}',
    loading: 'Caricamento...'
  }
};
