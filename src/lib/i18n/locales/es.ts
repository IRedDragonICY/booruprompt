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
    ...en.settings
  }
};
