const PAIRS = [
  { symbol: "BTCEUR", name: "Bitcoin", code: "BTC" },
  { symbol: "ETHEUR", name: "Ethereum", code: "ETH" },
  { symbol: "SOLEUR", name: "Solana", code: "SOL" },
] as const;

type Ticker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
};

export type MarketQuote = {
  symbol: string;
  name: string;
  code: string;
  priceEur: number;
  changePercent: number;
};

export async function getMarketQuotes(): Promise<MarketQuote[] | null> {
  const symbols = encodeURIComponent(JSON.stringify(PAIRS.map((pair) => pair.symbol)));
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as Ticker[];
    if (!Array.isArray(data)) return null;

    const quotes = PAIRS.flatMap((pair) => {
      const row = data.find((item) => item.symbol === pair.symbol);
      if (!row) return [];

      const priceEur = Number(row.lastPrice);
      const changePercent = Number(row.priceChangePercent);
      if (!Number.isFinite(priceEur) || !Number.isFinite(changePercent)) return [];

      return [{ ...pair, priceEur, changePercent }];
    });

    return quotes.length > 0 ? quotes : null;
  } catch (error) {
    console.error("Impossibile leggere i prezzi di mercato:", error);
    return null;
  }
}
