import type enTranslation from './locales/en.json';

// Deep type extractor for nested translation objects
type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type TranslationSchema = DeepStringRecord<typeof enTranslation>;

export type Locale = 'en' | 'id' | 'zh';

export interface LanguageOption {
  code: Locale;
  label: string;
}
