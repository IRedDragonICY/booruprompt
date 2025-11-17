import { en } from './en';
import type { TranslationSchema } from './en';

export const gu: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ટૅગ એક્સ્ટ્રૅક્ટર',
    language: 'ભાષા',
    english: 'અંગ્રેજી',
    indonesian: 'ઇન્ડોનેશિયન',
    chinese: 'ચાઇનીઝ',
    languageSwitcher: {
      title: 'ઇન્ટરફેસ ભાષા',
      description: 'તમારા બ્રાઉઝરમાં સાચવેલ. ડિફોલ્ટ ભાષા અંગ્રેજી છે.',
      instantNotice: 'ફેરફારો રીલોડ કર્યા વિના લાગુ થાય છે.',
      searchPlaceholder: 'ભાષાઓ શોધો...',
      noResults: 'કોઈ ભાષાઓ મળી નથી'
    },
    nav: {
      extractor: 'ટૅગ્સ',
      image: 'છબી',
      booruList: 'Booru',
      settings: 'સેટિંગ્સ'
    },
    actions: {
      ...en.common.actions,
      add: 'ઉમેરો',
      apply: 'લાગુ કરો',
      back: 'પાછળ',
      cancel: 'રદ કરો',
      clear: 'સાફ કરો',
      close: 'બંધ કરો',
      confirm: 'પુષ્ટિ કરો',
      copy: 'કૉપિ કરો',
      copied: 'કૉપિ થયું!',
      delete: 'કાઢી નાખો',
      save: 'સાચવો',
      search: 'શોધો',
      all: 'બધા',
      none: 'કંઈ નહીં'
    }
  },
  settings: {
    title: 'સેટિંગ્સ',
    sections: {
      appearance: 'દેખાવ',
      colorTheme: 'રંગ થીમ',
      dataFetch: 'ડેટા મેળવવાની પદ્ધતિ'
    },
    themeOptions: {
      system: 'સિસ્ટમ',
      light: 'પ્રકાશ',
      dark: 'ઘેરો'
    },
    colorThemes: {
      blue: 'વાદળી',
      orange: 'નારંગી',
      teal: 'ટીલ',
      rose: 'ગુલાબી',
      purple: 'જાંબલી',
      green: 'લીલો',
      custom: 'કસ્ટમ રંગ'
    },
    customColor: {
      label: 'કસ્ટમ રંગ',
      pickerLabel: 'કસ્ટમ રંગ પસંદગીકાર',
      inputLabel: 'કસ્ટમ રંગ હેક્સ કોડ',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'સર્વર પ્રોક્સી',
        description: 'ડેટા મેળવવા માટે આ એપ્લિકેશનના સર્વરનો ઉપયોગ કરે છે. ભલામણ કરેલ, વધુ વિશ્વસનીય.'
      },
      clientProxy: {
        label: 'ક્લાયન્ટ-સાઇડ પ્રોક્સી',
        description: 'તમારા બ્રાઉઝરમાં જાહેર CORS પ્રોક્સીનો ઉપયોગ કરે છે. ઓછું વિશ્વસનીય અથવા દર-મર્યાદિત હોઈ શકે છે.'
      }
    },
    clientProxy: {
      selectLabel: 'ક્લાયન્ટ પ્રોક્સી સેવા પસંદ કરો:',
      ariaLabel: 'ક્લાયન્ટ પ્રોક્સી સેવા પસંદગીકાર',
      helper: 'પ્રદર્શન અને વિશ્વસનીયતા પ્રોક્સીઓ વચ્ચે અલગ હોય છે.'
    },
    toggles: {
      autoExtract: {
        label: 'સ્વચાલિત નિષ્કર્ષણ',
        description: 'માન્ય URL પેસ્ટ/ટાઇપ કર્યા પછી સ્વચાલિતપણે ટૅગ્સ કાઢો.',
        tooltip: 'માન્ય URL પેસ્ટ/ટાઇપ કરતી વખતે સ્વચાલિત ટૅગ નિષ્કર્ષણ સક્ષમ અથવા અક્ષમ કરો'
      },
      previews: {
        label: 'પૂર્વાવલોકનો સક્ષમ કરો',
        description: 'નિષ્કર્ષણ અને ઇતિહાસમાં છબી/વિડિઓ પૂર્વાવલોકનો બતાવો.',
        tooltip: 'બેન્ડવિડ્થ બચાવવા અથવા સંભવિત સમસ્યાઓ ટાળવા માટે છબી/વિડિઓ પૂર્વાવલોકનો સક્ષમ અથવા અક્ષમ કરો',
        note: 'છબીઓ હંમેશા સર્વર પ્રોક્સી દ્વારા મેળવવામાં આવે છે.'
      },
      saveHistory: {
        label: 'ઇતિહાસ સાચવો',
        description: 'તમારા બ્રાઉઝરમાં સ્થાનિક રીતે સફળ નિષ્કર્ષણોનો સંગ્રહ કરો.',
        tooltip: 'તમારા બ્રાઉઝરના સ્થાનિક સંગ્રહમાં નિષ્કર્ષણ ઇતિહાસ સાચવવાનું સક્ષમ અથવા અક્ષમ કરો'
      },
      unsupportedSites: {
        label: 'અસમર્થિત સાઇટ્સ માટે સક્ષમ કરો',
        description: 'સમાન સાઇટ પેટર્નનો ઉપયોગ કરીને અસમર્થિત સાઇટ્સમાંથી કાઢવાનો પ્રયાસ કરો. બધી સાઇટ્સ પર કામ ન કરી શકે.',
        tooltip: 'સમાન સાઇટ પેટર્નનો ઉપયોગ કરીને અસમર્થિત વેબસાઇટ્સ માટે નિષ્કર્ષણ સક્ષમ કરો'
      },
      blacklist: {
        label: 'કીવર્ડ બ્લેકલિસ્ટ સક્ષમ કરો',
        description: 'અવરોધિત કરવા માટે કીવર્ડ્સ દાખલ કરો, અલ્પવિરામ, અર્ધવિરામ અથવા નવી લાઇનથી અલગ કરો.',
        tooltip: 'ચોક્કસ કીવર્ડ્સ ફિલ્ટર કરીને અનિચ્છનીય ટૅગ્સ અવરોધિત કરો',
        placeholder: 'અવરોધિત કરવા માટે કીવર્ડ્સ દાખલ કરો…',
        ariaLabel: 'બ્લેકલિસ્ટ કીવર્ડ્સ',
        reset: 'ડિફોલ્ટ પર રીસેટ કરો'
      }
    },
    historySize: {
      label: 'મહત્તમ ઇતિહાસ કદ',
      description: 'નિષ્કર્ષણ અને છબી ઇતિહાસ બંને માટે મહત્તમ એન્ટ્રીઓની સંખ્યા સેટ કરો.'
    },
    accessibility: {
      themeOption: 'થીમ {{label}}',
      colorThemeOption: 'રંગ થીમ {{label}}',
      historySizeSelect: 'મહત્તમ ઇતિહાસ કદ'
    },
    historySizeOptions: {
      '10': '10 એન્ટ્રીઓ',
      '30': '30 એન્ટ્રીઓ',
      '50': '50 એન્ટ્રીઓ',
      '100': '100 એન્ટ્રીઓ',
      unlimited: 'અમર્યાદિત'
    },
    support: {
      title: 'સમર્થન અને પ્રતિસાદ',
      cta: 'GitHub પર સમસ્યા જાણ કરો',
      description: 'બગ મળ્યો અથવા સૂચન છે? અમને જણાવો!'
    },
    modal: {
      close: 'સેટિંગ્સ બંધ કરો'
    }
  }
};
