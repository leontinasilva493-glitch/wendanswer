import { NextResponse } from "next/server";
import { todayWend } from "@/lib/puzzles";
import { buildPublicWendStatus } from "@/lib/wend-public-status";
import { expectedWendDisplay } from "@/lib/wend-status";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  const result = buildPublicWendStatus(todayWend, expectedWendDisplay(todayWend));
  return NextResponse.json(result.body, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
    status: result.httpStatus,
  });
}
