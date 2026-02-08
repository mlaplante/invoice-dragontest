import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '../Header'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img {...props} src={src} alt={alt || ''} />,
}))

// Mock LanguageSelector
jest.mock('../../Language/LanguageSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="language-selector" />,
}))

// Mock KeyboardShortcutsModal
jest.mock('../../KeyboardShortcutsModal/KeyboardShortcutsModal', () => ({
  __esModule: true,
  default: ({ isOpen }) => (isOpen ? <div data-testid="shortcuts-modal" /> : null),
}))

describe('Header Component', () => {
  test('renders logo and basic navigation', () => {
    render(<Header />)
    expect(screen.getByAltText('Page Logo')).toBeInTheDocument()
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  test('renders current page title when provided', () => {
    render(<Header currentPage="Test Page" />)
    expect(screen.getByText('Test Page')).toBeInTheDocument()
  })

  test('opens shortcuts modal when help button clicked', () => {
    render(<Header />)
    const helpBtn = screen.getByLabelText('Show keyboard shortcuts')
    fireEvent.click(helpBtn)
    expect(screen.getByTestId('shortcuts-modal')).toBeInTheDocument()
  })

  test('renders language selector', () => {
    render(<Header />)
    expect(screen.getByTestId('language-selector')).toBeInTheDocument()
  })
})
