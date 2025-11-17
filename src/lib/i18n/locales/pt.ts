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
    ...en.settings
  }
};
