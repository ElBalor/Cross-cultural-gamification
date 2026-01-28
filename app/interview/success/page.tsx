import Link from 'next/link'

export default function InterviewSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="max-w-2xl w-full relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        
        <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 p-12 text-center border-b border-white/10">
            <div className="text-7xl mb-6 animate-bounce">🧬</div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Analysis Complete</h1>
            <p className="text-lg text-indigo-100/80 font-medium">Qualitative data synchronized with the neural core.</p>
          </div>
          
          <div className="p-8 sm:p-12 text-center">
            <p className="text-white/70 mb-10 text-lg font-medium italic leading-relaxed">
              "Your insights provide the necessary context to bridge cultural gaps in fitness adoption. The neural engine is now processing your unique behavioral signature."
            </p>
            
            <Link
              href="/"
              className="w-full bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
            >
              Return to Portal
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}






