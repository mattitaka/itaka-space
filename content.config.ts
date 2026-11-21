import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Le news si scrivono dal pannello Pages CMS (vedi .pages.yml).
// Se c'è una foto, servono la descrizione e la conferma del consenso:
// senza, la pubblicazione si blocca e il sito resta com'era.
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z
    .object({
      title: z.string().min(3),
      date: z.coerce.date(),
      lang: z.enum(['it', 'en']),
      autore: z.string().min(2, 'Serve il nome di chi scrive la news'),
      riassunto: z.string().max(280).optional().nullable(),
      immagine: z.string().optional().nullable(),
      alt: z.string().optional().nullable(),
      consenso_foto: z.boolean().optional().nullable(),
    })
    .superRefine((v, ctx) => {
      if (v.immagine) {
        if (!v.alt || v.alt.trim().length < 5) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['alt'], message: 'La foto ha bisogno di una descrizione.' });
        }
        if (v.consenso_foto !== true) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['consenso_foto'], message: 'Manca la conferma del consenso per la foto.' });
        }
      }
    }),
});

export const collections = { news };
