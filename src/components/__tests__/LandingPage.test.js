import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FeaturesCards from '../FeaturesCards/FeaturesCards'
import HowItWorks from '../HowItWorks/HowItWorks'
import Footer from '../Footer/Footer'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
    lang: 'en',
  }),
}))

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }) {
    return <a href={href}>{children}</a>
  }
})

describe('FeaturesCards Component', () => {
  test('renders features section with heading', () => {
    render(<FeaturesCards />)
    expect(screen.getByText('features_title')).toBeInTheDocument()
  })

  test('renders 4 feature cards', () => {
    render(<FeaturesCards />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(4)
  })

  test('renders feature titles for all cards', () => {
    render(<FeaturesCards />)
    expect(screen.getByText('feature_free_title')).toBeInTheDocument()
    expect(screen.getByText('feature_fast_title')).toBeInTheDocument()
    expect(screen.getByText('feature_no_account_title')).toBeInTheDocument()
    expect(screen.getByText('feature_secure_title')).toBeInTheDocument()
  })

  test('renders feature descriptions for all cards', () => {
    render(<FeaturesCards />)
    expect(screen.getByText('feature_free_desc')).toBeInTheDocument()
    expect(screen.getByText('feature_fast_desc')).toBeInTheDocument()
    expect(screen.getByText('feature_no_account_desc')).toBeInTheDocument()
    expect(screen.getByText('feature_secure_desc')).toBeInTheDocument()
  })

  test('applies correct CSS classes for styling', () => {
    const { container } = render(<FeaturesCards />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('section')
  })

  test('renders cards in a responsive grid', () => {
    const { container } = render(<FeaturesCards />)
    const grid = container.querySelector('[class*="grid"]')
    expect(grid).toBeInTheDocument()
  })
})

describe('HowItWorks Component', () => {
  test('renders how-it-works section with heading', () => {
    render(<HowItWorks />)
    expect(screen.getByText('how_it_works_title')).toBeInTheDocument()
  })

  test('renders 4 steps', () => {
    render(<HowItWorks />)
    const steps = screen.getAllByRole('article')
    expect(steps).toHaveLength(4)
  })

  test('renders step titles for all steps', () => {
    render(<HowItWorks />)
    expect(screen.getByText('step_1_title')).toBeInTheDocument()
    expect(screen.getByText('step_2_title')).toBeInTheDocument()
    expect(screen.getByText('step_3_title')).toBeInTheDocument()
    expect(screen.getByText('step_4_title')).toBeInTheDocument()
  })

  test('renders step descriptions for all steps', () => {
    render(<HowItWorks />)
    expect(screen.getByText('step_1_desc')).toBeInTheDocument()
    expect(screen.getByText('step_2_desc')).toBeInTheDocument()
    expect(screen.getByText('step_3_desc')).toBeInTheDocument()
    expect(screen.getByText('step_4_desc')).toBeInTheDocument()
  })

  test('renders step numbers in circles', () => {
    const { container } = render(<HowItWorks />)
    const circles = container.querySelectorAll('[class*="number"]')
    expect(circles.length).toBeGreaterThanOrEqual(4)
  })

  test('applies correct CSS classes for styling', () => {
    const { container } = render(<HowItWorks />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('section')
  })
})

describe('Footer Component', () => {
  test('renders footer section', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  test('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/footer_copyright/)).toBeInTheDocument()
  })

  test('renders footer navigation links', () => {
    render(<Footer />)
    expect(screen.getByText('footer_about')).toBeInTheDocument()
    expect(screen.getByText('footer_privacy')).toBeInTheDocument()
    expect(screen.getByText('footer_terms')).toBeInTheDocument()
    expect(screen.getByText('footer_contact')).toBeInTheDocument()
  })

  test('renders social links', () => {
    render(<Footer />)
    expect(screen.getByText('footer_github')).toBeInTheDocument()
  })

  test('applies correct CSS classes for styling', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('footer')
  })

  test('footer links are properly structured', () => {
    const { container } = render(<Footer />)
    const links = container.querySelectorAll('a')
    expect(links.length).toBeGreaterThan(0)
  })
})

describe('LandingPage Integration Tests', () => {
  test('components render without errors', () => {
    expect(() => {
      render(<FeaturesCards />)
      render(<HowItWorks />)
      render(<Footer />)
    }).not.toThrow()
  })

  test('all translation keys are present', () => {
    const { container } = render(
      <>
        <FeaturesCards />
        <HowItWorks />
        <Footer />
      </>
    )

    // Check that no undefined translation keys are rendered
    const text = container.textContent
    expect(text).not.toContain('undefined')
  })
})
