import { en } from './en';
import type { TranslationSchema } from './en';

export const te: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'భాష',
    english: 'ఇంగ్లీష్',
    indonesian: 'ఇండోనేషియన్',
    chinese: 'చైనీస్',
    languageSwitcher: {
      title: 'ఇంటర్‌ఫేస్ భాష',
      description: 'మీ బ్రౌజర్‌లో సేవ్ చేయబడింది. డిఫాల్ట్ భాష ఇంగ్లీష్.',
      instantNotice: 'మార్పులు రీలోడ్ చేయకుండా తక్షణమే వర్తింపజేయబడతాయి.',
      searchPlaceholder: 'భాషలను వెతకండి...',
      noResults: 'భాషలు కనుగొనబడలేదు'
    },
    nav: {
      extractor: 'ట్యాగ్‌లు',
      image: 'చిత్రం',
      booruList: 'Booru',
      settings: 'సెట్టింగ్‌లు'
    },
    actions: {
      ...en.common.actions,
      add: 'జోడించు',
      apply: 'వర్తింపజేయండి',
      back: 'వెనక్కి',
      cancel: 'రద్దు చేయి',
      clear: 'క్లియర్ చేయి',
      close: 'మూసివేయి',
      confirm: 'నిర్ధారించు',
      copy: 'కాపీ చేయి',
      copied: 'కాపీ చేయబడింది!',
      delete: 'తొలగించు',
      save: 'సేవ్ చేయి',
      search: 'వెతకండి',
      all: 'అన్నీ',
      none: 'ఏదీ లేదు'
    }
  },
  settings: {
    ...en.settings
  }
};
