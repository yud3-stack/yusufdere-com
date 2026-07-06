import {defineField, defineType} from 'sanity'

export const nowItem = defineType({
  name: 'nowItem',
  title: 'Now Item',
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
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      titleEn: 'titleEn',
      titleTr: 'titleTr',
      subtitle: 'description',
      subtitleEn: 'descriptionEn',
      subtitleTr: 'descriptionTr',
    },
    prepare({title, titleEn, titleTr, subtitle, subtitleEn, subtitleTr}) {
      return {
        title: titleEn || titleTr || title || 'Now Item',
        subtitle: subtitleEn || subtitleTr || subtitle,
      }
    },
  },
})
