import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
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
      name: 'shortDescription',
      title: 'Short Description (legacy fallback)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'shortDescriptionEn',
      title: 'Short Description EN',
      type: 'text',
      rows: 3,
      fieldset: 'english',
    }),
    defineField({
      name: 'shortDescriptionTr',
      title: 'Short Description TR',
      type: 'text',
      rows: 3,
      fieldset: 'turkish',
    }),
    defineField({
      name: 'description',
      title: 'Description (legacy fallback)',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description EN',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      fieldset: 'english',
    }),
    defineField({
      name: 'descriptionTr',
      title: 'Description TR',
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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Idea', value: 'idea'},
          {title: 'Building', value: 'building'},
          {title: 'Live', value: 'live'},
          {title: 'Paused', value: 'paused'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'idea',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'AI', value: 'AI'},
          {title: 'SaaS', value: 'SaaS'},
          {title: 'Web', value: 'Web'},
          {title: 'Mobile', value: 'Mobile'},
          {title: 'Experiment', value: 'Experiment'},
          {title: 'Open Source', value: 'Open Source'},
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
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
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
      subtitle: 'status',
      media: 'coverImage',
    },
    prepare({title, titleEn, titleTr, subtitle, media}) {
      return {
        title: titleEn || titleTr || title || 'Project',
        subtitle,
        media,
      }
    },
  },
})
