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
  }
};
