import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorBoundary from '../ErrorBoundary'
import HomePage from '../Home/HomePage'
import StructuredData from '../StructuredData/StructuredData'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

describe('ErrorBoundary Component', () => {
  const ThrowError = () => {
    throw new Error('Test error')
  }

  test('renders error UI when child throws', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    spy.mockRestore()
  })

  test('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child Content</div>
      </ErrorBoundary>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})

describe('HomePage Component', () => {
  test('renders landing content', () => {
    render(<HomePage />)
    expect(screen.getByText('invoice_dragon')).toBeInTheDocument()
    expect(screen.getByText('get_started')).toBeInTheDocument()
  })
})

describe('StructuredData Component', () => {
  test('renders script tag with json-ld', () => {
    const { container } = render(<StructuredData />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    expect(script.textContent).toContain('Invoice Dragon')
  })
})
