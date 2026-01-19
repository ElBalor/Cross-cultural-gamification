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

    // Validation
    if (!formData.get("age")) newErrors.age = "Age is required";
    if (!formData.get("gender")) newErrors.gender = "Gender is required";
    if (!formData.get("country")) newErrors.country = "Country is required";
    if (!formData.get("activityFrequency")) newErrors.activityFrequency = "Required";

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
        alert(result.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      alert("Error submitting. Please check your connection.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Success! 🎉</h1>
          <p className="text-lg text-gray-700 mb-8">Thank you for your response.</p>
          <Link href="/interview" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold">Continue to Interview</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">Research Survey</h1>
          <p>Section {currentSection + 1} of 4</p>
        </div>

        {/* Progress Bar */}
        <div className="p-4 bg-gray-100 flex gap-2">
          {sections.map((s, i) => (
            <button key={s} type="button" onClick={() => setCurrentSection(i)} className={`flex-1 py-2 rounded-md font-bold transition-all ${currentSection === i ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* SECTION A */}
          <div className={currentSection !== 0 ? "hidden" : ""}>
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Section A: Demographics</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-bold">Age</label>
                <input name="age" type="text" className="w-full p-2 border rounded" placeholder="e.g. 25" />
              </div>
              <div>
                <label className="block font-bold">Gender</label>
                <select name="gender" className="w-full p-2 border rounded">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-bold">Country</label>
                <input name="country" type="text" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block font-bold">Activity Frequency</label>
                <select name="activityFrequency" className="w-full p-2 border rounded">
                  <option value="">Select...</option>
                  <option value="0 days">0 days</option>
                  <option value="1-2 days">1-2 days</option>
                  <option value="3-4 days">3-4 days</option>
                  <option value="5+ days">5+ days</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION B */}
          <div className={currentSection !== 1 ? "hidden" : ""}>
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Section B: Features</h2>
            <div className="space-y-6">
              {["pointsRewards", "leaderboards", "progressTracking", "achievements", "personalizedChallenges", "socialSharing", "dailyStreaks", "unlockableContent"].map(f => (
                <div key={f}>
                  <label className="block font-bold capitalize">{f.replace(/([A-Z])/g, ' $1')}</label>
                  <div className="flex gap-4 mt-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <label key={v} className="flex flex-col items-center">
                        <input type="radio" name={f} value={v} />
                        <span className="text-xs">{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION C */}
          <div className={currentSection !== 2 ? "hidden" : ""}>
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Section C: Culture</h2>
            <div className="space-y-4">
              <label className="block font-bold">Would cultural tailoring help?</label>
              <div className="flex gap-4">
                {["Yes", "No", "Maybe"].map(o => (
                  <label key={o} className="flex items-center gap-2"><input type="radio" name="culturalMotivation" value={o} /> {o}</label>
                ))}
              </div>
              <label className="block font-bold mt-4">Cultural elements you want to see?</label>
              <textarea name="culturalElements" className="w-full p-2 border rounded" rows={3}></textarea>
            </div>
          </div>

          {/* SECTION D */}
          <div className={currentSection !== 3 ? "hidden" : ""}>
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Section D: Motivation</h2>
            <div className="space-y-6">
              {["consistency", "enjoyment", "visualProgress", "competition"].map(f => (
                <div key={f}>
                  <label className="block font-bold capitalize">{f.replace(/([A-Z])/g, ' $1')}</label>
                  <div className="flex gap-4 mt-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <label key={v} className="flex flex-col items-center">
                        <input type="radio" name={f} value={v} />
                        <span className="text-xs">{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <label className="block font-bold">Likelihood to use?</label>
                <select name="likelihood" className="w-full p-2 border rounded">
                  <option value="">Select...</option>
                  <option value="Not likely">Not likely</option>
                  <option value="Maybe">Maybe</option>
                  <option value="Very likely">Very likely</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex justify-between">
            <button type="button" onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))} className="px-6 py-2 bg-gray-200 rounded font-bold">Prev</button>
            {currentSection < 3 ? (
              <button type="button" onClick={() => setCurrentSection(prev => Math.min(3, prev + 1))} className="px-6 py-2 bg-indigo-600 text-white rounded font-bold">Next</button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="px-10 py-2 bg-green-600 text-white rounded font-bold">{isSubmitting ? "Submitting..." : "Submit Survey"}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
