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

    // Restore original validation
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-lg opacity-95">Your survey response has been successfully submitted.</p>
          </div>
          <div className="p-10 text-center">
            <p className="text-gray-700 mb-6 text-lg">Your participation is greatly appreciated!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/interview" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">Continue to Interview</Link>
              <Link href="/" className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold">Return Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6 py-6 sm:py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Research Survey</h1>
          <p className="text-sm sm:text-lg opacity-95">Cross-Cultural Fitness Gamification Research</p>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 sm:px-8 pt-6 pb-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">Section {currentSection + 1} of 4</span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">{Math.round(((currentSection + 1) / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentSection + 1) / 4) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-3">
            {sections.map((section, index) => (
              <button key={section} type="button" onClick={() => goToSection(index)} className={`flex-1 mx-1 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${index === currentSection ? "bg-purple-600 text-white shadow-md" : index < currentSection ? "bg-purple-200 text-purple-700" : "bg-gray-200 text-gray-600"}`}>{section}</button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-8">
          {/* Section A */}
          <div className={currentSection !== 0 ? 'hidden' : ''}>
            <section className="mb-8 sm:mb-12 pb-8 sm:pb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4 sm:mb-6">Section A — Demographics</h2>
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2">1. Age: {errors.age && <span className="text-red-500 text-sm">* {errors.age}</span>}</label>
                <input type="text" name="age" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600" placeholder="Enter age" />
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2">2. Gender: {errors.gender && <span className="text-red-500 text-sm">* {errors.gender}</span>}</label>
                <div className="space-y-2">
                  {["Male", "Female", "Prefer not to say"].map(o => (
                    <label key={o} className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="gender" value={o} className="w-4 h-4 text-purple-600" /><span>{o}</span></label>
                  ))}
                </div>
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2">3. Country/Region: {errors.country && <span className="text-red-500 text-sm">* {errors.country}</span>}</label>
                <input type="text" name="country" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600" placeholder="Enter country" />
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2">4. Weekly Activity: {errors.activityFrequency && <span className="text-red-500 text-sm">* {errors.activityFrequency}</span>}</label>
                <div className="space-y-2">
                  {["0 days", "1–2 days", "3–4 days", "5+ days"].map(o => (
                    <label key={o} className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="activityFrequency" value={o} className="w-4 h-4 text-purple-600" /><span>{o}</span></label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Section B */}
          <div className={currentSection !== 1 ? 'hidden' : ''}>
            <section className="mb-8 sm:mb-12 pb-8 sm:pb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">Section B — Gamification Features</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">(Scale: 1 = Not important, 5 = Very important)</p>
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
                <div key={f.name} className="mb-6 sm:mb-8">
                  <label className="block text-gray-700 font-semibold mb-2">{idx + 5}. {f.label} {errors[f.name] && <span className="text-red-500 text-sm">*</span>}</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs text-gray-500">Min</span>
                    <div className="flex gap-2 sm:gap-4">
                      {[1, 2, 3, 4, 5].map(v => (
                        <label key={v} className="flex flex-col items-center cursor-pointer"><input type="radio" name={f.name} value={v} className="w-5 h-5 text-purple-600" /><span className="text-xs font-bold mt-1">{v}</span></label>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Max</span>
                  </div>
                </div>
              ))}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2">13. Top features? (Short answer)</label>
                <textarea name="favoriteFeatures" rows={4} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600" placeholder="Share thoughts..." />
              </div>
            </section>
          </div>

          {/* Section C */}
          <div className={currentSection !== 2 ? 'hidden' : ''}>
            <section className="mb-8 sm:mb-12 pb-8 sm:pb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4 sm:mb-6">Section C — Cultural Context</h2>
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2">14. Cultural motivation boost? {errors.culturalMotivation && <span className="text-red-500 text-sm">*</span>}</label>
                <div className="space-y-2">
                  {["Yes", "No", "Maybe"].map(o => (
                    <label key={o} className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="culturalMotivation" value={o} className="w-4 h-4 text-purple-600" /><span>{o}</span></label>
                  ))}
                </div>
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2">15. Desired cultural elements?</label>
                <textarea name="culturalElements" rows={4} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600" placeholder="e.g. music, language..." />
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2">16. Barriers to using fitness apps?</label>
                <div className="space-y-2">
                  {["Data costs", "Motivation", "Foreign feel", "Complexity", "Other"].map(o => (
                    <label key={o} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" name="barriers" value={o} className="w-4 h-4 text-purple-600" onChange={e => o === "Other" && setShowOtherBarriers(e.target.checked)} /><span>{o}</span></label>
                  ))}
                </div>
                {showOtherBarriers && <input type="text" name="otherBarriers" className="w-full mt-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600" placeholder="Specify..." />}
              </div>
            </section>
          </div>

          {/* Section D */}
          <div className={currentSection !== 3 ? 'hidden' : ''}>
            <section className="mb-8 sm:mb-12 pb-8 sm:pb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">Section D — Impact & Likelihood</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">(Scale: 1 = Strongly disagree, 5 = Strongly agree)</p>
              {[
                { name: "consistency", label: "App would make me more consistent." },
                { name: "enjoyment", label: "Gamification makes workout enjoyable." },
                { name: "visualProgress", label: "I am motivated by visual progress." },
                { name: "competition", label: "Competition increases engagement." },
              ].map((f, idx) => (
                <div key={f.name} className="mb-6 sm:mb-8">
                  <label className="block text-gray-700 font-semibold mb-2">{idx + 17}. {f.label} {errors[f.name] && <span className="text-red-500 text-sm">*</span>}</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs text-gray-500">Disagree</span>
                    <div className="flex gap-2 sm:gap-4">
                      {[1, 2, 3, 4, 5].map(v => (
                        <label key={v} className="flex flex-col items-center cursor-pointer"><input type="radio" name={f.name} value={v} className="w-5 h-5 text-purple-600" /><span className="text-xs font-bold mt-1">{v}</span></label>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Agree</span>
                  </div>
                </div>
              ))}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2">21. Likelihood to use? {errors.likelihood && <span className="text-red-500 text-sm">*</span>}</label>
                <div className="space-y-2">
                  {["Not likely", "Maybe", "Very likely"].map(o => (
                    <label key={o} className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="likelihood" value={o} className="w-4 h-4 text-purple-600" /><span>{o}</span></label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Navigation */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <button type="button" onClick={() => goToSection(currentSection - 1)} disabled={currentSection === 0} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50">← Previous</button>
            {currentSection < 3 ? (
              <button type="button" onClick={() => goToSection(currentSection + 1)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all shadow-lg ml-auto">Next →</button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-3 rounded-lg font-semibold hover:scale-105 transition-all shadow-lg disabled:opacity-50 ml-auto">{isSubmitting ? "Submitting..." : "Submit Survey"}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}