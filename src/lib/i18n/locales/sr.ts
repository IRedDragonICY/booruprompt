import { en } from './en';
import type { TranslationSchema } from './en';

export const sr: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru екстрактор ознака',
    language: 'Језик',
    english: 'Енглески',
    indonesian: 'Индонежански',
    chinese: 'Кинески',
    languageSwitcher: {
      title: 'Језик интерфејса',
      description: 'Сачувано у вашем прегледачу. Подразумевани језик је енглески.',
      instantNotice: 'Промене се примењују тренутно без поновног учитавања.',
      searchPlaceholder: 'Претражи језике...',
      noResults: 'Нема пронађених језика'
    },
    nav: {
      extractor: 'Ознаке',
      image: 'Слика',
      booruList: 'Booru',
      settings: 'Подешавања'
    },
    actions: {
      ...en.common.actions,
      add: 'Додај',
      apply: 'Примени',
      back: 'Назад',
      cancel: 'Откажи',
      clear: 'Обриши',
      close: 'Затвори',
      confirm: 'Потврди',
      copy: 'Копирај',
      copied: 'Копирано!',
      delete: 'Избриши',
      save: 'Сачувај',
      search: 'Претражи',
      all: 'Све',
      none: 'Ништа'
    }
  },
  settings: {
    title: 'Подешавања',
    sections: {
      appearance: 'Изглед',
      colorTheme: 'Тема боја',
      dataFetch: 'Метод преузимања података'
    },
    themeOptions: {
      system: 'Систем',
      light: 'Светла',
      dark: 'Тамна'
    },
    colorThemes: {
      blue: 'Плава',
      orange: 'Наранџаста',
      teal: 'Тиркизна',
      rose: 'Ружичаста',
      purple: 'Љубичаста',
      green: 'Зелена',
      custom: 'Прилагођена боја'
    },
    customColor: {
      label: 'Прилагођена боја',
      pickerLabel: 'Бирач прилагођене боје',
      inputLabel: 'Хекс код прилагођене боје',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Серверски Proxy',
        description: 'Користи сервер ове апликације за преузимање података. Препоручено, поузданије.'
      },
      clientProxy: {
        label: 'Клијентски Proxy',
        description: 'Користи јавни CORS proxy у вашем прегледачу. Може бити мање поуздан или ограничен.'
      }
    },
    clientProxy: {
      selectLabel: 'Изаберите услугу клијентског proxy-ја:',
      ariaLabel: 'Бирач услуге клијентског proxy-ја',
      helper: 'Перформансе и поузданост се разликују између proxy-ја.'
    },
    toggles: {
      autoExtract: {
        label: 'Аутоматска Екстракција',
        description: 'Аутоматски издвоји ознаке након лепљења/куцања важећег URL-а.',
        tooltip: 'Укључи или искључи аутоматску екстракцију ознака при лепљењу/куцању важећег URL-а'
      },
      previews: {
        label: 'Омогући Прегледе',
        description: 'Прикажи прегледе слика/видеа током екстракције и у историји.',
        tooltip: 'Укључи или искључи прегледе слика/видеа ради уштеде протока или избегавања потенцијалних проблема',
        note: 'Слике се увек преузимају преко Серверског Proxy-ја.'
      },
      saveHistory: {
        label: 'Сачувај Историју',
        description: 'Чувај успешне екстракције локално у вашем прегледачу.',
        tooltip: 'Укључи или искључи чување историје екстракција у локално складиште прегледача'
      },
      unsupportedSites: {
        label: 'Омогући за Неподржане Сајтове',
        description: 'Покушај да издвојиш са неподржаних сајтова користећи сличне шаблоне сајтова. Можда неће радити за све сајтове.',
        tooltip: 'Омогући екстракцију за неподржане веб сајтове користећи сличне шаблоне сајтова'
      },
      blacklist: {
        label: 'Омогући Црну Листу Кључних Речи',
        description: 'Унесите кључне речи за блокирање, одвојене зарезима, тачка-зарезима или новим редовима.',
        tooltip: 'Блокирај нежељене ознаке филтрирањем специфичних кључних речи',
        placeholder: 'Унесите кључне речи за блокирање…',
        ariaLabel: 'Кључне речи црне листе',
        reset: 'Врати на Подразумевано'
      }
    },
    historySize: {
      label: 'Максимална Величина Историје',
      description: 'Подесите максималан број уноса за историју екстракције и слика.'
    },
    accessibility: {
      themeOption: 'Тема {{label}}',
      colorThemeOption: 'Тема боја {{label}}',
      historySizeSelect: 'Максимална величина историје'
    },
    historySizeOptions: {
      '10': '10 Уноса',
      '30': '30 Уноса',
      '50': '50 Уноса',
      '100': '100 Уноса',
      unlimited: 'Неограничено'
    },
    support: {
      title: 'Подршка и Повратне Информације',
      cta: 'Пријави Проблем на GitHub',
      description: 'Нашли сте грешку или имате предлог? Јавите нам!'
    },
    modal: {
      close: 'Затвори Подешавања'
    }
  }
};
