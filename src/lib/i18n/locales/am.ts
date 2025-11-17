import { en } from './en';
import type { TranslationSchema } from './en';

export const am: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'ቋንቋ',
    english: 'እንግሊዝኛ',
    indonesian: 'ኢንዶኔዥያኛ',
    chinese: 'ቻይንኛ',
    languageSwitcher: {
      title: 'የበይነገጽ ቋንቋ',
      description: 'በአሳሽዎ ውስጥ ተቀምጧል። ነባሪው ቋንቋ እንግሊዝኛ ነው።',
      instantNotice: 'ለውጦች እንደገና ሳይጫን ወዲያውኑ ይተገበራሉ።',
      searchPlaceholder: 'ቋንቋዎችን ይፈልጉ...',
      noResults: 'ምንም ቋንቋዎች አልተገኙም'
    },
    nav: {
      extractor: 'መለያዎች',
      image: 'ምስል',
      booruList: 'Booru',
      settings: 'ቅንብሮች'
    },
    actions: {
      ...en.common.actions,
      add: 'ጨምር',
      apply: 'ተግብር',
      back: 'ተመለስ',
      cancel: 'ሰርዝ',
      clear: 'አጽዳ',
      close: 'ዝጋ',
      confirm: 'አረጋግጥ',
      copy: 'ቅዳ',
      copied: 'ተቀድቷል!',
      delete: 'ሰርዝ',
      save: 'አስቀምጥ',
      search: 'ፈልግ',
      all: 'ሁሉም',
      none: 'ምንም'
    }
  },
  settings: {
    ...en.settings,
    title: 'ቅንብሮች',
    themeOptions: {
      system: 'ስርዓት',
      light: 'ብርሃን',
      dark: 'ጨለማ'
    }
  }
};
