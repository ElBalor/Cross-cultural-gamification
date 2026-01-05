import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-10 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Cross-Cultural Fitness Gamification Research
          </h1>
          <p className="text-lg opacity-95">
            Developing a Cross-Cultural Gamification Tool for Global Health and Fitness Adoption
          </p>
        </div>
        
        <div className="p-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Research Objectives</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>(i)</strong> To identify key gamification features that influence sustained user participation across diverse cultural settings.</li>
                <li><strong>(ii)</strong> To design a scalable gamified fitness tool that is tailored to the Nigerian context and adaptable to multicultural environments.</li>
                <li><strong>(iii)</strong> To implement the designed tool.</li>
                <li><strong>(iv)</strong> To evaluate the impact of the developed tool on user motivation, engagement, and physical activity levels.</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Participate in the Research</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/survey"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-center hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Take Survey
                </Link>
                <Link
                  href="/interview"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-center hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Interview Questions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






