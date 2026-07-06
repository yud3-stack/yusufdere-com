import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    {
      name: 'english',
      title: 'English localized fields',
      options: {columns: 2},
    },
    {
      name: 'turkish',
      title: 'Turkish localized fields',
      options: {columns: 2},
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio (legacy fallback)',
      type: 'string',
      description: 'Kept for existing content. Prefer Bio EN / Bio TR for localized copy.',
    }),
    defineField({
      name: 'bioEn',
      title: 'Bio EN',
      type: 'string',
      fieldset: 'english',
    }),
    defineField({
      name: 'bioTr',
      title: 'Bio TR',
      type: 'string',
      fieldset: 'turkish',
    }),
    defineField({
      name: 'location',
      title: 'Location (legacy fallback)',
      type: 'string',
      description: 'Kept for existing content. Prefer Location EN / Location TR for localized copy.',
    }),
    defineField({
      name: 'locationEn',
      title: 'Location EN',
      type: 'string',
      fieldset: 'english',
    }),
    defineField({
      name: 'locationTr',
      title: 'Location TR',
      type: 'string',
      fieldset: 'turkish',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (legacy fallback)',
      type: 'string',
      description: 'Kept for existing content. Prefer SEO Title EN / SEO Title TR.',
    }),
    defineField({
      name: 'seoTitleEn',
      title: 'SEO Title EN',
      type: 'string',
      fieldset: 'english',
    }),
    defineField({
      name: 'seoTitleTr',
      title: 'SEO Title TR',
      type: 'string',
      fieldset: 'turkish',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (legacy fallback)',
      type: 'text',
      rows: 3,
      description: 'Kept for existing content. Prefer SEO Description EN / SEO Description TR.',
      validation: (rule) =>
        rule.max(160).warning('Keep SEO descriptions under 160 characters when possible.'),
    }),
    defineField({
      name: 'seoDescriptionEn',
      title: 'SEO Description EN',
      type: 'text',
      rows: 3,
      fieldset: 'english',
      validation: (rule) =>
        rule.max(160).warning('Keep SEO descriptions under 160 characters when possible.'),
    }),
    defineField({
      name: 'seoDescriptionTr',
      title: 'SEO Description TR',
      type: 'text',
      rows: 3,
      fieldset: 'turkish',
      validation: (rule) =>
        rule.max(160).warning('Keep SEO descriptions under 160 characters when possible.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'bio',
      subtitleEn: 'bioEn',
      subtitleTr: 'bioTr',
      media: 'ogImage',
    },
    prepare({title, subtitle, subtitleEn, subtitleTr, media}) {
      return {
        title: title || 'Site Settings',
        subtitle: subtitleEn || subtitleTr || subtitle,
        media,
      }
    },
  },
})
