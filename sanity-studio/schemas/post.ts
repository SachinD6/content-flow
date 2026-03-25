interface SanityRule {
  required: () => SanityRule;
}

export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Title', 
      type: 'string',
      validation: (Rule: SanityRule) => Rule.required() 
    },
    { 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug',
      options: { source: 'title' }, 
      validation: (Rule: SanityRule) => Rule.required() 
    },
    { 
      name: 'excerpt', 
      title: 'Excerpt', 
      type: 'text', 
      rows: 3 
    },
    { 
      name: 'body', 
      title: 'Body', 
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] 
    },
    { 
      name: 'author', 
      title: 'Author', 
      type: 'reference',
      to: [{ type: 'author' }] 
    },
    { 
      name: 'coverImage', 
      title: 'Cover Image', 
      type: 'image',
      options: { hotspot: true } 
    },
    { 
      name: 'publishedAt', 
      title: 'Published At', 
      type: 'datetime' 
    },
    { 
      name: 'tags', 
      title: 'Tags', 
      type: 'array', 
      of: [{ type: 'string' }] 
    },
    { 
      name: 'featured', 
      title: 'Featured', 
      type: 'boolean',
      initialValue: false 
    },
  ]
}
