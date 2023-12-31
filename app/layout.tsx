import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatAI: Chat with the stars',
  description: 'Chat with your favourite celebrities ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("bg-secondary" ,inter.className)}>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem>
          {children}
          <Toaster/>
          </ThemeProvider>
          </body>
          
      </html>
    </ClerkProvider>
  )
}
