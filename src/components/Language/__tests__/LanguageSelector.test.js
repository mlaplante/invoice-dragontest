import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import LanguageSelector from '../LanguageSelector'
import { useRouter } from 'next/router'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
    lang: 'en',
  }),
}))

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('LanguageSelector Component', () => {
  const mockRouter = { push: jest.fn(), pathname: '/', asPath: '/', query: {} }

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter)
  })

  test('renders current language', () => {
    render(<LanguageSelector />)
    expect(screen.getByText(/English/i)).toBeInTheDocument()
  })

  test('opens dropdown on click', () => {
    render(<LanguageSelector />)
    const selector = screen.getByLabelText(/Select Language/i)
    fireEvent.click(selector)
    expect(screen.getByText('Français')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
  })
})
