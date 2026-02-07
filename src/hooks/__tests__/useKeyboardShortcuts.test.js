import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  let mockCallbacks
  let addEventListenerSpy
  let removeEventListenerSpy
  let keydownHandler

  beforeEach(() => {
    mockCallbacks = {
      onPreviewToggle: jest.fn(),
      onDownload: jest.fn(),
      onCloseModals: jest.fn(),
      onShowHelp: jest.fn(),
    }

    // Mock window event listeners
    addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    // Store the handler so we can call it in tests
    addEventListenerSpy.mockImplementation((event, handler) => {
      if (event === 'keydown') {
        keydownHandler = handler
      }
    })
  })

  afterEach(() => {
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
    jest.clearAllMocks()
  })

  test('should trigger onPreviewToggle when Ctrl+P is pressed on Windows', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    // Mock Windows platform
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    })

    const event = {
      preventDefault: jest.fn(),
      key: 'p',
      ctrlKey: true,
      metaKey: false,
      target: {
        matches: jest.fn(() => false),
      },
    }

    keydownHandler(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(mockCallbacks.onPreviewToggle).toHaveBeenCalled()
  })

  test('should trigger onPreviewToggle when Cmd+P is pressed on Mac', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    // Mock Mac platform
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    })

    const event = {
      preventDefault: jest.fn(),
      key: 'p',
      ctrlKey: false,
      metaKey: true,
      target: {
        matches: jest.fn(() => false),
      },
    }

    keydownHandler(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(mockCallbacks.onPreviewToggle).toHaveBeenCalled()
  })

  test('should trigger onDownload when Ctrl+D is pressed on Windows', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    // Mock Windows platform
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    })

    const event = {
      preventDefault: jest.fn(),
      key: 'd',
      ctrlKey: true,
      metaKey: false,
      target: {
        matches: jest.fn(() => false),
      },
    }

    keydownHandler(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(mockCallbacks.onDownload).toHaveBeenCalled()
  })

  test('should trigger onDownload when Cmd+D is pressed on Mac', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    // Mock Mac platform
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    })

    const event = {
      preventDefault: jest.fn(),
      key: 'd',
      ctrlKey: false,
      metaKey: true,
      target: {
        matches: jest.fn(() => false),
      },
    }

    keydownHandler(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(mockCallbacks.onDownload).toHaveBeenCalled()
  })

  test('should trigger onCloseModals when Escape is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = {
      preventDefault: jest.fn(),
      key: 'Escape',
      ctrlKey: false,
      metaKey: false,
      target: {
        matches: jest.fn(() => false),
      },
    }

    keydownHandler(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(mockCallbacks.onCloseModals).toHaveBeenCalled()
  })

  test('should trigger onShowHelp when ? is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = {
      preventDefault: jest.fn(),
      key: '?',
      ctrlKey: false,
      metaKey: false,
      target: {
        matches: jest.fn(() => false),
      },
    }

    keydownHandler(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(mockCallbacks.onShowHelp).toHaveBeenCalled()
  })

  test('should not trigger shortcuts when event target is an input field', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = {
      preventDefault: jest.fn(),
      key: 'p',
      ctrlKey: true,
      metaKey: false,
      target: {
        matches: jest.fn(() => true), // Simulate being inside an input
      },
    }

    keydownHandler(event)

    expect(mockCallbacks.onPreviewToggle).not.toHaveBeenCalled()
    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  test('should not trigger shortcuts when event target is a textarea field', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = {
      preventDefault: jest.fn(),
      key: 'd',
      ctrlKey: true,
      metaKey: false,
      target: {
        matches: jest.fn(() => true), // Simulate being inside a textarea
      },
    }

    keydownHandler(event)

    expect(mockCallbacks.onDownload).not.toHaveBeenCalled()
    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  test('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const addListenerCalls = addEventListenerSpy.mock.calls.length
    expect(addListenerCalls).toBeGreaterThan(0)

    unmount()
    const removeListenerCalls = removeEventListenerSpy.mock.calls.length

    expect(removeListenerCalls).toBeGreaterThan(0)
  })

  test('should handle optional callbacks gracefully', () => {
    renderHook(() =>
      useKeyboardShortcuts({
        onPreviewToggle: undefined,
        onDownload: undefined,
        onCloseModals: undefined,
        onShowHelp: undefined,
      })
    )

    const event = {
      preventDefault: jest.fn(),
      key: 'p',
      ctrlKey: true,
      metaKey: false,
      target: {
        matches: jest.fn(() => false),
      },
    }

    // Should not throw
    expect(() => keydownHandler(event)).not.toThrow()
  })
})
