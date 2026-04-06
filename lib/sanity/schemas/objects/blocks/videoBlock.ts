import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'videoBlock',
  title: 'Video Embed',
  type: 'object',
  icon: () => '🎬',
  groups: [
    { name: 'video', title: '🎥 Video' },
    { name: 'display', title: '🖥️ Display' },
    { name: 'styles', title: '🎨 Styles' },
  ],
  fields: [
    defineField({
      name: 'videoType',
      title: 'Video Source',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'Self-hosted URL', value: 'url' },
        ],
      },
      initialValue: 'youtube',
      group: 'video',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Paste YouTube video URL',
      hidden: ({ parent }) => parent?.videoType !== 'youtube',
      group: 'video',
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL',
      type: 'url',
      description: 'Paste Vimeo video URL',
      hidden: ({ parent }) => parent?.videoType !== 'vimeo',
      group: 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Direct video file URL (MP4, WebM, etc.)',
      hidden: ({ parent }) => parent?.videoType !== 'url',
      group: 'video',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title above the video',
      group: 'video',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Optional description below the video',
      group: 'video',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9 (Widescreen)', value: '16:9' },
          { title: '4:3 (Standard)', value: '4:3' },
          { title: '21:9 (Ultrawide)', value: '21:9' },
          { title: '1:1 (Square)', value: '1:1' },
          { title: '9:16 (Vertical)', value: '9:16' },
        ],
      },
      initialValue: '16:9',
      group: 'display',
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: false,
      group: 'display',
    }),
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: false,
      group: 'display',
    }),
    defineField({
      name: 'muted',
      title: 'Muted',
      type: 'boolean',
      description: 'Mute audio by default',
      initialValue: false,
      group: 'display',
    }),
    defineField({
      name: 'showControls',
      title: 'Show Controls',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom Thumbnail',
      type: 'image',
      options: { hotspot: true },
      description: 'Custom poster image (replaces auto thumbnail)',
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
      videoType: 'videoType',
      title: 'title',
      youtubeUrl: 'youtubeUrl',
      vimeoUrl: 'vimeoUrl',
    },
    prepare({ videoType, title, youtubeUrl, vimeoUrl }) {
      const typeLabels: Record<string, string> = {
        youtube: 'YouTube',
        vimeo: 'Vimeo',
        url: 'Video',
      }
      return {
        title: title || `${typeLabels[videoType ?? 'youtube']} Video`,
        subtitle: youtubeUrl || vimeoUrl || 'Video embed',
      }
    },
  },
})