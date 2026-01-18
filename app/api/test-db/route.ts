import { NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";

export async function GET() {
  try {
    console.log("Testing database connection...");

    // Try to initialize the database
    await initDatabase();

    return NextResponse.json({
      success: true,
      message: "Database connection successful! Tables initialized.",
    });
  } catch (error) {
    console.error("Database test error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: errorMessage,
        hint: "Make sure you have set up Vercel Postgres and added the environment variables (POSTGRES_URL, etc.)",
      },
      { status: 500 }
    );
  }
}
