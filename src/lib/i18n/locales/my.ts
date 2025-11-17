import { en } from './en';
import type { TranslationSchema } from './en';

export const my: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'ဘာသာစကား',
    english: 'အင်္ဂလိပ်',
    indonesian: 'အင်ဒိုနီးရှား',
    chinese: 'တရုတ်',
    languageSwitcher: {
      title: 'အင်တာဖေ့စ် ဘာသာစကား',
      description: 'သင့်ဘရောက်ဇာတွင် သိမ်းဆည်းထားသည်။ ပုံမှန်ဘာသာစကားမှာ အင်္ဂလိပ်ဖြစ်သည်။',
      instantNotice: 'ပြောင်းလဲမှုများကို ပြန်လည်တင်ရန် မလိုအပ်ဘဲ ချက်ချင်းအသုံးချသည်။',
      searchPlaceholder: 'ဘာသာစကားများကို ရှာဖွေပါ...',
      noResults: 'ဘာသာစကားများ မတွေ့ပါ'
    },
    nav: {
      extractor: 'တဂ်များ',
      image: 'ရုပ်ပုံ',
      booruList: 'Booru',
      settings: 'ဆက်တင်များ'
    },
    actions: {
      ...en.common.actions,
      add: 'ထည့်ပါ',
      apply: 'အသုံးချပါ',
      back: 'နောက်သို့',
      cancel: 'မလုပ်တော့',
      clear: 'ရှင်းလင်းပါ',
      close: 'ပိတ်ပါ',
      confirm: 'အတည်ပြုပါ',
      copy: 'ကူးယူပါ',
      copied: 'ကူးယူပြီးပါပြီ!',
      delete: 'ဖျက်ပါ',
      save: 'သိမ်းပါ',
      search: 'ရှာဖွေပါ',
      all: 'အားလုံး',
      none: 'မရှိ'
    }
  },
  settings: {
    ...en.settings,
    title: 'ဆက်တင်များ',
    themeOptions: {
      system: 'စနစ်',
      light: 'အလင်း',
      dark: 'အမှောင်'
    }
  }
};
