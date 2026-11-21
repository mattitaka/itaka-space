import { it } from './it';
import { en } from './en';
import type { Lang } from '../i18n/ui';
export const content = { it, en } as const;
export const t = (lang: Lang) => content[lang] as typeof it;
