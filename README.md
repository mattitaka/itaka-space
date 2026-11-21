# itaka.space

Sito di ItaKA APS. Astro 5 (sito statico), bilingue IT/EN, news scritte dai volontari con Pages CMS, pubblicato su Cloudflare Pages.

## Cosa c'è dentro

| Percorso | Cosa contiene |
| --- | --- |
| `src/data/it.ts`, `src/data/en.ts` | Tutti i testi delle pagine. Si correggono qui. |
| `src/content/news/` | Le news, una per file. Le scrivono i volontari dal pannello. |
| `src/site.ts` | `DRAFT = true` mostra la barra "versione di prova" e chiede ai motori di ricerca di non indicizzare. Mettilo a `false` al lancio. |
| `src/components/EmblemaUE.astro` | Emblema UE provvisorio: va sostituito con il file ufficiale. |
| `public/documenti/HEART_toolkit.pdf` | Il toolkit scaricabile dalla pagina HEART. |
| `public/media/` | Le foto caricate dal pannello. |
| `.pages.yml` | Configurazione del pannello Pages CMS. |
| `public/_redirects` | Manda `itaka.space/` a `itaka.space/it/`. |

I segni **[DA VERIFICARE …]** e **[TO VERIFY …]** compaiono sul sito come riquadri tratteggiati. Restano visibili finché non correggi il testo.

## Prima messa online

Ci vogliono un account GitHub e un account Cloudflare, entrambi gratuiti. I nomi dei menu possono cambiare nel tempo: se non trovi una voce, cercala con parole simili.

### 1. GitHub

1. Crea un account su github.com, meglio con un indirizzo dell'associazione.
2. Crea un repository **privato** chiamato `itaka-space`.
3. Carica il contenuto di questa cartella (puoi trascinare i file dalla pagina del repository, "Add file → Upload files"). Non caricare `node_modules`, `dist` e `.astro`, se ci sono.

### 2. Cloudflare Pages

1. Su dash.cloudflare.com: **Workers & Pages → Create → Pages → Connect to Git**.
2. Scegli il repository `itaka-space`.
3. Impostazioni di build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Salva. Dopo un paio di minuti il sito è online su un indirizzo `….pages.dev`. Controllalo lì prima di collegare il dominio.

### 3. Il dominio itaka.space

**Attenzione alla posta.** Su itaka.space esistono già caselle email (info@, mattia@, federico@). Quando modifichi i DNS, i record **MX**, **SPF/TXT** e gli eventuali **DKIM/DMARC** devono restare identici, altrimenti la posta smette di arrivare. Prima di toccare qualsiasi cosa, fai uno screenshot di tutti i record DNS attuali.

1. In Cloudflare Pages, apri il progetto → **Custom domains → Set up a custom domain** → `itaka.space`, poi ripeti per `www.itaka.space`.
2. Cloudflare ti indica i record da aggiungere. Due strade:
   - **Lasci i DNS dal registrar attuale** e aggiungi solo i record indicati (di solito un CNAME). È la strada più prudente per la posta.
   - **Sposti i DNS su Cloudflare**: Cloudflare importa i record esistenti, ma verifica uno per uno che MX e TXT ci siano tutti prima di cambiare i nameserver.
3. Il certificato HTTPS si attiva da solo.

## Il pannello per le news (Pages CMS)

### Tu, come amministratore

1. Vai su app.pagescms.org e accedi con GitHub.
2. Autorizza l'accesso al repository `itaka-space`.
3. Nel pannello compare la sezione **News**, definita in `.pages.yml`.
4. Per i volontari: apri le impostazioni del repository nel pannello, sezione collaboratori, e invitali con la loro email. Non serve che abbiano GitHub. Possono scrivere e modificare news e foto, ma non cambiare la configurazione.

### Cosa succede quando un volontario pubblica

1. Salva la news dal pannello.
2. Cloudflare ricostruisce il sito, di solito in un paio di minuti.
3. **Se c'è una foto senza descrizione o senza la conferma del consenso, la ricostruzione si ferma.** Il sito resta com'era e la news non esce. In Cloudflare, nella lista dei deploy, l'errore dice cosa manca. È voluto: è il controllo minimo sul consenso.

Da sapere: il pannello non registra chi ha fatto la modifica, perché i volontari scrivono tramite l'app. Per questo il campo **Autore** è obbligatorio.

## Guida rapida per i volontari

1. Apri il link dell'invito che ti è arrivato via email.
2. Vai su **News → Nuova**.
3. Compila: titolo, data, lingua, il tuo nome, un riassunto di una o due frasi, il testo.
4. Foto: solo se hai il consenso scritto di tutte le persone riconoscibili, e dei genitori per chi ha meno di 18 anni. Scrivi sempre una descrizione della foto.
5. Salva. La news è online in pochi minuti.

Puoi scrivere in italiano o in inglese. Una news in una sola lingua compare in entrambe le versioni del sito, con l'etichetta "Solo in inglese" o "Italian only".

## Modificare i testi

I testi stanno in `src/data/it.ts` e `src/data/en.ts`. Si possono correggere direttamente su GitHub (apri il file, icona della matita, "Commit changes"). Ogni modifica pubblica il sito in pochi minuti. Conserva le virgolette ai lati di ogni testo.

## Lavorare sul computer (facoltativo)

Serve Node.js 22.

```
npm install
npm run dev
```

Il sito si apre su http://localhost:4321/it/.

## Prima del lancio

- [x] Testi verificati, nessun segno [DA VERIFICARE] rimasto.
- [x] `DRAFT = false` in `src/site.ts` (il sito è indicizzabile dai motori di ricerca).
- [ ] Sostituire l'emblema UE provvisorio (`src/components/EmblemaUE.astro`) con il file ufficiale "Cofinanziato dall'Unione europea".
- [ ] Confrontare il disclaimer UE con il testo indicato nelle convenzioni di sovvenzione (è il testo standard Erasmus+ adattato a ciascuna Agenzia).
- [ ] Raccogliere il consenso delle socie e dei soci prima di pubblicarne i nomi (pagina Chi siamo).
- [ ] Inserire gli importi incassati per anno nella pagina Trasparenza, entro il 30 giugno di ogni anno.
- [ ] Far rivedere la privacy policy da un professionista.

## Note tecniche

- Astro 5.18.2, fissato per stabilità. Esistono versioni più recenti di Astro; un aggiornamento va provato su `….pages.dev` prima di andare sul dominio.
- Il carattere Inter è ospitato sul sito (pacchetto `@fontsource-variable/inter`, licenza SIL OFL). Nessuna richiesta a Google Fonts.
- Il font Arkhip della cartella Brand non è usato: non ha le vocali accentate e la sua licenza vieta di renderlo scaricabile online. Compare solo dentro il logo, già convertito in tracciati.
- Nessun cookie, nessuna statistica, nessuno script di terze parti.
- Il sito si apre sempre in tema chiaro (sfondo bianco, testo blu notte), anche sui dispositivi in modalità scura. Il pulsante con la luna attiva il tema scuro; la scelta resta salvata nel browser di chi visita.
- Il pulsante EN/IT in alto a destra porta alla stessa pagina nell'altra lingua.
- Icone: Lucide (pacchetto `lucide-static`, licenza ISC), in `src/components/Icon.astro`.
