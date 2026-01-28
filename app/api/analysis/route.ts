import { NextResponse } from "next/server";
import { 
  getOverview, 
  analyzeClusters, 
  analyzeFeatureImportance, 
  analyzeCulturalPatterns, 
  analyzeSentiment 
} from "@/lib/analysis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisType = searchParams.get("type") || "overview";

    switch (analysisType) {
      case "clusters":
        return NextResponse.json(await analyzeClusters());
      case "features":
        return NextResponse.json(await analyzeFeatureImportance());
      case "cultural":
        return NextResponse.json(await analyzeCulturalPatterns());
      case "sentiment":
        return NextResponse.json(await analyzeSentiment());
      case "overview":
      default:
        return NextResponse.json(await getOverview());
    }
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to perform analysis" },
      { status: 500 }
    );
  }
}
