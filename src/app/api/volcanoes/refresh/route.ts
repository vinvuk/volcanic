import { NextResponse } from "next/server";
import { invalidateEruptionCache } from "@/lib/gvp-eruptions";

/**
 * POST handler to force refresh volcano data
 * Invalidates the eruption cache to fetch fresh data on next request
 */
export async function POST(): Promise<NextResponse> {
  try {
    invalidateEruptionCache();

    return NextResponse.json({
      success: true,
      message: "Cache invalidated. Fresh data will be fetched on next request.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error refreshing cache:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to invalidate cache",
      },
      { status: 500 }
    );
  }
}
