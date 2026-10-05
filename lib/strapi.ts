const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

export function strapiUrl() {
  return STRAPI_URL.replace(/\/$/, "");
}

export function mediaUrl(file?: { url?: string } | null) {
  if (!file?.url) return null;
  if (file.url.startsWith("http")) return file.url;
  return `${strapiUrl()}${file.url}`;
}

function qs(params: Record<string, string>) {
  return new URLSearchParams(params).toString();
}

async function strapiGet<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const url = `${strapiUrl()}${path}?${qs(params)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.error(`Strapi ${res.status} su ${url}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("Impossibile contattare Strapi:", error);
    return null;
  }
}

const articlePopulate = {
  "populate[cover]": "true",
  "populate[category]": "true",
  "populate[author][populate][0]": "avatar",
  "populate[blocks][populate]": "*",
};

export async function getArticles() {
  const json = await strapiGet<{ data: unknown[] }>("/api/articles", {
    "sort[0]": "publishedAt:desc",
    ...articlePopulate,
  });

  return Array.isArray(json?.data) ? json.data : [];
}

export async function getArticleBySlug(slug: string) {
  const json = await strapiGet<{ data: unknown[] }>("/api/articles", {
    "filters[slug][$eq]": slug,
    ...articlePopulate,
  });

  const first = json?.data?.[0];
  return first ?? null;
}

export async function getAbout() {
  const json = await strapiGet<{ data: unknown }>("/api/about", {
    "populate[blocks][populate]": "*",
  });

  return json?.data ?? null;
}
