import { en } from './en';
import type { TranslationSchema } from './en';

export const tr: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Etiket Çıkarıcı',
    language: 'Dil',
    english: 'İngilizce',
    indonesian: 'Endonezce',
    chinese: 'Çince',
    languageSwitcher: {
      title: 'Arayüz dili',
      description: 'Tarayıcınızda saklanır. Varsayılan dil İngilizce\'dir.',
      instantNotice: 'Değişiklikler yeniden yükleme olmadan anında uygulanır.',
      searchPlaceholder: 'Dil ara...',
      noResults: 'Dil bulunamadı'
    },
    nav: {
      extractor: 'Etiketler',
      image: 'Resim',
      booruList: 'Booru',
      settings: 'Ayarlar'
    },
    actions: {
      ...en.common.actions,
      add: 'Ekle',
      apply: 'Uygula',
      back: 'Geri',
      cancel: 'İptal',
      clear: 'Temizle',
      close: 'Kapat',
      confirm: 'Onayla',
      copy: 'Kopyala',
      copied: 'Kopyalandı!',
      delete: 'Sil',
      save: 'Kaydet',
      search: 'Ara',
      all: 'Tümü',
      none: 'Hiçbiri'
    }
  },
  settings: {
    ...en.settings
  }
};
