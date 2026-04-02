import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'authPages',
  title: 'Auth Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'ContentFlow',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'CMS-driven publishing for engineering teams.',
    }),
    defineField({
      name: 'features',
      title: 'Feature List',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({ name: 'icon', type: 'string', options: {
              list: [
                { title: 'Rocket', value: 'rocket' },
                { title: 'Code', value: 'code' },
                { title: 'Layers', value: 'layers' },
                { title: 'Zap', value: 'zap' },
                { title: 'Shield', value: 'shield' },
                { title: 'Users', value: 'users' },
              ]
            }}),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
    }),
    defineField({
      name: 'loginPage',
      title: 'Login Page',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Welcome back' }),
        defineField({ name: 'subtitle', type: 'string', initialValue: 'Sign in to your workspace' }),
        defineField({ name: 'buttonText', type: 'string', initialValue: 'Sign in' }),
        defineField({ name: 'alternateText', type: 'string', initialValue: "Don't have an account?" }),
        defineField({ name: 'alternateLinkText', type: 'string', initialValue: 'Sign up' }),
      ],
    }),
    defineField({
      name: 'signupPage',
      title: 'Signup Page',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Create an account' }),
        defineField({ name: 'subtitle', type: 'string', initialValue: 'Sign up for your workspace' }),
        defineField({ name: 'buttonText', type: 'string', initialValue: 'Sign up' }),
        defineField({ name: 'alternateText', type: 'string', initialValue: 'Already have an account?' }),
        defineField({ name: 'alternateLinkText', type: 'string', initialValue: 'Sign in' }),
      ],
    }),
    defineField({
      name: 'oauthProviders',
      title: 'OAuth Providers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', options: {
              list: [
                { title: 'Google', value: 'google' },
                { title: 'GitHub', value: 'github' },
                { title: 'Apple', value: 'apple' },
              ]
            }}),
            defineField({ name: 'enabled', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'name' },
          },
        },
      ],
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'object',
      fields: [
        defineField({ name: 'terms', type: 'string', initialValue: 'TERMS' }),
        defineField({ name: 'termsUrl', type: 'string', initialValue: '/terms' }),
        defineField({ name: 'privacy', type: 'string', initialValue: 'PRIVACY' }),
        defineField({ name: 'privacyUrl', type: 'string', initialValue: '/privacy' }),
        defineField({ name: 'security', type: 'string', initialValue: 'SECURITY' }),
        defineField({ name: 'securityUrl', type: 'string', initialValue: '/security' }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({ name: 'backedByText', type: 'string', initialValue: 'BACKED BY' }),
        defineField({ name: 'poweredByText', type: 'string', initialValue: 'Supabase Auth' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Auth Pages' }),
  },
})