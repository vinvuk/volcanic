import { NextResponse } from "next/server";
import { fetchActiveEruptions } from "@/lib/gvp-eruptions";

/**
 * GET handler to check eruption data status
 * Returns info about currently cached eruption data
 */
export async function GET(): Promise<NextResponse> {
  try {
    const eruptions = await fetchActiveEruptions();

    const eruptingVolcanoes = Array.from(eruptions.values()).map((e) => ({
      id: e.volcanoId,
      name: e.volcanoName,
      startDate: e.startDate,
    }));

    return NextResponse.json({
      eruptingCount: eruptions.size,
      eruptingVolcanoes,
      dataSource: "Smithsonian GVP E3WebApp_Eruptions1960",
      refreshInterval: "30 minutes",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting status:", error);
    return NextResponse.json(
      {
        error: "Failed to get status",
      },
      { status: 500 }
    );
  }
}
