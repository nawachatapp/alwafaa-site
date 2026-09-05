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
    'site.name': 'مدرسة الوفاء اللبناني',
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
    'nav.media': 'المركز الإعلامي',
    'nav.menu': 'القائمة',
    'nav.close': 'إغلاق',
    'nav.skip': 'تخطَّ إلى المحتوى',

    'lang.switch': 'English',
    // Shown on the header's language button: the language it switches to.
    'lang.glyph': 'EN',
    'lang.label': 'تغيير اللغة',

    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'للتواصل',
    'footer.services': 'خدماتٌ إلكترونية',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.address': 'لبنان',

    'cta.readMore': 'اقرأ المزيد',
    'cta.allNews': 'كل الأخبار',
    'cta.apply': 'سجّل الآن',
    'cta.applyDesc': 'ابدأ رحلة التسجيل لأبنائكم للعام الدراسي الجديد',
    'cta.portal': 'المنصة الالكترونية',
    'cta.portalDesc': 'العلامات والجداول والمتابعة اليومية في مكان واحد',
    'cta.soon': 'قريباً',
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
    'nav.media': 'Media',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.skip': 'Skip to content',

    'lang.switch': 'العربية',
    'lang.glyph': 'ع',
    'lang.label': 'Change language',

    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.services': 'Online Services',
    'footer.rights': 'All rights reserved',
    'footer.address': 'Lebanon',

    'cta.readMore': 'Read more',
    'cta.allNews': 'All news',
    'cta.apply': 'Apply now',
    'cta.applyDesc': 'Begin your child’s enrolment for the new academic year',
    'cta.portal': 'Web Portal',
    'cta.portalDesc': 'Grades, schedules and daily updates in one place',
    'cta.soon': 'Coming soon',
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

// The header's version of the same nav: News and Gallery collapse into one
// dropdown so the bar does not run to seven items. The footer still uses the
// flat `navItems` above - a footer has room, and a dropdown there helps nobody.
export const headerNav = [
  { key: 'nav.home', path: '' },
  { key: 'nav.about', path: 'about' },
  { key: 'nav.academics', path: 'academics' },
  { key: 'nav.admissions', path: 'admissions' },
  {
    key: 'nav.media',
    children: [
      { key: 'nav.news', path: 'news' },
      { key: 'nav.gallery', path: 'gallery' },
    ],
  },
  { key: 'nav.contact', path: 'contact' },
] as const;
