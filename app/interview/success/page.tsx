import Link from 'next/link'

export default function InterviewSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
          <p className="text-lg opacity-95">Your interview responses have been successfully submitted.</p>
        </div>
        
        <div className="p-10 text-center">
          <p className="text-gray-700 mb-6 text-lg">
            Your detailed responses provide valuable insights that will help shape the development of the culturally-adapted fitness gamification tool.
          </p>
          <p className="text-gray-600 mb-8">
            Your participation in this research is greatly appreciated!
          </p>
          
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}






