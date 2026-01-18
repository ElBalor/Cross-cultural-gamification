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
    if (!formData.get("country"))
      newErrors.country = "Country/Region is required";
    if (!formData.get("activityFrequency"))
      newErrors.activityFrequency = "Activity frequency is required";

    const sectionBFields = [
      "pointsRewards",
      "leaderboards",
      "progressTracking",
      "achievements",
      "personalizedChallenges",
      "socialSharing",
      "dailyStreaks",
      "unlockableContent",
    ];
    sectionBFields.forEach((field) => {
      if (!formData.get(field) || formData.get(field) === "0") {
        newErrors[field] = "Please rate this feature";
      }
    });

    if (!formData.get("culturalMotivation"))
      newErrors.culturalMotivation = "Please select an option";

    const sectionDFields = [
      "consistency",
      "enjoyment",
      "visualProgress",
      "competition",
    ];
    sectionDFields.forEach((field) => {
      if (!formData.get(field) || formData.get(field) === "0") {
        newErrors[field] = "Please answer this question";
      }
    });

    if (!formData.get("likelihood"))
      newErrors.likelihood = "Please select likelihood";

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
        console.error("Survey submission error:", result.message);
        alert(result.message || "Failed to submit survey. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Unexpected error submitting survey:", error);
      alert(
        "An unexpected error occurred. Please check the console for details and try again."
      );
      setIsSubmitting(false);
    }
  };

  const goToSection = (index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSection(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNext = () => {
    if (currentSection < sections.length - 1) {
      goToSection(currentSection + 1);
    }
  };

  const goToPrevious = () => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-lg opacity-95">
              Your survey response has been successfully submitted.
            </p>
          </div>

          <div className="p-10 text-center">
            <p className="text-gray-700 mb-6 text-lg">
              Your participation is greatly appreciated and will contribute to the
              development of a culturally-adapted fitness gamification tool.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/interview"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                Continue to Interview Questions
              </Link>
              <Link
                href="/"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Research Survey
          </h1>
          <p className="text-sm sm:text-lg opacity-95">
            Cross-Cultural Fitness Gamification Research
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 sm:px-8 pt-6 pb-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              Section {currentSection + 1} of {sections.length}
            </span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              {Math.round(((currentSection + 1) / sections.length) * 100)}%
              Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentSection + 1) / sections.length) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {sections.map((section, index) => (
              <button
                key={section}
                type="button"
                onClick={() => goToSection(index)}
                className={`flex-1 mx-1 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  index === currentSection
                    ? "bg-purple-600 text-white shadow-md"
                    : index < currentSection
                    ? "bg-purple-200 text-purple-700 hover:bg-purple-300"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-8">
          {/* Section A */}
          {currentSection === 0 && (
            <section className="mb-8 sm:mb-12 pb-8 sm:pb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4 sm:mb-6">
                Section A — Demographics
              </h2>

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  1. Age:{" "}
                  {errors.age && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      * {errors.age}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="age"
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  placeholder="Enter your age"
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  2. Gender:{" "}
                  {errors.gender && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      * {errors.gender}
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  {["Male", "Female", "Prefer not to say"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  3. Country/Region:{" "}
                  {errors.country && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      * {errors.country}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="country"
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  placeholder="Enter your country or region"
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  4. How often do you engage in physical activity weekly?
                  {errors.activityFrequency && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      * {errors.activityFrequency}
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  {["0 days", "1–2 days", "3–4 days", "5+ days"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
                      >
                        <input
                          type="radio"
                          name="activityFrequency"
                          value={option}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                        />
                        <span>{option}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section B */}
          {currentSection === 1 && (
            <section className="mb-8 sm:mb-12 pb-8 sm:pb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">
                Section B — Gamification Features (Objective i)
              </h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                &quot;How important are these features in motivating you to
                stick to a fitness app?&quot;
                <br />
                <strong>(Scale: 1 = Not important, 5 = Very important)</strong>
              </p>

              {[
                { num: 5, name: "pointsRewards", label: "Points and rewards" },
                { num: 6, name: "leaderboards", label: "Leaderboards" },
                {
                  num: 7,
                  name: "progressTracking",
                  label: "Progress tracking",
                },
                {
                  num: 8,
                  name: "achievements",
                  label: "Achievements / badges",
                },
                {
                  num: 9,
                  name: "personalizedChallenges",
                  label: "Personalized challenges",
                },
                {
                  num: 10,
                  name: "socialSharing",
                  label: "Social sharing / competing with friends",
                },
                { num: 11, name: "dailyStreaks", label: "Daily streaks" },
                {
                  num: 12,
                  name: "unlockableContent",
                  label: "Unlockable content (levels, items)",
                },
              ].map(({ num, name, label }) => (
                <div key={name} className="mb-6 sm:mb-8">
                  <label className="block text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    {num}. {label}
                    {errors[name] && (
                      <span className="text-red-500 text-xs sm:text-sm">
                        * {errors[name]}
                      </span>
                    )}
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-wrap">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Not important
                    </span>
                    <div className="flex gap-2 sm:gap-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label
                          key={value}
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={name}
                            value={value}
                            className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                          />
                          <span className="text-xs sm:text-sm font-semibold mt-1">
                            {value}
                          </span>
                        </label>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Very important
                    </span>
                  </div>
                </div>
              ))}

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  13. What gamification features do you personally enjoy the
                  most? (Short answer)
                </label>
                <textarea
                  name="favoriteFeatures"
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  placeholder="Share your thoughts..."
                />
              </div>
            </section>
          )}

          {/* Section C */}
          {currentSection === 2 && (
            <section className="mb-8 sm:mb-12 pb-8 sm:pb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4 sm:mb-6">
                Section C — Cultural & Nigerian Context (Objective ii)
              </h2>

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  14. Would a fitness tool tailored to your cultural background
                  increase your motivation?
                  {errors.culturalMotivation && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      * {errors.culturalMotivation}
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  {["Yes", "No", "Maybe"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
                    >
                      <input
                        type="radio"
                        name="culturalMotivation"
                        value={option}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  15. What cultural elements would make a fitness app feel more
                  familiar or relatable?
                  <span className="block text-xs sm:text-sm text-gray-500 font-normal mt-1">
                    (e.g., language, local music, Nigerian themes, local
                    challenges)
                  </span>
                </label>
                <textarea
                  name="culturalElements"
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  placeholder="Share your thoughts..."
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  16. What barriers stop you from using fitness apps?
                </label>
                <div className="space-y-2">
                  {[
                    "Data costs",
                    "Lack of motivation",
                    "Apps feel foreign / not relatable",
                    "Too complicated",
                    "Other",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
                    >
                      <input
                        type="checkbox"
                        name="barriers"
                        value={option}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                        onChange={(e) => {
                          if (option === "Other") {
                            setShowOtherBarriers(e.target.checked);
                          }
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {showOtherBarriers && (
                  <input
                    type="text"
                    name="otherBarriers"
                    className="w-full mt-3 px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    placeholder="Please specify..."
                  />
                )}
              </div>
            </section>
          )}

          {/* Section D */}
          {currentSection === 3 && (
            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">
                Section D — Motivation, Engagement, Physical Activity (Objective
                iv)
              </h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                <strong>
                  (Scale: 1 = Strongly disagree, 5 = Strongly agree)
                </strong>
              </p>

              {[
                {
                  num: 17,
                  name: "consistency",
                  label:
                    "A gamified fitness app would make me more consistent with physical activity.",
                },
                {
                  num: 18,
                  name: "enjoyment",
                  label:
                    "Gamification makes working out feel more enjoyable for me.",
                },
                {
                  num: 19,
                  name: "visualProgress",
                  label:
                    "I feel more motivated when I see my progress visually.",
                },
                {
                  num: 20,
                  name: "competition",
                  label: "Competing with others increases my engagement.",
                },
              ].map(({ num, name, label }) => (
                <div key={name} className="mb-6 sm:mb-8">
                  <label className="block text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    {num}. {label}
                    {errors[name] && (
                      <span className="text-red-500 text-xs sm:text-sm">
                        * {errors[name]}
                      </span>
                    )}
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-wrap">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Strongly disagree
                    </span>
                    <div className="flex gap-2 sm:gap-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label
                          key={value}
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={name}
                            value={value}
                            className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                          />
                          <span className="text-xs sm:text-sm font-semibold mt-1">
                            {value}
                          </span>
                        </label>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Strongly agree
                    </span>
                  </div>
                </div>
              ))}

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  21. How likely are you to use a culturally adapted fitness
                  tool?
                  {errors.likelihood && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      * {errors.likelihood}
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  {["Not likely", "Maybe", "Very likely"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
                    >
                      <input
                        type="radio"
                        name="likelihood"
                        value={option}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={goToPrevious}
              disabled={currentSection === 0}
              className="bg-gray-200 text-gray-700 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
            >
              ← Previous
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={goToNext}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg ml-auto"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 sm:px-12 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ml-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit Survey"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
