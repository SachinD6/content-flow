# Prompt: Fix ContentFlow Blog Platform UX and Translation System

## Project Context

ContentFlow is a Next.js blog platform powered by Sanity CMS. Everything should be dynamic - homepage blocks, navigation, posts, authors, pages - all managed through Sanity Studio.

**Current Stack:**
- Next.js 16 + React + TypeScript
- Sanity CMS (embedded in `/studio` route)
- Supabase for user data
- Tailwind CSS for styling

## Issues to Fix

### 1. Translation System Not Working
**Problem:** The "Create Translation" button is not appearing in the document editor for posts and pages.

**Current Implementation:**
- File: `lib/sanity/studio/actions/createTranslationAction.tsx`
- Config: `sanity.config.ts` (document.actions section)

**What Should Happen:**
- When editing a post or page, a "Create Translation" button should appear in the action bar (after Publish, Delete, etc.)
- Button should say: "Translate to 🇮🇳 Hindi" (or English if current is Hindi)
- Clicking it should create a new document with:
  - Title: "Original Title (Hindi)"
  - Slug: "original-slug-hi"
  - All non-translatable fields copied (images, author, tags, featured status)
  - Body/excerpt left empty for translation
  - `translationOf` field linked to original
- On translations, a "View Original" button should appear

**Current Debug Status:**
- Console shows: `🎯 createTranslationAction called` with correct data
- Console shows: `✅ Returning action: Translate to 🇮🇳 Hindi`
- BUT the button doesn't appear in the UI
- The actions function is being called but something is preventing the button from rendering

**What to Debug:**
- Check if `showAsAction: true` is needed
- Verify action object structure matches Sanity's DocumentActionDescription interface
- Check for React hydration errors that might be breaking the action bar
- Look for the action in a "More actions" dropdown (three dots menu)

### 2. Simplify Admin UX
**Problem:** The Sanity Studio is too complex for non-technical admins.

**Current Pain Points:**
- Too many fields visible at once
- Unclear what needs to be filled vs what's optional
- Translation workflow is confusing
- Page builder (components array) is overwhelming

**What Needs to Simplification:**

**Posts:**
- Group fields logically: Basic Info (title, slug, excerpt), Content (body), Media (cover image), Settings (tags, featured, language)
- Hide advanced fields by default (SEO, reading time, mostViewed)
- Make translation workflow obvious with clear visual indicators

**Pages:**
- Components array is complex - need better organization
- Group by: Page Info (title, slug, pageType), Content Blocks (components), Settings
- Consider adding descriptions/tooltips to explain what each block type does

**General:**
- Add helper text/descriptions to fields
- Use fieldsets to group related fields
- Make required fields obvious
- Hide fields that are auto-populated or rarely used

### 3. Enhance Design of Page Blocks
**Problem:** The block-based page builder components need better visual design in the frontend.

**Current Blocks That Need Design Enhancement:**
- `heroBlock` - Hero section with background (gradient/image), title, subtitle, CTA
- `contentBlock` - Rich text content
- `postsGridBlock` - Grid of posts with filtering
- `featuredPostBlock` - Single featured post highlight
- `ctaBlock` - Call to action section
- `newsletterBlock` - Email signup form
- `featuresBlock` - Feature grid with icons
- `testimonialBlock` - Customer testimonials
- `teamBlock` - Team member grid
- `statsBlock` - Statistics display
- `pricingBlock` - Pricing table
- `contactFormBlock` - Contact form
- `accordionBlock` - FAQ accordion

**Design Requirements:**
- Modern, clean aesthetic
- Consistent spacing and typography
- Responsive design (mobile, tablet, desktop)
- Good use of whitespace
- Clear visual hierarchy
- Accessible (WCAG compliant)
- Consistent with Tailwind design system

### 4. Navigation Should Be Dynamic
**Problem:** Navigation should be manageable from Sanity, not hardcoded.

**What's Needed:**
- Create a `navigation` schema type in Sanity
- Support for: header nav, footer nav, social links
- Each nav item should have: label, link (internal page or external URL), target (_blank or self), icon (optional)
- Frontend should fetch navigation from Sanity
- Support for nested/dropdown menus

### 5. Homepage Should Be Fully Dynamic
**Problem:** Homepage content should be editable from Sanity without code changes.

**Current State:**
- There's a `home` page type
- But the homepage structure might be too rigid

**What Should Be Possible:**
- Admin can reorder homepage sections
- Add/remove sections from Sanity
- Each section is a block (hero, posts grid, newsletter, etc.)
- Homepage layout is 100% configurable from CMS

## Technical Details

