/**
 * PHASE 4: Accessibility & Performance Testing
 *
 * Testing tools:
 * 1. Lighthouse: `npm run dev` then `npx lighthouse http://localhost:3000/templates --view`
 * 2. axe DevTools: Install browser extension, scan any page
 * 3. Keyboard navigation: Tab through form, verify focus indicators visible
 * 4. Screen reader: macOS VoiceOver (Cmd+F5) or Windows NVDA
 *
 * Success metrics:
 * - Lighthouse Accessibility score: > 90
 * - Lighthouse Performance score: > 85
 * - axe DevTools scan: 0 violations
 * - Keyboard navigation: all interactive elements reachable
 * - Screen reader: all content announced
 */

import '@/styles/focus.scss'
import '@/styles/globals.css'
import { Quicksand } from 'next/font/google'
import ErrorBoundary from '@/components/ErrorBoundary'

const quicksand = Quicksand({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <main className={quicksand.className}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </main>
  )
}
