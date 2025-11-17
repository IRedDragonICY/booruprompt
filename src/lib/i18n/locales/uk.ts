import { en } from './en';
import type { TranslationSchema } from './en';

export const uk: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Вилучення Тегів Booru',
    language: 'Мова',
    english: 'Англійська',
    indonesian: 'Індонезійська',
    chinese: 'Китайська',
    languageSwitcher: {
      title: 'Мова інтерфейсу',
      description: 'Зберігається у вашому браузері. Мова за замовчуванням - англійська.',
      instantNotice: 'Зміни застосовуються миттєво без перезавантаження.',
      searchPlaceholder: 'Пошук мов...',
      noResults: 'Мови не знайдено'
    },
    nav: {
      extractor: 'Теги',
      image: 'Зображення',
      booruList: 'Booru',
      settings: 'Налаштування'
    },
    actions: {
      ...en.common.actions,
      add: 'Додати',
      apply: 'Застосувати',
      back: 'Назад',
      cancel: 'Скасувати',
      clear: 'Очистити',
      close: 'Закрити',
      confirm: 'Підтвердити',
      copy: 'Копіювати',
      copied: 'Скопійовано!',
      delete: 'Видалити',
      save: 'Зберегти',
      search: 'Пошук',
      all: 'Усе',
      none: 'Нічого'
    }
  },
  settings: {
    title: 'Налаштування',
    sections: {
      appearance: 'Зовнішній вигляд',
      colorTheme: 'Кольорова тема',
      dataFetch: 'Метод отримання даних'
    },
    themeOptions: {
      system: 'Системна',
      light: 'Світла',
      dark: 'Темна'
    },
    colorThemes: {
      blue: 'Синій',
      orange: 'Помаранчевий',
      teal: 'Бірюзовий',
      rose: 'Рожевий',
      purple: 'Фіолетовий',
      green: 'Зелений',
      custom: 'Користувацький колір'
    },
    customColor: {
      label: 'Користувацький колір',
      pickerLabel: 'Вибір користувацького кольору',
      inputLabel: 'Hex-код користувацького кольору',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Серверний проксі',
        description: 'Використовує сервер цього додатку для отримання даних. Рекомендовано, надійніше.'
      },
      clientProxy: {
        label: 'Клієнтський проксі',
        description: 'Використовує публічний CORS-проксі у вашому браузері. Може бути менш надійним або обмеженим за швидкістю.'
      }
    },
    clientProxy: {
      selectLabel: 'Виберіть службу клієнтського проксі:',
      ariaLabel: 'Вибір служби клієнтського проксі',
      helper: 'Продуктивність та надійність відрізняються між проксі.'
    },
    toggles: {
      autoExtract: {
        label: 'Автоматичне вилучення',
        description: 'Автоматично вилучати теги після вставки/введення дійсного URL.',
        tooltip: 'Увімкнути або вимкнути автоматичне вилучення тегів при вставці/введенні дійсного URL'
      },
      previews: {
        label: 'Увімкнути попередній перегляд',
        description: 'Показувати попередній перегляд зображень/відео під час вилучення та в історії.',
        tooltip: 'Увімкнути або вимкнути попередній перегляд зображень/відео для економії трафіку або уникнення потенційних проблем',
        note: 'Зображення завжди завантажуються через серверний проксі.'
      },
      saveHistory: {
        label: 'Зберігати історію',
        description: 'Зберігати успішні вилучення локально у вашому браузері.',
        tooltip: 'Увімкнути або вимкнути збереження історії вилучень в локальне сховище браузера'
      },
      unsupportedSites: {
        label: 'Увімкнути для непідтримуваних сайтів',
        description: 'Спробувати вилучити з непідтримуваних сайтів, використовуючи шаблони схожих сайтів. Може не працювати для всіх сайтів.',
        tooltip: 'Увімкнути вилучення для непідтримуваних веб-сайтів з використанням шаблонів схожих сайтів'
      },
      blacklist: {
        label: 'Увімкнути чорний список ключових слів',
        description: 'Введіть ключові слова для блокування через кому, крапку з комою або з нового рядка.',
        tooltip: 'Блокувати небажані теги шляхом фільтрації певних ключових слів',
        placeholder: 'Введіть ключові слова для блокування…',
        ariaLabel: 'Ключові слова чорного списку',
        reset: 'Скинути за замовчуванням'
      }
    },
    historySize: {
      label: 'Максимальний розмір історії',
      description: 'Встановіть максимальну кількість записів для історії вилучень та зображень.'
    },
    accessibility: {
      themeOption: 'Тема {{label}}',
      colorThemeOption: 'Кольорова тема {{label}}',
      historySizeSelect: 'Максимальний розмір історії'
    },
    historySizeOptions: {
      '10': '10 записів',
      '30': '30 записів',
      '50': '50 записів',
      '100': '100 записів',
      unlimited: 'Необмежено'
    },
    support: {
      title: 'Підтримка та зворотний зв\'язок',
      cta: 'Повідомити про проблему на GitHub',
      description: 'Знайшли помилку чи маєте пропозицію? Дайте нам знати!'
    },
    modal: {
      close: 'Закрити налаштування'
    }
  },
  extractor: {
    header: {
      title: 'Вилучення Тегів Booru',
      subtitle: 'Вилучення тегів з дошок зображень booru',
      supported: 'Підтримувані платформи:',
      urlLabel: 'URL Публікації Booru',
      urlPlaceholder: 'Вставте URL публікації booru тут...',
      manualButton: 'Вилучити Вручну',
      resetButton: 'Скинути',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Вилучення Тегів Booru',
      heroSubtitle: 'Вилучайте, фільтруйте та копіюйте теги з сайтів booru миттєво',
      features: {
        smart: { title: 'Розумний', subtitle: 'Авто-вилучення' },
        fast: { title: 'Швидкий', subtitle: 'Миттєві результати' },
        private: { title: 'Приватний', subtitle: 'На стороні клієнта' },
        copy: { title: 'Копіювати', subtitle: 'Одним кліком' }
      },
      cta: {
        paste: 'Вставити',
        extract: 'Вилучити',
        filter: 'Фільтр',
        copy: 'Копіювати'
      },
      supportNotice: 'Підтримує Danbooru, Gelbooru, Safebooru, Rule34, e621 та інші'
    },
    preview: {
      title: 'Попередній перегляд'
    },
    status: {
      resultLabel: 'Результат для:'
    },
    categories: {
      title: 'Фільтрувати Категорії',
      enableAll: 'Усе',
      disableAll: 'Нічого',
      items: {
        copyright: 'Авторське Право',
        character: 'Персонаж',
        general: 'Загальне',
        meta: 'Мета',
        other: 'Інше'
      },
      count_one: '{{count}} тег',
      count_other: '{{count}} тегів'
    },
    filteredTags: {
      label: 'Відфільтровані Теги',
      ariaLabel: 'Відфільтровані теги',
      empty: 'Немає тегів для відображення.',
      copy: 'Копіювати Теги',
      copied: 'Скопійовано!'
    },
    history: {
      extractionTitle: 'Історія Вилучення',
      imageTitle: 'Історія Зображень',
      searchExtraction: 'Пошук заголовка, url, тегів...',
      searchImages: 'Пошук імені файлу, підказок, параметрів...',
      emptySearch: 'Жодного запису не відповідає вашому пошуку.',
      clearTooltip: 'Очистити Всю Історію',
      clearAction: 'Очистити Історію',
      confirmMessage: 'Дійсно очистити?',
      confirmYes: 'Так, Очистити',
      confirmCancel: 'Скасувати',
      searchAriaLabel: 'Пошук {{context}}',
      searchFallback: 'історія',
      clearSearchTooltip: 'Очистити Пошук',
      clearSearchAria: 'Очистити пошук'
    },
    mobile: {
      historyButton: 'Історія',
      urlLabel: 'URL Публікації Booru',
      urlPlaceholder: 'Вставте URL або Перетягніть & Відпустіть...',
      manualButton: 'Вилучити Вручну',
      resetButton: 'Скинути'
    }
  },
  imageTool: {
    title: 'Метадані Зображення',
    dropCtaTitle: 'Перетягніть & Відпустіть PNG Тут',
    dropCtaSubtitle: 'або натисніть для завантаження',
    selectButton: 'Вибрати PNG',
    statusProcessing: 'Обробка...',
    previewMeta: '{{name}} ({{size}} КБ)',
    positivePrompt: 'Позитивний Підказка',
    negativePrompt: 'Негативний Підказка',
    parameters: 'Параметри',
    copy: 'Копіювати',
    copyAll: 'Копіювати Все',
    copySuccess: 'Скопійовано!',
    noMetadata: 'Метадані генерації не знайдено.',
    loadMetadata: 'Завантажити Метадані',
    deleteEntry: 'Видалити Запис',
    historyTitle: 'Історія Зображень',
    historySearch: 'Пошук імені файлу, підказок, параметрів...',
    previewAlt: 'Попередній перегляд',
    footer: {
      metadataNotice: "Вилучення метаданих PNG для текстового фрагмента 'parameters'."
    }
  },
  historyItem: {
    load: 'Завантажити цей запис історії',
    delete: 'Видалити цей запис історії',
    previewAlt: 'Попередній перегляд'
  },
  imagePreview: {
    loading: 'Завантаження попереднього перегляду...',
    error: 'Не вдалося завантажити попередній перегляд.',
    errorDetail: 'Помилка серверного проксі або недійсне зображення',
    videoUnsupported: 'Ваш браузер не підтримує відео.',
    openFull: 'Відкрити попередній перегляд у повному розмірі',
    close: 'Закрити',
    reset: 'Скинути',
    openOriginal: 'Відкрити оригінал'
  },
  booruList: {
    pageTitle: 'Топ Рейтинг Booru',
    pageDescriptionShort: 'Досліджуйте найкращі сайти booru, ранжовані за загальною кількістю зображень та активністю.',
    pageDescriptionLong: 'Відкрийте для себе найпопулярніші сайти booru з усього інтернету. Ранжовані за загальною кількістю зображень, кількістю учасників та активністю з даними від Booru.org.',
    searchPlaceholder: 'Пошук сайтів booru...',
    filter: {
      all: 'Усі',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Зображення',
      members: 'Учасники',
      owner: 'Власник'
    },
    sort: {
      label: 'Сортувати за:',
      rank: 'Рейтинг (Топ)',
      images: 'Кількість Зображень',
      members: 'Кількість Учасників',
      asc: 'За зростанням',
      desc: 'За спаданням'
    },
    itemsPerPage: 'На сторінку:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> з {{total}}',
    pagination: {
      previous: 'Попередня',
      next: 'Наступна',
      previousShort: 'Попер',
      nextShort: 'Наст'
    },
    emptyState: 'Сайти booru не знайдено',
    loading: 'Завантаження даних booru...',
    errorTitle: 'Помилка Завантаження Даних',
    errors: {
      fetchFailed: 'Не вдалося отримати дані booru.',
      unknown: 'Щось пішло не так під час завантаження рейтингу.'
    },
    ownerLabel: 'Власник:',
    visit: 'Відвідати {{name}}'
  },
  booruDetail: {
    backButton: 'Повернутися до Списку Booru',
    notFoundTitle: 'Booru Не Знайдено',
    notFoundDescription: 'Домен booru "{{domain}}" не знайдено в нашій базі даних.',
    statistics: 'Статистика',
    totalImages: 'Загальна Кількість Зображень',
    totalMembers: 'Загальна Кількість Учасників',
    shortName: 'Коротке Ім\'я',
    owner: 'Власник',
    hosted: 'Розміщено на booru.org',
    protocol: 'Протокол',
    yes: 'Так',
    no: 'Ні',
    visit: 'Відвідати {{name}}',
    loading: 'Завантаження...'
  }
};
