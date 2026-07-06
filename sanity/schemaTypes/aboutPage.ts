import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fieldsets: [
    {
      name: 'english',
      title: 'English localized content',
      options: {columns: 2},
    },
    {
      name: 'turkish',
      title: 'Turkish localized content',
      options: {columns: 2},
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title (legacy fallback)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title EN',
      type: 'string',
      fieldset: 'english',
    }),
    defineField({
      name: 'titleTr',
      title: 'Title TR',
      type: 'string',
      fieldset: 'turkish',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (legacy fallback)',
      type: 'string',
    }),
    defineField({
      name: 'eyebrowEn',
      title: 'Eyebrow EN',
      type: 'string',
      fieldset: 'english',
    }),
    defineField({
      name: 'eyebrowTr',
      title: 'Eyebrow TR',
      type: 'string',
      fieldset: 'turkish',
    }),
    defineField({
      name: 'intro',
      title: 'Intro (legacy fallback)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introEn',
      title: 'Intro EN',
      type: 'text',
      rows: 3,
      fieldset: 'english',
    }),
    defineField({
      name: 'introTr',
      title: 'Intro TR',
      type: 'text',
      rows: 3,
      fieldset: 'turkish',
    }),
    defineField({
      name: 'body',
      title: 'Body (legacy fallback)',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'bodyEn',
      title: 'Body EN',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      fieldset: 'english',
    }),
    defineField({
      name: 'bodyTr',
      title: 'Body TR',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      fieldset: 'turkish',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'focusAreas',
      title: 'Focus Areas (legacy fallback)',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'focusAreasEn',
      title: 'Focus Areas EN',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      fieldset: 'english',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'focusAreasTr',
      title: 'Focus Areas TR',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      fieldset: 'turkish',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'currentFocus',
      title: 'Current Focus (legacy fallback)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'currentFocusEn',
      title: 'Current Focus EN',
      type: 'text',
      rows: 3,
      fieldset: 'english',
    }),
    defineField({
      name: 'currentFocusTr',
      title: 'Current Focus TR',
      type: 'text',
      rows: 3,
      fieldset: 'turkish',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      titleEn: 'titleEn',
      titleTr: 'titleTr',
      subtitle: 'intro',
      subtitleEn: 'introEn',
      subtitleTr: 'introTr',
      media: 'image',
    },
    prepare({title, titleEn, titleTr, subtitle, subtitleEn, subtitleTr, media}) {
      return {
        title: titleEn || titleTr || title || 'About Page',
        subtitle: subtitleEn || subtitleTr || subtitle,
        media,
      }
    },
  },
})