### Translation System Schema
**Posts (`lib/sanity/schemas/documents/post.ts`):**
```typescript
// Already has translationOf field
// Fix the filter to use 'language' string instead of 'language._ref'
```

**Pages (`lib/sanity/schemas/documents/page.ts`):**
```typescript
// translationOf field added
// Same filter fix needed
```

### Action Implementation
**Current file:** `lib/sanity/studio/actions/createTranslationAction.tsx`

Key requirements:
- Must use `DocumentActionComponent` type from 'sanity'
- Return object must have: `label`, `onHandle` (function)
- Optional: `icon`, `tone`, `disabled`, `showAsAction`
- `viewOriginalAction` should only appear if document has `translationOf` field set

### Sanity Config
**File:** `sanity.config.ts`

Current setup:
```typescript
document: {
  actions: (input, context) => {
    if (schemaType === 'post' || schemaType === 'page') {
      return [...input, createTranslationAction, viewOriginalAction]
    }
    return input
  }
}
```

## Acceptance Criteria

### Translation System
- [ ] "Create Translation" button appears when editing posts and pages
- [ ] Button creates translation with proper title/suffix and linked to original
- [ ] All non-translatable fields are copied automatically
- [ ] "View Original" button appears on translated documents
- [ ] Language flags appear in document list previews
- [ ] Works for both posts and pages

### Simplified UX
- [ ] Field groups are logically organized
- [ ] Advanced fields hidden by default
- [ ] Clear labels and descriptions
- [ ] Translation workflow is intuitive
- [ ] Page builder is easier to use

### Design Enhancement
- [ ] All block types have modern, responsive designs
- [ ] Consistent styling across all blocks
- [ ] Mobile-friendly layouts
- [ ] Good visual hierarchy

### Dynamic Navigation
- [ ] Navigation editable from Sanity
- [ ] Frontend fetches navigation from CMS
- [ ] Support for multiple nav locations (header, footer)

### Dynamic Homepage
- [ ] Homepage sections fully configurable
- [ ] Can add/remove/reorder blocks from Sanity
- [ ] No code changes needed for layout changes

## Files to Modify

### Critical for Translation Fix:
1. `lib/sanity/studio/actions/createTranslationAction.tsx` - Fix action to appear
2. `sanity.config.ts` - Verify action registration
3. `lib/sanity/schemas/documents/post.ts` - Fix translationOf filter
4. `lib/sanity/schemas/documents/page.ts` - Fix translationOf filter

### For UX Simplification:
5. `lib/sanity/schemas/documents/post.ts` - Reorganize fields, add groups
6. `lib/sanity/schemas/documents/page.ts` - Reorganize fields, improve components UX

### For Design Enhancement:
7. All files in `features/blocks/` - Enhance component designs
8. `components/ui/` - Add any needed UI primitives

### For Dynamic Navigation:
9. Create `lib/sanity/schemas/documents/navigation.ts`
10. Create `lib/sanity/schemas/objects/navItem.ts`
11. Update frontend to fetch navigation

### For Dynamic Homepage:
12. Review `app/page.tsx` - Make it fully dynamic
13. Ensure homepage page type supports all blocks

## Testing Steps

### Translation:
1. Open any post in Studio
2. Verify "Translate to 🇮🇳 Hindi" button appears
3. Click it → New document opens with:
   - Title: "Original (Hindi)"
   - Slug: "original-hi"
   - Image, author, tags copied
   - Body empty
4. On the translation, verify "View Original" button appears

### UX:
1. Create new post - verify fields are grouped logically
2. Create new page - verify page builder is intuitive
3. Test translation workflow end-to-end

### Design:
1. View homepage with different blocks
2. Verify responsive design on mobile/desktop
3. Check all block types render properly

### Navigation:
1. Edit navigation in Sanity
2. Verify changes reflect on frontend immediately

## Notes

- The translation button issue is the HIGHEST PRIORITY - it's been the main blocker
- For the action button, check Sanity v3 documentation on Document Actions
- The hydration error in console (`<div> cannot be a descendant of <p>`) might be related to the action not appearing
- Keep UX changes minimal but effective - don't over-engineer
- Design should be clean and modern, not overly fancy
- Test on actual mobile device, not just browser resize

## Questions to Resolve

1. Should navigation support dropdown menus? If yes, how many levels?
2. Should footer have different nav than header?
3. Do we need breadcrumbs that are also dynamic?
4. For translations, should there be a "translations" list on the original document showing all translations?

## Success Metrics

- Admin can create a translation in under 30 seconds without confusion
- Admin can create a new page with blocks without asking for help
- Frontend looks professional and modern
- All content is editable from Sanity without developer intervention