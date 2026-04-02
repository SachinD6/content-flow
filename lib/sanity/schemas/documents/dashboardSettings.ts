import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'dashboardSettings',
  title: 'Dashboard Settings',
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
      initialValue: 'Engineering CMS',
    }),
    defineField({
      name: 'welcomeMessage',
      title: 'Welcome Message Template',
      type: 'string',
      description: 'Use {name} to insert the user\'s name',
      initialValue: 'Welcome back, {name}',
    }),
    defineField({
      name: 'welcomeDescription',
      title: 'Welcome Description',
      type: 'text',
      rows: 2,
      initialValue: 'Here is what is happening across your content ecosystem today.',
    }),
    defineField({
      name: 'stats',
      title: 'Dashboard Stats',
      type: 'object',
      fields: [
        defineField({
          name: 'totalPosts',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Total Posts' }),
            defineField({ name: 'icon', type: 'string', initialValue: 'file-text' }),
          ],
        }),
        defineField({
          name: 'subscription',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Subscription Plan' }),
            defineField({ name: 'icon', type: 'string', initialValue: 'credit-card' }),
            defineField({ name: 'proText', type: 'string', initialValue: 'Unlimited access to all nodes' }),
            defineField({ name: 'freeText', type: 'string', initialValue: 'Basic publishing limits active' }),
          ],
        }),
        defineField({
          name: 'profileComplete',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Profile Complete' }),
            defineField({ name: 'icon', type: 'string', initialValue: 'user-check' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'activitySection',
      title: 'Activity Section',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Recent Content Activity' }),
        defineField({ name: 'viewAllLink', type: 'string', initialValue: 'View all architecture' }),
        defineField({ name: 'emptyMessage', type: 'string', initialValue: 'No recent architectural entries recorded yet.' }),
        defineField({
          name: 'tableHeaders',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', initialValue: 'Node Title' }),
            defineField({ name: 'author', type: 'string', initialValue: 'Architect' }),
            defineField({ name: 'date', type: 'string', initialValue: 'Publication Date' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'defaultAuthor',
      title: 'Default Author Name',
      type: 'string',
      initialValue: 'Generic System',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Dashboard Settings' }),
  },
})