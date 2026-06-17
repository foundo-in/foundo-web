import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ToastProvider } from '@/components/Toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Foundo.in — India\'s Startup Connection Platform',
  description: 'Connecting founders, investors, students and builders in one place.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body>
          <ToastProvider>
            {children}
          </ToastProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}