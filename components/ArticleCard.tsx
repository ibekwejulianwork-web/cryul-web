import Link from "next/link";
import type { Article } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";

export function ArticleCard({ article }: { article: Article }) {
  const href = article.slug ? `/articoli/${article.slug}` : "/";
  const cover = mediaUrl(article.cover);
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={href}
      className="group grid overflow-hidden rounded-2xl border border-cyan-200/10 bg-[#0b1c26] transition hover:border-cyan-300/30 hover:shadow-[0_0_40px_rgba(103,232,249,0.08)] md:grid-cols-[220px_1fr]"
    >
      <div className="relative min-h-44 bg-[#08202c]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={article.cover?.alternativeText || article.title || ""}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full min-h-44 items-center justify-center text-xs tracking-[0.2em] text-cyan-200/30">
            CRYUL
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-3 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-cyan-300/80">
          {article.category?.name ? <span>{article.category.name}</span> : null}
          {date ? <span className="text-cyan-100/40">{date}</span> : null}
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-cyan-50 group-hover:text-white">
          {article.title || "Senza titolo"}
        </h2>
        {article.description ? (
          <p className="max-w-prose text-sm leading-relaxed text-cyan-100/65">
            {article.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
