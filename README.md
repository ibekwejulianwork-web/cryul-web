# CRYUL

CRYUL è un sito per leggere il mercato delle crypto e, più avanti, per decidere compere e vendite in autonomia. Oggi fa solo la prima parte: mostra prezzi veri e testi scritti a mano. Non invia ordini e non usa denaro reale.

Il progetto nasce dall’idea che una persona non debba restare tutto il giorno davanti allo schermo. La missione, scritta anche nella pagina Chi siamo, è questa: tu puoi staccarti, CRYUL resta sul mercato. Il comportamento automatico di compra e vendi non è ancora costruito. Si parte dai prezzi pubblici e da un sito che spiega ogni valuta, compreso il rischio.

In questa fase il sito esiste solo sul computer di chi lo avvia. L’indirizzo `localhost` significa proprio «questo computer». Non è un dominio pubblico e non è raggiungibile da un altro PC.

## Due programmi

CRYUL non è un solo programma. Sono due cartelle, e vanno tenute accese insieme.

| Programma | Cartella | A che cosa serve | Indirizzo |
| --- | --- | --- | --- |
| Sito | `cryul-web` | Pagine, grafica, prezzi | [http://localhost:3000](http://localhost:3000) |
| Strapi | `my-strapi-project` | Testi di Chi siamo e articoli | [http://localhost:1337/admin](http://localhost:1337/admin) |

Strapi è il pannello dei contenuti. Lì si scrive, si corregge e si pubblica. Il sito Next.js legge quei testi e li mostra. Strapi non legge i prezzi e non fa operazioni di mercato. I prezzi li chiede il sito, da solo, all’API pubblica di Binance.

Se Strapi è spento, la home può ancora mostrare i prezzi. Gli articoli e Chi siamo, invece, restano vuoti o fermi all’ultimo contenuto che il sito è riuscito a leggere.

## Avvio

Apri un terminale nella cartella `cryul-web` e lancia:

```bash
npm install
npm run dev
```

`npm install` serve solo la prima volta, oppure dopo aver cambiato le dipendenze. `npm run dev` accende il sito in modalità sviluppo. Poi apri il browser su [http://localhost:3000](http://localhost:3000).

Apri un secondo terminale nella cartella `my-strapi-project` e lancia:

```bash
npm install
npm run develop
```

Quando Strapi ha finito di avviarsi, l’admin è su [http://localhost:1337/admin](http://localhost:1337/admin). Il primo avvio può richiedere un minuto. La finestra del terminale va lasciata aperta: se la chiudi, il programma si spegne e `localhost:1337` smette di rispondere.

In alternativa, dentro `cryul-web` c’è il file `apri-cryul.bat`. Un doppio clic apre il sito nel browser. Se il server del sito è spento, il file prova ad avviarlo. Non avvia Strapi: quello resta un comando a parte.

Il file della home si chiama `app/page.tsx`. Non è un `index.html`. Un doppio clic su `page.tsx` apre il codice nell’editor, non la pagina nel browser.

## Che cosa si vede sul sito

La home ha due blocchi.

Il primo è **Prezzi**. Tre schede: Bitcoin (BTC), Ethereum (ETH) e Solana (SOL). Ogni scheda mostra il prezzo in euro e la variazione delle ultime 24 ore. Il verde indica una variazione positiva, il rosso una negativa. In alto a destra c’è l’ora della lettura. Ricaricando la pagina, ora e prezzi vengono richiesti di nuovo.

Il secondo blocco è **Articoli**. È l’elenco dei pezzi pubblicati in Strapi. Ogni scheda porta alla pagina dell’articolo. Se non c’è nessun articolo pubblicato, la home lo dice in modo esplicito.

Il menu in alto ha due voci: **Articoli**, che torna alla home, e **Chi siamo**.

### Pagine

| Indirizzo | File | Contenuto |
| --- | --- | --- |
| `/` | `app/page.tsx` | Prezzi e elenco articoli |
| `/chi-siamo` | `app/chi-siamo/page.tsx` | Pagina About letta da Strapi |
| `/articoli/bitcoin` | `app/articoli/[slug]/page.tsx` | Articolo su Bitcoin |
| `/articoli/ethereum` | `app/articoli/[slug]/page.tsx` | Articolo su Ethereum |
| `/articoli/solana` | `app/articoli/[slug]/page.tsx` | Articolo su Solana |

`[slug]` non è una cartella con quel nome letterale. È il pezzo variabile dell’indirizzo. Lo slug `bitcoin` produce `/articoli/bitcoin`. Lo stesso file serve per tutti gli articoli.

## Prezzi

I prezzi arrivano da Binance, senza chiave e senza account. Il sito chiede il riepilogo delle ultime 24 ore per tre coppie in euro:

- `BTCEUR`, Bitcoin
- `ETHEUR`, Ethereum
- `SOLEUR`, Solana

La chiamata è in `lib/markets.ts`. Usa `cache: "no-store"`, quindi Next.js non conserva la risposta tra un caricamento e l’altro. Se Binance non risponde, la home mostra un avviso al posto delle schede e il resto della pagina continua a funzionare.

Le schede stanno in `components/MarketBoard.tsx`. Su uno schermo largo sono tre colonne. Su uno schermo stretto si mettono una sotto l’altra.

Questo numero è il prezzo di mercato in quel momento. Non è un consiglio di acquisto e non è un ordine. Il sito lo mostra e basta.

## Contenuti in Strapi

Dopo il login, la prima voce del menu a sinistra è **Casa**. È solo la pagina iniziale dell’admin. I testi stanno nella voce subito sotto, **Content Manager**.

Dentro Content Manager ci sono due zone.

- **About**, tra i tipi singoli, è la pagina Chi siamo. Il campo `title` diventa il titolo grande sul sito. I blocchi sotto sono il corpo: citazione, testo, immagini. Dopo ogni modifica va premuto **Publish**, poi si ricarica [http://localhost:3000/chi-siamo](http://localhost:3000/chi-siamo). La scritta piccola «CRYUL» sopra il titolo non viene da Strapi: è fissa nel codice della pagina.
- **Article**, tra i tipi collezione, è un articolo. I campi usati dal sito sono `title`, `description`, `slug` e i blocchi di testo. `description` accetta al massimo 80 caratteri: una frase più lunga non si salva. Lo `slug` è la parte finale dell’indirizzo e va scritto senza spazi, per esempio `bitcoin`.

Un articolo compare in home solo dopo **Publish**. Una bozza resta nel pannello e il sito non la elenca.

Nel testo lungo, un titolo di sezione si scrive su una riga da sola, con due cancelletti e uno spazio:

```markdown
## Come funziona
```

I pulsanti grassetto e sottolineato dell’editor non bastano. Se si usano quelli, sul sito può comparire il codice grezzo, per esempio `<u>**Come funziona**</u>`. Il sito riconosce solo le righe che iniziano con `#`, `##` o `###`.

La dimensione del carattere non si regola da Strapi. Si regola nel codice, con classi come `text-lg`, `text-2xl` o `text-4xl`. I titoli di sezione dentro un articolo stanno in `components/Blocks.tsx`. Il titolo grande della pagina articolo sta in `app/articoli/[slug]/page.tsx`.

Gli articoli già previsti, uno per ogni valuta monitorata, spiegano che cos’è la rete, come si forma il prezzo e quanto è alto il rischio. Tra le tre, Bitcoin è la meno instabile e resta comunque un rischio alto. Ethereum sta un gradino sopra. Solana è la più esposta.

## Cartelle del sito

```text
cryul-web
├── app
│   ├── page.tsx                  home
│   ├── layout.tsx                menu, fondo pagina, font
│   ├── globals.css               colori e sfondo
│   ├── chi-siamo/page.tsx
│   └── articoli/[slug]/page.tsx
├── components
│   ├── Header.tsx                menu
│   ├── Footer.tsx
│   ├── MarketBoard.tsx           schede prezzi
│   ├── ArticleCard.tsx           scheda in elenco
│   └── Blocks.tsx                testo, titoli, immagini da Strapi
├── lib
│   ├── markets.ts                lettura prezzi
│   ├── strapi.ts                 lettura contenuti
│   └── types.ts                  forma dei dati
├── apri-cryul.bat                scorciatoia per aprire il sito
├── next.config.ts                permesso alle immagini di Strapi
└── package.json
```

`lib/strapi.ts` chiama `/api/articles` e `/api/about`. Chiede anche copertina, categoria, autore e blocchi. Le immagini caricate in Strapi arrivano da `localhost:1337`: `next.config.ts` autorizza quel dominio per la cartella `/uploads`.

I file `.env` non vanno su GitHub. L’indirizzo di Strapi può stare in `.env.local`, nella variabile `STRAPI_URL`. Se manca, il sito usa `http://localhost:1337`.

## Tecnologie

- [Next.js](https://nextjs.org) 16, con la cartella `app`
- React 19
- TypeScript
- Tailwind CSS 4
- Strapi 5, nel progetto separato, con database SQLite in sviluppo

## Che cosa non fa ancora

- Non è online. Non ha un dominio pubblico.
- Non compra e non vende.
- Non ha un portafoglio, nemmeno simulato.
- Non conserva uno storico dei prezzi: ogni apertura legge il valore del momento.

Il passo successivo è un portafoglio finto. Si sceglie una delle tre crypto, si indica una cifra in euro e il sito registra una compera o una vendita al prezzo appena letto, senza denaro reale.
