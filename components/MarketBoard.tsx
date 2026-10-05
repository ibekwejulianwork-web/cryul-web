import type { MarketQuote } from "@/lib/markets";

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

export function MarketBoard({
  quotes,
  updatedAt,
}: {
  quotes: MarketQuote[];
  updatedAt: string;
}) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-cyan-50">
          Prezzi
        </h2>
        <p className="text-xs tracking-wide text-cyan-100/45">
          Lettura pubblica · {updatedAt}
        </p>
      </div>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {quotes.map((quote) => {
          const up = quote.changePercent >= 0;
          return (
            <li
              key={quote.symbol}
              className="rounded-2xl border border-cyan-200/10 bg-[#0b1c26] p-5"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">
                {quote.code}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-lg text-cyan-50">
                {quote.name}
              </p>
              <p className="mt-4 text-2xl tracking-tight text-cyan-50">
                {euro.format(quote.priceEur)}
              </p>
              <p className={`mt-2 text-sm ${up ? "text-emerald-300" : "text-rose-300"}`}>
                {formatChange(quote.changePercent)} nelle ultime 24 ore
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
