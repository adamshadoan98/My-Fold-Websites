import { TemplateKey } from './supabase';

export interface TemplateStyleConfig {
  name: string;
  pageBg: string;
  textPrimary: string;
  textSecondary: string;
  navBg: string;
  navText: string;
  heroLayout: 'modern-split' | 'warm-overlay' | 'classic-banner' | 'traditional-centered';
  headingClass: string;
  bodyClass: string;
  cardClass: string;
  buttonRadius: string;
  sectionPadding: string;
  badgeClass: string;
}

export const TEMPLATES: Record<TemplateKey, TemplateStyleConfig> = {
  // 1. RADIANT: Highly Modern (Dark-accented, bold geometric sans, bento cards, pill buttons)
  radiant: {
    name: 'Radiant (Ultra-Modern)',
    pageBg: 'bg-zinc-950 text-zinc-50',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-400',
    navBg: 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800',
    navText: 'text-zinc-100',
    heroLayout: 'modern-split',
    headingClass: 'font-sans font-extrabold tracking-tight uppercase',
    bodyClass: 'font-sans',
    cardClass: 'bg-zinc-900/90 border border-zinc-800 rounded-3xl shadow-2xl hover:border-zinc-700 transition-all',
    buttonRadius: 'rounded-full px-7 py-3.5 font-bold tracking-wide uppercase text-sm',
    sectionPadding: 'py-20 px-6',
    badgeClass: 'rounded-full bg-zinc-800 text-zinc-200 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider',
  },

  // 2. BRIDGE: Modern Warm & Welcoming (Default in Supabase - Clean airy cards, rounded corners)
  bridge: {
    name: 'Bridge (Modern Community)',
    pageBg: 'bg-slate-50 text-slate-900',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    navBg: 'bg-white/95 backdrop-blur-md border-b border-slate-200',
    navText: 'text-slate-800',
    heroLayout: 'warm-overlay',
    headingClass: 'font-sans font-bold tracking-tight',
    bodyClass: 'font-sans',
    cardClass: 'bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all',
    buttonRadius: 'rounded-xl px-6 py-3 font-semibold text-sm',
    sectionPadding: 'py-16 px-6',
    badgeClass: 'rounded-lg bg-slate-100 text-slate-700 px-3 py-1 text-xs font-medium',
  },

  // 3. CORNERSTONE: Transitional (Warm stone tones, serif headings + clean sans body, structured cards)
  cornerstone: {
    name: 'Cornerstone (Transitional)',
    pageBg: 'bg-stone-50 text-stone-900',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-600',
    navBg: 'bg-stone-100 border-b border-stone-300',
    navText: 'text-stone-800',
    heroLayout: 'classic-banner',
    headingClass: 'font-serif font-bold tracking-normal',
    bodyClass: 'font-sans',
    cardClass: 'bg-white border border-stone-300 rounded-lg shadow-sm',
    buttonRadius: 'rounded-md px-6 py-3 font-semibold text-sm',
    sectionPadding: 'py-16 px-6',
    badgeClass: 'rounded bg-stone-200 text-stone-800 px-2.5 py-1 text-xs font-semibold',
  },

  // 4. HERITAGE: Traditional & Reverent (Ivory/parchment tones, formal serif, double borders, centered layout)
  heritage: {
    name: 'Heritage (Traditional)',
    pageBg: 'bg-[#FAF7F2] text-[#2C2523]',
    textPrimary: 'text-[#1F1A18]',
    textSecondary: 'text-[#5C534E]',
    navBg: 'bg-[#FAF7F2] border-b-2 border-[#D8CFC4]',
    navText: 'text-[#2C2523]',
    heroLayout: 'traditional-centered',
    headingClass: 'font-serif font-normal tracking-wide',
    bodyClass: 'font-serif',
    cardClass: 'bg-[#FFFDF9] border-2 border-[#E5DEC9] rounded-none shadow-none',
    buttonRadius: 'rounded-none px-7 py-3 font-serif uppercase tracking-widest text-xs border border-current',
    sectionPadding: 'py-16 px-6',
    badgeClass: 'rounded-none border border-[#D8CFC4] bg-[#F3EFE6] text-[#4A403B] px-3 py-1 text-xs font-serif uppercase tracking-widest',
  },
};

export function getTemplateConfig(template?: string | null): TemplateStyleConfig {
  const key = (template?.toLowerCase().trim() || 'bridge') as TemplateKey;
  return TEMPLATES[key] || TEMPLATES.bridge;
}
