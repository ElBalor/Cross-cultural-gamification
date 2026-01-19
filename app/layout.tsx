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
          className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-full shadow-md hover:shadow-lg border border-gray-100 group"
          title="Admin Access"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </a>
        {children}
      </body>
    </html>
  )
}






