import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cross-Cultural Fitness Gamification Research Survey',
  description: 'Research survey for developing a Cross-Cultural Gamification Tool for Global Health and Fitness Adoption',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}






