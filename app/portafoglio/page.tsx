import { MarketBoard } from "@/components/MarketBoard";
import { PaperPortfolio } from "@/components/PaperPortfolio";
import { getMarketQuotes } from "@/lib/markets";

export const metadata = {
  title: "Portafoglio",
};

export default async function PortfolioPage() {
  const quotes = await getMarketQuotes();
  const updatedAt = new Date().toLocaleString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
        Simulazione
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cyan-50 sm:text-5xl">
        Portafoglio
      </h1>
      <p className="mt-4 max-w-xl text-lg text-cyan-100/60">
        Compere e vendite finte, al prezzo appena letto. Parti con 10.000 euro finti. Nessun ordine reale.
      </p>

      {quotes ? (
        <>
          <MarketBoard quotes={quotes} updatedAt={updatedAt} />
          <PaperPortfolio quotes={quotes} />
        </>
      ) : (
        <div className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-950/20 p-6 text-amber-100/90">
          <p className="font-[family-name:var(--font-display)] text-lg">
            Prezzi non disponibili
          </p>
          <p className="mt-2 text-sm leading-relaxed text-amber-100/70">
            Senza il prezzo pubblico non si può registrare un’operazione finta. Ricarica la pagina tra qualche secondo.
          </p>
        </div>
      )}
    </div>
  );
}
