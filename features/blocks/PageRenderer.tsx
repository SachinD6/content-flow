/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PortableTextBlock } from '@portabletext/types'

import { HeroBlock } from './HeroBlock'
import { PostsGridBlock } from './PostsGridBlock'
import { CTABlock } from './CTABlock'
import { NewsletterBlock } from './NewsletterBlock'
import { ContentBlock } from './ContentBlock'
import { ImageBlock } from './ImageBlock'
import { FeaturedPostBlock } from './FeaturedPostBlock'
import { StatsBlock } from './StatsBlock'
import { SeparatorBlock } from './SeparatorBlock'
import { TestimonialBlock } from './TestimonialBlock'
import { FeaturesBlock } from './FeaturesBlock'
import { SearchBlock } from './SearchBlock'
import { TagsFilterBlock } from './TagsFilterBlock'
import { CodeBlock } from './CodeBlock'
import { VideoBlock } from './VideoBlock'
import { AccordionBlock } from './AccordionBlock'
import { PricingBlock } from './PricingBlock'
import { ContactFormBlock } from './ContactFormBlock'
import { TeamBlock } from './TeamBlock'
import { ContainerBlock } from './ContainerBlock'
import { GridBlock } from './GridBlock'

interface PageComponent {
  _type: string
  _key: string
  [key: string]: unknown
}

interface CTAButton {
  label: string
  href: string
  variant?: string
  external?: boolean
  requiresAuth?: boolean
}

interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string
  featured?: boolean
  mostViewed?: boolean
  tags?: string[]
  author?: { name: string; avatar?: string }
  coverImage?: string
}

interface PageRendererProps {
  components?: PageComponent[]
  posts?: Post[]
  lang?: string
}

