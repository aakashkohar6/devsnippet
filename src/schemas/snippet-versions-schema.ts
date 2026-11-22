import type { CollectionSchema } from 'deepspace/schema'

export const snippetVersionsSchema: CollectionSchema = {
  name: 'snippet_versions',
  columns: [
    { name: 'snippetId', storage: 'text', interpretation: 'plain' },
    { name: 'title', storage: 'text', interpretation: 'plain' },
    { name: 'language', storage: 'text', interpretation: 'plain' },
    { name: 'code', storage: 'text', interpretation: 'plain' },
    { name: 'ownerId', storage: 'text', interpretation: 'plain' },
  ],
  permissions: {
    viewer: { read: false, create: false, update: false, delete: false },
    member: { read: 'own', create: true, update: 'own', delete: 'own' },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
