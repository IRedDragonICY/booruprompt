import { en } from './en';
import type { TranslationSchema } from './en';

export const ko: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru 태그 추출기',
    language: '언어',
    english: '영어',
    indonesian: '인도네시아어',
    chinese: '중국어',
    languageSwitcher: {
      title: '인터페이스 언어',
      description: '브라우저에 저장됩니다. 기본 언어는 영어입니다.',
      instantNotice: '새로고침 없이 즉시 변경 사항이 적용됩니다.',
      searchPlaceholder: '언어 검색...',
      noResults: '언어를 찾을 수 없습니다'
    },
    nav: {
      extractor: '태그',
      image: '이미지',
      booruList: 'Booru',
      settings: '설정'
    },
    actions: {
      ...en.common.actions,
      add: '추가',
      apply: '적용',
      back: '뒤로',
      cancel: '취소',
      clear: '지우기',
      close: '닫기',
      confirm: '확인',
      copy: '복사',
      copied: '복사됨!',
      delete: '삭제',
      save: '저장',
      search: '검색',
      all: '전체',
      none: '없음'
    }
  },
  settings: {
    title: '설정',
    sections: {
      appearance: '외관',
      colorTheme: '색상 테마',
      dataFetch: '데이터 가져오기 방법'
    },
    themeOptions: {
      system: '시스템',
      light: '밝게',
      dark: '어둡게'
    },
    colorThemes: {
      blue: '파랑',
      orange: '주황',
      teal: '청록',
      rose: '장미',
      purple: '보라',
      green: '초록',
      custom: '사용자 정의 색상'
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
