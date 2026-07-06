import {defineField, defineType} from 'sanity'

export const usesItem = defineType({
  name: 'usesItem',
  title: 'Uses Item',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Hardware', value: 'Hardware'},
          {title: 'Software', value: 'Software'},
          {title: 'Desk', value: 'Desk'},
          {title: 'Apps', value: 'Apps'},
          {title: 'Everyday Carry', value: 'Everyday Carry'},
        ],
      },
    }),
    defineField({
      name: 'categoryLabelEn',
      title: 'Category Label EN',
      type: 'string',
      fieldset: 'english',
      description: 'Optional display label. Falls back to Category.',
    }),
    defineField({
      name: 'categoryLabelTr',
      title: 'Category Label TR',
      type: 'string',
      fieldset: 'turkish',
      description: 'Optional display label. Falls back to Category.',
    }),
    defineField({
      name: 'description',
      title: 'Description (legacy fallback)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description EN',
      type: 'text',
      rows: 3,
      fieldset: 'english',
    }),
    defineField({
      name: 'descriptionTr',
      title: 'Description TR',
      type: 'text',
      rows: 3,
      fieldset: 'turkish',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Lucide icon name or a short internal icon key.',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
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
    },
    prepare({title, titleEn, titleTr, subtitle}) {
      return {
        title: titleEn || titleTr || title || 'Uses Item',
        subtitle,
      }
    },
  },
})
