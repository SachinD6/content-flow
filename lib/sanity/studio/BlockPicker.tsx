import { useState, useCallback } from 'react'
import { Box, Card, Text, Flex, Button } from '@sanity/ui'

const BLOCK_CATEGORIES = {
  layout: { title: 'Layout', blocks: ['containerBlock', 'gridBlock', 'separatorBlock'] },
  content: { title: 'Content', blocks: ['heroBlock', 'contentBlock', 'imageBlock', 'codeBlock', 'videoBlock'] },
  posts: { title: 'Posts', blocks: ['postsGridBlock', 'featuredPostBlock', 'searchBlock', 'tagsFilterBlock'] },
  marketing: { title: 'Marketing', blocks: ['ctaBlock', 'newsletterBlock', 'pricingBlock'] },
  social: { title: 'Social', blocks: ['statsBlock', 'testimonialBlock', 'teamBlock', 'featuresBlock'] },
  interactive: { title: 'Interactive', blocks: ['contactFormBlock', 'accordionBlock'] },
}

const BLOCK_INFO: Record<string, { title: string; description: string; icon: string }> = {
  containerBlock: { title: 'Container', description: 'Wrapper with width and background', icon: '📦' },
  gridBlock: { title: 'Grid', description: 'Multi-column layout', icon: '⊞' },
  separatorBlock: { title: 'Separator', description: 'Visual divider', icon: '➖' },
  heroBlock: { title: 'Hero', description: 'Large hero section', icon: '🎯' },
  contentBlock: { title: 'Rich Text', description: 'Portable text content', icon: '📝' },
  imageBlock: { title: 'Image', description: 'Image with caption', icon: '🖼️' },
  codeBlock: { title: 'Code', description: 'Syntax highlighted code', icon: '💻' },
  videoBlock: { title: 'Video', description: 'YouTube, Vimeo, or self-hosted', icon: '🎬' },
  postsGridBlock: { title: 'Posts Grid', description: 'Grid of posts', icon: '📰' },
  featuredPostBlock: { title: 'Featured Post', description: 'Single featured post', icon: '⭐' },
  searchBlock: { title: 'Search', description: 'Search posts', icon: '🔍' },
  tagsFilterBlock: { title: 'Tags Filter', description: 'Filter posts by tag', icon: '🏷️' },
  ctaBlock: { title: 'Call to Action', description: 'CTA section', icon: '🔘' },
  newsletterBlock: { title: 'Newsletter', description: 'Email signup', icon: '📧' },
  pricingBlock: { title: 'Pricing', description: 'Pricing table', icon: '💰' },
  statsBlock: { title: 'Statistics', description: 'Stats and metrics', icon: '📊' },
  testimonialBlock: { title: 'Testimonials', description: 'Customer quotes', icon: '💬' },
  teamBlock: { title: 'Team', description: 'Team members grid', icon: '👥' },
  featuresBlock: { title: 'Features', description: 'Features grid', icon: '⚡' },
  contactFormBlock: { title: 'Contact Form', description: 'Lead capture form', icon: '📧' },
  accordionBlock: { title: 'FAQ', description: 'Expandable Q&A', icon: '❓' },
}

interface BlockPickerProps {
  onSelect: (type: string) => void
  onClose: () => void
}

export function BlockPicker({ onSelect, onClose }: BlockPickerProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredBlocks = Object.values(BLOCK_INFO).filter(block => {
    const matchesSearch = block.title.toLowerCase().includes(search.toLowerCase()) ||
      block.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || 
      BLOCK_CATEGORIES[activeCategory as keyof typeof BLOCK_CATEGORIES]?.blocks.includes(
        Object.keys(BLOCK_INFO).find(k => BLOCK_INFO[k] === block) || ''
      )
    return matchesSearch && matchesCategory
  })

  const handleSelect = useCallback((type: string) => {
    onSelect(type)
    onClose()
  }, [onSelect, onClose])

  return (
    <div style={{ padding: '16px' }}>
      <input
        type="text"
        placeholder="Search blocks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          color: 'white',
          fontSize: '14px',
          marginBottom: '16px',
        }}
      />

      <Flex gap={2} wrap="wrap" style={{ marginBottom: '16px' }}>
        <Button
          mode={activeCategory === null ? 'default' : 'ghost'}
          tone={activeCategory === null ? 'primary' : 'default'}
          onClick={() => setActiveCategory(null)}
          text="All"
          fontSize={1}
        />
        {Object.entries(BLOCK_CATEGORIES).map(([key, category]) => (
          <Button
            key={key}
            mode={activeCategory === key ? 'default' : 'ghost'}
            tone={activeCategory === key ? 'primary' : 'default'}
            onClick={() => setActiveCategory(key)}
            text={category.title}
            fontSize={1}
          />
        ))}
      </Flex>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {filteredBlocks.map((block, index) => {
          const blockType = Object.keys(BLOCK_INFO).find(k => BLOCK_INFO[k] === block) || `block-${index}`
          return (
            <Card
              key={blockType}
              padding={3}
              radius={2}
              style={{
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s',
              }}
              onClick={() => handleSelect(blockType)}
            >
              <Text size={5} style={{ marginBottom: '8px' }}>{block.icon}</Text>
              <Text weight="semibold" size={1} style={{ marginBottom: '4px' }}>{block.title}</Text>
              <Text muted size={0}>{block.description}</Text>
            </Card>
          )
        })}
      </div>

      {filteredBlocks.length === 0 && (
        <Box padding={4} style={{ textAlign: 'center' }}>
          <Text muted>No blocks found</Text>
        </Box>
      )}
    </div>
  )
}

export default BlockPicker