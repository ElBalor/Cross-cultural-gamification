"use server";

import { saveSurveyResponse, saveInterviewResponse } from "@/lib/db";
import { mlEncoder } from "@/lib/ml-encoder";

export async function submitSurvey(formData: FormData) {
  try {
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

    const encodedResponse = await mlEncoder.encodeSurveyResponse(data);

    const result = await saveSurveyResponse({
      ...data,
      embeddings: {
        textEmbeddings: encodedResponse.textEmbeddings,
        responseVector: encodedResponse.responseVector,
      },
      mlMetadata: encodedResponse.metadata,
    });

    return {
      success: true,
      message: "Survey submitted successfully!",
      id: result.id,
    };
  } catch (error) {
    console.error("Error submitting survey:", error);
    return {
      success: false,
      message: "Failed to submit survey. Please try again.",
    };
  }
}

export async function submitInterview(formData: FormData) {
  try {
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

    const encodedResponse = await mlEncoder.encodeInterviewResponse(data);

    const result = await saveInterviewResponse({
      responses: data,
      embeddings: {
        textEmbeddings: encodedResponse.textEmbeddings,
        responseVector: encodedResponse.responseVector,
      },
      mlMetadata: encodedResponse.metadata,
    });

    return {
      success: true,
      message: "Interview responses submitted successfully!",
      id: result.id,
    };
  } catch (error) {
    console.error("Error submitting interview:", error);
    return {
      success: false,
      message: "Failed to submit interview responses. Please try again.",
    };
  }
}
