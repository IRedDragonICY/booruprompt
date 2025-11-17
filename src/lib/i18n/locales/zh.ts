import { en } from './en';
import type { TranslationSchema } from './en';

export const zh: TranslationSchema = {
  ...en,
  common: {
    appName: 'Booru 标签提取器',
    language: '语言',
    english: '英语',
    indonesian: '印尼语',
    chinese: '中文',
    author: 'IRedDragonICY',
    defaultDescription: '即时提取、筛选并复制 booru 帖子的标签。',
    unknown: '未知',
    languageSwitcher: {
      title: '界面语言',
      description: '保存在浏览器中。默认语言为英语。',
      instantNotice: '无需刷新即可立即生效。',
      searchPlaceholder: '搜索语言...',
      noResults: '没有找到语言'
    },
    nav: {
      extractor: '标签',
      image: '图片',
      booruList: 'Booru 排行',
      settings: '设置'
    },
    navTooltip: {
      extractor: '标签提取器',
      image: '图片元数据',
      booruList: 'Booru 排行榜',
      settings: '设置'
    },
    dropOverlay: {
      url: '拖放 URL',
      png: '拖放 PNG'
    },
    actions: {
      add: '添加',
      apply: '应用',
      back: '返回',
      cancel: '取消',
      clear: '清除',
      close: '关闭',
      confirm: '确认',
      copy: '复制',
      copied: '已复制！',
      delete: '删除',
      done: '完成',
      edit: '编辑',
      next: '下一步',
      previous: '上一步',
      refresh: '刷新',
      reset: '重置',
      retry: '重试',
      save: '保存',
      search: '搜索',
      select: '选择',
      submit: '提交',
      all: '全部',
      none: '无',
      visit: '访问',
      previousShort: '上',
      nextShort: '下'
    },
    status: {
      loading: '加载中...',
      processing: '处理中...'
    },
    footer: {
      madeWith: '由衷制作',
      by: '来自'
    },
    statusBar: {
      serverProxy: '服务器代理。',
      clientProxy: '客户端代理（{{proxy}}）。',
      historyEnabled: '历史记录已启用（{{size}}）。',
      historyDisabled: '历史记录已禁用。',
      historyUnlimited: '无限制',
      historyEntries: '{{count}} 条记录'
    }
  },
  settings: {
    ...en.settings,
    title: '设置',
    sections: {
      appearance: '外观',
      colorTheme: '配色方案',
      dataFetch: '数据获取方式'
    },
    themeOptions: {
      system: '跟随系统',
      light: '浅色',
      dark: '深色'
    },
    colorThemes: {
      blue: '蓝色',
      orange: '橙色',
      teal: '青绿',
      rose: '玫瑰',
      purple: '紫色',
      green: '绿色',
      custom: '自定义颜色'
    },
    customColor: {
      label: '自定义颜色',
      pickerLabel: '自定义颜色选择器',
      inputLabel: '自定义颜色十六进制',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: '服务器代理',
        description: '使用本应用的服务器获取数据。推荐且更稳定。'
      },
      clientProxy: {
        label: '客户端代理',
        description: '在浏览器中使用公共 CORS 代理，可能不稳定或受限。'
      }
    },
    clientProxy: {
      selectLabel: '选择客户端代理服务：',
      ariaLabel: '客户端代理选择器',
      helper: '不同代理的性能与稳定性会有所不同。'
    },
    toggles: {
      autoExtract: {
        label: '自动提取',
        description: '粘贴/输入有效 URL 后自动提取标签。',
        tooltip: '启用或禁用粘贴/输入 URL 时的自动提取'
      },
      previews: {
        label: '启用预览',
        description: '在提取和历史记录中显示图像/视频预览。',
        tooltip: '启用或禁用预览以节省带宽或避免问题',
        note: '图像始终通过服务器代理获取。'
      },
      saveHistory: {
        label: '保存历史',
        description: '在浏览器本地保存成功的提取。',
        tooltip: '将提取历史保存到浏览器本地存储'
      },
      unsupportedSites: {
        label: '启用未支持站点',
        description: '尝试使用相似模式从未支持站点提取，结果不保证。',
        tooltip: '通过相似站点模式在未支持站点上尝试提取'
      },
      blacklist: {
        label: '启用关键词黑名单',
        description: '输入要屏蔽的关键词，使用逗号、分号或换行分隔。',
        tooltip: '通过过滤特定关键词屏蔽不想要的标签',
        placeholder: '请输入要屏蔽的关键词…',
        ariaLabel: '黑名单关键词',
        reset: '恢复默认'
      }
    },
    historySize: {
      label: '历史记录上限',
      description: '设置提取与图片历史的最大条数。'
    },
    historySizeOptions: {
      '10': '10 条',
      '30': '30 条',
      '50': '50 条',
      '100': '100 条',
      unlimited: '无限制'
    },
    support: {
      title: '支持与反馈',
      cta: '在 GitHub 报告问题',
      description: '发现 bug 或有建议？告诉我们！'
    },
    modal: {
      close: '关闭设置'
    },
    accessibility: {
      themeOption: '{{label}} 主题',
      colorThemeOption: '{{label}} 配色',
      historySizeSelect: '历史记录上限'
    }
  },
  extractor: {
    ...en.extractor,
    header: {
      title: 'Booru 标签提取器',
      subtitle: '从 booru 图站提取标签',
      supported: '支持的平台：',
      urlLabel: 'Booru 帖子 URL',
      urlPlaceholder: '在此粘贴 booru 帖子 URL...',
      manualButton: '手动提取',
      resetButton: '重置',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Booru 标签提取器',
      heroSubtitle: '即时提取、筛选并复制 booru 标签',
      features: {
        smart: { title: '智能', subtitle: '自动提取' },
        fast: { title: '快速', subtitle: '即时结果' },
        private: { title: '私密', subtitle: '在客户端运行' },
        copy: { title: '复制', subtitle: '一键复制' }
      },
      cta: {
        paste: '粘贴',
        extract: '提取',
        filter: '筛选',
        copy: '复制'
      },
      supportNotice: '支持 Danbooru、Gelbooru、Safebooru、Rule34、e621 等'
    },
    preview: {
      title: '预览'
    },
    categories: {
      title: '筛选分类',
      enableAll: '全选',
      disableAll: '全不选',
      items: {
        copyright: '版权',
        character: '角色',
        general: '普通',
        meta: '元信息',
        other: '其他'
      },
      count_one: '{{count}} 个标签',
      count_other: '{{count}} 个标签'
    },
    filteredTags: {
      label: '筛选后的标签',
      ariaLabel: '筛选后的标签',
      empty: '暂无标签。',
      copy: '复制标签',
      copied: '已复制！'
    },
    history: {
      extractionTitle: '提取历史',
      imageTitle: '图片历史',
      searchExtraction: '搜索标题、URL、标签...',
      searchImages: '搜索文件名、提示词、参数...',
      emptySearch: '没有匹配的记录。',
      clearTooltip: '清空所有历史',
      clearAction: '清空历史',
      confirmMessage: '确定要清空吗？',
      confirmYes: '是的，清空',
      confirmCancel: '取消',
      searchAriaLabel: '搜索 {{context}}',
      searchFallback: '历史',
      clearSearchTooltip: '清除搜索',
      clearSearchAria: '清除搜索'
    },
    mobile: {
      historyButton: '历史',
      urlLabel: 'Booru 帖子 URL',
      urlPlaceholder: '粘贴 URL 或拖放...',
      manualButton: '手动提取',
      resetButton: '重置'
    },
    status: {
      resultLabel: '结果：'
    }
  },
  imageTool: {
    ...en.imageTool,
    title: '图片元数据',
    dropCtaTitle: '拖放 PNG 到此处',
    dropCtaSubtitle: '或点击上传',
    selectButton: '选择 PNG',
    statusProcessing: '处理中...',
    previewMeta: '{{name}}（{{size}} KB）',
    positivePrompt: '正向提示词',
    negativePrompt: '负向提示词',
    parameters: '参数',
    copy: '复制',
    copyAll: '全部复制',
    copySuccess: '已复制！',
    noMetadata: '未找到生成元数据。',
    loadMetadata: '加载元数据',
    deleteEntry: '删除记录',
    historyTitle: '图片历史',
    historySearch: '搜索文件名、提示词、参数...',
    previewAlt: '预览',
    footer: {
      metadataNotice: 'PNG 元数据提取用于 “parameters” 文本片段。'
    }
  },
  historyItem: {
    ...en.historyItem,
    load: '加载此历史记录',
    delete: '删除此历史记录',
    previewAlt: '预览'
  },
  imagePreview: {
    ...en.imagePreview,
    loading: '预览加载中...',
    error: '无法加载预览。',
    errorDetail: '服务器代理错误或无效图片',
    videoUnsupported: '您的浏览器不支持视频。',
    openFull: '打开完整预览',
    close: '关闭',
    reset: '重置',
    openOriginal: '打开原图'
  },
  booruList: {
    ...en.booruList,
    pageTitle: '热门 Booru 排行榜',
    pageDescriptionShort: '按图片总数与活跃度浏览顶级 booru 站点。',
    pageDescriptionLong: '发现全网最受欢迎的 booru 站点。根据图片、会员与活跃度排名，数据来自 Booru.org。',
    searchPlaceholder: '搜索 booru 站点...',
    filter: {
      all: '全部',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: '图片',
      members: '成员',
      owner: '所有者'
    },
    sort: {
      label: '排序：',
      rank: '排名',
      images: '图片数量',
      members: '成员数量',
      asc: '升序',
      desc: '降序'
    },
    itemsPerPage: '每页：',
    resultsRange: '<strong>{{start}}-{{end}}</strong> / {{total}}',
    pagination: {
      previous: '上一页',
      next: '下一页',
      previousShort: '上',
      nextShort: '下'
    },
    emptyState: '未找到 booru 站点',
    loading: '正在加载 booru 数据...',
    errorTitle: '加载数据出错',
    errors: {
      fetchFailed: '获取 booru 数据失败。',
      unknown: '加载排行榜时出现问题。'
    },
    ownerLabel: '所有者：',
    visit: '访问 {{name}}'
  },
  booruDetail: {
    ...en.booruDetail,
    backButton: '返回 Booru 列表',
    notFoundTitle: '未找到 Booru',
    notFoundDescription: '在数据库中找不到 booru 域名 "{{domain}}"。',
    statistics: '统计',
    totalImages: '图片总数',
    totalMembers: '成员总数',
    shortName: '简称',
    owner: '所有者',
    hosted: '由 booru.org 托管',
    protocol: '协议',
    yes: '是',
    no: '否',
    visit: '访问 {{name}}',
    loading: '加载中...'
  }
};
