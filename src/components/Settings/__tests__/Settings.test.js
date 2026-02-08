import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Settings from '../Settings'
import * as settingsStorage from '@/utils/settingsStorage'
import * as storage from '@/utils/storage'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

// Mock storage utilities
jest.mock('@/utils/settingsStorage', () => ({
  saveSettings: jest.fn(),
  loadSettings: jest.fn(() => ({
    theme: 'light',
    autoIncrement: true,
    defaultNotes: 'Test Notes',
    branding: { primaryColor: '#000000' },
  })),
  clearSettings: jest.fn(),
  getDefaultSettings: jest.fn(() => ({})),
}))

jest.mock('@/utils/storage', () => ({
  loadCompanyInfo: jest.fn(),
  clearCompanyInfo: jest.fn(),
  clearLogo: jest.fn(),
  loadLogo: jest.fn(),
  saveLogo: jest.fn(),
  loadInvoices: jest.fn(() => []),
  loadClients: jest.fn(() => []),
  saveCompanyInfo: jest.fn(),
}))

describe('Settings Component', () => {
  const mockOnClose = jest.fn()
  const mockOnSettingsChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('does not render when isOpen is false', () => {
    const { container } = render(<Settings isOpen={false} onClose={mockOnClose} />)
    expect(container).toBeEmptyDOMElement()
  })

  test('renders when isOpen is true', () => {
    render(<Settings isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('settings')).toBeInTheDocument()
  })

  test('switches tabs correctly', () => {
    render(<Settings isOpen={true} onClose={mockOnClose} />)

    const dataTab = screen.getByText('data')
    fireEvent.click(dataTab)

    expect(screen.getByText('export_data')).toBeInTheDocument()

    const generalTab = screen.getByText('general')
    fireEvent.click(generalTab)
    expect(screen.getByText('theme')).toBeInTheDocument()
  })

  test('updates theme and calls saveSettings', () => {
    render(<Settings isOpen={true} onClose={mockOnClose} onSettingsChange={mockOnSettingsChange} />)

    const themeSelect = screen.getByLabelText('theme')
    fireEvent.change(themeSelect, { target: { value: 'dark' } })

    expect(settingsStorage.saveSettings).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'dark' })
    )
    expect(mockOnSettingsChange).toHaveBeenCalled()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  test('updates autoIncrement setting', () => {
    render(<Settings isOpen={true} onClose={mockOnClose} />)

    const checkbox = screen.getByLabelText('auto_increment_invoices')
    fireEvent.click(checkbox)

    expect(settingsStorage.saveSettings).toHaveBeenCalledWith(
      expect.objectContaining({ autoIncrement: false })
    )
  })

  test('triggers data export', () => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url')
    global.URL.revokeObjectURL = jest.fn()

    render(<Settings isOpen={true} onClose={mockOnClose} />)

    fireEvent.click(screen.getByText('data'))
    fireEvent.click(screen.getByText('export_data'))

    expect(storage.loadCompanyInfo).toHaveBeenCalled()
    expect(storage.loadLogo).toHaveBeenCalled()
    expect(storage.loadInvoices).toHaveBeenCalled()
    expect(storage.loadClients).toHaveBeenCalled()
  })

  test('updates branding settings', async () => {
    render(<Settings isOpen={true} onClose={mockOnClose} />)

    fireEvent.click(screen.getByText('branding'))

    const colorPicker = screen.getByLabelText('primary_color')
    fireEvent.change(colorPicker, { target: { value: '#ff0000' } })

    const secondaryColorPicker = screen.getByLabelText('secondary_color')
    fireEvent.change(secondaryColorPicker, { target: { value: '#0000ff' } })

    await waitFor(() => {
      expect(settingsStorage.saveSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          branding: expect.objectContaining({ secondaryColor: '#0000ff' }),
        })
      )
    })

    const fontSelect = screen.getByLabelText('font_family')
    fireEvent.change(fontSelect, { target: { value: 'Helvetica' } })

    await waitFor(() => {
      expect(settingsStorage.saveSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          branding: expect.objectContaining({ fontFamily: 'Helvetica' }),
        })
      )
    })
  })

  test('triggers data import', async () => {
    render(<Settings isOpen={true} onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('data'))

    const file = new File(['{"settings": {"theme": "dark"}}'], 'backup.json', {
      type: 'application/json',
    })
    const input = document.getElementById('importData')

    // Mock FileReader
    const mockFileReader = {
      readAsText: jest.fn(),
      onload: null,
      result: '{"settings": {"theme": "dark"}}',
    }
    jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader)

    fireEvent.change(input, { target: { files: [file] } })

    // Simulate onload
    mockFileReader.onload({ target: { result: mockFileReader.result } })

    await waitFor(() => {
      expect(settingsStorage.saveSettings).toHaveBeenCalled()
    })
  })
})
