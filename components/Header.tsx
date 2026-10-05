import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-cyan-200/10 bg-[#061018]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.28em] text-cyan-100">
            CRYUL
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9] transition group-hover:scale-125" />
        </Link>
        <nav className="flex gap-8 text-sm tracking-wide text-cyan-100/70">
          <Link href="/" className="hover:text-cyan-200">
            Articoli
          </Link>
          <Link href="/chi-siamo" className="hover:text-cyan-200">
            Chi siamo
          </Link>
        </nav>
      </div>
    </header>
  );
}
