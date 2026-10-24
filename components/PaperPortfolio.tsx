"use client";

import { useEffect, useState } from "react";
import type { MarketQuote } from "@/lib/markets";

const STORAGE_KEY = "cryul-paper-v1";
const START_CASH = 10_000;

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Trade = {
  id: string;
  side: "buy" | "sell";
  code: string;
  name: string;
  euro: number;
  coins: number;
  priceEur: number;
  at: string;
};

type Book = {
  cashEur: number;
  holdings: Record<string, number>;
  trades: Trade[];
};

function emptyBook(): Book {
  return {
    cashEur: START_CASH,
    holdings: { BTC: 0, ETH: 0, SOL: 0 },
    trades: [],
  };
}

function formatCoins(value: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

export function PaperPortfolio({ quotes }: { quotes: MarketQuote[] }) {
  const [book, setBook] = useState<Book | null>(null);
  const [code, setCode] = useState(quotes[0]?.code ?? "BTC");
  const [amount, setAmount] = useState("100");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setBook(emptyBook());
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Book;
      if (!parsed || typeof parsed.cashEur !== "number" || !parsed.holdings) {
        setBook(emptyBook());
        return;
      }
      setBook(parsed);
    } catch {
      setBook(emptyBook());
    }
  }, []);

  useEffect(() => {
    if (!book) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
  }, [book]);

  const selected = quotes.find((quote) => quote.code === code) ?? quotes[0];

  function trade(side: "buy" | "sell") {
    if (!book || !selected) return;
    const euroAmount = Number(amount.replace(",", "."));
    if (!Number.isFinite(euroAmount) || euroAmount <= 0) {
      setMessage("Scrivi un importo in euro maggiore di zero.");
      return;
    }

    const coins = euroAmount / selected.priceEur;
    const owned = book.holdings[selected.code] ?? 0;

    if (side === "buy" && euroAmount > book.cashEur + 0.001) {
      setMessage("Il saldo finto non basta per questa compra.");
      return;
    }
    if (side === "sell" && coins > owned + 1e-10) {
      setMessage("Non hai abbastanza monete finte da vendere.");
      return;
    }

    const next: Book = {
      cashEur: side === "buy" ? book.cashEur - euroAmount : book.cashEur + euroAmount,
      holdings: {
        ...book.holdings,
        [selected.code]: side === "buy" ? owned + coins : owned - coins,
      },
      trades: [
        {
          id: crypto.randomUUID(),
          side,
          code: selected.code,
          name: selected.name,
          euro: euroAmount,
          coins,
          priceEur: selected.priceEur,
          at: new Date().toLocaleString("it-IT"),
        },
        ...book.trades,
      ],
    };

    setBook(next);
    setMessage(
      side === "buy"
        ? `Compera finta registrata: ${euro.format(euroAmount)} di ${selected.name}.`
        : `Vendita finta registrata: ${euro.format(euroAmount)} di ${selected.name}.`,
    );
  }

  if (!book || !selected) {
    return <p className="mt-10 text-cyan-100/60">Carico il portafoglio finto.</p>;
  }

  const total =
    book.cashEur +
    quotes.reduce((sum, quote) => sum + (book.holdings[quote.code] ?? 0) * quote.priceEur, 0);

  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-cyan-50">
          Simulazione
        </h2>
        <button
          type="button"
          className="text-xs tracking-wide text-cyan-100/45 hover:text-cyan-100"
          onClick={() => {
            setBook(emptyBook());
            setMessage("Simulazione azzerata. Il saldo è di nuovo 10.000 € finti.");
          }}
        >
          Azzera
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-cyan-200/10 bg-[#0b1c26] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">Euro finti</p>
          <p className="mt-3 text-3xl tracking-tight text-cyan-50">{euro.format(book.cashEur)}</p>
          <p className="mt-2 text-sm text-cyan-100/50">Valore totale {euro.format(total)}</p>
        </div>
        <ul className="rounded-2xl border border-cyan-200/10 bg-[#0b1c26] p-5 text-sm text-cyan-100/75">
          {quotes.map((quote) => {
            const coins = book.holdings[quote.code] ?? 0;
            return (
              <li key={quote.code} className="flex items-center justify-between gap-3 py-1">
                <span>{quote.code}</span>
                <span>
                  {formatCoins(coins)} · {euro.format(coins * quote.priceEur)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <form
        className="mt-4 grid gap-3 rounded-2xl border border-cyan-200/10 bg-[#0b1c26] p-5 sm:grid-cols-[1fr_1fr_auto_auto]"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="text-sm text-cyan-100/70">
          Valuta
          <select
            value={selected.code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-2 w-full rounded-xl border border-cyan-200/15 bg-[#061018] px-3 py-2 text-cyan-50"
          >
            {quotes.map((quote) => (
              <option key={quote.code} value={quote.code}>
                {quote.name} · {euro.format(quote.priceEur)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-cyan-100/70">
          Importo in euro
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            className="mt-2 w-full rounded-xl border border-cyan-200/15 bg-[#061018] px-3 py-2 text-cyan-50"
          />
        </label>
        <button
          type="button"
          onClick={() => trade("buy")}
          className="self-end rounded-xl bg-cyan-200 px-4 py-2 text-sm font-medium text-[#061018]"
        >
          Compra
        </button>
        <button
          type="button"
          onClick={() => trade("sell")}
          className="self-end rounded-xl border border-cyan-200/20 px-4 py-2 text-sm text-cyan-50"
        >
          Vendi
        </button>
      </form>
      {message ? <p className="mt-3 text-sm text-cyan-100/70">{message}</p> : null}

      {book.trades.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {book.trades.map((tradeItem) => (
            <li
              key={tradeItem.id}
              className="rounded-2xl border border-cyan-200/10 px-4 py-3 text-sm text-cyan-100/70"
            >
              {tradeItem.side === "buy" ? "Compera" : "Vendita"} finta di {tradeItem.name}:{" "}
              {euro.format(tradeItem.euro)} a {euro.format(tradeItem.priceEur)} · {tradeItem.at}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
