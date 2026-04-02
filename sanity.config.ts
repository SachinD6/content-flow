import { defineConfig } from 'sanity'
import { structureTool, StructureBuilder as S } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './lib/sanity/schemas'

// Single-instance page types - only one of each can exist
const singlePageTypes = ['home', 'auth', 'dashboard']
const singlePageActions = ['publish', 'discardChanges', 'restore']

export default defineConfig({
  name: 'default',
  title: 'ContentFlow Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wk6gdzqf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draft/enable',
        },
      },
    }),
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
            S.divider(),
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages by Type')
                  .items([
                    S.listItem()
                      .title('Homepage')
                      .id('page-home')
                      .child(
                        S.document()
                          .schemaType('page')
                          .documentId('page-home')
                          .initialValueTemplate('pageType', { pageType: 'home' })
                      ),
                    S.listItem()
                      .title('Auth Pages')
                      .id('page-auth')
                      .child(
                        S.document()
                          .schemaType('page')
                          .documentId('page-auth')
                          .initialValueTemplate('pageType', { pageType: 'auth' })
                      ),
                    S.listItem()
                      .title('Dashboard')
                      .id('page-dashboard')
                      .child(
                        S.document()
                          .schemaType('page')
                          .documentId('page-dashboard')
                          .initialValueTemplate('pageType', { pageType: 'dashboard' })
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Generic Pages')
                      .child(
                        S.documentTypeList('page')
                          .title('Generic Pages')
                          .filter('pageType == "generic"')
                      ),
                  ])
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
    templates: (templates) => {
      // Filter out single-page types from templates (they're created via structure)
      const filtered = templates.filter(
        (template) => !singlePageTypes.includes(template.id)
      )
      // Add template for creating generic pages
      return [
        ...filtered,
        {
          id: 'pageType',
          title: 'Page Type',
          schemaType: 'page',
          parameters: [{ name: 'pageType', type: 'string' }],
          value: (params: { pageType: string }) => ({
            pageType: params.pageType,
            title: params.pageType === 'home' ? 'Home' : 
                   params.pageType === 'auth' ? 'Authentication' : 
                   params.pageType === 'dashboard' ? 'Dashboard' : 'Untitled',
          }),
        },
      ]
    },
  },
  document: {
    actions: (input, context) => {
      // Get the current document being edited
      const documentId = context.documentId
      // Check if it's a single-instance page (home, auth, dashboard)
      const isSinglePage = documentId === 'page-home' || documentId === 'page-auth' || documentId === 'page-dashboard'
      
      if (isSinglePage) {
        return input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
      }
      return input
    },
  },
})