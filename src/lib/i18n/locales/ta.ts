import { en } from './en';
import type { TranslationSchema } from './en';

export const ta: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'மொழி',
    english: 'ஆங்கிலம்',
    indonesian: 'இந்தோனேசியன்',
    chinese: 'சீன',
    languageSwitcher: {
      title: 'இடைமுக மொழி',
      description: 'உங்கள் உலாவியில் சேமிக்கப்பட்டுள்ளது. இயல்புநிலை மொழி ஆங்கிலம்.',
      instantNotice: 'மாற்றங்கள் மீண்டும் ஏற்ற வேண்டிய அவசியமின்றி உடனடியாக பயன்படுத்தப்படும்.',
      searchPlaceholder: 'மொழிகளைத் தேடு...',
      noResults: 'மொழிகள் எதுவும் கிடைக்கவில்லை'
    },
    nav: {
      extractor: 'குறிச்சொற்கள்',
      image: 'படம்',
      booruList: 'Booru',
      settings: 'அமைப்புகள்'
    },
    actions: {
      ...en.common.actions,
      add: 'சேர்',
      apply: 'பயன்படுத்து',
      back: 'பின்செல்',
      cancel: 'ரத்துசெய்',
      clear: 'அழி',
      close: 'மூடு',
      confirm: 'உறுதிப்படுத்து',
      copy: 'நகலெடு',
      copied: 'நகலெடுக்கப்பட்டது!',
      delete: 'நீக்கு',
      save: 'சேமி',
      search: 'தேடு',
      all: 'அனைத்தும்',
      none: 'ஏதுமில்லை'
    }
  },
  settings: {
    ...en.settings
  }
};
