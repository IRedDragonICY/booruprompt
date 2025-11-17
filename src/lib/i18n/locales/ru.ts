import { en } from './en';
import type { TranslationSchema } from './en';

export const ru: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Извлечение Тегов Booru',
    language: 'Язык',
    english: 'Английский',
    indonesian: 'Индонезийский',
    chinese: 'Китайский',
    languageSwitcher: {
      title: 'Язык интерфейса',
      description: 'Сохраняется в вашем браузере. Язык по умолчанию - английский.',
      instantNotice: 'Изменения применяются мгновенно без перезагрузки.',
      searchPlaceholder: 'Поиск языков...',
      noResults: 'Языки не найдены'
    },
    nav: {
      extractor: 'Теги',
      image: 'Изображение',
      booruList: 'Booru',
      settings: 'Настройки'
    },
    actions: {
      ...en.common.actions,
      add: 'Добавить',
      apply: 'Применить',
      back: 'Назад',
      cancel: 'Отмена',
      clear: 'Очистить',
      close: 'Закрыть',
      confirm: 'Подтвердить',
      copy: 'Копировать',
      copied: 'Скопировано!',
      delete: 'Удалить',
      save: 'Сохранить',
      search: 'Поиск',
      all: 'Все',
      none: 'Нет'
    }
  },
  settings: {
    title: 'Настройки',
    sections: {
      appearance: 'Внешний вид',
      colorTheme: 'Цветовая тема',
      dataFetch: 'Метод получения данных'
    },
    themeOptions: {
      system: 'Системная',
      light: 'Светлая',
      dark: 'Тёмная'
    },
    colorThemes: {
      blue: 'Синий',
      orange: 'Оранжевый',
      teal: 'Бирюзовый',
      rose: 'Розовый',
      purple: 'Фиолетовый',
      green: 'Зелёный',
      custom: 'Пользовательский цвет'
    },
    customColor: {
      label: 'Пользовательский цвет',
      pickerLabel: 'Выбор пользовательского цвета',
      inputLabel: 'Hex-код пользовательского цвета',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Серверный прокси',
        description: 'Использует сервер этого приложения для получения данных. Рекомендуется, более надёжно.'
      },
      clientProxy: {
        label: 'Клиентский прокси',
        description: 'Использует публичный CORS-прокси в вашем браузере. Может быть менее надёжным или ограниченным по скорости.'
      }
    },
    clientProxy: {
      selectLabel: 'Выберите службу клиентского прокси:',
      ariaLabel: 'Выбор службы клиентского прокси',
      helper: 'Производительность и надёжность различаются между прокси.'
    },
    toggles: {
      autoExtract: {
        label: 'Автоматическое извлечение',
        description: 'Автоматически извлекать теги после вставки/ввода действительного URL.',
        tooltip: 'Включить или отключить автоматическое извлечение тегов при вставке/вводе действительного URL'
      },
      previews: {
        label: 'Включить предпросмотр',
        description: 'Показывать предпросмотр изображений/видео во время извлечения и в истории.',
        tooltip: 'Включить или отключить предпросмотр изображений/видео для экономии трафика или избежания потенциальных проблем',
        note: 'Изображения всегда загружаются через серверный прокси.'
      },
      saveHistory: {
        label: 'Сохранять историю',
        description: 'Сохранять успешные извлечения локально в вашем браузере.',
        tooltip: 'Включить или отключить сохранение истории извлечений в локальное хранилище браузера'
      },
      unsupportedSites: {
        label: 'Включить для неподдерживаемых сайтов',
        description: 'Попытаться извлечь с неподдерживаемых сайтов, используя шаблоны похожих сайтов. Может не работать для всех сайтов.',
        tooltip: 'Включить извлечение для неподдерживаемых веб-сайтов с использованием шаблонов похожих сайтов'
      },
      blacklist: {
        label: 'Включить чёрный список ключевых слов',
        description: 'Введите ключевые слова для блокировки через запятую, точку с запятой или с новой строки.',
        tooltip: 'Блокировать нежелательные теги путём фильтрации определённых ключевых слов',
        placeholder: 'Введите ключевые слова для блокировки…',
        ariaLabel: 'Ключевые слова чёрного списка',
        reset: 'Сбросить по умолчанию'
      }
    },
    historySize: {
      label: 'Максимальный размер истории',
      description: 'Установите максимальное количество записей для истории извлечений и изображений.'
    },
    accessibility: {
      themeOption: 'Тема {{label}}',
      colorThemeOption: 'Цветовая тема {{label}}',
      historySizeSelect: 'Максимальный размер истории'
    },
    historySizeOptions: {
      '10': '10 записей',
      '30': '30 записей',
      '50': '50 записей',
      '100': '100 записей',
      unlimited: 'Неограниченно'
    },
    support: {
      title: 'Поддержка и обратная связь',
      cta: 'Сообщить о проблеме на GitHub',
      description: 'Нашли ошибку или есть предложение? Дайте нам знать!'
    },
    modal: {
      close: 'Закрыть настройки'
    }
  },
  extractor: {
    header: {
      title: 'Извлечение тегов Booru',
      subtitle: 'Извлечение тегов с имиджбордов booru',
      supported: 'Поддерживаемые платформы:',
      urlLabel: 'URL поста Booru',
      urlPlaceholder: 'Вставьте URL вашего поста booru сюда...',
      manualButton: 'Извлечь вручную',
      resetButton: 'Сбросить',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Извлечение тегов Booru',
      heroSubtitle: 'Извлекайте, фильтруйте и копируйте теги с сайтов booru мгновенно',
      features: {
        smart: { title: 'Умно', subtitle: 'Авто-извлечение' },
        fast: { title: 'Быстро', subtitle: 'Мгновенные результаты' },
        private: { title: 'Приватно', subtitle: 'На стороне клиента' },
        copy: { title: 'Копировать', subtitle: 'Один клик' }
      },
      cta: {
        paste: 'Вставить',
        extract: 'Извлечь',
        filter: 'Фильтровать',
        copy: 'Копировать'
      },
      supportNotice: 'Поддерживает Danbooru, Gelbooru, Safebooru, Rule34, e621 и другие'
    },
    preview: {
      title: 'Предпросмотр'
    },
    status: {
      resultLabel: 'Результат для:'
    },
    categories: {
      title: 'Фильтр категорий',
      enableAll: 'Все',
      disableAll: 'Нет',
      items: {
        copyright: 'Авторские права',
        character: 'Персонаж',
        general: 'Общее',
        meta: 'Мета',
        other: 'Другое'
      },
      count_one: '{{count}} тег',
      count_other: '{{count}} тегов'
    },
    filteredTags: {
      label: 'Отфильтрованные теги',
      ariaLabel: 'Отфильтрованные теги',
      empty: 'Нет тегов для отображения.',
      copy: 'Копировать теги',
      copied: 'Скопировано!'
    },
    history: {
      extractionTitle: 'История извлечений',
      imageTitle: 'История изображений',
      searchExtraction: 'Поиск по названию, url, тегам...',
      searchImages: 'Поиск по имени файла, промптам, параметрам...',
      emptySearch: 'Нет записей, соответствующих вашему поиску.',
      clearTooltip: 'Очистить всю историю',
      clearAction: 'Очистить историю',
      confirmMessage: 'Действительно очистить?',
      confirmYes: 'Да, очистить',
      confirmCancel: 'Отмена',
      searchAriaLabel: 'Поиск {{context}}',
      searchFallback: 'история',
      clearSearchTooltip: 'Очистить поиск',
      clearSearchAria: 'Очистить поиск'
    },
    mobile: {
      historyButton: 'История',
      urlLabel: 'URL поста Booru',
      urlPlaceholder: 'Вставьте URL или перетащите...',
      manualButton: 'Извлечь вручную',
      resetButton: 'Сбросить'
    }
  },
  imageTool: {
    title: 'Метаданные изображения',
    dropCtaTitle: 'Перетащите PNG сюда',
    dropCtaSubtitle: 'или нажмите для загрузки',
    selectButton: 'Выбрать PNG',
    statusProcessing: 'Обработка...',
    previewMeta: '{{name}} ({{size}} КБ)',
    positivePrompt: 'Позитивный промпт',
    negativePrompt: 'Негативный промпт',
    parameters: 'Параметры',
    copy: 'Копировать',
    copyAll: 'Копировать всё',
    copySuccess: 'Скопировано!',
    noMetadata: 'Метаданные генерации не найдены.',
    loadMetadata: 'Загрузить метаданные',
    deleteEntry: 'Удалить запись',
    historyTitle: 'История изображений',
    historySearch: 'Поиск по имени файла, промптам, параметрам...',
    previewAlt: 'Предпросмотр',
    footer: {
      metadataNotice: 'Извлечение метаданных PNG для текстового блока "parameters".'
    }
  },
  historyItem: {
    load: 'Загрузить эту запись истории',
    delete: 'Удалить эту запись истории',
    previewAlt: 'Предпросмотр'
  },
  imagePreview: {
    loading: 'Загрузка предпросмотра...',
    error: 'Не удалось загрузить предпросмотр.',
    errorDetail: 'Ошибка серверного прокси или недействительное изображение',
    videoUnsupported: 'Ваш браузер не поддерживает видео.',
    openFull: 'Открыть предпросмотр в полном размере',
    close: 'Закрыть',
    reset: 'Сбросить',
    openOriginal: 'Открыть оригинал'
  },
  booruList: {
    pageTitle: 'Топ рейтинг Booru',
    pageDescriptionShort: 'Исследуйте лучшие сайты booru, отсортированные по общему количеству изображений и активности.',
    pageDescriptionLong: 'Откройте для себя самые популярные сайты booru в сети. Ранжированы по общему количеству изображений, количеству участников и активности с данными от Booru.org.',
    searchPlaceholder: 'Поиск сайтов booru...',
    filter: {
      all: 'Все',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Изображения',
      members: 'Участники',
      owner: 'Владелец'
    },
    sort: {
      label: 'Сортировка:',
      rank: 'Рейтинг (Топ)',
      images: 'Количество изображений',
      members: 'Количество участников',
      asc: 'По возр.',
      desc: 'По убыв.'
    },
    itemsPerPage: 'На страницу:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> из {{total}}',
    pagination: {
      previous: 'Предыдущая',
      next: 'Следующая',
      previousShort: 'Пред',
      nextShort: 'След'
    },
    emptyState: 'Сайты booru не найдены',
    loading: 'Загрузка данных booru...',
    errorTitle: 'Ошибка загрузки данных',
    errors: {
      fetchFailed: 'Не удалось получить данные booru.',
      unknown: 'Что-то пошло не так при загрузке рейтинга.'
    },
    ownerLabel: 'Владелец:',
    visit: 'Посетить {{name}}'
  },
  booruDetail: {
    backButton: 'Вернуться к списку Booru',
    notFoundTitle: 'Booru не найден',
    notFoundDescription: 'Домен booru "{{domain}}" не найден в нашей базе данных.',
    statistics: 'Статистика',
    totalImages: 'Всего изображений',
    totalMembers: 'Всего участников',
    shortName: 'Краткое название',
    owner: 'Владелец',
    hosted: 'Размещено на booru.org',
    protocol: 'Протокол',
    yes: 'Да',
    no: 'Нет',
    visit: 'Посетить {{name}}',
    loading: 'Загрузка...'
  }
};
