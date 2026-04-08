import { definePlugin, NavbarProps } from 'sanity'

// Language options
export const languages = [
  { id: 'en', title: 'English', flag: '🇺🇸' },
  { id: 'hi', title: 'Hindi', flag: '🇮🇳' },
]

const STORAGE_KEY = 'studio-language'

// Component that shows the language dropdown
function LanguageSelector() {
  // Get stored language on mount
  const storedLanguage = typeof window !== 'undefined' 
    ? (localStorage.getItem(STORAGE_KEY) || 'en')
    : 'en'

  const handleChange = (langId: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, langId)
    } catch {
      // localStorage not available
    }
    // Custom event for other components to listen
    window.dispatchEvent(new CustomEvent('studio-language-change', { detail: langId }))
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
      <select
        defaultValue={storedLanguage}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid var(--card-border-color)',
          background: 'var(--card-bg-color)',
          color: 'var(--card-fg-color)',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.flag} {lang.title}
          </option>
        ))}
      </select>
    </div>
  )
}

// Wrapper that preserves the original navbar and adds our selector
function NavbarWithLanguageSelector(props: NavbarProps) {
  const { renderDefault } = props
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {/* Render the original navbar */}
      <div style={{ flex: 1 }}>
        {renderDefault(props)}
      </div>
      {/* Add language selector on the right */}
      <LanguageSelector />
    </div>
  )
}

// Plugin that adds language selector to navbar
export const languageSelectorPlugin = definePlugin({
  name: 'language-selector',
  studio: {
    components: {
      navbar: NavbarWithLanguageSelector,
    },
  },
})

// Helper function to get current studio language
export function getStudioLanguage(): string {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && languages.some(l => l.id === saved)) {
      return saved
    }
  } catch {
    // localStorage not available
  }
  return 'en'
}