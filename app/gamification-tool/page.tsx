import { getSurveyResponseById } from "@/lib/db";
import { getPrototypeConfig, getConsensusConfig } from "@/lib/analysis";
import InteractiveTool from "./InteractiveTool";

export default async function GamificationToolPage({
  searchParams 
}: {
  searchParams: { id?: string } 
}) {
  const id = searchParams.id ? parseInt(searchParams.id) : null;
  let surveyData = null;
  let config = null;
  let mode = "Research Consensus";
  
  if (id) {
    surveyData = await getSurveyResponseById(id);
    if (surveyData) {
      config = getPrototypeConfig(surveyData);
      mode = `Personalized Protocol (ID: ${id})`;
    }
  }

  // If no specific user ID or user not found, load the research consensus
  if (!config) {
    config = await getConsensusConfig();
  }

  return <InteractiveTool config={config} mode={mode} />;
}