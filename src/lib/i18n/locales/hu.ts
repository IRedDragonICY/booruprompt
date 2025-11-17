import { en } from './en';
import type { TranslationSchema } from './en';

export const hu: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Címke Kinyerő',
    language: 'Nyelv',
    english: 'Angol',
    indonesian: 'Indonéz',
    chinese: 'Kínai',
    languageSwitcher: {
      title: 'Felület nyelve',
      description: 'A böngészőben tárolva. Az alapértelmezett nyelv az angol.',
      instantNotice: 'A módosítások azonnal érvénybe lépnek újratöltés nélkül.',
      searchPlaceholder: 'Nyelvek keresése...',
      noResults: 'Nem találhatók nyelvek'
    },
    nav: {
      extractor: 'Címkék',
      image: 'Kép',
      booruList: 'Booru',
      settings: 'Beállítások'
    },
    actions: {
      ...en.common.actions,
      add: 'Hozzáadás',
      apply: 'Alkalmaz',
      back: 'Vissza',
      cancel: 'Mégse',
      clear: 'Törlés',
      close: 'Bezárás',
      confirm: 'Megerősítés',
      copy: 'Másolás',
      copied: 'Másolva!',
      delete: 'Törlés',
      save: 'Mentés',
      search: 'Keresés',
      all: 'Összes',
      none: 'Egyik sem'
    }
  },
  settings: {
    title: 'Beállítások',
    sections: {
      appearance: 'Megjelenés',
      colorTheme: 'Színtéma',
      dataFetch: 'Adatlekérési Módszer'
    },
    themeOptions: {
      system: 'Rendszer',
      light: 'Világos',
      dark: 'Sötét'
    },
    colorThemes: {
      blue: 'Kék',
      orange: 'Narancs',
      teal: 'Türkiz',
      rose: 'Rózsa',
      purple: 'Lila',
      green: 'Zöld',
      custom: 'Egyedi Szín'
    },
    customColor: {
      label: 'Egyedi Szín',
      pickerLabel: 'Egyedi színválasztó',
      inputLabel: 'Egyedi szín hex kód',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Szerver Proxy',
        description: 'Az alkalmazás szerverét használja az adatok lekéréséhez. Ajánlott, megbízhatóbb.'
      },
      clientProxy: {
        label: 'Kliens Oldali Proxy',
        description: 'Nyilvános CORS proxyt használ a böngészőjében. Kevésbé megbízható vagy korlátozott lehet.'
      }
    },
    clientProxy: {
      selectLabel: 'Válasszon kliens proxy szolgáltatást:',
      ariaLabel: 'Kliens proxy szolgáltatás választó',
      helper: 'A teljesítmény és a megbízhatóság eltérő a proxyk között.'
    },
    toggles: {
      autoExtract: {
        label: 'Automatikus Kivonás',
        description: 'Címkék automatikus kivonása érvényes URL beillesztése/beírása után.',
        tooltip: 'Automatikus címke kivonás engedélyezése vagy letiltása érvényes URL beillesztésekor/beírásakor'
      },
      previews: {
        label: 'Előnézetek Engedélyezése',
        description: 'Kép/videó előnézetek megjelenítése kivonás közben és az előzményekben.',
        tooltip: 'Kép/videó előnézetek engedélyezése vagy letiltása a sávszélesség megtakarítása vagy a lehetséges problémák elkerülése érdekében',
        note: 'A képek mindig a Szerver Proxyn keresztül kerülnek lekérésre.'
      },
      saveHistory: {
        label: 'Előzmények Mentése',
        description: 'Sikeres kivonások helyi tárolása a böngészőben.',
        tooltip: 'A kivonási előzmények mentésének engedélyezése vagy letiltása a böngésző helyi tárolójában'
      },
      unsupportedSites: {
        label: 'Engedélyezés Nem Támogatott Oldalakon',
        description: 'Próbáljon kivonni nem támogatott oldalakról hasonló oldal minták használatával. Lehet, hogy nem működik minden oldalon.',
        tooltip: 'Kivonás engedélyezése nem támogatott weboldalakon hasonló oldal minták használatával'
      },
      blacklist: {
        label: 'Kulcsszó Feketelista Engedélyezése',
        description: 'Adja meg a blokkolandó kulcsszavakat vesszővel, pontosvesszővel vagy új sorokkal elválasztva.',
        tooltip: 'Nem kívánt címkék blokkolása meghatározott kulcsszavak szűrésével',
        placeholder: 'Adja meg a blokkolandó kulcsszavakat…',
        ariaLabel: 'Feketelista kulcsszavak',
        reset: 'Visszaállítás Alapértelmezettre'
      }
    },
    historySize: {
      label: 'Maximális Előzmények Mérete',
      description: 'Állítsa be a bejegyzések maximális számát a kivonási és kép előzményekhez.'
    },
    accessibility: {
      themeOption: 'Téma {{label}}',
      colorThemeOption: 'Színtéma {{label}}',
      historySizeSelect: 'Maximális előzmények mérete'
    },
    historySizeOptions: {
      '10': '10 Bejegyzés',
      '30': '30 Bejegyzés',
      '50': '50 Bejegyzés',
      '100': '100 Bejegyzés',
      unlimited: 'Korlátlan'
    },
    support: {
      title: 'Támogatás és Visszajelzés',
      cta: 'Probléma Jelentése a GitHubon',
      description: 'Hibát talált vagy javaslata van? Tudassa velünk!'
    },
    modal: {
      close: 'Beállítások Bezárása'
    }
  }
};
