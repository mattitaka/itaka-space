// Mappa del sito per i motori di ricerca: tutte le pagine nelle due lingue, con i collegamenti tra versioni.
import { getCollection } from 'astro:content';
import { routes, type RouteKey } from '../i18n/ui';

const SITE = 'https://itaka.space';

export async function GET() {
  const pairs: { it: string; en: string }[] = (Object.keys(routes.it) as RouteKey[]).map((k) => ({ it: routes.it[k], en: routes.en[k] }));
  const news = await getCollection('news');
  for (const n of news) pairs.push({ it: `${routes.it.news}${n.id}/`, en: `${routes.en.news}${n.id}/` });
  const entry = (loc: string, p: { it: string; en: string }) => `  <url>
    <loc>${SITE}${loc}</loc>
    <xhtml:link rel="alternate" hreflang="it" href="${SITE}${p.it}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${p.en}"/>
  </url>`;
  const body = pairs.flatMap((p) => [entry(p.it, p), entry(p.en, p)]).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
