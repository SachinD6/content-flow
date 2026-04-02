import { defineConfig } from 'sanity'
import { structureTool, StructureBuilder as S } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './lib/sanity/schemas'

const singletonTypes = ['siteSettings', 'navigation', 'homePage', 'authPages', 'dashboardSettings']

const singletonActions = ['publish', 'discardChanges', 'restore']

export default defineConfig({
  name: 'default',
  title: 'ContentFlow Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wk6gdzqf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('Navigation')
              .id('navigation')
              .child(
                S.document()
                  .schemaType('navigation')
                  .documentId('navigation')
              ),
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
              ),
            S.listItem()
              .title('Auth Pages')
              .id('authPages')
              .child(
                S.document()
                  .schemaType('authPages')
                  .documentId('authPages')
              ),
            S.listItem()
              .title('Dashboard Settings')
              .id('dashboardSettings')
              .child(
                S.document()
                  .schemaType('dashboardSettings')
                  .documentId('dashboardSettings')
              ),
            S.divider(),
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('author').title('Authors'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletonTypes.includes(template.id)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.includes(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.includes(action))
        : input,
  },
})