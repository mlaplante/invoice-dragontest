import { useEffect } from 'react'

export function useKeyboardShortcuts({ onPreviewToggle, onDownload, onCloseModals, onShowHelp }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger in input/textarea/contenteditable elements
      if (e.target.matches('input, textarea, [contenteditable]')) {
        return
      }

      // Detect platform to use correct modifier key
      const isMac = navigator.platform.toLowerCase().includes('mac')
      const isCtrlCmd = isMac ? e.metaKey : e.ctrlKey

      // Cmd/Ctrl+P: Toggle preview
      if (isCtrlCmd && e.key === 'p') {
        e.preventDefault()
        onPreviewToggle?.()
      }

      // Cmd/Ctrl+D: Download
      if (isCtrlCmd && e.key === 'd') {
        e.preventDefault()
        onDownload?.()
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseModals?.()
      }

      // ?: Show help
      if (e.key === '?') {
        e.preventDefault()
        onShowHelp?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onPreviewToggle, onDownload, onCloseModals, onShowHelp])
}
