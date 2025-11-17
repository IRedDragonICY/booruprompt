import { en } from './en';
import type { TranslationSchema } from './en';

export const si: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'භාෂාව',
    english: 'ඉංග්‍රීසි',
    indonesian: 'ඉන්දුනීසියානු',
    chinese: 'චීන',
    languageSwitcher: {
      title: 'අතුරු මුහුණත් භාෂාව',
      description: 'ඔබගේ බ්‍රවුසරයේ සුරකින ලදී. පෙරනිමි භාෂාව ඉංග්‍රීසි වේ.',
      instantNotice: 'වෙනස්කම් නැවත පූරණය කිරීමකින් තොරව ක්ෂණිකව යොදනු ලැබේ.',
      searchPlaceholder: 'භාෂා සොයන්න...',
      noResults: 'භාෂා හමු නොවීය'
    },
    nav: {
      extractor: 'ටැග්',
      image: 'රූපය',
      booruList: 'Booru',
      settings: 'සැකසීම්'
    },
    actions: {
      ...en.common.actions,
      add: 'එක් කරන්න',
      apply: 'යොදන්න',
      back: 'ආපසු',
      cancel: 'අවලංගු කරන්න',
      clear: 'ඉවත් කරන්න',
      close: 'වසන්න',
      confirm: 'තහවුරු කරන්න',
      copy: 'පිටපත් කරන්න',
      copied: 'පිටපත් කළා!',
      delete: 'මකන්න',
      save: 'සුරකින්න',
      search: 'සොයන්න',
      all: 'සියල්ල',
      none: 'කිසිවක් නැත'
    }
  },
  settings: {
    title: 'සැකසීම්',
    sections: {
      appearance: 'පෙනුම',
      colorTheme: 'වර්ණ තේමාව',
      dataFetch: 'දත්ත ලබා ගැනීමේ ක්‍රමය'
    },
    themeOptions: {
      system: 'පද්ධතිය',
      light: 'එළිය',
      dark: 'අඳුර'
    },
    colorThemes: {
      blue: 'නිල්',
      orange: 'තැඹිලි',
      teal: 'ටීල්',
      rose: 'රෝස',
      purple: 'දම්',
      green: 'කොළ',
      custom: 'අභිරුචි වර්ණය'
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
