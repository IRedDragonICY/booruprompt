import { en } from './en';
import type { TranslationSchema } from './en';

export const vi: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Công Cụ Trích Xuất Thẻ Booru',
    language: 'Ngôn ngữ',
    english: 'Tiếng Anh',
    indonesian: 'Tiếng Indonesia',
    chinese: 'Tiếng Trung',
    languageSwitcher: {
      title: 'Ngôn ngữ giao diện',
      description: 'Lưu trong trình duyệt của bạn. Ngôn ngữ mặc định là tiếng Anh.',
      instantNotice: 'Thay đổi được áp dụng ngay lập tức mà không cần tải lại.',
      searchPlaceholder: 'Tìm kiếm ngôn ngữ...',
      noResults: 'Không tìm thấy ngôn ngữ'
    },
    nav: {
      extractor: 'Thẻ',
      image: 'Hình ảnh',
      booruList: 'Booru',
      settings: 'Cài đặt'
    },
    actions: {
      ...en.common.actions,
      add: 'Thêm',
      apply: 'Áp dụng',
      back: 'Quay lại',
      cancel: 'Hủy',
      clear: 'Xóa',
      close: 'Đóng',
      confirm: 'Xác nhận',
      copy: 'Sao chép',
      copied: 'Đã sao chép!',
      delete: 'Xóa',
      save: 'Lưu',
      search: 'Tìm kiếm',
      all: 'Tất cả',
      none: 'Không có'
    }
  },
  settings: {
    title: 'Cài đặt',
    sections: {
      appearance: 'Giao diện',
      colorTheme: 'Chủ đề màu',
      dataFetch: 'Phương thức lấy dữ liệu'
    },
    themeOptions: {
      system: 'Hệ thống',
      light: 'Sáng',
      dark: 'Tối'
    },
    colorThemes: {
      blue: 'Xanh dương',
      orange: 'Cam',
      teal: 'Xanh ngọc',
      rose: 'Hồng',
      purple: 'Tím',
      green: 'Xanh lá',
      custom: 'Màu tùy chỉnh'
    },
    customColor: {
      label: 'Màu tùy chỉnh',
      pickerLabel: 'Bộ chọn màu tùy chỉnh',
      inputLabel: 'Mã hex màu tùy chỉnh',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Proxy Máy chủ',
        description: 'Sử dụng máy chủ của ứng dụng này để lấy dữ liệu. Khuyến nghị, đáng tin cậy hơn.'
      },
      clientProxy: {
        label: 'Proxy Phía Client',
        description: 'Sử dụng proxy CORS công khai trong trình duyệt của bạn. Có thể kém tin cậy hơn hoặc bị giới hạn.'
      }
    },
    clientProxy: {
      selectLabel: 'Chọn dịch vụ proxy client:',
      ariaLabel: 'Bộ chọn dịch vụ proxy client',
      helper: 'Hiệu suất và độ tin cậy khác nhau giữa các proxy.'
    },
    toggles: {
      autoExtract: {
        label: 'Trích xuất Tự động',
        description: 'Tự động trích xuất thẻ sau khi dán/nhập URL hợp lệ.',
        tooltip: 'Bật hoặc tắt trích xuất thẻ tự động khi dán/nhập URL hợp lệ'
      },
      previews: {
        label: 'Bật Xem trước',
        description: 'Hiển thị xem trước hình ảnh/video trong quá trình trích xuất và trong lịch sử.',
        tooltip: 'Bật hoặc tắt xem trước hình ảnh/video để tiết kiệm băng thông hoặc tránh các vấn đề tiềm ẩn',
        note: 'Hình ảnh luôn được lấy qua Proxy Máy chủ.'
      },
      saveHistory: {
        label: 'Lưu Lịch sử',
        description: 'Lưu trữ các lần trích xuất thành công cục bộ trong trình duyệt của bạn.',
        tooltip: 'Bật hoặc tắt lưu lịch sử trích xuất vào bộ nhớ cục bộ của trình duyệt'
      },
      unsupportedSites: {
        label: 'Bật cho Trang không được Hỗ trợ',
        description: 'Thử trích xuất từ các trang không được hỗ trợ bằng cách sử dụng các mẫu trang tương tự. Có thể không hoạt động cho tất cả các trang.',
        tooltip: 'Bật trích xuất cho các trang web không được hỗ trợ bằng cách sử dụng các mẫu trang tương tự'
      },
      blacklist: {
        label: 'Bật Danh sách Đen Từ khóa',
        description: 'Nhập các từ khóa cần chặn, phân tách bằng dấu phẩy, dấu chấm phẩy hoặc dòng mới.',
        tooltip: 'Chặn các thẻ không mong muốn bằng cách lọc các từ khóa cụ thể',
        placeholder: 'Nhập từ khóa cần chặn…',
        ariaLabel: 'Từ khóa Danh sách Đen',
        reset: 'Đặt lại về Mặc định'
      }
    },
    historySize: {
      label: 'Kích thước Lịch sử Tối đa',
      description: 'Đặt số lượng mục tối đa cho cả lịch sử trích xuất và hình ảnh.'
    },
    accessibility: {
      themeOption: 'Chủ đề {{label}}',
      colorThemeOption: 'Chủ đề màu {{label}}',
      historySizeSelect: 'Kích thước lịch sử tối đa'
    },
    historySizeOptions: {
      '10': '10 Mục',
      '30': '30 Mục',
      '50': '50 Mục',
      '100': '100 Mục',
      unlimited: 'Không giới hạn'
    },
    support: {
      title: 'Hỗ trợ & Phản hồi',
      cta: 'Báo cáo Vấn đề trên GitHub',
      description: 'Tìm thấy lỗi hoặc có đề xuất? Hãy cho chúng tôi biết!'
    },
    modal: {
      close: 'Đóng Cài đặt'
    }
  },
  extractor: {
    header: {
      title: 'Công Cụ Trích Xuất Thẻ Booru',
      subtitle: 'Trích xuất thẻ từ bảng hình ảnh booru',
      supported: 'Nền tảng được hỗ trợ:',
      urlLabel: 'URL Bài Đăng Booru',
      urlPlaceholder: 'Dán URL bài đăng booru của bạn vào đây...',
      manualButton: 'Trích Xuất Thủ Công',
      resetButton: 'Đặt Lại',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Công Cụ Trích Xuất Thẻ Booru',
      heroSubtitle: 'Trích xuất, lọc và sao chép thẻ từ các trang booru ngay lập tức',
      features: {
        smart: { title: 'Thông Minh', subtitle: 'Tự động trích xuất' },
        fast: { title: 'Nhanh Chóng', subtitle: 'Kết quả tức thì' },
        private: { title: 'Riêng Tư', subtitle: 'Phía client' },
        copy: { title: 'Sao Chép', subtitle: 'Một cú nhấp' }
      },
      cta: {
        paste: 'Dán',
        extract: 'Trích Xuất',
        filter: 'Lọc',
        copy: 'Sao Chép'
      },
      supportNotice: 'Hỗ trợ Danbooru, Gelbooru, Safebooru, Rule34, e621 và nhiều hơn nữa'
    },
    preview: {
      title: 'Xem Trước'
    },
    status: {
      resultLabel: 'Kết quả cho:'
    },
    categories: {
      title: 'Lọc Danh Mục',
      enableAll: 'Tất Cả',
      disableAll: 'Không Có',
      items: {
        copyright: 'Bản Quyền',
        character: 'Nhân Vật',
        general: 'Chung',
        meta: 'Meta',
        other: 'Khác'
      },
      count_one: '{{count}} thẻ',
      count_other: '{{count}} thẻ'
    },
    filteredTags: {
      label: 'Thẻ Đã Lọc',
      ariaLabel: 'Thẻ đã lọc',
      empty: 'Không có thẻ để hiển thị.',
      copy: 'Sao Chép Thẻ',
      copied: 'Đã Sao Chép!'
    },
    history: {
      extractionTitle: 'Lịch Sử Trích Xuất',
      imageTitle: 'Lịch Sử Hình Ảnh',
      searchExtraction: 'Tìm tiêu đề, url, thẻ...',
      searchImages: 'Tìm tên tệp, lời nhắc, tham số...',
      emptySearch: 'Không có mục nào khớp với tìm kiếm của bạn.',
      clearTooltip: 'Xóa Tất Cả Lịch Sử',
      clearAction: 'Xóa Lịch Sử',
      confirmMessage: 'Thực sự xóa?',
      confirmYes: 'Có, Xóa',
      confirmCancel: 'Hủy',
      searchAriaLabel: 'Tìm {{context}}',
      searchFallback: 'lịch sử',
      clearSearchTooltip: 'Xóa Tìm Kiếm',
      clearSearchAria: 'Xóa tìm kiếm'
    },
    mobile: {
      historyButton: 'Lịch Sử',
      urlLabel: 'URL Bài Đăng Booru',
      urlPlaceholder: 'Dán URL hoặc Kéo & Thả...',
      manualButton: 'Trích Xuất Thủ Công',
      resetButton: 'Đặt Lại'
    }
  },
  imageTool: {
    title: 'Siêu Dữ Liệu Hình Ảnh',
    dropCtaTitle: 'Kéo & Thả PNG Vào Đây',
    dropCtaSubtitle: 'hoặc nhấp để tải lên',
    selectButton: 'Chọn PNG',
    statusProcessing: 'Đang xử lý...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'Lời Nhắc Tích Cực',
    negativePrompt: 'Lời Nhắc Tiêu Cực',
    parameters: 'Tham Số',
    copy: 'Sao Chép',
    copyAll: 'Sao Chép Tất Cả',
    copySuccess: 'Đã Sao Chép!',
    noMetadata: 'Không tìm thấy siêu dữ liệu tạo.',
    loadMetadata: 'Tải Siêu Dữ Liệu',
    deleteEntry: 'Xóa Mục',
    historyTitle: 'Lịch Sử Hình Ảnh',
    historySearch: 'Tìm tên tệp, lời nhắc, tham số...',
    previewAlt: 'Xem Trước',
    footer: {
      metadataNotice: "Trích xuất siêu dữ liệu PNG cho đoạn văn bản 'parameters'."
    }
  },
  historyItem: {
    load: 'Tải mục lịch sử này',
    delete: 'Xóa mục lịch sử này',
    previewAlt: 'Xem Trước'
  },
  imagePreview: {
    loading: 'Đang tải xem trước...',
    error: 'Không thể tải xem trước.',
    errorDetail: 'Lỗi proxy máy chủ hoặc hình ảnh không hợp lệ',
    videoUnsupported: 'Trình duyệt của bạn không hỗ trợ video.',
    openFull: 'Mở xem trước kích thước đầy đủ',
    close: 'Đóng',
    reset: 'Đặt Lại',
    openOriginal: 'Mở bản gốc'
  },
  booruList: {
    pageTitle: 'Bảng Xếp Hạng Booru Hàng Đầu',
    pageDescriptionShort: 'Khám phá các trang booru hàng đầu được xếp hạng theo tổng số hình ảnh và hoạt động.',
    pageDescriptionLong: 'Khám phá các trang booru phổ biến nhất từ khắp nơi trên web. Xếp hạng theo tổng số hình ảnh, số thành viên và hoạt động với dữ liệu từ Booru.org.',
    searchPlaceholder: 'Tìm kiếm trang booru...',
    filter: {
      all: 'Tất Cả',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Hình Ảnh',
      members: 'Thành Viên',
      owner: 'Chủ Sở Hữu'
    },
    sort: {
      label: 'Sắp xếp theo:',
      rank: 'Xếp Hạng (Hàng Đầu)',
      images: 'Số Lượng Hình Ảnh',
      members: 'Số Lượng Thành Viên',
      asc: 'Tăng Dần',
      desc: 'Giảm Dần'
    },
    itemsPerPage: 'Mỗi trang:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> của {{total}}',
    pagination: {
      previous: 'Trước',
      next: 'Tiếp',
      previousShort: 'Trước',
      nextShort: 'Tiếp'
    },
    emptyState: 'Không tìm thấy trang booru',
    loading: 'Đang tải dữ liệu booru...',
    errorTitle: 'Lỗi Tải Dữ Liệu',
    errors: {
      fetchFailed: 'Không thể tải dữ liệu booru.',
      unknown: 'Đã xảy ra lỗi khi tải bảng xếp hạng.'
    },
    ownerLabel: 'Chủ Sở Hữu:',
    visit: 'Truy Cập {{name}}'
  },
  booruDetail: {
    backButton: 'Quay Lại Danh Sách Booru',
    notFoundTitle: 'Không Tìm Thấy Booru',
    notFoundDescription: 'Tên miền booru "{{domain}}" không được tìm thấy trong cơ sở dữ liệu của chúng tôi.',
    statistics: 'Thống Kê',
    totalImages: 'Tổng Số Hình Ảnh',
    totalMembers: 'Tổng Số Thành Viên',
    shortName: 'Tên Ngắn',
    owner: 'Chủ Sở Hữu',
    hosted: 'Được lưu trữ bởi booru.org',
    protocol: 'Giao Thức',
    yes: 'Có',
    no: 'Không',
    visit: 'Truy Cập {{name}}',
    loading: 'Đang tải...'
  }
};
