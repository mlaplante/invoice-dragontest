import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import LanguageChange from '../languageChange'
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

describe('LanguageChange Component', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    pathname: '/test',
    asPath: '/test',
    query: { id: '1' },
    locale: 'en',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useRouter.mockReturnValue(mockRouter)
  })

  test('renders current language correctly', () => {
    render(<LanguageChange />)
    const select = screen.getByRole('combobox')
    expect(select.value).toBe('en')
  })

  test('changes language on select change', () => {
    render(<LanguageChange />)
    const select = screen.getByRole('combobox')

    fireEvent.change(select, { target: { value: 'fr' } })

    expect(mockPush).toHaveBeenCalledWith(
      '/test',
      '/test',
      expect.objectContaining({ locale: 'fr' })
    )
  })
})
