import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../index'

// Mock components
jest.mock('../../components/Header/Header', () => () => <div data-testid="header" />)
jest.mock('../../components/Footer/Footer', () => () => <div data-testid="footer" />)
jest.mock('../../components/Home/HomePage', () => () => <div data-testid="home-page" />)
jest.mock('../../components/FeaturesCards/FeaturesCards', () => () => (
  <div data-testid="features" />
))
jest.mock('../../components/HowItWorks/HowItWorks', () => () => <div data-testid="how-it-works" />)
jest.mock('../../components/StructuredData/StructuredData', () => () => (
  <div data-testid="structured-data" />
))

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
