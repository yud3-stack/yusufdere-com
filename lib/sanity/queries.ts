import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0] {
    _id,
    name,
    bio,
    location,
    email,
    instagramUrl,
    githubUrl,
    linkedinUrl,
    seoTitle,
    seoDescription,
    ogImage
  }
`);

export const featuredProjectsQuery = defineQuery(/* groq */ `
  *[_type == "project" && featured == true]
  | order(order asc, _createdAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    coverImage,
    status,
    category,
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
    "slug": slug.current,
    excerpt,
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
    description,
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
    category,
    description,
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
    category,
    location,
    date,
    description,
    featured,
    order
  }
`);
