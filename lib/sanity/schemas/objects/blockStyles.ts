import { defineType, defineField } from 'sanity'

// Reusable style options for all blocks
export default defineType({
  name: 'blockStyles',
  title: 'Block Styles',
  type: 'object',
  groups: [
    { name: 'background', title: '🎨 Background' },
    { name: 'spacing', title: '📐 Spacing' },
    { name: 'layout', title: '📦 Layout' },
    { name: 'border', title: '🔲 Border & Shadow' },
  ],
  fields: [
    // Background
    defineField({
      name: 'backgroundType',
      title: 'Background Type',
      type: 'string',
      options: {
        list: [
          { title: 'None (transparent)', value: 'none' },
          { title: 'Solid Color', value: 'color' },
          { title: 'Gradient', value: 'gradient' },
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      group: 'background',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color code (e.g., #0b0c10)',
      hidden: ({ parent }) => parent?.backgroundType !== 'color',
      group: 'background',
    }),
    defineField({
      name: 'backgroundGradient',
      title: 'Gradient',
      type: 'string',
      description: 'CSS gradient (e.g., linear-gradient(135deg, #667eea 0%, #764ba2 100%))',
      hidden: ({ parent }) => parent?.backgroundType !== 'gradient',
      group: 'background',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
      group: 'background',
    }),
    defineField({
      name: 'backgroundVideo',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube or Vimeo video URL for background',
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
      group: 'background',
    }),

    // Spacing
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Extra Small (1rem)', value: 'xs' },
          { title: 'Small (2rem)', value: 'sm' },
          { title: 'Medium (3rem)', value: 'md' },
          { title: 'Large (4rem)', value: 'lg' },
          { title: 'Extra Large (6rem)', value: 'xl' },
          { title: '2X Large (8rem)', value: '2xl' },
        ],
      },
      initialValue: 'md',
      group: 'spacing',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Extra Small (1rem)', value: 'xs' },
          { title: 'Small (2rem)', value: 'sm' },
          { title: 'Medium (3rem)', value: 'md' },
          { title: 'Large (4rem)', value: 'lg' },
          { title: 'Extra Large (6rem)', value: 'xl' },
          { title: '2X Large (8rem)', value: '2xl' },
        ],
      },
      initialValue: 'md',
      group: 'spacing',
    }),

    // Layout
    defineField({
      name: 'maxWidth',
      title: 'Max Width',
      type: 'string',
      options: {
        list: [
          { title: 'Narrow (640px)', value: 'narrow' },
          { title: 'Medium (768px)', value: 'medium' },
          { title: 'Wide (1024px)', value: 'wide' },
          { title: 'Extra Wide (1280px)', value: 'xwide' },
          { title: 'Full Width', value: 'full' },
        ],
      },
      initialValue: 'wide',
      group: 'layout',
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'left',
      group: 'layout',
    }),

    // Border & Shadow
    defineField({
      name: 'borderRadius',
      title: 'Border Radius',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small (0.25rem)', value: 'sm' },
          { title: 'Medium (0.5rem)', value: 'md' },
          { title: 'Large (1rem)', value: 'lg' },
          { title: 'Extra Large (1.5rem)', value: 'xl' },
          { title: 'Full (9999px)', value: 'full' },
        ],
      },
      initialValue: 'none',
      group: 'border',
    }),
    defineField({
      name: 'shadow',
      title: 'Shadow',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' },
          { title: 'Extra Large', value: 'xl' },
          { title: '2X Large', value: '2xl' },
        ],
      },
      initialValue: 'none',
      group: 'border',
    }),
    defineField({
      name: 'borderColor',
      title: 'Border Color',
      type: 'string',
      description: 'Hex color code for border (e.g., rgba(255,255,255,0.1))',
      group: 'border',
    }),
    defineField({
      name: 'borderWidth',
      title: 'Border Width',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: '1px', value: '1' },
          { title: '2px', value: '2' },
          { title: '4px', value: '4' },
        ],
      },
      initialValue: 'none',
      group: 'border',
    }),
  ],
})