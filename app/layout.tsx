import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/nav/Navbar'
import { Cursor } from '@/components/ui/Cursor'

const bebas = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'], 
  variable: '--font-bebas-neue' 
})

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-dm-sans',
  weight: ['300', '400', '500']
})

export const metadata: Metadata = {
  title: 'VERVE | Run Club',
  description: 'Connect, compete, and conquer with the VERVE run club platform. Integrated with Strava.',
}

import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bebas.variable} ${dmSans.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Cursor />
          <Navbar />
          <main className="flex-1 flex flex-col pt-[86px]">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
