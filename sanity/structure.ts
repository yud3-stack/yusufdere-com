import type {StructureResolver} from 'sanity/structure'

const singletonTypes = ['siteSettings', 'aboutPage']
const manuallyListedTypes = [...singletonTypes, 'activityLog']

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),
      S.listItem()
        .title('About Page')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
            .title('About Page'),
        ),
      S.listItem()
        .title('Activity Log')
        .schemaType('activityLog')
        .child(S.documentTypeList('activityLog').title('Activity Log')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !manuallyListedTypes.includes(listItem.getId() || ''),
      ),
    ])
