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
      label: 'カスタムカラー',
      pickerLabel: 'カスタムカラーピッカー',
      inputLabel: 'カスタムカラーの16進数コード',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'サーバープロキシ',
        description: 'このアプリケーションのサーバーを使用してデータを取得します。推奨、より信頼性が高い。'
      },
      clientProxy: {
        label: 'クライアント側プロキシ',
        description: 'ブラウザで公開CORSプロキシを使用します。信頼性が低い場合や制限される場合があります。'
      }
    },
    clientProxy: {
      selectLabel: 'クライアントプロキシサービスを選択：',
      ariaLabel: 'クライアントプロキシサービスセレクター',
      helper: 'プロキシによってパフォーマンスと信頼性が異なります。'
    },
    toggles: {
      autoExtract: {
        label: '自動抽出',
        description: '有効なURLを貼り付け/入力した後、自動的にタグを抽出します。',
        tooltip: '有効なURLを貼り付け/入力した際の自動タグ抽出を有効または無効にする'
      },
      previews: {
        label: 'プレビューを有効化',
        description: '抽出時と履歴で画像/動画のプレビューを表示します。',
        tooltip: '帯域幅の節約や潜在的な問題回避のため、画像/動画プレビューを有効または無効にする',
        note: '画像は常にサーバープロキシ経由で取得されます。'
      },
      saveHistory: {
        label: '履歴を保存',
        description: '成功した抽出をブラウザにローカル保存します。',
        tooltip: 'ブラウザのローカルストレージへの抽出履歴の保存を有効または無効にする'
      },
      unsupportedSites: {
        label: '未対応サイトで有効化',
        description: '類似サイトのパターンを使用して、未対応サイトから抽出を試みます。すべてのサイトで機能するわけではありません。',
        tooltip: '類似サイトパターンを使用して未対応ウェブサイトでの抽出を有効にする'
      },
      blacklist: {
        label: 'キーワードブラックリストを有効化',
        description: 'ブロックするキーワードをカンマ、セミコロン、または改行で区切って入力します。',
        tooltip: '特定のキーワードをフィルタリングして不要なタグをブロックする',
        placeholder: 'ブロックするキーワードを入力…',
        ariaLabel: 'ブラックリストキーワード',
        reset: 'デフォルトにリセット'
      }
    },
    historySize: {
      label: '最大履歴サイズ',
      description: '抽出履歴と画像履歴の両方の最大エントリ数を設定します。'
    },
    accessibility: {
      themeOption: 'テーマ {{label}}',
      colorThemeOption: 'カラーテーマ {{label}}',
      historySizeSelect: '最大履歴サイズ'
    },
    historySizeOptions: {
      '10': '10エントリ',
      '30': '30エントリ',
      '50': '50エントリ',
      '100': '100エントリ',
      unlimited: '無制限'
    },
    support: {
      title: 'サポート&フィードバック',
      cta: 'GitHubで問題を報告',
      description: 'バグを見つけたり提案がありますか？お知らせください！'
    },
    modal: {
      close: '設定を閉じる'
    }
  },
  extractor: {
    header: {
      title: 'Booru タグ抽出ツール',
      subtitle: 'Booru画像ボードからタグを抽出',
      supported: '対応プラットフォーム:',
      urlLabel: 'Booru投稿URL',
      urlPlaceholder: 'Booru投稿URLをここに貼り付け...',
      manualButton: '手動抽出',
      resetButton: 'リセット',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Booru タグ抽出ツール',
      heroSubtitle: 'Booruサイトからタグを瞬時に抽出、フィルタ、コピー',
      features: {
        smart: { title: 'スマート', subtitle: '自動抽出' },
        fast: { title: '高速', subtitle: '即座に結果' },
        private: { title: 'プライベート', subtitle: 'クライアント側' },
        copy: { title: 'コピー', subtitle: 'ワンクリック' }
      },
      cta: {
        paste: '貼り付け',
        extract: '抽出',
        filter: 'フィルタ',
        copy: 'コピー'
      },
      supportNotice: 'Danbooru、Gelbooru、Safebooru、Rule34、e621などに対応'
    },
    preview: {
      title: 'プレビュー'
    },
    status: {
      resultLabel: '結果:'
    },
    categories: {
      title: 'カテゴリをフィルタ',
      enableAll: 'すべて',
      disableAll: 'なし',
      items: {
        copyright: '著作権',
        character: 'キャラクター',
        general: '一般',
        meta: 'メタ',
        other: 'その他'
      },
      count_one: '{{count}}個のタグ',
      count_other: '{{count}}個のタグ'
    },
    filteredTags: {
      label: 'フィルタされたタグ',
      ariaLabel: 'フィルタされたタグ',
      empty: '表示するタグがありません。',
      copy: 'タグをコピー',
      copied: 'コピーしました！'
    },
    history: {
      extractionTitle: '抽出履歴',
      imageTitle: '画像履歴',
      searchExtraction: 'タイトル、URL、タグを検索...',
      searchImages: 'ファイル名、プロンプト、パラメータを検索...',
      emptySearch: '検索に一致するエントリがありません。',
      clearTooltip: 'すべての履歴をクリア',
      clearAction: '履歴をクリア',
      confirmMessage: '本当にクリアしますか？',
      confirmYes: 'はい、クリア',
      confirmCancel: 'キャンセル',
      searchAriaLabel: '{{context}}を検索',
      searchFallback: '履歴',
      clearSearchTooltip: '検索をクリア',
      clearSearchAria: '検索をクリア'
    },
    mobile: {
      historyButton: '履歴',
      urlLabel: 'Booru投稿URL',
      urlPlaceholder: 'URLを貼り付けるかドラッグ＆ドロップ...',
      manualButton: '手動抽出',
      resetButton: 'リセット'
    }
  },
  imageTool: {
    title: '画像メタデータ',
    dropCtaTitle: 'PNGをここにドラッグ＆ドロップ',
    dropCtaSubtitle: 'またはクリックしてアップロード',
    selectButton: 'PNGを選択',
    statusProcessing: '処理中...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'ポジティブプロンプト',
    negativePrompt: 'ネガティブプロンプト',
    parameters: 'パラメータ',
    copy: 'コピー',
    copyAll: 'すべてコピー',
    copySuccess: 'コピーしました！',
    noMetadata: '生成メタデータが見つかりません。',
    loadMetadata: 'メタデータを読み込む',
    deleteEntry: 'エントリを削除',
    historyTitle: '画像履歴',
    historySearch: 'ファイル名、プロンプト、パラメータを検索...',
    previewAlt: 'プレビュー',
    footer: {
      metadataNotice: "'parameters'テキストチャンクのPNGメタデータ抽出。"
    }
  },
  historyItem: {
    load: 'この履歴エントリを読み込む',
    delete: 'この履歴エントリを削除',
    previewAlt: 'プレビュー'
  },
  imagePreview: {
    loading: 'プレビューを読み込み中...',
    error: 'プレビューを読み込めませんでした。',
    errorDetail: 'サーバープロキシエラーまたは無効な画像',
    videoUnsupported: 'ブラウザがビデオをサポートしていません。',
    openFull: 'フルサイズプレビューを開く',
    close: '閉じる',
    reset: 'リセット',
    openOriginal: 'オリジナルを開く'
  },
  booruList: {
    pageTitle: 'トップBooruランキング',
    pageDescriptionShort: '総画像数とアクティビティでランク付けされたトップBooruサイトを探索。',
    pageDescriptionLong: 'Web上で最も人気のあるBooruサイトを発見。Booru.orgのデータを使用して、総画像数、メンバー数、アクティビティでランク付け。',
    searchPlaceholder: 'Booruサイトを検索...',
    filter: {
      all: 'すべて',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: '画像',
      members: 'メンバー',
      owner: '所有者'
    },
    sort: {
      label: '並び替え:',
      rank: 'ランク（トップ）',
      images: '画像数',
      members: 'メンバー数',
      asc: '昇順',
      desc: '降順'
    },
    itemsPerPage: 'ページあたり:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> / {{total}}',
    pagination: {
      previous: '前へ',
      next: '次へ',
      previousShort: '前',
      nextShort: '次'
    },
    emptyState: 'Booruサイトが見つかりません',
    loading: 'Booruデータを読み込み中...',
    errorTitle: 'データ読み込みエラー',
    errors: {
      fetchFailed: 'Booruデータの取得に失敗しました。',
      unknown: 'ランキングの読み込み中に問題が発生しました。'
    },
    ownerLabel: '所有者:',
    visit: '{{name}}を訪問'
  },
  booruDetail: {
    backButton: 'Booruリストに戻る',
    notFoundTitle: 'Booruが見つかりません',
    notFoundDescription: 'Booruドメイン「{{domain}}」はデータベースに見つかりませんでした。',
    statistics: '統計',
    totalImages: '総画像数',
    totalMembers: '総メンバー数',
    shortName: '短縮名',
    owner: '所有者',
    hosted: 'booru.orgでホスティング',
    protocol: 'プロトコル',
    yes: 'はい',
    no: 'いいえ',
    visit: '{{name}}を訪問',
    loading: '読み込み中...'
  }
};
