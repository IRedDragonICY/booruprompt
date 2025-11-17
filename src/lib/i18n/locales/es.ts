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
      label: 'Color Personalizado',
      pickerLabel: 'Selector de color personalizado',
      inputLabel: 'Código hexadecimal del color personalizado',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Proxy del Servidor',
        description: 'Usa el servidor de esta aplicación para obtener datos. Recomendado, más confiable.'
      },
      clientProxy: {
        label: 'Proxy del Cliente',
        description: 'Usa un proxy CORS público en tu navegador. Puede ser menos confiable o limitado.'
      }
    },
    clientProxy: {
      selectLabel: 'Seleccionar servicio de proxy del cliente:',
      ariaLabel: 'Selector de servicio de proxy del cliente',
      helper: 'El rendimiento y la confiabilidad varían entre proxies.'
    },
    toggles: {
      autoExtract: {
        label: 'Extracción Automática',
        description: 'Extrae etiquetas automáticamente después de pegar/escribir una URL válida.',
        tooltip: 'Activar o desactivar la extracción automática de etiquetas al pegar/escribir una URL válida'
      },
      previews: {
        label: 'Activar Vistas Previas',
        description: 'Mostrar vistas previas de imagen/video durante la extracción y en el historial.',
        tooltip: 'Activar o desactivar las vistas previas de imagen/video para ahorrar ancho de banda o evitar problemas potenciales',
        note: 'Las imágenes siempre se obtienen a través del Proxy del Servidor.'
      },
      saveHistory: {
        label: 'Guardar Historial',
        description: 'Almacenar extracciones exitosas localmente en tu navegador.',
        tooltip: 'Activar o desactivar el guardado del historial de extracciones en el almacenamiento local del navegador'
      },
      unsupportedSites: {
        label: 'Activar para Sitios No Compatibles',
        description: 'Intentar extraer de sitios no compatibles usando patrones de sitios similares. Puede no funcionar para todos los sitios.',
        tooltip: 'Activar extracción para sitios web no compatibles usando patrones de sitios similares'
      },
      blacklist: {
        label: 'Activar Lista Negra de Palabras Clave',
        description: 'Ingresa palabras clave para bloquear, separadas por comas, punto y coma o líneas nuevas.',
        tooltip: 'Bloquear etiquetas no deseadas filtrando palabras clave específicas',
        placeholder: 'Ingresa palabras clave para bloquear…',
        ariaLabel: 'Palabras clave de la lista negra',
        reset: 'Restablecer a Predeterminado'
      }
    },
    historySize: {
      label: 'Tamaño Máximo del Historial',
      description: 'Establece el número máximo de entradas para el historial de extracción e imagen.'
    },
    accessibility: {
      themeOption: 'Tema {{label}}',
      colorThemeOption: 'Tema de color {{label}}',
      historySizeSelect: 'Tamaño máximo del historial'
    },
    historySizeOptions: {
      '10': '10 Entradas',
      '30': '30 Entradas',
      '50': '50 Entradas',
      '100': '100 Entradas',
      unlimited: 'Ilimitado'
    },
    support: {
      title: 'Soporte y Comentarios',
      cta: 'Informar un Problema en GitHub',
      description: '¿Encontraste un error o tienes una sugerencia? ¡Háznoslo saber!'
    },
    modal: {
      close: 'Cerrar Configuración'
    }
  }
};
