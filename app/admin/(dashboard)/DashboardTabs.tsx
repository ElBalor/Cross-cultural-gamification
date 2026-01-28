"use client";

import { useState } from "react";

interface DashboardTabsProps {
  submissions: React.ReactNode;
  aiInsights: React.ReactNode;
}

export default function DashboardTabs({ submissions, aiInsights }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"submissions" | "ai">("submissions");

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-gray-200/50 backdrop-blur-sm rounded-xl w-full sm:w-fit border border-white/20 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === "submissions"
              ? "bg-white text-indigo-600 shadow-md scale-100 sm:scale-105"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Submissions
          </div>
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === "ai"
              ? "bg-white text-purple-600 shadow-md scale-100 sm:scale-105"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M12 18h.01"/></svg>
            AI Analysis
          </div>
        </button>
      </div>

      <div className="transition-all duration-300">
        {activeTab === "submissions" ? submissions : aiInsights}
      </div>
    </div>
  );
}
