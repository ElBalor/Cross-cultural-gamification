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
      <body>
        <a 
          href="/admin" 
          className="fixed top-4 right-4 z-50 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
          title="Admin Access"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </a>
        {children}
      </body>
    </html>
  )
}






