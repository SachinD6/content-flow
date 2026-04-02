'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class StudioErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    if (error.name === 'AbortError' || error.message.includes('signal is aborted')) {
      return { hasError: false }
    }
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    if (error.name === 'AbortError' || error.message.includes('signal is aborted')) {
      return
    }
    console.error('Studio error:', error)
  }

  render() {
    return this.props.children
  }
}