import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { assist } from '@sanity/assist'
import { schemaTypes } from './lib/sanity/schemas'

const singlePageTypes = ['home', 'auth', 'dashboard']

export default defineConfig({
  name: 'default',
  title: 'ContentFlow',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wk6gdzqf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    // AI Assist - enables AI-powered content assist
    // Translation configuration is handled by @sanity/document-internationalization
    assist(),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draft/enable',
        },
      },
    }),
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'hi', title: 'Hindi' },
      ],
      schemaTypes: ['page', 'post'],
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title('ContentFlow')
          .items([
            S.listItem()
              .title('Posts')
              .icon(() => '📝')
              .child(S.documentTypeList('post').title('Posts')),
            
            S.listItem()
              .title('Pages')
              .icon(() => '📄')
              .child(S.documentTypeList('page').title('Pages')),
            
            S.listItem()
              .title('Authors')
              .icon(() => '👤')
              .child(S.documentTypeList('author').title('Authors')),
            
            S.listItem()
              .title('Languages')
              .icon(() => '🌐')
              .child(S.documentTypeList('language').title('Languages')),
            
            S.listItem()
              .title('Settings')
              .icon(() => '⚙️')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => {
      const filtered = templates.filter(
        (template) => !singlePageTypes.includes(template.id)
      )
      return [
        ...filtered,
        {
          id: 'homepage-template',
          title: 'Homepage',
          schemaType: 'page',
          value: {
            pageType: 'home',
            title: 'Home',
            components: [
              { _type: 'heroBlock', title: 'Welcome to ContentFlow', subtitle: 'Modern Publishing Platform', description: 'Create, manage, and publish amazing content.', backgroundType: 'gradient', align: 'center', size: 'lg' },
              { _type: 'featuredPostBlock', label: 'Featured Story', autoSelect: 'featured', layout: 'large' },
              { _type: 'postsGridBlock', title: 'Latest Stories', subtitle: 'Thoughts, tutorials, and insights', layout: 'grid', postsSource: 'latest', limit: 6 },
              { _type: 'newsletterBlock', title: 'Stay in the loop', description: 'Get the latest articles and updates delivered to your inbox.', style: 'simple' },
            ],
          },
        },
        {
          id: 'blog-page-template',
          title: 'Blog Page',
          schemaType: 'page',
          value: {
            pageType: 'generic',
            title: 'Blog',
            slug: { current: 'blog' },
            description: 'Explore our latest articles, tutorials, and insights.',
            components: [
              { _type: 'heroBlock', title: 'Our Blog', subtitle: 'Resources', description: 'Discover insights, tutorials, and stories.', backgroundType: 'gradient', align: 'center', size: 'md' },
              { _type: 'postsGridBlock', layout: 'grid', postsSource: 'latest', limit: 12 },
            ],
          },
        },
        {
          id: 'about-page-template',
          title: 'About Page',
          schemaType: 'page',
          value: {
            pageType: 'generic',
            title: 'About Us',
            slug: { current: 'about' },
            description: 'Learn more about our mission and team.',
            components: [
              { _type: 'heroBlock', title: 'About ContentFlow', subtitle: 'Our Story', description: "We're building the future of content management.", backgroundType: 'gradient', align: 'center', size: 'lg' },
              { _type: 'featuresBlock', title: 'What We Offer', layout: 'grid', features: [{ title: 'Fast & Modern', description: 'Built with the latest technologies.', icon: 'zap' }, { title: 'CMS-Driven', description: 'Manage content from a powerful CMS.', icon: 'layers' }, { title: 'SEO Optimized', description: 'Every page is optimized for search.', icon: 'globe' }] },
            ],
          },
        },
        {
          id: 'contact-page-template',
          title: 'Contact Page',
          schemaType: 'page',
          value: {
            pageType: 'generic',
            title: 'Contact Us',
            slug: { current: 'contact' },
            description: 'Get in touch with our team.',
            components: [
              { _type: 'heroBlock', title: 'Get in Touch', subtitle: 'Contact', description: 'Have questions? We\'d love to hear from you.', backgroundType: 'gradient', align: 'center', size: 'md' },
              { _type: 'newsletterBlock', title: 'Stay Updated', description: 'Subscribe to our newsletter.', style: 'simple', showIcon: true },
            ],
          },
        },
        {
          id: 'landing-page-template',
          title: 'Landing Page',
          schemaType: 'page',
          value: {
            pageType: 'generic',
            title: 'Landing Page',
            slug: { current: 'landing' },
            description: 'A complete landing page template.',
            components: [
              { _type: 'heroBlock', title: 'Transform Your Content Strategy', subtitle: 'Content Management Platform', description: 'The all-in-one platform for modern content teams.', backgroundType: 'gradient', align: 'center', size: 'full' },
              { _type: 'featuresBlock', title: 'Everything You Need', subtitle: 'Powerful features for modern teams', layout: 'grid', features: [{ title: 'Visual Editor', description: 'Intuitive drag-and-drop content building.', icon: 'layers' }, { title: 'Real-time Collaboration', description: 'Work together with your team.', icon: 'users' }, { title: 'API-First', description: 'Headless CMS with powerful APIs.', icon: 'code' }] },
              { _type: 'ctaBlock', title: 'Ready to Get Started?', description: 'Join thousands of teams using ContentFlow.', background: 'gradient', align: 'center' },
            ],
          },
        },
      ]
    },
  },
  document: {
    actions: (input, context) => {
      const documentId = context.documentId
      const isSinglePage = documentId === 'page-home' || documentId === 'page-auth' || documentId === 'page-dashboard'
      
      if (isSinglePage) {
        return input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
      }
      return input
    },
  },
})