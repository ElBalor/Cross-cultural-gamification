"use server";

import {
  saveSurveyResponse,
  saveInterviewResponse,
  initDatabase,
} from "@/lib/db";
import { mlEncoder } from "@/lib/ml-encoder";

export async function submitSurvey(formData: FormData) {
  console.log("Starting survey submission...");
  try {
    // Initialize database tables if they don't exist
    await initDatabase().catch(err => console.error("DB Init warning:", err));
    console.log("Database checked/initialized");

    const data = {
      sectionA: {
        age: formData.get("age") as string,
        gender: formData.get("gender") as string,
        country: formData.get("country") as string,
        activityFrequency: formData.get("activityFrequency") as string,
      },
      sectionB: {
        pointsRewards: parseInt(formData.get("pointsRewards") as string) || 0,
        leaderboards: parseInt(formData.get("leaderboards") as string) || 0,
        progressTracking:
          parseInt(formData.get("progressTracking") as string) || 0,
        achievements: parseInt(formData.get("achievements") as string) || 0,
        personalizedChallenges:
          parseInt(formData.get("personalizedChallenges") as string) || 0,
        socialSharing: parseInt(formData.get("socialSharing") as string) || 0,
        dailyStreaks: parseInt(formData.get("dailyStreaks") as string) || 0,
        unlockableContent:
          parseInt(formData.get("unlockableContent") as string) || 0,
        favoriteFeatures: formData.get("favoriteFeatures") as string,
      },
      sectionC: {
        culturalMotivation: formData.get("culturalMotivation") as string,
        culturalElements: formData.get("culturalElements") as string,
        barriers: formData.getAll("barriers") as string[],
        otherBarriers: (formData.get("otherBarriers") as string) || "",
      },
      sectionD: {
        consistency: parseInt(formData.get("consistency") as string) || 0,
        enjoyment: parseInt(formData.get("enjoyment") as string) || 0,
        visualProgress: parseInt(formData.get("visualProgress") as string) || 0,
        competition: parseInt(formData.get("competition") as string) || 0,
        likelihood: formData.get("likelihood") as string,
      },
    };

    let encodedResponse = null;
    try {
      encodedResponse = await mlEncoder.encodeSurveyResponse(data);
    } catch (mlError) {
      console.error("ML Encoding failed, continuing without it:", mlError);
    }

    const result = await saveSurveyResponse({
      ...data,
      embeddings: encodedResponse ? {
        textEmbeddings: encodedResponse.textEmbeddings,
        responseVector: encodedResponse.responseVector,
      } : null,
      mlMetadata: encodedResponse ? encodedResponse.metadata : { note: "ML fallback used" },
    });

    return {
      success: true,
      message: "Survey submitted successfully!",
      id: result.id,
    };
  } catch (error) {
    console.error("Error submitting survey:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to submit survey: ${errorMessage}. Please check your database connection and try again.`,
    };
  }
}

export async function submitInterview(formData: FormData) {
  console.log("Starting interview submission...");
  try {
    // Initialize database tables if they don't exist
    await initDatabase().catch(err => console.error("DB Init warning:", err));
    console.log("Database checked/initialized for interview");

    const data = {
      motivation: formData.get("motivation") as string,
      previousApps: formData.get("previousApps") as string,
      dailyFeatures: formData.get("dailyFeatures") as string,
      rewardsOpinion: formData.get("rewardsOpinion") as string,
      socialFeatures: formData.get("socialFeatures") as string,
      cultureReflection: formData.get("cultureReflection") as string,
      nigerianElements: formData.get("nigerianElements") as string,
      prototypeFeatures: formData.get("prototypeFeatures") as string,
      usability: formData.get("usability") as string,
      habitChange: formData.get("habitChange") as string,
      reminders: formData.get("reminders") as string,
    };

    let encodedResponse = null;
    try {
      encodedResponse = await mlEncoder.encodeInterviewResponse(data);
    } catch (mlError) {
      console.error("ML Encoding failed for interview, continuing:", mlError);
    }

    const result = await saveInterviewResponse({
      responses: data,
      embeddings: encodedResponse ? {
        textEmbeddings: encodedResponse.textEmbeddings,
        responseVector: encodedResponse.responseVector,
      } : null,
      mlMetadata: encodedResponse ? encodedResponse.metadata : { note: "ML fallback used" },
    });

    return {
      success: true,
      message: "Interview responses submitted successfully!",
      id: result.id,
    };
  } catch (error) {
    console.error("Error submitting interview:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to submit interview responses: ${errorMessage}. Please check your database connection and try again.`,
    };
  }
}
