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
      label: 'สีที่กำหนดเอง',
      pickerLabel: 'ตัวเลือกสีที่กำหนดเอง',
      inputLabel: 'รหัสฐานสิบหกสีที่กำหนดเอง',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'พร็อกซีเซิร์ฟเวอร์',
        description: 'ใช้เซิร์ฟเวอร์ของแอปพลิเคชันนี้ในการดึงข้อมูล แนะนำ เชื่อถือได้มากกว่า'
      },
      clientProxy: {
        label: 'พร็อกซีฝั่งไคลเอนต์',
        description: 'ใช้พร็อกซี CORS สาธารณะในเบราว์เซอร์ของคุณ อาจเชื่อถือได้น้อยกว่าหรือมีข้อจำกัด'
      }
    },
    clientProxy: {
      selectLabel: 'เลือกบริการพร็อกซีไคลเอนต์:',
      ariaLabel: 'ตัวเลือกบริการพร็อกซีไคลเอนต์',
      helper: 'ประสิทธิภาพและความเชื่อถือแตกต่างกันไปในแต่ละพร็อกซี'
    },
    toggles: {
      autoExtract: {
        label: 'การดึงข้อมูลอัตโนมัติ',
        description: 'ดึงแท็กโดยอัตโนมัติหลังจากวาง/พิมพ์ URL ที่ถูกต้อง',
        tooltip: 'เปิดหรือปิดการดึงแท็กอัตโนมัติเมื่อวาง/พิมพ์ URL ที่ถูกต้อง'
      },
      previews: {
        label: 'เปิดใช้งานพรีวิว',
        description: 'แสดงพรีวิวรูปภาพ/วิดีโอระหว่างการดึงข้อมูลและในประวัติ',
        tooltip: 'เปิดหรือปิดพรีวิวรูปภาพ/วิดีโอเพื่อประหยัดแบนด์วิธหรือหลีกเลี่ยงปัญหาที่อาจเกิดขึ้น',
        note: 'รูปภาพจะถูกดึงผ่านพร็อกซีเซิร์ฟเวอร์เสมอ'
      },
      saveHistory: {
        label: 'บันทึกประวัติ',
        description: 'เก็บการดึงข้อมูลที่สำเร็จไว้ในเบราว์เซอร์ของคุณ',
        tooltip: 'เปิดหรือปิดการบันทึกประวัติการดึงข้อมูลไปยังที่เก็บข้อมูลในเครื่องของเบราว์เซอร์'
      },
      unsupportedSites: {
        label: 'เปิดใช้งานสำหรับเว็บไซต์ที่ไม่รองรับ',
        description: 'พยายามดึงข้อมูลจากเว็บไซต์ที่ไม่รองรับโดยใช้รูปแบบเว็บไซต์ที่คล้ายกัน อาจใช้ไม่ได้กับทุกเว็บไซต์',
        tooltip: 'เปิดใช้งานการดึงข้อมูลสำหรับเว็บไซต์ที่ไม่รองรับโดยใช้รูปแบบเว็บไซต์ที่คล้ายกัน'
      },
      blacklist: {
        label: 'เปิดใช้งานบัญชีดำคำสำคัญ',
        description: 'ป้อนคำสำคัญที่จะบล็อก คั่นด้วยจุลภาค เครื่องหมายอัฒภาค หรือบรรทัดใหม่',
        tooltip: 'บล็อกแท็กที่ไม่ต้องการโดยกรองคำสำคัญเฉพาะ',
        placeholder: 'ป้อนคำสำคัญที่จะบล็อก…',
        ariaLabel: 'คำสำคัญในบัญชีดำ',
        reset: 'รีเซ็ตเป็นค่าเริ่มต้น'
      }
    },
    historySize: {
      label: 'ขนาดประวัติสูงสุด',
      description: 'ตั้งค่าจำนวนรายการสูงสุดสำหรับทั้งประวัติการดึงข้อมูลและรูปภาพ'
    },
    accessibility: {
      themeOption: 'ธีม {{label}}',
      colorThemeOption: 'ธีมสี {{label}}',
      historySizeSelect: 'ขนาดประวัติสูงสุด'
    },
    historySizeOptions: {
      '10': '10 รายการ',
      '30': '30 รายการ',
      '50': '50 รายการ',
      '100': '100 รายการ',
      unlimited: 'ไม่จำกัด'
    },
    support: {
      title: 'การสนับสนุนและคำติชม',
      cta: 'รายงานปัญหาบน GitHub',
      description: 'พบบั๊กหรือมีข้อเสนอแนะ? แจ้งให้เราทราบ!'
    },
    modal: {
      close: 'ปิดการตั้งค่า'
    }
  }
};
