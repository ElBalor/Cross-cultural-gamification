"use client";

import { useState, FormEvent } from "react";
import { submitSurvey } from "@/app/actions";
import Link from "next/link";

export default function SurveyPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOtherBarriers, setShowOtherBarriers] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = ["A", "B", "C", "D"];
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    if (!formData.get("age")) newErrors.age = "Age is required";
    if (!formData.get("gender")) newErrors.gender = "Gender is required";
    if (!formData.get("country")) newErrors.country = "Country/Region is required";
    if (!formData.get("activityFrequency")) newErrors.activityFrequency = "Required";

    const sectionBFields = ["pointsRewards", "leaderboards", "progressTracking", "achievements", "personalizedChallenges", "socialSharing", "dailyStreaks", "unlockableContent"];
    sectionBFields.forEach((field) => {
      if (!formData.get(field) || formData.get(field) === "0") newErrors[field] = "Required";
    });

    if (!formData.get("culturalMotivation")) newErrors.culturalMotivation = "Required";

    const sectionDFields = ["consistency", "enjoyment", "visualProgress", "competition"];
    sectionDFields.forEach((field) => {
      if (!formData.get(field) || formData.get(field) === "0") newErrors[field] = "Required";
    });

    if (!formData.get("likelihood")) newErrors.likelihood = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const result = await submitSurvey(formData);
      if (result.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert(result.message || "Failed to submit survey.");
        setIsSubmitting(false);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const goToSection = (index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSection(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-12 text-center">
            <div className="text-7xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Transmission Received</h1>
            <p className="text-lg opacity-90 font-medium">Your data has been securely uploaded.</p>
          </div>
          <div className="p-8 sm:p-10 text-center">
            <p className="text-gray-600 mb-8 text-lg font-medium italic">Your participation accelerates our cultural AI research.</p>
            <div className="flex flex-col gap-4">
              <Link href="/interview" className="w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg">Continue to Interview</Link>
              <Link href="/" className="w-full bg-gray-100 text-gray-500 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Return Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50/50">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 sm:p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] mb-2">Research Survey</h1>
            <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest">Neural Behavioral Protocol</p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 sm:px-10 py-6 bg-gray-50/50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Step {currentSection + 1} of 4</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{Math.round(((currentSection + 1) / 4) * 100)}% Synchronized</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-700 ease-out" style={{ width: `${((currentSection + 1) / 4) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-6 gap-2 overflow-x-auto no-scrollbar pb-2">
            {sections.map((section, index) => (
              <button 
                key={section} 
                type="button" 
                onClick={() => goToSection(index)} 
                className={`flex-1 min-w-[60px] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  index === currentSection 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-y-[-2px]" 
                    : index < currentSection 
                      ? "bg-indigo-100 text-indigo-600" 
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-10">
          {/* Section A */}
          <div className={currentSection !== 0 ? 'hidden' : 'space-y-8 animate-in fade-in slide-in-from-right-4'}>
            <section>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8 pb-4 border-b-2 border-indigo-600 w-fit">Demographics</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">1. Age {errors.age && <span className="text-red-500">*</span>}</label>
                  <input type="text" name="age" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold" placeholder="e.g. 24" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3. Country {errors.country && <span className="text-red-500">*</span>}</label>
                  <input type="text" name="country" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold" placeholder="e.g. Nigeria" />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">2. Gender {errors.gender && <span className="text-red-500">*</span>}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Male", "Female", "Other"].map(o => (
                    <label key={o} className="relative group cursor-pointer">
                      <input type="radio" name="gender" value={o} className="peer sr-only" />
                      <div className="p-4 text-center border-2 border-gray-100 rounded-2xl font-bold text-gray-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 transition-all hover:border-indigo-200">
                        {o}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4. Weekly Activity {errors.activityFrequency && <span className="text-red-500">*</span>}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["0 days", "1–2 days", "3–4 days", "5+ days"].map(o => (
                    <label key={o} className="relative cursor-pointer">
                      <input type="radio" name="activityFrequency" value={o} className="peer sr-only" />
                      <div className="p-4 text-center border-2 border-gray-100 rounded-2xl font-bold text-sm text-gray-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 transition-all">
                        {o}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Section B */}
          <div className={currentSection !== 1 ? 'hidden' : 'space-y-8 animate-in fade-in slide-in-from-right-4'}>
            <section>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Gamification Features</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Priority Scaling (1 = Low, 5 = High)</p>
              
              <div className="space-y-10">
                {[
                  { name: "pointsRewards", label: "Points and rewards" },
                  { name: "leaderboards", label: "Leaderboards" },
                  { name: "progressTracking", label: "Progress tracking" },
                  { name: "achievements", label: "Achievements / badges" },
                  { name: "personalizedChallenges", label: "Personalized challenges" },
                  { name: "socialSharing", label: "Social sharing" },
                  { name: "dailyStreaks", label: "Daily streaks" },
                  { name: "unlockableContent", label: "Unlockable content" },
                ].map((f, idx) => (
                  <div key={f.name} className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 flex justify-between">
                      <span>{idx + 5}. {f.label}</span>
                      {errors[f.name] && <span className="text-red-500 font-black text-[10px]">REQUIRED</span>}
                    </label>
                    <div className="flex items-center justify-between gap-2">
                       <span className="text-[9px] font-black text-gray-300 uppercase">Min</span>
                       <div className="flex-1 grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map(v => (
                            <label key={v} className="cursor-pointer">
                              <input type="radio" name={f.name} value={v} className="peer sr-only" />
                              <div className="h-10 sm:h-12 flex items-center justify-center border-2 border-gray-50 bg-gray-50 rounded-xl font-black text-gray-400 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-all">
                                {v}
                              </div>
                            </label>
                          ))}
                       </div>
                       <span className="text-[9px] font-black text-gray-300 uppercase">Max</span>
                    </div>
                  </div>
                ))}
                
                <div className="pt-8 border-t border-gray-100">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">13. Top features? (Deep thoughts)</label>
                  <textarea name="favoriteFeatures" rows={4} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-medium text-sm" placeholder="What keeps you coming back?" />
                </div>
              </div>
            </section>
          </div>

          {/* Section C */}
          <div className={currentSection !== 2 ? 'hidden' : 'space-y-8 animate-in fade-in slide-in-from-right-4'}>
            <section>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Cultural Context</h2>
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">14. Would cultural elements boost your motivation? {errors.culturalMotivation && <span className="text-red-500">*</span>}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Yes", "No", "Maybe"].map(o => (
                      <label key={o} className="cursor-pointer">
                        <input type="radio" name="culturalMotivation" value={o} className="peer sr-only" />
                        <div className="p-4 text-center border-2 border-gray-100 rounded-2xl font-bold text-gray-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 transition-all">
                          {o}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">15. Desired cultural elements? (Local music, language, etc.)</label>
                  <textarea name="culturalElements" rows={4} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-medium text-sm" placeholder="e.g. Afrobeats, local challenges, Yoruba voiceovers..." />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">16. Significant barriers? (Multi-select)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Data costs", "Lack of motivation", "Foreign look/feel", "Complexity", "Other"].map(o => (
                      <label key={o} className="relative flex items-center p-4 border-2 border-gray-50 bg-gray-50 rounded-2xl font-bold text-gray-600 cursor-pointer has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-600 transition-all">
                        <input type="checkbox" name="barriers" value={o} className="w-5 h-5 rounded-lg text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3" onChange={e => o === "Other" && setShowOtherBarriers(e.target.checked)} />
                        {o}
                      </label>
                    ))}
                  </div>
                  {showOtherBarriers && (
                    <input type="text" name="otherBarriers" className="w-full mt-4 px-5 py-4 bg-gray-50 border-2 border-indigo-100 rounded-2xl outline-none font-medium animate-in slide-in-from-top-2" placeholder="Please specify..." />
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Section D */}
          <div className={currentSection !== 3 ? 'hidden' : 'space-y-8 animate-in fade-in slide-in-from-right-4'}>
            <section>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Impact & Future</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Agreement Scale (1 = Disagree, 5 = Agree)</p>
              
              <div className="space-y-10">
                {[
                  { name: "consistency", label: "This app would make me more consistent." },
                  { name: "enjoyment", label: "Gamification makes workouts enjoyable." },
                  { name: "visualProgress", label: "I am motivated by visual progress." },
                  { name: "competition", label: "Leaderboards increase my engagement." },
                ].map((f, idx) => (
                  <div key={f.name} className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 flex justify-between">
                      <span>{idx + 17}. {f.label}</span>
                      {errors[f.name] && <span className="text-red-500 font-black text-[10px]">REQUIRED</span>}
                    </label>
                    <div className="flex items-center justify-between gap-2">
                       <span className="text-[9px] font-black text-gray-300 uppercase">No</span>
                       <div className="flex-1 grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map(v => (
                            <label key={v} className="cursor-pointer">
                              <input type="radio" name={f.name} value={v} className="peer sr-only" />
                              <div className="h-10 sm:h-12 flex items-center justify-center border-2 border-gray-50 bg-gray-50 rounded-xl font-black text-gray-400 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-all">
                                {v}
                              </div>
                            </label>
                          ))}
                       </div>
                       <span className="text-[9px] font-black text-gray-300 uppercase">Yes</span>
                    </div>
                  </div>
                ))}

                <div className="pt-8 border-t border-gray-100 space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">21. Adoption Likelihood? {errors.likelihood && <span className="text-red-500">*</span>}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["Not likely", "Maybe", "Very likely"].map(o => (
                      <label key={o} className="cursor-pointer">
                        <input type="radio" name="likelihood" value={o} className="peer sr-only" />
                        <div className="p-4 text-center border-2 border-gray-100 rounded-2xl font-bold text-gray-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 transition-all">
                          {o}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Navigation */}
          <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
            <button 
              type="button" 
              onClick={() => goToSection(currentSection - 1)} 
              disabled={currentSection === 0} 
              className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              Back
            </button>
            {currentSection < 3 ? (
              <button 
                type="button" 
                onClick={() => goToSection(currentSection + 1)} 
                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95"
              >
                Next Step
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {isSubmitting ? "Uploading..." : "Submit Profile"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}