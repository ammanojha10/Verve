import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/nav/Navbar'
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'VERVE | Run Club',
  description: 'Connect, compete, and conquer with the VERVE run club platform. Integrated with Strava.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Analytics />
          <Navbar />
          <main className="flex-1 flex flex-col pt-[86px]">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
