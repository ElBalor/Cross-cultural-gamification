import Link from 'next/link'

export default function SurveySuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
          <p className="text-lg opacity-95">Your survey response has been successfully submitted.</p>
        </div>
        
        <div className="p-10 text-center">
          <p className="text-gray-700 mb-6 text-lg">
            Your participation is greatly appreciated and will contribute to the development of a culturally-adapted fitness gamification tool.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/interview"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              Continue to Interview Questions
            </Link>
            <Link
              href="/"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}






