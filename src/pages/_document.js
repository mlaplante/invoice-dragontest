import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Create professional invoices and receipts for free. No account required, all data stays private."
        />
        <meta
          name="keywords"
          content="invoice, receipt, generator, free, PDF, template, freelancer, small business"
        />

        {/* Open Graph for social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Invoice Dragon - Free Invoice & Receipt Generator" />
        <meta
          property="og:description"
          content="Create professional invoices and receipts for free. No account required, all data stays private."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://laplantedevinvoices.netlify.app" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Invoice Dragon" />
        <meta name="twitter:description" content="Free invoice and receipt generator" />
        <meta name="twitter:image" content="/og-image.png" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
