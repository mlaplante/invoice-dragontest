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
