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
    ...en.settings,
    title: 'ການຕັ້ງຄ່າ',
    themeOptions: {
      system: 'ລະບົບ',
      light: 'ສະຫວ່າງ',
      dark: 'ມືດ'
    }
  }
};
