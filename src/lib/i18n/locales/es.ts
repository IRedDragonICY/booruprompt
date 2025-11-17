import { en } from './en';
import type { TranslationSchema } from './en';

export const es: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Extractor de Etiquetas Booru',
    language: 'Idioma',
    english: 'Inglés',
    indonesian: 'Indonesio',
    chinese: 'Chino',
    languageSwitcher: {
      title: 'Idioma de la interfaz',
      description: 'Guardado en tu navegador. El idioma predeterminado es inglés.',
      instantNotice: 'Los cambios se aplican instantáneamente sin recargar.',
      searchPlaceholder: 'Buscar idiomas...',
      noResults: 'No se encontraron idiomas'
    },
    nav: {
      extractor: 'Etiquetas',
      image: 'Imagen',
      booruList: 'Boorus',
      settings: 'Configuración'
    },
    actions: {
      ...en.common.actions,
      add: 'Añadir',
      apply: 'Aplicar',
      back: 'Atrás',
      cancel: 'Cancelar',
      clear: 'Limpiar',
      close: 'Cerrar',
      confirm: 'Confirmar',
      copy: 'Copiar',
      copied: '¡Copiado!',
      delete: 'Eliminar',
      save: 'Guardar',
      search: 'Buscar',
      all: 'Todo',
      none: 'Ninguno'
    }
  },
  settings: {
    title: 'Configuración',
    sections: {
      appearance: 'Apariencia',
      colorTheme: 'Tema de Color',
      dataFetch: 'Método de Obtención de Datos'
    },
    themeOptions: {
      system: 'Sistema',
      light: 'Claro',
      dark: 'Oscuro'
    },
    colorThemes: {
      blue: 'Azul',
      orange: 'Naranja',
      teal: 'Verde azulado',
      rose: 'Rosa',
      purple: 'Morado',
      green: 'Verde',
      custom: 'Color Personalizado'
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
