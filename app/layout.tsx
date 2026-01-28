import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cross-Cultural Fitness Intelligence',
  description: 'AI-Powered Research for Global Health Gamification',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <nav className="fixed top-0 left-0 w-full z-[100] pointer-events-none p-4 sm:p-6">
          <div className="max-w-7xl mx-auto flex justify-end">
            <a 
              href="/admin" 
              className="pointer-events-auto flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-md text-gray-400 hover:text-indigo-600 transition-all rounded-xl shadow-xl border border-white group"
              title="Controller Login"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </a>
          </div>
        </nav>
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  )
}






