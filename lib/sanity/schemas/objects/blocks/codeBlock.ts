import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  icon: () => '💻',
  groups: [
    { name: 'code', title: '💻 Code' },
    { name: 'display', title: '🖥️ Display' },
    { name: 'styles', title: '🎨 Styles' },
  ],
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 10,
      description: 'Paste your code here',
      validation: (Rule) => Rule.required(),
      group: 'code',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'Python', value: 'python' },
          { title: 'React/JSX', value: 'jsx' },
          { title: 'Vue', value: 'vue' },
          { title: 'CSS', value: 'css' },
          { title: 'SCSS', value: 'scss' },
          { title: 'HTML', value: 'html' },
          { title: 'JSON', value: 'json' },
          { title: 'Bash', value: 'bash' },
          { title: 'SQL', value: 'sql' },
          { title: 'Go', value: 'go' },
          { title: 'Rust', value: 'rust' },
          { title: 'Java', value: 'java' },
          { title: 'C#', value: 'csharp' },
          { title: 'PHP', value: 'php' },
          { title: 'Ruby', value: 'ruby' },
          { title: 'Swift', value: 'swift' },
          { title: 'Kotlin', value: 'kotlin' },
        ],
      },
      initialValue: 'javascript',
      group: 'code',
    }),
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
      description: 'Optional filename to display (e.g., "app.tsx")',
      group: 'code',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title above the code block',
      group: 'display',
    }),
    defineField({
      name: 'showLineNumbers',
      title: 'Show Line Numbers',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'showCopyButton',
      title: 'Show Copy Button',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'highlightLines',
      title: 'Highlight Lines',
      type: 'string',
      description: 'Line numbers to highlight (e.g., "1-3, 7, 10-12")',
      group: 'display',
    }),
    defineField({
      name: 'styles',
      title: 'Block Styles',
      type: 'blockStyles',
      group: 'styles',
    }),
  ],
  preview: {
    select: {
      language: 'language',
      filename: 'filename',
      code: 'code',
    },
    prepare({ language, filename, code }) {
      const preview = code ? code.substring(0, 50) : ''
      return {
        title: filename || `${language || 'Code'} Block`,
        subtitle: preview + (code && code.length > 50 ? '...' : ''),
      }
    },
  },
})