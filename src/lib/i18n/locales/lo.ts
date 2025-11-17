import { en } from './en';
import type { TranslationSchema } from './en';

export const lo: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'ພາສາ',
    english: 'ອັງກິດ',
    indonesian: 'ອິນໂດເນເຊຍ',
    chinese: 'ຈີນ',
    languageSwitcher: {
      title: 'ພາສາສ່ວນຕິດຕໍ່',
      description: 'ບັນທຶກໄວ້ໃນບຣາວເຊີຂອງທ່ານ. ພາສາເລີ່ມຕົ້ນແມ່ນພາສາອັງກິດ.',
      instantNotice: 'ການປ່ຽນແປງຈະຖືກນຳໃຊ້ທັນທີໂດຍບໍ່ຕ້ອງໂຫລດຄືນ.',
      searchPlaceholder: 'ຄົ້ນຫາພາສາ...',
      noResults: 'ບໍ່ພົບພາສາ'
    },
    nav: {
      extractor: 'ແທັກ',
      image: 'ຮູບພາບ',
      booruList: 'Booru',
      settings: 'ການຕັ້ງຄ່າ'
    },
    actions: {
      ...en.common.actions,
      add: 'ເພີ່ມ',
      apply: 'ນຳໃຊ້',
      back: 'ກັບຄືນ',
      cancel: 'ຍົກເລີກ',
      clear: 'ລຶບລ້າງ',
      close: 'ປິດ',
      confirm: 'ຢືນຢັນ',
      copy: 'ສຳເນົາ',
      copied: 'ສຳເນົາແລ້ວ!',
      delete: 'ລຶບ',
      save: 'ບັນທຶກ',
      search: 'ຄົ້ນຫາ',
      all: 'ທັງໝົດ',
      none: 'ບໍ່ມີ'
    }
  },
  settings: {
    title: 'ການຕັ້ງຄ່າ',
    sections: {
      appearance: 'ຮູບລັກສະນະ',
      colorTheme: 'ຊຸດສີ',
      dataFetch: 'ວິທີການດຶງຂໍ້ມູນ'
    },
    themeOptions: {
      system: 'ລະບົບ',
      light: 'ສະຫວ່າງ',
      dark: 'ມືດ'
    },
    colorThemes: {
      blue: 'ສີຟ້າ',
      orange: 'ສົ້ມ',
      teal: 'ສີຟ້າເຂັ້ມ',
      rose: 'ສີບົວ',
      purple: 'ສີມ່ວງ',
      green: 'ເຂົ້າ',
      custom: 'ສີກຳນົດເອງ'
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
