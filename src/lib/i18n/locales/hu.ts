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
  },
  extractor: {
    header: {
      title: 'Booru Címke Kinyerő',
      subtitle: 'Címkék kinyerése booru képtáblákból',
      supported: 'Támogatott platformok:',
      urlLabel: 'Booru Bejegyzés URL',
      urlPlaceholder: 'Illessze be a booru bejegyzés URL-jét ide...',
      manualButton: 'Manuális Kinyerés',
      resetButton: 'Visszaállítás',
      activePlaceholder: '—'
    },
    info: {
      heroTitle: 'Booru Címke Kinyerő',
      heroSubtitle: 'Címkék kinyerése, szűrése és másolása booru oldalakról azonnal',
      features: {
        smart: { title: 'Okos', subtitle: 'Automatikus kinyerés' },
        fast: { title: 'Gyors', subtitle: 'Azonnali eredmények' },
        private: { title: 'Privát', subtitle: 'Kliens oldali' },
        copy: { title: 'Másolás', subtitle: 'Egy kattintás' }
      },
      cta: {
        paste: 'Beillesztés',
        extract: 'Kinyerés',
        filter: 'Szűrés',
        copy: 'Másolás'
      },
      supportNotice: 'Támogatja a Danbooru, Gelbooru, Safebooru, Rule34, e621 és más oldalakat'
    },
    preview: {
      title: 'Előnézet'
    },
    status: {
      resultLabel: 'Eredmény:'
    },
    categories: {
      title: 'Kategóriák Szűrése',
      enableAll: 'Összes',
      disableAll: 'Egyik sem',
      items: {
        copyright: 'Szerzői Jog',
        character: 'Karakter',
        general: 'Általános',
        meta: 'Meta',
        other: 'Egyéb'
      },
      count_one: '{{count}} címke',
      count_other: '{{count}} címke'
    },
    filteredTags: {
      label: 'Szűrt Címkék',
      ariaLabel: 'Szűrt címkék',
      empty: 'Nincsenek megjelenítendő címkék.',
      copy: 'Címkék Másolása',
      copied: 'Másolva!'
    },
    history: {
      extractionTitle: 'Kinyerési Előzmények',
      imageTitle: 'Kép Előzmények',
      searchExtraction: 'Cím, url, címkék keresése...',
      searchImages: 'Fájlnév, promptok, paraméterek keresése...',
      emptySearch: 'Nincs a keresésnek megfelelő bejegyzés.',
      clearTooltip: 'Összes Előzmény Törlése',
      clearAction: 'Előzmények Törlése',
      confirmMessage: 'Biztosan törli?',
      confirmYes: 'Igen, Törlés',
      confirmCancel: 'Mégse',
      searchAriaLabel: '{{context}} keresése',
      searchFallback: 'előzmények',
      clearSearchTooltip: 'Keresés Törlése',
      clearSearchAria: 'Keresés törlése'
    },
    mobile: {
      historyButton: 'Előzmények',
      urlLabel: 'Booru Bejegyzés URL',
      urlPlaceholder: 'URL Beillesztése vagy Húzás & Ejtés...',
      manualButton: 'Manuális Kinyerés',
      resetButton: 'Visszaállítás'
    }
  },
  imageTool: {
    title: 'Kép Metaadatok',
    dropCtaTitle: 'Húzza & Ejtse a PNG-t Ide',
    dropCtaSubtitle: 'vagy kattintson a feltöltéshez',
    selectButton: 'PNG Kiválasztása',
    statusProcessing: 'Feldolgozás...',
    previewMeta: '{{name}} ({{size}} KB)',
    positivePrompt: 'Pozitív Prompt',
    negativePrompt: 'Negatív Prompt',
    parameters: 'Paraméterek',
    copy: 'Másolás',
    copyAll: 'Összes Másolása',
    copySuccess: 'Másolva!',
    noMetadata: 'Nem találhatók generálási metaadatok.',
    loadMetadata: 'Metaadatok Betöltése',
    deleteEntry: 'Bejegyzés Törlése',
    historyTitle: 'Kép Előzmények',
    historySearch: 'Fájlnév, promptok, paraméterek keresése...',
    previewAlt: 'Előnézet',
    footer: {
      metadataNotice: "PNG metaadat kinyerés a 'parameters' szövegrészlethez."
    }
  },
  historyItem: {
    load: 'Előzmény bejegyzés betöltése',
    delete: 'Előzmény bejegyzés törlése',
    previewAlt: 'Előnézet'
  },
  imagePreview: {
    loading: 'Előnézet betöltése...',
    error: 'Az előnézet betöltése sikertelen.',
    errorDetail: 'Szerver proxy hiba vagy érvénytelen kép',
    videoUnsupported: 'A böngésző nem támogatja a videót.',
    openFull: 'Teljes méretű előnézet megnyitása',
    close: 'Bezárás',
    reset: 'Visszaállítás',
    openOriginal: 'Eredeti megnyitása'
  },
  booruList: {
    pageTitle: 'Top Booru Rangsor',
    pageDescriptionShort: 'Fedezze fel a legjobb booru oldalakat összképszám és aktivitás alapján rangsorolva.',
    pageDescriptionLong: 'Fedezze fel a legnépszerűbb booru oldalakat a weben. Rangsorolva összképszám, tagszám és aktivitás szerint a Booru.org adataival.',
    searchPlaceholder: 'Booru oldalak keresése...',
    filter: {
      all: 'Összes',
      sfw: 'SFW',
      nsfw: 'NSFW'
    },
    stats: {
      images: 'Képek',
      members: 'Tagok',
      owner: 'Tulajdonos'
    },
    sort: {
      label: 'Rendezés:',
      rank: 'Rangsor (Top)',
      images: 'Képek Száma',
      members: 'Tagok Száma',
      asc: 'Növekvő',
      desc: 'Csökkenő'
    },
    itemsPerPage: 'Oldalanként:',
    resultsRange: '<strong>{{start}}-{{end}}</strong> / {{total}}',
    pagination: {
      previous: 'Előző',
      next: 'Következő',
      previousShort: 'Előző',
      nextShort: 'Köv'
    },
    emptyState: 'Nem találhatók booru oldalak',
    loading: 'Booru adatok betöltése...',
    errorTitle: 'Adatok Betöltési Hiba',
    errors: {
      fetchFailed: 'Nem sikerült lekérni a booru adatokat.',
      unknown: 'Valami hiba történt a rangsor betöltése során.'
    },
    ownerLabel: 'Tulajdonos:',
    visit: '{{name}} Meglátogatása'
  },
  booruDetail: {
    backButton: 'Vissza a Booru Listához',
    notFoundTitle: 'Booru Nem Található',
    notFoundDescription: 'A(z) "{{domain}}" booru domain nem található az adatbázisunkban.',
    statistics: 'Statisztikák',
    totalImages: 'Összes Kép',
    totalMembers: 'Összes Tag',
    shortName: 'Rövid Név',
    owner: 'Tulajdonos',
    hosted: 'Üzemeltető: booru.org',
    protocol: 'Protokoll',
    yes: 'Igen',
    no: 'Nem',
    visit: '{{name}} Meglátogatása',
    loading: 'Betöltés...'
  }
};
