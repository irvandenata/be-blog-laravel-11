/**
 * UI copy for both locales. Indonesian is the default (served at "/"),
 * English is served under "/en". Article/portfolio *content* is not here —
 * that comes from the API, which falls back to Indonesian when a translation
 * is missing (see ArticleResource).
 */
export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "id";

const dictionary = {
  id: {
    "nav.home": "Beranda",
    "nav.workExperience": "Pengalaman Kerja",
    "nav.techStack": "Tech Stack",
    "nav.projects": "Proyek",
    "nav.getInTouch": "Hubungi Saya",
    "nav.blogs": "Blog",
    "nav.about": "Tentang Saya",
    "nav.toggleTheme": "Ganti tema",
    "nav.openMenu": "Buka menu",
    "nav.closeMenu": "Tutup menu",
    "nav.switchLanguage": "Ganti bahasa",

    "landing.workExperience": "Pengalaman Kerja",
    "landing.techStack": "Tech Stack",
    "landing.frontend": "Frontend",
    "landing.backend": "Backend",
    "landing.others": "Lainnya",
    "landing.projects": "Proyek",
    "landing.moreProjects": "Proyek Lainnya",
    "landing.seoTitle": "Beranda",

    "blog.badge": "Baca Pikiran Saya",
    "blog.title": "Jelajahi Tulisan",
    "blog.subtitle":
      "Dedikasi untuk pemikiran dan ide yang pernah mampir di kepala saya",
    "blog.searchLabel": "Cari",
    "blog.searchPlaceholder": "Cari apa saja ...",
    "blog.searchButton": "Cari",
    "blog.allCategory": "Semua Kategori",
    "blog.searchedFor": "Hasil pencarian:",
    "blog.notFound": "Artikel tidak ditemukan",
    "blog.seoTitle": "Artikel & Blog",
    "blog.seoDescription":
      "Jelajahi artikel dan tulisan seputar rekayasa perangkat lunak, teknologi, dan lainnya.",
    "blog.translationNotice":
      "Terjemahan bahasa Inggris belum tersedia, menampilkan versi bahasa Indonesia.",
    "blog.relatedArticles": "Artikel Terkait",
    "blog.views": "Dilihat",

    "about.seoTitle": "Tentang Saya",
    "about.badge": "Kenali Saya",
    "about.title": "Tentang Saya",
    "about.subtitle": "Sedikit cerita tentang saya dan perjalanan saya.",
    "about.empty": "Konten belum tersedia.",

    "common.loading": "Memuat...",
    "common.readMore": "Baca selengkapnya",
  },
  en: {
    "nav.home": "Home",
    "nav.workExperience": "Work Experience",
    "nav.techStack": "Tech Stack",
    "nav.projects": "Projects",
    "nav.getInTouch": "Get in touch",
    "nav.blogs": "Blogs",
    "nav.about": "About Me",
    "nav.toggleTheme": "Toggle theme",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",
    "nav.switchLanguage": "Switch language",

    "landing.workExperience": "Work Experience",
    "landing.techStack": "Tech Stack",
    "landing.frontend": "Frontend",
    "landing.backend": "Backend",
    "landing.others": "Others",
    "landing.projects": "Projects",
    "landing.moreProjects": "More Projects",
    "landing.seoTitle": "Home",

    "blog.badge": "Read My Mind",
    "blog.title": "Browse The Resources",
    "blog.subtitle":
      "Dedication to the thoughts and ideas that have ever stopped by in my head",
    "blog.searchLabel": "Search",
    "blog.searchPlaceholder": "Search everything ...",
    "blog.searchButton": "Search",
    "blog.allCategory": "All Category",
    "blog.searchedFor": "Searched for:",
    "blog.notFound": "No article found",
    "blog.seoTitle": "Articles & Blog",
    "blog.seoDescription":
      "Browse articles and blog posts about software engineering, technology, and more.",
    "blog.translationNotice":
      "An English translation is not available yet, showing the Indonesian version.",
    "blog.relatedArticles": "Related Articles",
    "blog.views": "Views",

    "about.seoTitle": "About Me",
    "about.badge": "Know Me",
    "about.title": "About Me",
    "about.subtitle": "A little about me and the road that got me here.",
    "about.empty": "No content yet.",

    "common.loading": "Loading...",
    "common.readMore": "Read more",
  },
} as const;

export type TranslationKey = keyof (typeof dictionary)["id"];

export default dictionary;
