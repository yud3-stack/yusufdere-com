import { type SchemaTypeDefinition } from 'sanity'

import {aboutPage} from './aboutPage'
import {galleryImage} from './galleryImage'
import {journalPost} from './journalPost'
import {nowItem} from './nowItem'
import {project} from './project'
import {siteSettings} from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    aboutPage,
    project,
    journalPost,
    galleryImage,
    nowItem,
  ],
}
