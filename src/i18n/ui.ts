// ---------------------------------------------------------------------------
// Every user-visible string that is not page body copy lives here.
// Page content itself sits in the page files; this covers navigation, labels,
// buttons and footer - anything repeated across pages.
// ---------------------------------------------------------------------------

export const languages = {
  ar: 'العربية',
  en: 'English',
} as const;

export const defaultLang = 'ar';
export type Lang = keyof typeof languages;

// Text direction per language, used on <html dir="...">.
export const dir: Record<Lang, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
};

export const ui = {
  ar: {
    'site.name': 'مدرسةُ الوفاءِ اللبناني',
    'site.nameShort': 'الوفاء اللبناني',
    'site.tagline': 'عَلَّمَ بالقَلَم',
    'site.est': 'تأسست عام ٢٠٠٠',

    'nav.home': 'الرئيسية',
    'nav.about': 'عن المدرسة',
    'nav.academics': 'الأقسام التعليمية',
    'nav.admissions': 'التسجيل',
    'nav.news': 'الأخبار',
    'nav.gallery': 'الصور',
    'nav.contact': 'اتصل بنا',
    'nav.menu': 'القائمة',
    'nav.close': 'إغلاق',
    'nav.skip': 'تخطَّ إلى المحتوى',

    'lang.switch': 'English',
    'lang.label': 'تغيير اللغة',

    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'للتواصل',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.address': 'لبنان',

    'cta.readMore': 'اقرأ المزيد',
    'cta.allNews': 'كل الأخبار',
    'cta.apply': 'سجّل الآن',
    'cta.contactUs': 'تواصل معنا',
  },

  en: {
    'site.name': 'Alwafaa Lebanese School',
    'site.nameShort': 'Alwafaa School',
    'site.tagline': 'He who taught by the pen',
    'site.est': 'Established 2000',

    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.academics': 'Academics',
    'nav.admissions': 'Admissions',
    'nav.news': 'News',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.skip': 'Skip to content',

    'lang.switch': 'العربية',
    'lang.label': 'Change language',

    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved',
    'footer.address': 'Lebanon',

    'cta.readMore': 'Read more',
    'cta.allNews': 'All news',
    'cta.apply': 'Apply now',
    'cta.contactUs': 'Get in touch',
  },
} as const;

// The nav, in display order. `key` indexes into `ui`; `path` is appended to
// the language prefix. Adding a page here adds it to the header AND footer.
export const navItems = [
  { key: 'nav.home', path: '' },
  { key: 'nav.about', path: 'about' },
  { key: 'nav.academics', path: 'academics' },
  { key: 'nav.admissions', path: 'admissions' },
  { key: 'nav.news', path: 'news' },
  { key: 'nav.gallery', path: 'gallery' },
  { key: 'nav.contact', path: 'contact' },
] as const;
