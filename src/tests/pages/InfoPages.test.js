import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import About from '../../pages/about'
import Privacy from '../../pages/privacy'
import Terms from '../../pages/terms'
import Contact from '../../pages/contact'

// Mock components
jest.mock('@/components/Header/Header', () => {
  const Header = () => <div data-testid="header" />
  Header.displayName = 'Header'
  return Header
})
jest.mock('@/components/Footer/Footer', () => {
  const Footer = () => <div data-testid="footer" />
  Footer.displayName = 'Footer'
  return Footer
})

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

describe('Static Info Pages', () => {
  test('About page renders', () => {
    render(<About />)
    expect(screen.getByText('about_title')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  test('Privacy page renders', () => {
    render(<Privacy />)
    expect(screen.getByText('privacy_title')).toBeInTheDocument()
  })

  test('Terms page renders', () => {
    render(<Terms />)
    expect(screen.getByText('terms_title')).toBeInTheDocument()
  })

  test('Contact page renders', () => {
    render(<Contact />)
    expect(screen.getByText('contact_title')).toBeInTheDocument()
  })
})
