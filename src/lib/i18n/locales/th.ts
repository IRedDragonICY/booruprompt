import { en } from './en';
import type { TranslationSchema } from './en';

export const th: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'เครื่องมือดึงแท็ก Booru',
    language: 'ภาษา',
    english: 'อังกฤษ',
    indonesian: 'อินโดนีเซีย',
    chinese: 'จีน',
    languageSwitcher: {
      title: 'ภาษาอินเทอร์เฟซ',
      description: 'บันทึกในเบราว์เซอร์ของคุณ ภาษาเริ่มต้นคือภาษาอังกฤษ',
      instantNotice: 'การเปลี่ยนแปลงจะมีผลทันทีโดยไม่ต้องโหลดใหม่',
      searchPlaceholder: 'ค้นหาภาษา...',
      noResults: 'ไม่พบภาษา'
    },
    nav: {
      extractor: 'แท็ก',
      image: 'รูปภาพ',
      booruList: 'Booru',
      settings: 'การตั้งค่า'
    },
    actions: {
      ...en.common.actions,
      add: 'เพิ่ม',
      apply: 'ใช้',
      back: 'กลับ',
      cancel: 'ยกเลิก',
      clear: 'ล้าง',
      close: 'ปิด',
      confirm: 'ยืนยัน',
      copy: 'คัดลอก',
      copied: 'คัดลอกแล้ว!',
      delete: 'ลบ',
      save: 'บันทึก',
      search: 'ค้นหา',
      all: 'ทั้งหมด',
      none: 'ไม่มี'
    }
  },
  settings: {
    title: 'การตั้งค่า',
    sections: {
      appearance: 'รูปลักษณ์',
      colorTheme: 'ธีมสี',
      dataFetch: 'วิธีการดึงข้อมูล'
    },
    themeOptions: {
      system: 'ระบบ',
      light: 'สว่าง',
      dark: 'มืด'
    },
    colorThemes: {
      blue: 'น้ำเงิน',
      orange: 'ส้ม',
      teal: 'เขียวอมฟ้า',
      rose: 'ชมพู',
      purple: 'ม่วง',
      green: 'เขียว',
      custom: 'สีที่กำหนดเอง'
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
