import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "../actions";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token");

  if (!token || token.value !== "authenticated") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] flex flex-col">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M12 18h.01"/></svg>
              </div>
              <h1 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-widest">Lab Controller</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors">Portal</Link>
              <form action={logout}>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-600 transition-all shadow-md active:scale-95"
                >
                  Exit
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
