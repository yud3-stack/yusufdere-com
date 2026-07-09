import {defineField, defineType} from 'sanity'

export const activityLog = defineType({
  name: 'activityLog',
  title: 'Activity Log',
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
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Project', value: 'project'},
          {title: 'Journal', value: 'journal'},
          {title: 'Code', value: 'code'},
          {title: 'Design', value: 'design'},
          {title: 'Photo', value: 'photo'},
          {title: 'Learning', value: 'learning'},
          {title: 'Personal', value: 'personal'},
        ],
        layout: 'radio',
      },
      initialValue: 'project',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intensity',
      title: 'Intensity',
      type: 'number',
      initialValue: 2,
      validation: (rule) => rule.integer().min(1).max(4),
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related Project',
      type: 'reference',
      to: [{type: 'project'}],
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
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
      date: 'date',
      type: 'type',
    },
    prepare({title, titleEn, titleTr, date, type}) {
      return {
        title: titleEn || titleTr || title || 'Activity Log',
        subtitle: [type, date].filter(Boolean).join(' · '),
      }
    },
  },
})
