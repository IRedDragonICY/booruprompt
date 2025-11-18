import type { Locale } from './types';

/**
 * Server-safe i18n constants
 * This file contains no React dependencies and can be imported in server-side code
 */

export const SUPPORTED_LOCALES: readonly Locale[] = [
  'en',
  'id',
  'zh',
  'zh-TW',
  'ja',
  'ar',
  'ru',
  'es',
  'fr',
  'de',
  'pt',
  'ko',
  'it',
  'nl',
  'tr',
  'pl',
  'vi',
  'th',
  'hi',
  'uk',
] as const;

export const DEFAULT_LOCALE: Locale = 'en';
