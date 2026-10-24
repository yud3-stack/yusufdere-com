import { NextResponse } from "next/server";
import { collectQuoteCandidates, createQuoteJobClient } from "@/lib/quotes/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const client = createQuoteJobClient();
  if (!client) return NextResponse.json({ error: "Sunucu Supabase bağlantısı eksik." }, { status: 503 });
  try {
    const result = await collectQuoteCandidates(client);
    const { error } = await client.rpc("current_daily_quote");
    if (error) throw new Error("Günlük yayın kaydedilemedi.");
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Toplama yapılamadı." }, { status: 503 });
  }
}
