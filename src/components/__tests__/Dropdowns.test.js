import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MoreMenu from '../MoreMenu'
import CurrencySelector from '../Dropdown/CurrencySelector'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

// Mock Settings component
jest.mock('../Settings/Settings', () => {
  const Settings = ({ isOpen }) => (isOpen ? <div data-testid="settings-modal" /> : null)
  Settings.displayName = 'Settings'
  return Settings
})

describe('MoreMenu Component', () => {
  const mockProps = {
    onClearData: jest.fn(),
    onLoadExampleData: jest.fn(),
    onSettingsChange: jest.fn(),
  }

  test('opens dropdown on click', () => {
    render(<MoreMenu {...mockProps} />)
    const btn = screen.getByLabelText('More options')
    fireEvent.click(btn)
    expect(screen.getByText('load_example_data')).toBeInTheDocument()
    expect(screen.getByText('settings')).toBeInTheDocument()
  })

  test('calls onLoadExampleData', () => {
    render(<MoreMenu {...mockProps} />)
    fireEvent.click(screen.getByLabelText('More options'))
    fireEvent.click(screen.getByText('load_example_data'))
    expect(mockProps.onLoadExampleData).toHaveBeenCalled()
  })

  test('opens settings', () => {
    render(<MoreMenu {...mockProps} />)
    fireEvent.click(screen.getByLabelText('More options'))
    fireEvent.click(screen.getByText('settings'))
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument()
  })

  test('calls onClearData', () => {
    render(<MoreMenu {...mockProps} />)
    fireEvent.click(screen.getByLabelText('More options'))
    fireEvent.click(screen.getByText('clear_saved_data'))
    expect(mockProps.onClearData).toHaveBeenCalled()
  })

  test('handles keyboard navigation', () => {
    render(<MoreMenu {...mockProps} />)
    const btn = screen.getByLabelText('More options')
    fireEvent.click(btn)

    // Trigger keyboard events on the container
    fireEvent.keyDown(btn.parentElement, { key: 'ArrowDown' })
    fireEvent.keyDown(btn.parentElement, { key: 'Enter' })

    expect(mockProps.onLoadExampleData).toHaveBeenCalled()
  })

  test('closes on escape', () => {
    render(<MoreMenu {...mockProps} />)
    const btn = screen.getByLabelText('More options')
    fireEvent.click(btn)
    expect(screen.getByText('load_example_data')).toBeInTheDocument()
    fireEvent.keyDown(btn.parentElement, { key: 'Escape' })
    expect(screen.queryByText('load_example_data')).not.toBeInTheDocument()
  })

  test('closes on click outside', () => {
    render(<MoreMenu {...mockProps} />)
    const btn = screen.getByLabelText('More options')
    fireEvent.click(btn)
    expect(screen.getByText('load_example_data')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('load_example_data')).not.toBeInTheDocument()
  })
})

describe('CurrencySelector Component', () => {
  const mockProps = {
    currencyCode: 'USD',
    currencySymbol: '$',
    onCurrencyModify: jest.fn(),
  }

  test('renders current currency', () => {
    render(<CurrencySelector {...mockProps} />)
    expect(screen.getByText('USD')).toBeInTheDocument()
  })
})
