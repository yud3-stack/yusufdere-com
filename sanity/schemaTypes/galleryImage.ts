import {defineField, defineType} from 'sanity'

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Lifestyle', value: 'Lifestyle'},
          {title: 'Travel', value: 'Travel'},
          {title: 'Cars', value: 'Cars'},
          {title: 'Motorcycles', value: 'Motorcycles'},
          {title: 'Coffee', value: 'Coffee'},
          {title: 'Workspace', value: 'Workspace'},
          {title: 'Photography', value: 'Photography'},
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location (legacy fallback)',
      type: 'string',
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
      name: 'date',
      title: 'Date',
      type: 'date',
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
      subtitle: 'category',
      media: 'image',
    },
    prepare({title, titleEn, titleTr, subtitle, media}) {
      return {
        title: titleEn || titleTr || title || 'Gallery Image',
        subtitle,
        media,
      }
    },
  },
})
