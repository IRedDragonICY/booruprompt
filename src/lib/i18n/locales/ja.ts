import { en } from './en';
import type { TranslationSchema } from './en';

export const ja: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru タグ抽出ツール',
    language: '言語',
    english: '英語',
    indonesian: 'インドネシア語',
    chinese: '中国語',
    languageSwitcher: {
      title: 'インターフェース言語',
      description: 'ブラウザに保存されます。デフォルト言語は英語です。',
      instantNotice: '再読み込みせずに即座に変更が適用されます。',
      searchPlaceholder: '言語を検索...',
      noResults: '言語が見つかりません'
    },
    nav: {
      extractor: 'タグ',
      image: '画像',
      booruList: 'Booru',
      settings: '設定'
    },
    actions: {
      ...en.common.actions,
      add: '追加',
      apply: '適用',
      back: '戻る',
      cancel: 'キャンセル',
      clear: 'クリア',
      close: '閉じる',
      confirm: '確認',
      copy: 'コピー',
      copied: 'コピーしました！',
      delete: '削除',
      save: '保存',
      search: '検索',
      all: 'すべて',
      none: 'なし'
    }
  },
  settings: {
    title: '設定',
    sections: {
      appearance: '外観',
      colorTheme: 'カラーテーマ',
      dataFetch: 'データ取得方法'
    },
    themeOptions: {
      system: 'システム',
      light: 'ライト',
      dark: 'ダーク'
    },
    colorThemes: {
      blue: '青',
      orange: 'オレンジ',
      teal: 'ティール',
      rose: 'ローズ',
      purple: '紫',
      green: '緑',
      custom: 'カスタムカラー'
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
