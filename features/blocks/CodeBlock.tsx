'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  title?: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
  highlightLines?: string
  styles?: {
    backgroundType?: string
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    maxWidth?: string
    borderRadius?: string
  }
}

export function CodeBlock({
  code,
  language = 'javascript',
  filename,
  title,
  showLineNumbers = true,
  showCopyButton = true,
  highlightLines,
  styles,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPaddingClass = (padding?: string) => {
    const classes: Record<string, string> = {
      none: '',
      xs: 'py-4',
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
      '2xl': 'py-32',
    }
    return classes[padding || 'md'] || 'py-12'
  }

  const maxWidthClass = {
    narrow: 'max-w-3xl',
    medium: 'max-w-4xl',
    wide: 'max-w-5xl',
    xwide: 'max-w-6xl',
    full: 'max-w-full',
  }[styles?.maxWidth || 'wide'] || 'max-w-5xl'

  const borderRadiusClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-2xl',
  }[styles?.borderRadius || 'lg'] || 'rounded-lg'

  // Parse highlight lines
  const highlightedLines = new Set<number>()
  if (highlightLines) {
    highlightLines.split(',').forEach(part => {
      part = part.trim()
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()))
        for (let i = start; i <= end; i++) {
          highlightedLines.add(i)
        }
      } else {
        highlightedLines.add(parseInt(part))
      }
    })
  }

  const lines = code.split('\n')

  const langColors: Record<string, string> = {
    javascript: 'text-yellow-400',
    typescript: 'text-blue-400',
    python: 'text-green-400',
    react: 'text-cyan-400',
    jsx: 'text-cyan-400',
    css: 'text-pink-400',
    html: 'text-orange-400',
    json: 'text-zinc-400',
    bash: 'text-green-400',
  }

  return (
    <section className={`${getPaddingClass(styles?.paddingTop)} ${getPaddingClass(styles?.paddingBottom)}`}>
      <div className={`mx-auto px-6 ${maxWidthClass}`}>
        {(title || filename) && (
          <div className="mb-4">
            {title && <h3 className="text-lg font-medium text-white mb-1">{title}</h3>}
            {filename && (
              <span className="text-sm text-zinc-500 font-mono">{filename}</span>
            )}
          </div>
        )}
        
        <div className={`relative overflow-hidden ${borderRadiusClass} bg-[#0d0f14] border border-white/[0.08]`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.08] bg-[#0a0b0e]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className={`text-xs font-mono ml-2 ${langColors[language] || 'text-zinc-400'}`}>
                {language}
              </span>
            </div>
            {showCopyButton && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Code */}
          <div className="overflow-x-auto">
            <pre className="p-4 text-sm font-mono leading-relaxed">
              <code>
                {lines.map((line, i) => {
                  const lineNum = i + 1
                  const isHighlighted = highlightedLines.has(lineNum)
                  return (
                    <div
                      key={i}
                      className={`flex ${isHighlighted ? 'bg-[#6154f0]/10 -mx-4 px-4' : ''}`}
                    >
                      {showLineNumbers && (
                        <span className="select-none text-zinc-600 w-8 text-right mr-4 flex-shrink-0">
                          {lineNum}
                        </span>
                      )}
                      <span className="text-zinc-300">{line || '\n'}</span>
                    </div>
                  )
                })}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}