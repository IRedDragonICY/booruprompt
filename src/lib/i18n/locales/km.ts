import { en } from './en';
import type { TranslationSchema } from './en';

export const km: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'ភាសា',
    english: 'អង់គ្លេស',
    indonesian: 'ឥណ្ឌូណេស៊ី',
    chinese: 'ចិន',
    languageSwitcher: {
      title: 'ភាសាចំណុចប្រទាក់',
      description: 'រក្សាទុកក្នុងកម្មវិធីរុករករបស់អ្នក។ ភាសាលំនាំដើមគឺអង់គ្លេស។',
      instantNotice: 'ការផ្លាស់ប្តូរត្រូវបានអនុវត្តភ្លាមៗដោយមិនចាំបាច់ផ្ទុកឡើងវិញ។',
      searchPlaceholder: 'ស្វែងរកភាសា...',
      noResults: 'រកមិនឃើញភាសា'
    },
    nav: {
      extractor: 'ស្លាក',
      image: 'រូបភាព',
      booruList: 'Booru',
      settings: 'ការកំណត់'
    },
    actions: {
      ...en.common.actions,
      add: 'បន្ថែម',
      apply: 'អនុវត្ត',
      back: 'ត្រឡប់',
      cancel: 'បោះបង់',
      clear: 'សម្អាត',
      close: 'បិទ',
      confirm: 'បញ្ជាក់',
      copy: 'ចម្លង',
      copied: 'បានចម្លង!',
      delete: 'លុប',
      save: 'រក្សាទុក',
      search: 'ស្វែងរក',
      all: 'ទាំងអស់',
      none: 'គ្មាន'
    }
  },
  settings: {
    ...en.settings
  }
};
