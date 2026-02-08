import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../pages/index'

// Mock components
jest.mock('../../components/Header/Header', () => {
  const Header = () => <div data-testid="header" />
  Header.displayName = 'Header'
  return Header
})
jest.mock('../../components/Footer/Footer', () => {
  const Footer = () => <div data-testid="footer" />
  Footer.displayName = 'Footer'
  return Footer
})
jest.mock('../../components/Home/HomePage', () => {
  const HomePage = () => <div data-testid="home-page" />
  HomePage.displayName = 'HomePage'
  return HomePage
})
jest.mock('../../components/FeaturesCards/FeaturesCards', () => {
  const FeaturesCards = () => <div data-testid="features" />
  FeaturesCards.displayName = 'FeaturesCards'
  return FeaturesCards
})
jest.mock('../../components/HowItWorks/HowItWorks', () => {
  const HowItWorks = () => <div data-testid="how-it-works" />
  HowItWorks.displayName = 'HowItWorks'
  return HowItWorks
})
jest.mock('../../components/StructuredData/StructuredData', () => {
  const StructuredData = () => <div data-testid="structured-data" />
  StructuredData.displayName = 'StructuredData'
  return StructuredData
})

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

describe('Home Page', () => {
  test('renders all main sections', () => {
    render(<Home />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
    expect(screen.getByTestId('features')).toBeInTheDocument()
    expect(screen.getByTestId('how-it-works')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})
