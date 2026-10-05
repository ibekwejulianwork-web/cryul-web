import { Blocks } from "@/components/Blocks";
import { getAbout } from "@/lib/strapi";
import type { AboutPage } from "@/lib/types";

export const metadata = {
  title: "Chi siamo",
};

export default async function AboutRoute() {
  const about = (await getAbout()) as AboutPage | null;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">CRYUL</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cyan-50 sm:text-5xl">
        {about?.title || "Chi siamo"}
      </h1>
      {about ? (
        <Blocks blocks={about.blocks} />
      ) : (
        <p className="mt-8 max-w-xl text-cyan-100/65">
          La pagina About non è ancora visibile dal sito. Nel prossimo passo
          apriamo i permessi in Strapi.
        </p>
      )}
    </div>
  );
}
