import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0] {
    _id,
    name,
    bio,
    bioEn,
    bioTr,
    location,
    locationEn,
    locationTr,
    email,
    instagramUrl,
    githubUrl,
    linkedinUrl,
    seoTitle,
    seoTitleEn,
    seoTitleTr,
    seoDescription,
    seoDescriptionEn,
    seoDescriptionTr,
    ogImage
  }
`);

export const aboutPageQuery = defineQuery(/* groq */ `
  *[_id == "aboutPage" || _type == "aboutPage"][0] {
    _id,
    title,
    titleEn,
    titleTr,
    eyebrow,
    eyebrowEn,
    eyebrowTr,
    intro,
    introEn,
    introTr,
    body,
    bodyEn,
    bodyTr,
    location,
    focusAreas,
    focusAreasEn,
    focusAreasTr,
    currentFocus,
    currentFocusEn,
    currentFocusTr,
    image,
    updatedAt
  }
`);

export const featuredProjectsQuery = defineQuery(/* groq */ `
  *[_type == "project" && featured == true]
  | order(order asc, _createdAt desc) [0...3] {
    _id,
    title,
    titleEn,
    titleTr,
    "slug": slug.current,
    shortDescription,
    shortDescriptionEn,
    shortDescriptionTr,
    coverImage,
    status,
    category,
    categoryLabelEn,
    categoryLabelTr,
    techStack,
    liveUrl,
    githubUrl,
    featured,
    order
  }
`);

export const featuredJournalPostsQuery = defineQuery(/* groq */ `
  *[_type == "journalPost" && published == true && featured == true]
  | order(date desc, _createdAt desc) [0...3] {
    _id,
    title,
    titleEn,
    titleTr,
    "slug": slug.current,
    excerpt,
    excerptEn,
    excerptTr,
    coverImage,
    date,
    category,
    published,
    featured
  }
`);

export const activeNowItemsQuery = defineQuery(/* groq */ `
  *[_type == "nowItem" && active == true]
  | order(order asc, _createdAt desc) [0...4] {
    _id,
    title,
    titleEn,
    titleTr,
    description,
    descriptionEn,
    descriptionTr,
    icon,
    active,
    order
  }
`);

export const featuredUsesItemsQuery = defineQuery(/* groq */ `
  *[_type == "usesItem" && featured == true]
  | order(order asc, _createdAt desc) [0...6] {
    _id,
    title,
    titleEn,
    titleTr,
    category,
    categoryLabelEn,
    categoryLabelTr,
    description,
    descriptionEn,
    descriptionTr,
    icon,
    url,
    order,
    featured
  }
`);

export const featuredGalleryImagesQuery = defineQuery(/* groq */ `
  *[_type == "galleryImage" && featured == true]
  | order(order asc, date desc, _createdAt desc) [0...4] {
    _id,
    image,
    title,
    titleEn,
    titleTr,
    category,
    location,
    locationEn,
    locationTr,
    date,
    description,
    descriptionEn,
    descriptionTr,
    featured,
    order
  }
`);

export const featuredActivityLogsQuery = defineQuery(/* groq */ `
  *[_type == "activityLog" && featured == true]
  | order(order asc, date desc, _createdAt desc) [0...5] {
    _id,
    title,
    titleEn,
    titleTr,
    description,
    descriptionEn,
    descriptionTr,
    date,
    type,
    intensity,
    relatedProject->{
      title,
      titleEn,
      titleTr,
      "slug": slug.current
    },
    url,
    featured,
    order
  }
`);

export const allProjectsQuery = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)]
  | order(order asc, _createdAt desc) {
    _id,
    title,
    titleEn,
    titleTr,
    "slug": slug.current,
    shortDescription,
    shortDescriptionEn,
    shortDescriptionTr,
    coverImage,
    status,
    category,
    categoryLabelEn,
    categoryLabelTr,
    techStack,
    liveUrl,
    githubUrl,
    featured,
    order
  }
`);

export const projectBySlugQuery = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    titleEn,
    titleTr,
    "slug": slug.current,
    shortDescription,
    shortDescriptionEn,
    shortDescriptionTr,
    description,
    descriptionEn,
    descriptionTr,
    coverImage,
    status,
    category,
    categoryLabelEn,
    categoryLabelTr,
    techStack,
    liveUrl,
    githubUrl,
    featured,
    order
  }
`);

export const allJournalPostsQuery = defineQuery(/* groq */ `
  *[_type == "journalPost" && published == true && defined(slug.current)]
  | order(date desc, _createdAt desc) {
    _id,
    title,
    titleEn,
    titleTr,
    "slug": slug.current,
    excerpt,
    excerptEn,
    excerptTr,
    coverImage,
    date,
    category,
    published,
    featured
  }
`);

export const journalPostBySlugQuery = defineQuery(/* groq */ `
  *[_type == "journalPost" && slug.current == $slug && published == true][0] {
    _id,
    title,
    titleEn,
    titleTr,
    "slug": slug.current,
    excerpt,
    excerptEn,
    excerptTr,
    content,
    contentEn,
    contentTr,
    coverImage,
    date,
    category,
    published,
    featured
  }
`);

export const allGalleryImagesQuery = defineQuery(/* groq */ `
  *[_type == "galleryImage"]
  | order(order asc, date desc, _createdAt desc) {
    _id,
    image,
    title,
    titleEn,
    titleTr,
    category,
    location,
    locationEn,
    locationTr,
    date,
    description,
    descriptionEn,
    descriptionTr,
    featured,
    order
  }
`);

export const allUsesItemsQuery = defineQuery(/* groq */ `
  *[_type == "usesItem"]
  | order(order asc, _createdAt desc) {
    _id,
    title,
    titleEn,
    titleTr,
    category,
    categoryLabelEn,
    categoryLabelTr,
    description,
    descriptionEn,
    descriptionTr,
    icon,
    url,
    order,
    featured
  }
`);

export const allNowItemsQuery = defineQuery(/* groq */ `
  *[_type == "nowItem"]
  | order(active desc, order asc, _createdAt desc) {
    _id,
    title,
    titleEn,
    titleTr,
    description,
    descriptionEn,
    descriptionTr,
    icon,
    active,
    order
  }
`);

export const allActivityLogsQuery = defineQuery(/* groq */ `
  *[_type == "activityLog"]
  | order(order asc, date desc, _createdAt desc) {
    _id,
    title,
    titleEn,
    titleTr,
    description,
    descriptionEn,
    descriptionTr,
    date,
    type,
    intensity,
    relatedProject->{
      title,
      titleEn,
      titleTr,
      "slug": slug.current
    },
    url,
    featured,
    order
  }
`);
