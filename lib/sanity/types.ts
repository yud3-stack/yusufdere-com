export type SanityImage = {
  _type?: "image";
  asset?: {
    _ref?: string;
    _type?: "reference";
  };
  [key: string]: unknown;
};

export type PortableTextSpan = {
  _type?: "span";
  text?: string;
};

export type PortableTextBlock = {
  _key?: string;
  _type?: "block";
  style?: string;
  children?: PortableTextSpan[];
};

export type SiteSettings = {
  _id?: string;
  name?: string | null;
  bio?: string | null;
  location?: string | null;
  email?: string | null;
  instagramUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: SanityImage | null;
};

export type AboutPage = {
  _id?: string;
  title?: string | null;
  eyebrow?: string | null;
  intro?: string | null;
  body?: PortableTextBlock[] | null;
  location?: string | null;
  focusAreas?: string[] | null;
  currentFocus?: string | null;
  image?: SanityImage | null;
  updatedAt?: string | null;
};

export type Project = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  description?: PortableTextBlock[] | null;
  coverImage?: SanityImage | null;
  status?: string | null;
  category?: string | null;
  techStack?: string[] | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean | null;
  order?: number | null;
};

export type JournalPost = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: PortableTextBlock[] | null;
  coverImage?: SanityImage | null;
  date?: string | null;
  category?: string | null;
  published?: boolean | null;
  featured?: boolean | null;
};

export type NowItem = {
  _id: string;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  active?: boolean | null;
  order?: number | null;
};

export type UsesItem = {
  _id: string;
  title?: string | null;
  category?: string | null;
  description?: string | null;
  icon?: string | null;
  url?: string | null;
  order?: number | null;
  featured?: boolean | null;
};

export type GalleryImage = {
  _id: string;
  image?: SanityImage | null;
  title?: string | null;
  category?: string | null;
  location?: string | null;
  date?: string | null;
  description?: string | null;
  featured?: boolean | null;
  order?: number | null;
};
