import Link from 'next/link'

export default function SurveySuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="max-w-2xl w-full relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        
        <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-emerald-500/80 to-teal-600/80 p-12 text-center border-b border-white/10">
            <div className="text-7xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Transmission Received</h1>
            <p className="text-lg text-emerald-100/80 font-medium">Your data has been securely uploaded to the research core.</p>
          </div>
          
          <div className="p-8 sm:p-12 text-center">
            <p className="text-white/70 mb-10 text-lg font-medium italic leading-relaxed">
              "Your participation accelerates our cultural AI research. Every signal contributes to a more inclusive fitness future."
            </p>
            
            <div className="flex flex-col gap-4">
              <Link
                href="/interview"
                className="w-full bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
              >
                Continue to Interview
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
              <Link
                href="/"
                className="w-full bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Return to Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






