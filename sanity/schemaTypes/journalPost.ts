import {defineArrayMember, defineField, defineType} from 'sanity'

export const journalPost = defineType({
  name: 'journalPost',
  title: 'Journal Post',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt (legacy fallback)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'excerptEn',
      title: 'Excerpt EN',
      type: 'text',
      rows: 3,
      fieldset: 'english',
    }),
    defineField({
      name: 'excerptTr',
      title: 'Excerpt TR',
      type: 'text',
      rows: 3,
      fieldset: 'turkish',
    }),
    defineField({
      name: 'content',
      title: 'Content (legacy fallback)',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'contentEn',
      title: 'Content EN',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      fieldset: 'english',
    }),
    defineField({
      name: 'contentTr',
      title: 'Content TR',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      fieldset: 'turkish',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Thought', value: 'Thought'},
          {title: 'Development Log', value: 'Development Log'},
          {title: 'Behind the Scenes', value: 'Behind the Scenes'},
          {title: 'Life Note', value: 'Life Note'},
        ],
      },
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      titleEn: 'titleEn',
      titleTr: 'titleTr',
      subtitle: 'category',
      media: 'coverImage',
    },
    prepare({title, titleEn, titleTr, subtitle, media}) {
      return {
        title: titleEn || titleTr || title || 'Journal Post',
        subtitle,
        media,
      }
    },
  },
})
