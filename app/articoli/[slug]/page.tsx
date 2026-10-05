import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/Blocks";
import { getArticleBySlug, mediaUrl } from "@/lib/strapi";
import type { Article } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = (await getArticleBySlug(slug)) as Article | null;
  return {
    title: article?.title ?? "Articolo",
    description: article?.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = (await getArticleBySlug(slug)) as Article | null;

  if (!article) {
    notFound();
  }

  const cover = mediaUrl(article.cover);
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article>
      <Link href="/" className="text-sm text-cyan-300/70 hover:text-cyan-200">
        ← Tutti gli articoli
      </Link>
      {article.category?.name ? (
        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-cyan-300">
          {article.category.name}
        </p>
      ) : null}
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cyan-50 sm:text-5xl">
        {article.title}
      </h1>
      <p className="mt-4 text-sm text-cyan-100/50">
        {[article.author?.name, date].filter(Boolean).join(" · ")}
      </p>
      {article.description ? (
        <p className="mt-6 text-xl text-cyan-100/70">{article.description}</p>
      ) : null}
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={article.cover?.alternativeText || article.title || ""}
          className="mt-8 w-full rounded-2xl"
        />
      ) : null}
      <Blocks blocks={article.blocks} />
    </article>
  );
}
