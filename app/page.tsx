import { ArticleCard } from "@/components/ArticleCard";
import { MarketBoard } from "@/components/MarketBoard";
import { getMarketQuotes } from "@/lib/markets";
import { getArticles } from "@/lib/strapi";
import type { Article } from "@/lib/types";

export default async function Home() {
  const [articles, quotes] = await Promise.all([
    getArticles() as Promise<Article[]>,
    getMarketQuotes(),
  ]);
  const updatedAt = new Date().toLocaleString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Mercato</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-tight text-cyan-50 sm:text-6xl">
        CRYUL
      </h1>
      <p className="mt-4 max-w-xl text-lg text-cyan-100/60">
        Prezzi pubblici di Bitcoin, Ethereum e Solana, in euro. Nessun ordine.
      </p>

      {quotes ? (
        <MarketBoard quotes={quotes} updatedAt={updatedAt} />
      ) : (
        <div className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-950/20 p-6 text-amber-100/90">
          <p className="font-[family-name:var(--font-display)] text-lg">
            Prezzi non disponibili
          </p>
          <p className="mt-2 text-sm leading-relaxed text-amber-100/70">
            La lettura pubblica del mercato non ha risposto. Ricarica la pagina tra qualche secondo.
          </p>
        </div>
      )}

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-xl text-cyan-50">
        Articoli
      </h2>

      {articles.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-950/20 p-6 text-amber-100/90">
          <p className="font-[family-name:var(--font-display)] text-lg">
            Nessun articolo visibile
          </p>
          <p className="mt-2 text-sm leading-relaxed text-amber-100/70">
            O Strapi non è avviato, o i permessi pubblici non sono ancora aperti.
            Nel prossimo passo ti guido nell&apos;admin.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-6">
          {articles.map((article) => (
            <li key={article.documentId ?? article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
