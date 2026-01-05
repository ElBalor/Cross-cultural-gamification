import { NextResponse } from "next/server";
import { mlEncoder } from "@/lib/ml-encoder";

export async function GET() {
  try {
    const testText =
      "I love Nigerian music and fitness challenges with leaderboards";

    console.log("Testing ML Encoder...");
    console.log("API Key exists:", !!process.env.HUGGINGFACE_API_KEY);
    console.log(
      "API Key value:",
      process.env.HUGGINGFACE_API_KEY
        ? `${process.env.HUGGINGFACE_API_KEY.substring(0, 10)}...`
        : "NOT FOUND"
    );
    console.log(
      "All env vars with HUGGING:",
      Object.keys(process.env).filter((k) => k.includes("HUGGING"))
    );

    // First, test simple text encoding
    let embedding;
    try {
      embedding = await mlEncoder.encodeText(testText);
      console.log("Text encoding successful, dimension:", embedding.dimension);
    } catch (encodeError: any) {
      console.error("Text encoding error:", encodeError);
      return NextResponse.json(
        {
          success: false,
          error: "Text encoding failed",
          details: encodeError.message,
          stack: encodeError.stack,
          config: {
            hasApiKey: !!process.env.HUGGINGFACE_API_KEY,
            apiKeyPrefix:
              process.env.HUGGINGFACE_API_KEY?.substring(0, 10) || "none",
          },
        },
        { status: 500 }
      );
    }

    // Test with a sample survey response to get sentiment and keywords
    let encoded;
    try {
      const testSurvey = {
        sectionA: { country: "Nigeria" },
        sectionB: { favoriteFeatures: testText },
        sectionC: { culturalElements: testText },
        sectionD: {},
      };

      encoded = await mlEncoder.encodeSurveyResponse(testSurvey);
      console.log("Survey encoding successful");
    } catch (surveyError: any) {
      console.error("Survey encoding error:", surveyError);
      return NextResponse.json(
        {
          success: false,
          error: "Survey encoding failed",
          details: surveyError.message,
          stack: surveyError.stack,
          textEncoding: {
            dimension: embedding.dimension,
            sampleValues: embedding.values.slice(0, 5),
          },
        },
        { status: 500 }
      );
    }

    const sentiment = encoded.metadata.sentiment;
    const keywords = encoded.metadata.culturalKeywords;

    return NextResponse.json({
      success: true,
      message: "ML Encoder is working!",
      test: {
        text: testText,
        embedding: {
          dimension: embedding.dimension,
          sampleValues: embedding.values.slice(0, 5),
          allValuesLength: embedding.values.length,
        },
        sentiment,
        culturalKeywords: keywords,
      },
      config: {
        hasApiKey: !!process.env.HUGGINGFACE_API_KEY,
        apiKeyPrefix:
          process.env.HUGGINGFACE_API_KEY?.substring(0, 10) || "none",
        mlEncoderHasKey: !!(mlEncoder as any).apiKey,
        mlEncoderKeyPrefix:
          (mlEncoder as any).apiKey?.substring(0, 10) || "none",
        useLocalModel: process.env.USE_LOCAL_ML_MODEL === "true",
        encodingMethod:
          process.env.HUGGINGFACE_API_KEY || (mlEncoder as any).apiKey
            ? "Hugging Face API"
            : process.env.USE_LOCAL_ML_MODEL === "true"
            ? "Local Model"
            : "Fallback",
      },
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        message: "ML Encoder test failed",
        stack: error.stack,
        config: {
          hasApiKey: !!process.env.HUGGINGFACE_API_KEY,
          apiKeyPrefix:
            process.env.HUGGINGFACE_API_KEY?.substring(0, 10) || "none",
        },
      },
      { status: 500 }
    );
  }
}
