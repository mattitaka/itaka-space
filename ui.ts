export type Lang = 'it' | 'en';
export const langs: Lang[] = ['it', 'en'];

export type RouteKey =
  | 'home' | 'about' | 'projects' | 'heart' | 'fot' | 'edit'
  | 'partners' | 'news' | 'join' | 'transparency' | 'contact' | 'privacy';

export const routes: Record<Lang, Record<RouteKey, string>> = {
  it: {
    home: '/it/', about: '/it/chi-siamo/', projects: '/it/progetti/',
    heart: '/it/progetti/heart/', fot: '/it/progetti/fields-of-tomorrow/', edit: '/it/progetti/edit/',
    partners: '/it/partner/', news: '/it/news/', join: '/it/partecipa/',
    transparency: '/it/trasparenza/', contact: '/it/contatti/', privacy: '/it/privacy/',
  },
  en: {
    home: '/en/', about: '/en/about/', projects: '/en/projects/',
    heart: '/en/projects/heart/', fot: '/en/projects/fields-of-tomorrow/', edit: '/en/projects/edit/',
    partners: '/en/partners/', news: '/en/news/', join: '/en/get-involved/',
    transparency: '/en/transparency/', contact: '/en/contact/', privacy: '/en/privacy/',
  },
};

export const nav: RouteKey[] = ['about', 'projects', 'partners', 'news', 'join', 'contact'];

export const ui = {
  it: {
    htmlLang: 'it',
    nav: { about: 'Chi siamo', projects: 'Progetti', partners: 'Partner', news: 'News', join: 'Partecipa', contact: 'Contatti', transparency: 'Trasparenza', privacy: 'Privacy' } as Record<string, string>,
    skip: 'Vai al contenuto',
    menu: 'Menu',
    otherLang: 'English',
    langShort: 'EN',
    langLabel: 'Read this page in English',
    themeDark: 'Attiva il tema scuro',
    themeLight: 'Attiva il tema chiaro',
    otherLangCode: 'en' as Lang,
    homeLabel: 'ItaKA APS, pagina iniziale',
    footerLine: 'Associazione di promozione sociale attiva nella Tuscia.',
    taxCode: 'C.F.',
    seat: 'Sede legale',
    runts: 'RUNTS, sezione APS, rep. n. 173065',
    verifyLegend: 'I riquadri tratteggiati segnano dati ancora da verificare.',
  },
  en: {
    htmlLang: 'en',
    nav: { about: 'About', projects: 'Projects', partners: 'Partners', news: 'News', join: 'Get involved', contact: 'Contact', transparency: 'Transparency', privacy: 'Privacy' } as Record<string, string>,
    skip: 'Skip to content',
    menu: 'Menu',
    otherLang: 'Italiano',
    langShort: 'IT',
    langLabel: 'Leggi questa pagina in italiano',
    themeDark: 'Switch to dark theme',
    themeLight: 'Switch to light theme',
    otherLangCode: 'it' as Lang,
    homeLabel: 'ItaKA APS, home page',
    footerLine: 'Non-profit association for social promotion, active across Tuscia, Italy.',
    taxCode: 'Tax code',
    seat: 'Registered office',
    runts: 'RUNTS, APS section, no. 173065',
    verifyLegend: 'Dashed boxes mark facts still to be verified.',
  },
} as const;

/** Escapes HTML and wraps [DA VERIFICARE…] / [TO VERIFY…] markers so they stay visible until fixed. */
export function rich(text: string): string {
  const esc = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc
    .replace(/\[(DA VERIFICARE|TO VERIFY)([^\]]*)\]/g, '<mark class="verify">$1$2</mark>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export function formatDate(d: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(d);
}
