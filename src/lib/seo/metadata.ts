import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://booruprompt.vercel.app';

export interface SeoTranslations {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
}

export const seoTranslations: Record<Locale, SeoTranslations> = {
  en: {
    title: 'Booru Tag Extractor',
    description: 'Easily extract and manage tags from popular booru image board posts (Danbooru, Gelbooru, Safebooru, Rule34, e621). Copy tags, filter by category, and view image previews.',
    keywords: ['booru', 'tags', 'extractor', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'image tags', 'tag management', 'copy tags', 'tag filter', 'anime art', 'illustration', 'metadata'],
  },
  id: {
    title: 'Pengekstrak Tag Booru',
    description: 'Ekstrak dan kelola tag dari postingan papan gambar booru populer (Danbooru, Gelbooru, Safebooru, Rule34, e621) dengan mudah. Salin tag, filter berdasarkan kategori, dan lihat pratinjau gambar.',
    keywords: ['booru', 'tag', 'ekstrak', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'tag gambar', 'manajemen tag', 'salin tag', 'filter tag', 'seni anime', 'ilustrasi', 'metadata'],
  },
  zh: {
    title: 'Booru 标签提取器',
    description: '轻松从流行的 booru 图像板帖子（Danbooru、Gelbooru、Safebooru、Rule34、e621）中提取和管理标签。复制标签、按类别过滤并查看图像预览。',
    keywords: ['booru', '标签', '提取器', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', '图像标签', '标签管理', '复制标签', '标签过滤', '动漫艺术', '插画', '元数据'],
  },
  'zh-TW': {
    title: 'Booru 標籤提取器',
    description: '輕鬆從流行的 booru 圖像板帖子（Danbooru、Gelbooru、Safebooru、Rule34、e621）中提取和管理標籤。複製標籤、按類別過濾並查看圖像預覽。',
    keywords: ['booru', '標籤', '提取器', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', '圖像標籤', '標籤管理', '複製標籤', '標籤過濾', '動漫藝術', '插畫', '元數據'],
  },
  ja: {
    title: 'Booru タグエクストラクター',
    description: '人気のあるbooruイメージボードの投稿（Danbooru、Gelbooru、Safebooru、Rule34、e621）からタグを簡単に抽出して管理できます。タグをコピーし、カテゴリでフィルタリングし、画像プレビューを表示します。',
    keywords: ['booru', 'タグ', 'エクストラクター', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', '画像タグ', 'タグ管理', 'タグコピー', 'タグフィルター', 'アニメアート', 'イラスト', 'メタデータ'],
  },
  ar: {
    title: 'مستخرج علامات Booru',
    description: 'استخراج وإدارة العلامات بسهولة من منشورات لوحة صور booru الشهيرة (Danbooru، Gelbooru، Safebooru، Rule34، e621). انسخ العلامات، وقم بالتصفية حسب الفئة، وعرض معاينات الصور.',
    keywords: ['booru', 'علامات', 'مستخرج', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'علامات الصور', 'إدارة العلامات', 'نسخ العلامات', 'تصفية العلامات', 'فن الأنمي', 'رسوم توضيحية', 'بيانات وصفية'],
  },
  ru: {
    title: 'Экстрактор тегов Booru',
    description: 'Легко извлекайте и управляйте тегами из популярных постов имиджбордов booru (Danbooru, Gelbooru, Safebooru, Rule34, e621). Копируйте теги, фильтруйте по категориям и просматривайте превью изображений.',
    keywords: ['booru', 'теги', 'экстрактор', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'теги изображений', 'управление тегами', 'копирование тегов', 'фильтр тегов', 'аниме арт', 'иллюстрация', 'метаданные'],
  },
  es: {
    title: 'Extractor de Etiquetas Booru',
    description: 'Extrae y gestiona fácilmente etiquetas de publicaciones populares de tableros de imágenes booru (Danbooru, Gelbooru, Safebooru, Rule34, e621). Copia etiquetas, filtra por categoría y visualiza vistas previas de imágenes.',
    keywords: ['booru', 'etiquetas', 'extractor', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'etiquetas de imagen', 'gestión de etiquetas', 'copiar etiquetas', 'filtro de etiquetas', 'arte anime', 'ilustración', 'metadatos'],
  },
  fr: {
    title: 'Extracteur de Tags Booru',
    description: 'Extrayez et gérez facilement les tags des publications populaires de forums d\'images booru (Danbooru, Gelbooru, Safebooru, Rule34, e621). Copiez les tags, filtrez par catégorie et affichez les aperçus d\'images.',
    keywords: ['booru', 'tags', 'extracteur', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'tags d\'image', 'gestion des tags', 'copier les tags', 'filtre de tags', 'art anime', 'illustration', 'métadonnées'],
  },
  de: {
    title: 'Booru Tag-Extraktor',
    description: 'Extrahieren und verwalten Sie einfach Tags von beliebten Booru-Imageboard-Posts (Danbooru, Gelbooru, Safebooru, Rule34, e621). Kopieren Sie Tags, filtern Sie nach Kategorie und zeigen Sie Bildvorschauen an.',
    keywords: ['booru', 'tags', 'extraktor', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'bild-tags', 'tag-verwaltung', 'tags kopieren', 'tag-filter', 'anime-kunst', 'illustration', 'metadaten'],
  },
  pt: {
    title: 'Extrator de Tags Booru',
    description: 'Extraia e gerencie facilmente tags de postagens populares de quadros de imagens booru (Danbooru, Gelbooru, Safebooru, Rule34, e621). Copie tags, filtre por categoria e visualize prévias de imagens.',
    keywords: ['booru', 'tags', 'extrator', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'tags de imagem', 'gerenciamento de tags', 'copiar tags', 'filtro de tags', 'arte anime', 'ilustração', 'metadados'],
  },
  ko: {
    title: 'Booru 태그 추출기',
    description: '인기 있는 booru 이미지 보드 게시물(Danbooru, Gelbooru, Safebooru, Rule34, e621)에서 태그를 쉽게 추출하고 관리하세요. 태그를 복사하고, 카테고리별로 필터링하고, 이미지 미리보기를 확인하세요.',
    keywords: ['booru', '태그', '추출기', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', '이미지 태그', '태그 관리', '태그 복사', '태그 필터', '애니메 아트', '일러스트', '메타데이터'],
  },
  it: {
    title: 'Estrattore di Tag Booru',
    description: 'Estrai e gestisci facilmente i tag dai post popolari delle bacheche di immagini booru (Danbooru, Gelbooru, Safebooru, Rule34, e621). Copia tag, filtra per categoria e visualizza anteprime delle immagini.',
    keywords: ['booru', 'tag', 'estrattore', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'tag immagini', 'gestione tag', 'copia tag', 'filtro tag', 'arte anime', 'illustrazione', 'metadati'],
  },
  nl: {
    title: 'Booru Tag-Extractor',
    description: 'Extraheer en beheer eenvoudig tags van populaire booru imageboard-berichten (Danbooru, Gelbooru, Safebooru, Rule34, e621). Kopieer tags, filter op categorie en bekijk afbeeldingsvoorbeelden.',
    keywords: ['booru', 'tags', 'extractor', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'afbeeldings-tags', 'tagbeheer', 'tags kopiëren', 'tagfilter', 'anime-kunst', 'illustratie', 'metadata'],
  },
  tr: {
    title: 'Booru Etiket Çıkarıcı',
    description: 'Popüler booru görüntü panosu gönderilerinden (Danbooru, Gelbooru, Safebooru, Rule34, e621) etiketleri kolayca çıkarın ve yönetin. Etiketleri kopyalayın, kategoriye göre filtreleyin ve görüntü önizlemelerini görüntüleyin.',
    keywords: ['booru', 'etiketler', 'çıkarıcı', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'görüntü etiketleri', 'etiket yönetimi', 'etiket kopyalama', 'etiket filtresi', 'anime sanatı', 'illüstrasyon', 'meta veri'],
  },
  pl: {
    title: 'Ekstraktor Tagów Booru',
    description: 'Łatwo wyodrębniaj i zarządzaj tagami z popularnych postów na tablicach obrazów booru (Danbooru, Gelbooru, Safebooru, Rule34, e621). Kopiuj tagi, filtruj według kategorii i przeglądaj podglądy obrazów.',
    keywords: ['booru', 'tagi', 'ekstraktor', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'tagi obrazów', 'zarządzanie tagami', 'kopiowanie tagów', 'filtr tagów', 'sztuka anime', 'ilustracja', 'metadane'],
  },
  vi: {
    title: 'Trình Trích Xuất Thẻ Booru',
    description: 'Dễ dàng trích xuất và quản lý thẻ từ các bài đăng bảng hình ảnh booru phổ biến (Danbooru, Gelbooru, Safebooru, Rule34, e621). Sao chép thẻ, lọc theo danh mục và xem trước hình ảnh.',
    keywords: ['booru', 'thẻ', 'trích xuất', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'thẻ hình ảnh', 'quản lý thẻ', 'sao chép thẻ', 'bộ lọc thẻ', 'nghệ thuật anime', 'minh họa', 'siêu dữ liệu'],
  },
  th: {
    title: 'เครื่องมือแยกแท็ก Booru',
    description: 'แยกและจัดการแท็กจากโพสต์กระดานภาพ booru ยอดนิยม (Danbooru, Gelbooru, Safebooru, Rule34, e621) ได้อย่างง่ายดาย คัดลอกแท็ก กรองตามหมวดหมู่ และดูตัวอย่างภาพ',
    keywords: ['booru', 'แท็ก', 'เครื่องมือแยก', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'แท็กภาพ', 'การจัดการแท็ก', 'คัดลอกแท็ก', 'ตัวกรองแท็ก', 'ศิลปะอนิเมะ', 'ภาพประกอบ', 'ข้อมูลเมตา'],
  },
  hi: {
    title: 'Booru टैग एक्सट्रैक्टर',
    description: 'लोकप्रिय booru छवि बोर्ड पोस्ट (Danbooru, Gelbooru, Safebooru, Rule34, e621) से टैग आसानी से निकालें और प्रबंधित करें। टैग कॉपी करें, श्रेणी के अनुसार फ़िल्टर करें और छवि पूर्वावलोकन देखें।',
    keywords: ['booru', 'टैग', 'एक्सट्रैक्टर', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'छवि टैग', 'टैग प्रबंधन', 'टैग कॉपी', 'टैग फ़िल्टर', 'एनीमे कला', 'चित्रण', 'मेटाडेटा'],
  },
  uk: {
    title: 'Екстрактор тегів Booru',
    description: 'Легко витягуйте та керуйте тегами з популярних постів дощок зображень booru (Danbooru, Gelbooru, Safebooru, Rule34, e621). Копіюйте теги, фільтруйте за категоріями та переглядайте попередній перегляд зображень.',
    keywords: ['booru', 'теги', 'екстрактор', 'danbooru', 'gelbooru', 'safebooru', 'rule34', 'e621', 'теги зображень', 'керування тегами', 'копіювання тегів', 'фільтр тегів', 'аніме мистецтво', 'ілюстрація', 'метадані'],
  },
};

export const localeToLanguage: Record<Locale, string> = {
  en: 'en_US',
  id: 'id_ID',
  zh: 'zh_CN',
  'zh-TW': 'zh_TW',
  ja: 'ja_JP',
  ar: 'ar_SA',
  ru: 'ru_RU',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_BR',
  ko: 'ko_KR',
  it: 'it_IT',
  nl: 'nl_NL',
  tr: 'tr_TR',
  pl: 'pl_PL',
  vi: 'vi_VN',
  th: 'th_TH',
  hi: 'hi_IN',
  uk: 'uk_UA',
};

export function generateMetadata(
  locale: Locale = 'en',
  options?: {
    title?: string;
    description?: string;
    path?: string;
    ogImage?: string;
  }
): Metadata {
  const seo = seoTranslations[locale];
  const title = options?.title || seo.title;
  const description = options?.description || seo.description;
  const url = `${SITE_URL}${options?.path || ''}`;
  const ogImage = options?.ogImage || `${SITE_URL}/og-image.png`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: seo.keywords,
    authors: [{ name: 'IRedDragonICY', url: 'https://x.com/ireddragonicy' }],
    creator: 'IRedDragonICY',

    alternates: {
      canonical: url,
      languages: Object.keys(seoTranslations).reduce((acc, lang) => {
        acc[lang] = `${SITE_URL}${options?.path || ''}`;
        return acc;
      }, {} as Record<string, string>),
    },

    openGraph: {
      type: 'website',
      locale: localeToLanguage[locale],
      url,
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      siteName: seo.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.title} - OG Image`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      images: [ogImage],
      creator: '@IRedDragonICY',
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
