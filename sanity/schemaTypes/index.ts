import { type SchemaTypeDefinition } from 'sanity'

import {galleryImage} from './galleryImage'
import {journalPost} from './journalPost'
import {nowItem} from './nowItem'
import {project} from './project'
import {siteSettings} from './siteSettings'
import {usesItem} from './usesItem'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, project, journalPost, galleryImage, nowItem, usesItem],
}
