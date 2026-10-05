# CRYUL

CRYUL is a site for reading the crypto market and, later, for deciding buys and sells on its own. Today it only does the first part: it shows real prices and texts written by hand. It does not send orders and it does not use real money.

The project starts from a simple idea: a person should not have to watch the screen all day. The mission, also written on the About page, is this: you can step away, and CRYUL stays on the market. Automatic buying and selling is not built yet. The work starts with public prices and a site that explains each currency, including the risk.

At this stage the site exists only on the computer that starts it. The address `localhost` means “this computer”. It is not a public domain, and another PC cannot open it.

## Two programs

CRYUL is not one program. It is two folders, and both need to be running.

| Program | Folder | What it does | Address |
| --- | --- | --- | --- |
| Site | `cryul-web` | Pages, layout, prices | [http://localhost:3000](http://localhost:3000) |
| Strapi | `my-strapi-project` | About page and articles | [http://localhost:1337/admin](http://localhost:1337/admin) |

Strapi is the content desk. Text is written, edited, and published there. The Next.js site reads those texts and displays them. Strapi does not read prices and does not place market orders. The site asks Binance’s public API for prices on its own.

If Strapi is off, the home page can still show prices. Articles and the About page stay empty, or stay on the last content the site managed to read.

## Start

Open a terminal in the `cryul-web` folder and run:

```bash
npm install
npm run dev
```

`npm install` is only needed the first time, or after dependencies change. `npm run dev` starts the site in development. Then open [http://localhost:3000](http://localhost:3000) in the browser.

Open a second terminal in the `my-strapi-project` folder and run:

```bash
npm install
npm run develop
```

When Strapi has finished starting, the admin is at [http://localhost:1337/admin](http://localhost:1337/admin). The first start can take a minute. Leave that terminal window open: if you close it, the program stops and `localhost:1337` stops answering.

Inside `cryul-web` there is also `apri-cryul.bat`. A double click opens the site in the browser. If the site server is off, the file tries to start it. It does not start Strapi. That remains a separate command.

The home page file is `app/page.tsx`. There is no `index.html`. A double click on `page.tsx` opens the code in the editor, not the page in the browser.

## What the site shows

The home page has two blocks.

The first is **Prices**. Three cards: Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). Each card shows the price in euros and the change over the last 24 hours. Green means the change is positive. Red means it is negative. The time of the reading is at the top right. Reloading the page asks for the time and the prices again.

The second block is **Articles**. It is the list of pieces published in Strapi. Each card links to the article page. If nothing is published, the home page says so.

The top menu has two links: **Articles**, which returns to the home page, and **About**.

### Pages

| Address | File | Content |
| --- | --- | --- |
| `/` | `app/page.tsx` | Prices and article list |
| `/chi-siamo` | `app/chi-siamo/page.tsx` | About page read from Strapi |
| `/articoli/bitcoin` | `app/articoli/[slug]/page.tsx` | Article about Bitcoin |
| `/articoli/ethereum` | `app/articoli/[slug]/page.tsx` | Article about Ethereum |
| `/articoli/solana` | `app/articoli/[slug]/page.tsx` | Article about Solana |

`[slug]` is not a folder with that literal name. It is the changing part of the address. The slug `bitcoin` produces `/articoli/bitcoin`. The same file serves every article.

## Prices

Prices come from Binance, with no key and no account. The site asks for the 24-hour summary of three euro pairs:

- `BTCEUR`, Bitcoin
- `ETHEUR`, Ethereum
- `SOLEUR`, Solana

The request lives in `lib/markets.ts`. It uses `cache: "no-store"`, so Next.js does not keep the response between page loads. If Binance does not answer, the home page shows a notice instead of the cards, and the rest of the page still works.

The cards are in `components/MarketBoard.tsx`. On a wide screen they sit in three columns. On a narrow screen they stack.

That number is the market price at that moment. It is not a buy recommendation and it is not an order. The site only displays it.

## Content in Strapi

After login, the first item in the left menu is **Home**. That is only the admin start page. The texts are in the item just below it, **Content Manager**.

Content Manager has two areas.

- **About**, under single types, is the About page. The `title` field becomes the large title on the site. The blocks underneath are the body: quote, text, images. After each change, press **Publish**, then reload [http://localhost:3000/chi-siamo](http://localhost:3000/chi-siamo). The small “CRYUL” label above the title does not come from Strapi. It is fixed in the page code.
- **Article**, under collection types, is one article. The fields the site uses are `title`, `description`, `slug`, and the text blocks. `description` accepts at most 80 characters. A longer sentence will not save. The `slug` is the last part of the address and must be written without spaces, for example `bitcoin`.

An article appears on the home page only after **Publish**. A draft stays in the admin, and the site does not list it.

In the long text, a section heading is written on its own line, with two hash marks and a space:

```markdown
## How it works
```

The editor’s bold and underline buttons are not enough. If you use those, the site can show the raw code, for example `<u>**How it works**</u>`. The site only treats lines that start with `#`, `##`, or `###` as headings.

Font size is not set in Strapi. It is set in the code, with classes such as `text-lg`, `text-2xl`, or `text-4xl`. Section headings inside an article are in `components/Blocks.tsx`. The large title on an article page is in `app/articoli/[slug]/page.tsx`.

The articles already planned, one for each currency the site follows, explain what the network is, how the price is formed, and how high the risk is. Of the three, Bitcoin is the least unstable, and it is still high risk. Ethereum sits one step above that. Solana is the most exposed.

## Site folders

```text
cryul-web
├── app
│   ├── page.tsx                  home
│   ├── layout.tsx                menu, footer, fonts
│   ├── globals.css               colors and background
│   ├── chi-siamo/page.tsx
│   └── articoli/[slug]/page.tsx
├── components
│   ├── Header.tsx                menu
│   ├── Footer.tsx
│   ├── MarketBoard.tsx           price cards
│   ├── ArticleCard.tsx           card in the list
│   └── Blocks.tsx                text, headings, images from Strapi
├── lib
│   ├── markets.ts                price reading
│   ├── strapi.ts                 content reading
│   └── types.ts                  shape of the data
├── apri-cryul.bat                shortcut that opens the site
├── next.config.ts                allows images from Strapi
└── package.json
```

`lib/strapi.ts` calls `/api/articles` and `/api/about`. It also asks for the cover, category, author, and blocks. Images uploaded in Strapi come from `localhost:1337`. `next.config.ts` allows that host for the `/uploads` folder.

`.env` files are not pushed to GitHub. The Strapi address can live in `.env.local`, in the `STRAPI_URL` variable. If it is missing, the site uses `http://localhost:1337`.

## Technologies

- [Next.js](https://nextjs.org) 16, with the `app` folder
- React 19
- TypeScript
- Tailwind CSS 4
- Strapi 5, in the separate project, with SQLite in development

## What it does not do yet

- It is not online. It has no public domain.
- It does not buy or sell.
- It has no portfolio, not even a simulated one.
- It does not keep a price history. Each visit reads the price of that moment.

The next step is a fake portfolio. You pick one of the three cryptos, enter an amount in euros, and the site records a buy or a sell at the price it just read, without real money.
