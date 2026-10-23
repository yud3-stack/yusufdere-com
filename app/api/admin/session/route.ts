import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  return NextResponse.json(
    { isAdmin: admin.ok },
    { headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } },
  );
}
