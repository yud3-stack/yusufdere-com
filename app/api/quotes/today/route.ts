import { NextResponse } from "next/server";
import { todayQuote } from "@/lib/quotes/store";

export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json(await todayQuote(), { headers: { "Cache-Control": "no-store" } });
}
