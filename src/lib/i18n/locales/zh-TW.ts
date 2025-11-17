import { en } from './en';
import type { TranslationSchema } from './en';

export const zh_TW: TranslationSchema = {
  ...en,
  common: {
    appName: 'Booru 標籤擷取器',
    language: '語言',
    english: '英語',
    indonesian: '印尼語',
    chinese: '中文',
    author: 'IRedDragonICY',
    defaultDescription: '即時擷取、篩選並複製 booru 貼文的標籤。',
    unknown: '未知',
    languageSwitcher: {
      title: '介面語言',
      description: '儲存在瀏覽器中。預設語言為英語。',
      instantNotice: '無需重新整理即可立即生效。',
      searchPlaceholder: '搜尋語言...',
      noResults: '沒有找到語言'
    },
    nav: {
      extractor: '標籤',
      image: '圖片',
      booruList: 'Booru 排行',
      settings: '設定'
    },
    navTooltip: {
      extractor: '標籤擷取器',
      image: '圖片中繼資料',
      booruList: 'Booru 排行榜',
      settings: '設定'
    },
    dropOverlay: {
      url: '拖放 URL',
      png: '拖放 PNG'
    },
    actions: {
      add: '新增',
      apply: '套用',
      back: '返回',
      cancel: '取消',
      clear: '清除',
      close: '關閉',
      confirm: '確認',
      copy: '複製',
      copied: '已複製！',
      delete: '刪除',
      done: '完成',
      edit: '編輯',
      next: '下一步',
      previous: '上一步',
      refresh: '重新整理',
      reset: '重設',
      retry: '重試',
      save: '儲存',
      search: '搜尋',
      select: '選擇',
      submit: '提交',
      all: '全部',
      none: '無',
      visit: '造訪',
      previousShort: '上',
      nextShort: '下'
    },
    status: {
      loading: '載入中...',
      processing: '處理中...'
    },
    footer: {
      madeWith: '由衷製作',
      by: '來自'
    },
    statusBar: {
      serverProxy: '伺服器代理。',
      clientProxy: '客戶端代理（{{proxy}}）。',
      historyEnabled: '歷史記錄已啟用（{{size}}）。',
      historyDisabled: '歷史記錄已停用。',
      historyUnlimited: '無限制',
      historyEntries: '{{count}} 條記錄'
    }
  },
  settings: {
    title: '設定',
    sections: {
      appearance: '外觀',
      colorTheme: '配色方案',
      dataFetch: '資料擷取方式'
    },
    themeOptions: {
      system: '跟隨系統',
      light: '淺色',
      dark: '深色'
    },
    colorThemes: {
      blue: '藍色',
      orange: '橙色',
      teal: '青綠',
      rose: '玫瑰',
      purple: '紫色',
      green: '綠色',
      custom: '自訂顏色'
    },
    customColor: {
      label: '自訂顏色',
      pickerLabel: '自訂顏色選擇器',
      inputLabel: '自訂顏色十六進位',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: '伺服器代理',
        description: '使用本應用程式的伺服器擷取資料。建議且更穩定。'
      },
      clientProxy: {
        label: '客戶端代理',
        description: '在瀏覽器中使用公共 CORS 代理，可能不穩定或受限。'
      }
    },
    clientProxy: {
      selectLabel: '選擇客戶端代理服務：',
      ariaLabel: '客戶端代理選擇器',
      helper: '不同代理的效能與穩定性會有所不同。'
    },
    toggles: {
      autoExtract: {
        label: '自動擷取',
        description: '貼上/輸入有效 URL 後自動擷取標籤。',
        tooltip: '啟用或停用貼上/輸入 URL 時的自動擷取'
      },
      previews: {
        label: '啟用預覽',
        description: '在擷取和歷史記錄中顯示圖片/影片預覽。',
        tooltip: '啟用或停用預覽以節省頻寬或避免問題',
        note: '圖片始終透過伺服器代理擷取。'
      },
      saveHistory: {
        label: '儲存歷史',
        description: '在瀏覽器本機儲存成功的擷取。',
        tooltip: '將擷取歷史儲存到瀏覽器本機儲存空間'
      },
      unsupportedSites: {
        label: '啟用未支援網站',
        description: '嘗試使用相似模式從未支援網站擷取，結果不保證。',
        tooltip: '透過相似網站模式在未支援網站上嘗試擷取'
      },
      blacklist: {
        label: '啟用關鍵詞黑名單',
        description: '輸入要封鎖的關鍵詞，使用逗號、分號或換行分隔。',
        tooltip: '透過篩選特定關鍵詞封鎖不想要的標籤',
        placeholder: '請輸入要封鎖的關鍵詞…',
        ariaLabel: '黑名單關鍵詞',
        reset: '恢復預設'
      }
    },
    historySize: {
      label: '歷史記錄上限',
      description: '設定擷取與圖片歷史的最大條數。'
    },
    accessibility: {
      themeOption: '{{label}} 主題',
      colorThemeOption: '{{label}} 配色',
      historySizeSelect: '歷史記錄上限'
    },
    historySizeOptions: {
      '10': '10 條',
      '30': '30 條',
      '50': '50 條',
      '100': '100 條',
      unlimited: '無限制'
    },
    support: {
      title: '支援與回饋',
      cta: '在 GitHub 回報問題',
      description: '發現 bug 或有建議？告訴我們！'
    },
    modal: {
      close: '關閉設定'
    }
  },
  extractor: {
    ...en.extractor,
    header: {
      title: 'Booru 標籤擷取器',
      subtitle: '從 booru 圖站擷取標籤',
      supported: '支援的平台：',
      urlLabel: 'Booru 貼文 URL',
      urlPlaceholder: '在此貼上 booru 貼文 URL...',
      manualButton: '手動擷取',
      resetButton: '重設',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Booru 標籤擷取器',
      heroSubtitle: '即時擷取、篩選並複製 booru 標籤',
      features: {
        smart: { title: '智慧', subtitle: '自動擷取' },
        fast: { title: '快速', subtitle: '即時結果' },
        private: { title: '私密', subtitle: '在客戶端執行' },
        copy: { title: '複製', subtitle: '一鍵複製' }
      },
      cta: {
        paste: '貼上',
        extract: '擷取',
        filter: '篩選',
        copy: '複製'
      },
      supportNotice: '支援 Danbooru、Gelbooru、Safebooru、Rule34、e621 等'
    },
    preview: {
      title: '預覽'
    },
    categories: {
      title: '篩選分類',
      enableAll: '全選',
      disableAll: '全不選',
      items: {
        copyright: '版權',
        character: '角色',
        general: '一般',
        meta: '中繼資訊',
        other: '其他'
      },
      count_one: '{{count}} 個標籤',
      count_other: '{{count}} 個標籤'
    },
    filteredTags: {
      label: '篩選後的標籤',
      ariaLabel: '篩選後的標籤',
      empty: '暫無標籤。',
      copy: '複製標籤',
      copied: '已複製！'
    },
    history: {
      extractionTitle: '擷取歷史',
      imageTitle: '圖片歷史',
      searchExtraction: '搜尋標題、URL、標籤...',
      searchImages: '搜尋檔案名稱、提示詞、參數...',
      emptySearch: '沒有符合的記錄。',
      clearTooltip: '清空所有歷史',
      clearAction: '清空歷史',
      confirmMessage: '確定要清空嗎？',
      confirmYes: '是的，清空',
      confirmCancel: '取消',
      searchAriaLabel: '搜尋 {{context}}',
      searchFallback: '歷史',
      clearSearchTooltip: '清除搜尋',
      clearSearchAria: '清除搜尋'
    },
    mobile: {
      historyButton: '歷史',
      urlLabel: 'Booru 貼文 URL',
      urlPlaceholder: '貼上 URL 或拖放...',
      manualButton: '手動擷取',
      resetButton: '重設'
    },
    status: {
      resultLabel: '結果：'
    }
  },
  imageTool: {
    ...en.imageTool,
    title: '圖片中繼資料',
    dropCtaTitle: '拖放 PNG 到此處',
    dropCtaSubtitle: '或點選上傳',
    selectButton: '選擇 PNG',
    statusProcessing: '處理中...',
    previewMeta: '{{name}}（{{size}} KB）',
    positivePrompt: '正向提示詞',
    negativePrompt: '負向提示詞',
    parameters: '參數',
    copy: '複製',
    copyAll: '全部複製',
    copySuccess: '已複製！',
    noMetadata: '未找到生成中繼資料。',
    loadMetadata: '載入中繼資料',
    deleteEntry: '刪除記錄',
    historyTitle: '圖片歷史',
    historySearch: '搜尋檔案名稱、提示詞、參數...',
    previewAlt: '預覽',
    footer: {
      metadataNotice: 'PNG 中繼資料擷取用於 "parameters" 文字片段。'
    }
  },
  historyItem: {
    ...en.historyItem,
    load: '載入此歷史記錄',
    delete: '刪除此歷史記錄',
    previewAlt: '預覽'
  },
  imagePreview: {
    ...en.imagePreview,
    loading: '預覽載入中...',
    error: '無法載入預覽。',
    errorDetail: '伺服器代理錯誤或無效圖片',
    videoUnsupported: '您的瀏覽器不支援影片。',
    openFull: '開啟完整預覽',
    close: '關閉',
    reset: '重設',
    openOriginal: '開啟原圖'
  },
  booruList: {
    ...en.booruList,
    pageTitle: '熱門 Booru 排行榜',
    pageDescriptionShort: '按圖片總數與活躍度瀏覽頂級 booru 網站。',
    pageDescriptionLong: '發現全網最受歡迎的 booru 網站。根據圖片、會員與活躍度排名，資料來自 Booru.org。',
    searchPlaceholder: '搜尋 booru 網站...',
    filter: {
      all: '全部',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: '圖片',
      members: '成員',
      owner: '所有者'
    },
    sort: {
      label: '排序：',
      rank: '排名',
      images: '圖片數量',
      members: '成員數量',
      asc: '升序',
      desc: '降序'
    },
    itemsPerPage: '每頁：',
    resultsRange: '<strong>{{start}}-{{end}}</strong> / {{total}}',
    pagination: {
      previous: '上一頁',
      next: '下一頁',
      previousShort: '上',
      nextShort: '下'
    },
    emptyState: '未找到 booru 網站',
    loading: '正在載入 booru 資料...',
    errorTitle: '載入資料出錯',
    errors: {
      fetchFailed: '擷取 booru 資料失敗。',
      unknown: '載入排行榜時出現問題。'
    },
    ownerLabel: '所有者：',
    visit: '造訪 {{name}}'
  },
  booruDetail: {
    ...en.booruDetail,
    backButton: '返回 Booru 列表',
    notFoundTitle: '未找到 Booru',
    notFoundDescription: '在資料庫中找不到 booru 網域 "{{domain}}"。',
    statistics: '統計',
    totalImages: '圖片總數',
    totalMembers: '成員總數',
    shortName: '簡稱',
    owner: '所有者',
    hosted: '由 booru.org 託管',
    protocol: '協定',
    yes: '是',
    no: '否',
    visit: '造訪 {{name}}',
    loading: '載入中...'
  }
};