export function PageRenderer({
  components = [],
  posts = [],
  lang = 'en',
}: PageRendererProps) {
  if (components.length === 0) return null

  return (
    <>
      {components.map((component) => {
        const key = component._key || component._type

        switch (component._type) {
          case 'heroBlock': {
            const block = component as unknown as {
              title: string
              subtitle?: string
              description?: string
              backgroundImage?: string
              backgroundColor?: string
              backgroundType?: 'gradient' | 'image' | 'video' | 'solid'
              buttons?: CTAButton[]
              align?: 'left' | 'center' | 'right'
              size?: 'sm' | 'md' | 'lg' | 'full'
              styles?: Record<string, unknown>
            }
            return (
              <HeroBlock
                key={key}
                title={block.title}
                subtitle={block.subtitle}
                description={block.description}
                backgroundImage={block.backgroundImage}
                backgroundColor={block.backgroundColor}
                backgroundType={block.backgroundType}
                buttons={block.buttons}
                align={block.align}
                size={block.size}
                lang={lang}
              />
            )
          }

          case 'postsGridBlock': {
            const block = component as unknown as {
              title?: string
              subtitle?: string
              layout?: 'grid' | 'list' | 'featured' | 'masonry'
              postsSource?: 'latest' | 'featured' | 'byTag' | 'byAuthor' | 'manual'
              limit?: number
              emptyMessage?: string
              viewAllLink?: { show?: boolean; text?: string; href?: string }
              styles?: Record<string, unknown>
            }
            return (
              <PostsGridBlock
                key={key}
                title={block.title}
                subtitle={block.subtitle}
                layout={block.layout}
                posts={posts.slice(0, block.limit || 6) as any[]}
                emptyMessage={block.emptyMessage}
                viewAllLink={block.viewAllLink}
                lang={lang}
              />
            )
          }

          case 'ctaBlock': {
            const block = component as unknown as {
              title: string
              description?: string
              buttons?: CTAButton[]
              background?: 'default' | 'gradient' | 'card' | 'border'
              align?: 'left' | 'center' | 'right'
              styles?: Record<string, unknown>
            }
            return (
              <CTABlock
                key={key}
                title={block.title}
                description={block.description}
                buttons={block.buttons}
                background={block.background}
                align={block.align}
                lang={lang}
              />
            )
          }

          case 'newsletterBlock': {
            const block = component as unknown as {
              title?: string
              description?: string
              placeholder?: string
              buttonText?: string
              successMessage?: string
              style?: 'simple' | 'card' | 'fullWidth'
              showIcon?: boolean
              styles?: Record<string, unknown>
            }
            return (
              <NewsletterBlock
                key={key}
                title={block.title}
                description={block.description}
                placeholder={block.placeholder}
                buttonText={block.buttonText}
                successMessage={block.successMessage}
                style={block.style}
                showIcon={block.showIcon}
              />
            )
          }

          case 'contentBlock': {
            const block = component as unknown as {
              content?: PortableTextBlock[]
              width?: 'narrow' | 'medium' | 'wide' | 'full'
              align?: 'left' | 'center'
              styles?: Record<string, unknown>
            }
            if (!block.content) return null
            return (
              <ContentBlock
                key={key}
                content={block.content}
                width={block.width}
                align={block.align}
              />
            )
          }

          case 'imageBlock': {
            const block = component as unknown as {
              image?: string
              alt?: string
              caption?: string
              width?: 'narrow' | 'medium' | 'wide' | 'full'
              rounded?: boolean
              shadow?: boolean
              styles?: Record<string, unknown>
            }
            if (!block.image) return null
            return (
              <ImageBlock
                key={key}
                image={block.image}
                alt={block.alt}
                caption={block.caption}
                width={block.width}
                rounded={block.rounded}
                shadow={block.shadow}
              />
            )
          }

          case 'featuredPostBlock': {
            const block = component as unknown as {
              label?: string
              post?: Post
              autoSelect?: 'latest' | 'featured' | 'mostViewed' | 'manual'
              showExcerpt?: boolean
              showAuthor?: boolean
              showDate?: boolean
              layout?: 'large' | 'medium' | 'split'
              styles?: Record<string, unknown>
            }
            return (
              <FeaturedPostBlock
                key={key}
                label={block.label}
                post={block.post as any}
                autoSelect={block.autoSelect}
                showExcerpt={block.showExcerpt}
                showAuthor={block.showAuthor}
                showDate={block.showDate}
                layout={block.layout}
                posts={posts as any[]}
              />
            )
          }

          case 'statsBlock': {
            const block = component as unknown as {
              title?: string
              layout?: 'grid' | 'stacked' | 'inline'
              stats?: Array<{
                value: string
                label: string
                description?: string
                icon?: string
              }>
              background?: 'none' | 'muted' | 'accent'
              styles?: Record<string, unknown>
            }
            return (
              <StatsBlock
                key={key}
                title={block.title}
                layout={block.layout}
                stats={block.stats}
                background={block.background}
              />
            )
          }

          case 'separatorBlock': {
            const block = component as unknown as {
              style?: 'line' | 'dots' | 'gradient' | 'space'
              size?: 'sm' | 'md' | 'lg'
              color?: 'default' | 'accent' | 'light'
            }
            return (
              <SeparatorBlock
                key={key}
                style={block.style}
                size={block.size}
                color={block.color}
              />
            )
          }

          case 'testimonialBlock': {
            const block = component as unknown as {
              title?: string
              subtitle?: string
              layout?: 'grid' | 'carousel' | 'featured' | 'stacked'
              testimonials?: Array<{
                quote: string
                author: string
                role?: string
                avatar?: string
                rating?: number
              }>
              styles?: Record<string, unknown>
            }
            return (
              <TestimonialBlock
                key={key}
                title={block.title}
                subtitle={block.subtitle}
                layout={block.layout}
                testimonials={block.testimonials}
              />
            )
          }

          case 'featuresBlock': {
            const block = component as unknown as {
              title?: string
              subtitle?: string
              layout?: 'grid' | 'grid2' | 'list'
              features?: Array<{
                title: string
                description?: string
                icon?: string
                link?: { text?: string; href?: string }
              }>
              styles?: Record<string, unknown>
            }
            return (
              <FeaturesBlock
                key={key}
                title={block.title}
                subtitle={block.subtitle}
                layout={block.layout}
                features={block.features}
                lang={lang}
              />
            )
          }

          case 'searchBlock': {
            const block = component as unknown as {
              title?: string
              placeholder?: string
              buttonText?: string
              searchScope?: 'posts' | 'all'
              resultsLayout?: 'inline' | 'redirect'
              showExcerpt?: boolean
              showAuthor?: boolean
              showDate?: boolean
              limit?: number
              styles?: Record<string, unknown>
            }
            return (
              <SearchBlock
                key={key}
                title={block.title}
                placeholder={block.placeholder}
                buttonText={block.buttonText}
                searchScope={block.searchScope}
                resultsLayout={block.resultsLayout}
                showExcerpt={block.showExcerpt}
                showAuthor={block.showAuthor}
                showDate={block.showDate}
                limit={block.limit}
                styles={block.styles as any}
                posts={posts as any}
                lang={lang}
              />
            )
          }

          case 'tagsFilterBlock': {
            const block = component as unknown as {
              title?: string
              showAllTag?: boolean
              allTagLabel?: string
              tagsSource?: 'all' | 'manual'
              selectedTags?: string[]
              layout?: 'sidebar' | 'top' | 'grid'
              postsLayout?: 'grid' | 'list' | 'masonry'
              columns?: number
              postsPerTag?: number
              showPostCount?: boolean
              showExcerpt?: boolean
              showAuthor?: boolean
              showDate?: boolean
              styles?: Record<string, unknown>
            }
            return (
              <TagsFilterBlock
                key={key}
                title={block.title}
                showAllTag={block.showAllTag}
                allTagLabel={block.allTagLabel}
                tagsSource={block.tagsSource}
                selectedTags={block.selectedTags}
                layout={block.layout}
                postsLayout={block.postsLayout}
                columns={block.columns}
                postsPerTag={block.postsPerTag}
                showPostCount={block.showPostCount}
                showExcerpt={block.showExcerpt}
                showAuthor={block.showAuthor}
                showDate={block.showDate}
                styles={block.styles as any}
                posts={posts as any}
                lang={lang}
              />
            )
          }

          case 'codeBlock': {
            const block = component as unknown as {
              code: string
              language?: string
              filename?: string
              title?: string
              showLineNumbers?: boolean
              showCopyButton?: boolean
              highlightLines?: string
              styles?: Record<string, unknown>
            }
            return (
              <CodeBlock
                key={key}
                code={block.code}
                language={block.language}
                filename={block.filename}
                title={block.title}
                showLineNumbers={block.showLineNumbers}
                showCopyButton={block.showCopyButton}
                highlightLines={block.highlightLines}
                styles={block.styles as any}
              />
            )
          }

          case 'videoBlock': {
            const block = component as unknown as {
              videoType?: 'youtube' | 'vimeo' | 'url'
              youtubeUrl?: string
              vimeoUrl?: string
              videoUrl?: string
              title?: string
              description?: string
              aspectRatio?: '16:9' | '4:3' | '21:9' | '1:1' | '9:16'
              autoplay?: boolean
              loop?: boolean
              muted?: boolean
              showControls?: boolean
              thumbnail?: string
              styles?: Record<string, unknown>
            }
            return (
              <VideoBlock
                key={key}
                videoType={block.videoType}
                youtubeUrl={block.youtubeUrl}
                vimeoUrl={block.vimeoUrl}
                videoUrl={block.videoUrl}
                title={block.title}
                description={block.description}
                aspectRatio={block.aspectRatio}
                autoplay={block.autoplay}
                loop={block.loop}
                muted={block.muted}
                showControls={block.showControls}
                thumbnail={block.thumbnail}
                styles={block.styles as any}
              />
            )
          }

          case 'accordionBlock': {
            const block = component as unknown as {
              title?: string
              subtitle?: string
              items?: Array<{
                question: string
                answer: string
                initiallyOpen?: boolean
              }>
              allowMultiple?: boolean
              iconPosition?: 'right' | 'left'
              variant?: 'default' | 'minimal' | 'card' | 'filled'
              styles?: Record<string, unknown>
            }
            return (
              <AccordionBlock
                key={key}
                title={block.title}
                subtitle={block.subtitle}
                items={block.items}
                allowMultiple={block.allowMultiple}
                iconPosition={block.iconPosition}
                variant={block.variant}
                styles={block.styles as any}
              />
            )
          }

          case 'pricingBlock': {
            const block = component as unknown as {
              title?: string
              subtitle?: string
              plans?: Array<{
                name: string
                price: string
                period?: string
                description?: string
                features?: string[]
                highlighted?: boolean
                highlightLabel?: string
                buttonText?: string
                buttonHref?: string
              }>
              columns?: number
              variant?: 'cards' | 'table' | 'minimal'
              styles?: Record<string, unknown>
            }
            return (
              <PricingBlock
                key={key}
                title={block.title}
                subtitle={block.subtitle}
                plans={block.plans}
                columns={block.columns}
                variant={block.variant}
                styles={block.styles as any}
              />
            )
          }

          case 'contactFormBlock': {
            const block = component as unknown as {
              title?: string
              description?: string
              fields?: Array<{
                name: string
                label?: string
                type: string
                placeholder?: string
                required?: boolean
                options?: string[]
              }>
              submitButton?: string
              successMessage?: string
              layout?: 'stacked' | 'twocolumn'
              variant?: 'default' | 'card' | 'minimal'
              styles?: Record<string, unknown>
            }
            return (
              <ContactFormBlock
                key={key}
                title={block.title}
                description={block.description}
                fields={block.fields as any}
                submitButton={block.submitButton}
                successMessage={block.successMessage}
                layout={block.layout}
                variant={block.variant}
                styles={block.styles as any}
              />
            )
          }

          case 'teamBlock': {
            const block = component as unknown as {
              title?: string
              subtitle?: string
              members?: Array<{
                name: string
                role?: string
                image?: string
                bio?: string
                socialLinks?: Array<{
                  platform: string
                  url: string
                }>
              }>
              columns?: number
              showBio?: boolean
              showSocial?: boolean
              variant?: 'cards' | 'minimal' | 'circle'
              styles?: Record<string, unknown>
            }
            return (
              <TeamBlock
                key={key}
                title={block.title}
                subtitle={block.subtitle}
                members={block.members as any}
                columns={block.columns}
                showBio={block.showBio}
                showSocial={block.showSocial}
                variant={block.variant}
                styles={block.styles as any}
              />
            )
          }

          case 'containerBlock': {
            const block = component as unknown as {
              maxWidth?: string
              padding?: string
              centerContent?: boolean
              backgroundType?: string
              backgroundColor?: string
              backgroundGradient?: string
              borderRadius?: string
              shadow?: string
            }
            return (
              <ContainerBlock
                key={key}
                maxWidth={block.maxWidth as any}
                padding={block.padding as any}
                centerContent={block.centerContent}
                backgroundType={block.backgroundType as any}
                backgroundColor={block.backgroundColor}
                backgroundGradient={block.backgroundGradient}
                borderRadius={block.borderRadius as any}
                shadow={block.shadow as any}
              />
            )
          }

          case 'gridBlock': {
            const block = component as unknown as {
              columns?: number
              columnsMobile?: number
              gap?: string
              alignItems?: string
              equalHeight?: boolean
              styles?: Record<string, unknown>
            }
            return (
              <GridBlock
                key={key}
                columns={block.columns}
                columnsMobile={block.columnsMobile}
                gap={block.gap as any}
                alignItems={block.alignItems as any}
                equalHeight={block.equalHeight}
                styles={block.styles as any}
              />
            )
          }

          default:
            return null
        }
      })}
    </>
  )
}