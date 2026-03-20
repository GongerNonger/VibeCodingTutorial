import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PitchDeck — AI Pitch Deck Outline Generator',
  description: 'Describe your startup, get a structured pitch deck outline with talking points for each slide',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
