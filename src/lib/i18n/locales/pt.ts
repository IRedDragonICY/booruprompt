import { en } from './en';
import type { TranslationSchema } from './en';

export const pt: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Extrator de Tags Booru',
    language: 'Idioma',
    english: 'Inglês',
    indonesian: 'Indonésio',
    chinese: 'Chinês',
    languageSwitcher: {
      title: 'Idioma da interface',
      description: 'Salvo no seu navegador. O idioma padrão é o inglês.',
      instantNotice: 'As alterações são aplicadas instantaneamente sem recarregar.',
      searchPlaceholder: 'Pesquisar idiomas...',
      noResults: 'Nenhum idioma encontrado'
    },
    nav: {
      extractor: 'Tags',
      image: 'Imagem',
      booruList: 'Boorus',
      settings: 'Configurações'
    },
    actions: {
      ...en.common.actions,
      add: 'Adicionar',
      apply: 'Aplicar',
      back: 'Voltar',
      cancel: 'Cancelar',
      clear: 'Limpar',
      close: 'Fechar',
      confirm: 'Confirmar',
      copy: 'Copiar',
      copied: 'Copiado!',
      delete: 'Excluir',
      save: 'Salvar',
      search: 'Pesquisar',
      all: 'Tudo',
      none: 'Nenhum'
    }
  },
  settings: {
    title: 'Configurações',
    sections: {
      appearance: 'Aparência',
      colorTheme: 'Tema de Cor',
      dataFetch: 'Método de Obtenção de Dados'
    },
    themeOptions: {
      system: 'Sistema',
      light: 'Claro',
      dark: 'Escuro'
    },
    colorThemes: {
      blue: 'Azul',
      orange: 'Laranja',
      teal: 'Azul-petróleo',
      rose: 'Rosa',
      purple: 'Roxo',
      green: 'Verde',
      custom: 'Cor Personalizada'
    },
    customColor: {
      label: 'Cor Personalizada',
      pickerLabel: 'Seletor de cor personalizada',
      inputLabel: 'Código hexadecimal da cor personalizada',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Proxy do Servidor',
        description: 'Usa o servidor desta aplicação para obter dados. Recomendado, mais confiável.'
      },
      clientProxy: {
        label: 'Proxy do Cliente',
        description: 'Usa um proxy CORS público no seu navegador. Pode ser menos confiável ou limitado.'
      }
    },
    clientProxy: {
      selectLabel: 'Selecionar serviço de proxy do cliente:',
      ariaLabel: 'Seletor de serviço de proxy do cliente',
      helper: 'O desempenho e a confiabilidade variam entre proxies.'
    },
    toggles: {
      autoExtract: {
        label: 'Extração Automática',
        description: 'Extrair tags automaticamente após colar/digitar uma URL válida.',
        tooltip: 'Ativar ou desativar a extração automática de tags ao colar/digitar uma URL válida'
      },
      previews: {
        label: 'Ativar Prévias',
        description: 'Mostrar prévias de imagem/vídeo durante a extração e no histórico.',
        tooltip: 'Ativar ou desativar prévias de imagem/vídeo para economizar largura de banda ou evitar problemas potenciais',
        note: 'As imagens são sempre obtidas através do Proxy do Servidor.'
      },
      saveHistory: {
        label: 'Salvar Histórico',
        description: 'Armazenar extrações bem-sucedidas localmente no seu navegador.',
        tooltip: 'Ativar ou desativar o salvamento do histórico de extrações no armazenamento local do navegador'
      },
      unsupportedSites: {
        label: 'Ativar para Sites Não Suportados',
        description: 'Tentar extrair de sites não suportados usando padrões de sites semelhantes. Pode não funcionar para todos os sites.',
        tooltip: 'Ativar extração para sites não suportados usando padrões de sites semelhantes'
      },
      blacklist: {
        label: 'Ativar Lista Negra de Palavras-Chave',
        description: 'Digite palavras-chave para bloquear, separadas por vírgulas, ponto e vírgula ou quebras de linha.',
        tooltip: 'Bloquear tags indesejadas filtrando palavras-chave específicas',
        placeholder: 'Digite palavras-chave para bloquear…',
        ariaLabel: 'Palavras-chave da lista negra',
        reset: 'Redefinir para Padrão'
      }
    },
    historySize: {
      label: 'Tamanho Máximo do Histórico',
      description: 'Definir o número máximo de entradas para o histórico de extração e imagem.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Tema de cor {{label}}',
      historySizeSelect: 'Tamanho máximo do histórico'
    },
    historySizeOptions: {
      '10': '10 Entradas',
      '30': '30 Entradas',
      '50': '50 Entradas',
      '100': '100 Entradas',
      unlimited: 'Ilimitado'
    },
    support: {
      title: 'Suporte e Feedback',
      cta: 'Relatar um Problema no GitHub',
      description: 'Encontrou um bug ou tem uma sugestão? Nos avise!'
    },
    modal: {
      close: 'Fechar Configurações'
    }
  },
  extractor: {
    header: {
      title: 'Extrator de Tags Booru',
      subtitle: 'Extrair tags de quadros de imagens booru',
      supported: 'Plataformas suportadas:',
      urlLabel: 'URL da Postagem Booru',
      urlPlaceholder: 'Cole a URL da sua postagem booru aqui...',
      manualButton: 'Extrair Manualmente',
      resetButton: 'Redefinir',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Extrator de Tags Booru',
      heroSubtitle: 'Extrair, filtrar e copiar tags de sites booru instantaneamente',
      features: {
        smart: { title: 'Inteligente', subtitle: 'Auto-extração' },
        fast: { title: 'Rápido', subtitle: 'Resultados instantâneos' },
        private: { title: 'Privado', subtitle: 'No cliente' },
        copy: { title: 'Copiar', subtitle: 'Um clique' }
      },
      cta: {
        paste: 'Colar',
        extract: 'Extrair',
        filter: 'Filtrar',
        copy: 'Copiar'
      },
      supportNotice: 'Suporta Danbooru, Gelbooru, Safebooru, Rule34, e621 e mais'
    },
    preview: {
      title: 'Prévia'
    },
    status: {
      resultLabel: 'Resultado para:'
    },
    categories: {
      title: 'Filtrar Categorias',
      enableAll: 'Tudo',
      disableAll: 'Nenhum',
      items: {
        copyright: 'Copyright',
        character: 'Personagem',
        general: 'Geral',
        meta: 'Meta',
        other: 'Outro'
      },
      count_one: '{{count}} tag',
      count_other: '{{count}} tags'
    },
    filteredTags: {
      label: 'Tags Filtradas',
      ariaLabel: 'Tags filtradas',
      empty: 'Nenhuma tag para exibir.',
      copy: 'Copiar Tags',
      copied: 'Copiado!'
    },
    history: {
      extractionTitle: 'Histórico de Extração',
      imageTitle: 'Histórico de Imagens',
      searchExtraction: 'Pesquisar título, url, tags...',
      searchImages: 'Pesquisar nome do arquivo, prompts, parâmetros...',
      emptySearch: 'Nenhuma entrada corresponde à sua pesquisa.',
      clearTooltip: 'Limpar Todo o Histórico',
      clearAction: 'Limpar Histórico',
      confirmMessage: 'Realmente limpar?',
      confirmYes: 'Sim, Limpar',
      confirmCancel: 'Cancelar',
      searchAriaLabel: 'Pesquisar {{context}}',
      searchFallback: 'histórico',
      clearSearchTooltip: 'Limpar Pesquisa',
      clearSearchAria: 'Limpar pesquisa'
    },
    mobile: {
      historyButton: 'Histórico',
      urlLabel: 'URL da Postagem Booru',
      urlPlaceholder: 'Cole a URL ou Arraste e Solte...',
      manualButton: 'Extrair Manualmente',
      resetButton: 'Redefinir'
    }
  },
  imageTool: {
    title: 'Metadados da Imagem',
    dropCtaTitle: 'Arraste e Solte PNG Aqui',
    dropCtaSubtitle: 'ou clique para carregar',
    selectButton: 'Selecionar PNG',
    statusProcessing: 'Processando...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'Prompt Positivo',
    negativePrompt: 'Prompt Negativo',
    parameters: 'Parâmetros',
    copy: 'Copiar',
    copyAll: 'Copiar Tudo',
    copySuccess: 'Copiado!',
    noMetadata: 'Nenhum metadado de geração encontrado.',
    loadMetadata: 'Carregar Metadados',
    deleteEntry: 'Excluir Entrada',
    historyTitle: 'Histórico de Imagens',
    historySearch: 'Pesquisar nome do arquivo, prompts, parâmetros...',
    previewAlt: 'Prévia',
    footer: {
      metadataNotice: 'Extração de metadados PNG para bloco de texto "parameters".'
    }
  },
  historyItem: {
    load: 'Carregar esta entrada do histórico',
    delete: 'Excluir esta entrada do histórico',
    previewAlt: 'Prévia'
  },
  imagePreview: {
    loading: 'Carregando prévia...',
    error: 'Não foi possível carregar a prévia.',
    errorDetail: 'Erro de proxy do servidor ou imagem inválida',
    videoUnsupported: 'Seu navegador não suporta vídeo.',
    openFull: 'Abrir prévia em tamanho real',
    close: 'Fechar',
    reset: 'Redefinir',
    openOriginal: 'Abrir original'
  },
  booruList: {
    pageTitle: 'Classificação dos Melhores Boorus',
    pageDescriptionShort: 'Explore os melhores sites booru classificados por total de imagens e atividade.',
    pageDescriptionLong: 'Descubra os sites booru mais populares da web. Classificados por total de imagens, número de membros e atividade com dados do Booru.org.',
    searchPlaceholder: 'Pesquisar sites booru...',
    filter: {
      all: 'Tudo',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Imagens',
      members: 'Membros',
      owner: 'Proprietário'
    },
    sort: {
      label: 'Ordenar por:',
      rank: 'Classificação (Top)',
      images: 'Contagem de Imagens',
      members: 'Contagem de Membros',
      asc: 'Asc',
      desc: 'Desc'
    },
    itemsPerPage: 'Por página:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> de {{total}}',
    pagination: {
      previous: 'Anterior',
      next: 'Próximo',
      previousShort: 'Ant',
      nextShort: 'Prox'
    },
    emptyState: 'Nenhum site booru encontrado',
    loading: 'Carregando dados booru...',
    errorTitle: 'Erro ao Carregar Dados',
    errors: {
      fetchFailed: 'Falha ao obter dados booru.',
      unknown: 'Algo deu errado ao carregar a classificação.'
    },
    ownerLabel: 'Proprietário:',
    visit: 'Visitar {{name}}'
  },
  booruDetail: {
    backButton: 'Voltar à Lista de Boorus',
    notFoundTitle: 'Booru Não Encontrado',
    notFoundDescription: 'O domínio booru "{{domain}}" não foi encontrado em nosso banco de dados.',
    statistics: 'Estatísticas',
    totalImages: 'Total de Imagens',
    totalMembers: 'Total de Membros',
    shortName: 'Nome Curto',
    owner: 'Proprietário',
    hosted: 'Hospedado por booru.org',
    protocol: 'Protocolo',
    yes: 'Sim',
    no: 'Não',
    visit: 'Visitar {{name}}',
    loading: 'Carregando...'
  }
};
