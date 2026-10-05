export type StrapiMedia = {
  url?: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
};

export type Category = {
  name?: string;
  slug?: string;
};

export type Author = {
  name?: string;
  email?: string;
  avatar?: StrapiMedia | null;
};

export type Article = {
  id: number;
  documentId?: string;
  title?: string;
  description?: string;
  slug?: string;
  publishedAt?: string | null;
  cover?: StrapiMedia | null;
  category?: Category | null;
  author?: Author | null;
  blocks?: Block[] | null;
};

export type Block = {
  __component?: string;
  id?: number;
  body?: string;
  title?: string;
  file?: StrapiMedia | null;
  files?: StrapiMedia[] | null;
};

export type AboutPage = {
  title?: string;
  blocks?: Block[] | null;
};
