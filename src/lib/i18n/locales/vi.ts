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
    ...en.settings,
    title: 'Cài đặt',
    themeOptions: {
      system: 'Hệ thống',
      light: 'Sáng',
      dark: 'Tối'
    }
  }
};
