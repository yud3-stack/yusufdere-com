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
  bioEn?: string | null;
  bioTr?: string | null;
  location?: string | null;
  locationEn?: string | null;
  locationTr?: string | null;
  email?: string | null;
  instagramUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  seoTitle?: string | null;
  seoTitleEn?: string | null;
  seoTitleTr?: string | null;
  seoDescription?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionTr?: string | null;
  ogImage?: SanityImage | null;
};

export type AboutPage = {
  _id?: string;
  title?: string | null;
  titleEn?: string | null;
  titleTr?: string | null;
  eyebrow?: string | null;
  eyebrowEn?: string | null;
  eyebrowTr?: string | null;
  intro?: string | null;
  introEn?: string | null;
  introTr?: string | null;
  body?: PortableTextBlock[] | null;
  bodyEn?: PortableTextBlock[] | null;
  bodyTr?: PortableTextBlock[] | null;
  location?: string | null;
  focusAreas?: string[] | null;
  focusAreasEn?: string[] | null;
  focusAreasTr?: string[] | null;
  currentFocus?: string | null;
  currentFocusEn?: string | null;
  currentFocusTr?: string | null;
  image?: SanityImage | null;
  updatedAt?: string | null;
};

export type Project = {
  _id: string;
  title?: string | null;
  titleEn?: string | null;
  titleTr?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  shortDescriptionEn?: string | null;
  shortDescriptionTr?: string | null;
  description?: PortableTextBlock[] | null;
  descriptionEn?: PortableTextBlock[] | null;
  descriptionTr?: PortableTextBlock[] | null;
  coverImage?: SanityImage | null;
  status?: string | null;
  category?: string | null;
  categoryLabelEn?: string | null;
  categoryLabelTr?: string | null;
  techStack?: string[] | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean | null;
  order?: number | null;
};

export type JournalPost = {
  _id: string;
  title?: string | null;
  titleEn?: string | null;
  titleTr?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  excerptEn?: string | null;
  excerptTr?: string | null;
  content?: PortableTextBlock[] | null;
  contentEn?: PortableTextBlock[] | null;
  contentTr?: PortableTextBlock[] | null;
  coverImage?: SanityImage | null;
  date?: string | null;
  category?: string | null;
  published?: boolean | null;
  featured?: boolean | null;
};

export type NowItem = {
  _id: string;
  title?: string | null;
  titleEn?: string | null;
  titleTr?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  descriptionTr?: string | null;
  icon?: string | null;
  active?: boolean | null;
  order?: number | null;
};

export type UsesItem = {
  _id: string;
  title?: string | null;
  titleEn?: string | null;
  titleTr?: string | null;
  category?: string | null;
  categoryLabelEn?: string | null;
  categoryLabelTr?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  descriptionTr?: string | null;
  icon?: string | null;
  url?: string | null;
  order?: number | null;
  featured?: boolean | null;
};

export type GalleryImage = {
  _id: string;
  image?: SanityImage | null;
  title?: string | null;
  titleEn?: string | null;
  titleTr?: string | null;
  category?: string | null;
  location?: string | null;
  locationEn?: string | null;
  locationTr?: string | null;
  date?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  descriptionTr?: string | null;
  featured?: boolean | null;
  order?: number | null;
};
