"use client";

import { useFormState } from "react-dom";
import { login } from "../actions";
import Link from "next/link";

const initialState = {
  message: "",
};

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-white/20">
          <Link 
            href="/" 
            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            title="Return home"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white mb-6 shadow-xl shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Controller Login</h1>
            <p className="text-indigo-200/60 text-xs font-bold uppercase tracking-widest mt-2">Authorized Access Only</p>
          </div>
          
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                Security ID (Email)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-white/20"
                placeholder="name@research.org"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                Access Key (Password)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>

            {state?.message && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {state.message}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-white text-indigo-900 font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
            >
              <span>Authenticate</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <div className="flex justify-center gap-2">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Biometric bypass disabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}