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
      ...en.settings.customColor
    },
    fetchModes: {
      ...en.settings.fetchModes
    },
    clientProxy: {
      ...en.settings.clientProxy
    },
    toggles: {
      ...en.settings.toggles
    },
    historySize: {
      ...en.settings.historySize
    },
    accessibility: {
      ...en.settings.accessibility
    },
    historySizeOptions: {
      ...en.settings.historySizeOptions
    },
    support: {
      ...en.settings.support
    },
    modal: {
      ...en.settings.modal
    }
  }
};
