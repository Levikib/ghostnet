'use client'
import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  label?: string
}

interface State {
  hasError: boolean
  error: string
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error: Error) {
    console.error('[GHOSTNET ErrorBoundary]', error)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          background: 'rgba(255,65,54,0.04)',
          border: '1px solid rgba(255,65,54,0.2)',
          borderRadius: '8px',
          padding: '20px 24px',
          fontFamily: 'JetBrains Mono, monospace',
          margin: '1rem 0',
        }}>
          <div style={{ fontSize: '0.65rem', color: '#ff4136', letterSpacing: '0.2em', marginBottom: '6px' }}>
            {this.props.label ? this.props.label.toUpperCase() + ' ' : ''}ERROR
          </div>
          <div style={{ fontSize: '0.82rem', color: '#8a6a6a', marginBottom: '12px' }}>
            Something went wrong loading this component.
          </div>
          {this.state.error && (
            <div style={{ fontSize: '0.7rem', color: '#5a3a3a', background: '#0a0202', border: '1px solid rgba(255,65,54,0.1)', borderRadius: '4px', padding: '8px 12px', marginBottom: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
              {this.state.error}
            </div>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: '' })}
            style={{
              background: 'rgba(255,65,54,0.08)',
              border: '1px solid rgba(255,65,54,0.3)',
              borderRadius: '4px',
              padding: '4px 14px',
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '8px',
              color: '#ff4136',
              letterSpacing: '0.1em',
            }}
          >
            RETRY
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
