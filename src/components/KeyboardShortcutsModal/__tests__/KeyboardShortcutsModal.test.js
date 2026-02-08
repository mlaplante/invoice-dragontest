import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import KeyboardShortcutsModal from '../KeyboardShortcutsModal'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

describe('KeyboardShortcutsModal Component', () => {
  test('does not render when isOpen is false', () => {
    const { container } = render(<KeyboardShortcutsModal isOpen={false} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  test('renders shortcuts list when open', () => {
    render(<KeyboardShortcutsModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('keyboard_shortcuts')).toBeInTheDocument()
    expect(screen.getByText('shortcut_preview')).toBeInTheDocument()
    expect(screen.getByText('shortcut_download')).toBeInTheDocument()
  })

  test('calls onClose when close button clicked', () => {
    const mockOnClose = jest.fn()
    render(<KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} />)
    const closeBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeBtn)
    expect(mockOnClose).toHaveBeenCalled()
  })

  test('calls onClose when overlay clicked', () => {
    const mockOnClose = jest.fn()
    const { container } = render(<KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} />)
    // The overlay is the first child
    fireEvent.click(container.firstChild)
    expect(mockOnClose).toHaveBeenCalled()
  })
})
