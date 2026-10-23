"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { compileWeeklyRadar } from "./compile";

export type RadarActionState = {
  ok: boolean;
  message: string;
};

export async function compileRadarAction(
  _previous: RadarActionState,
  _formData: FormData,
): Promise<RadarActionState> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return { ok: false, message: admin.error };
  }

  const result = await compileWeeklyRadar();
  if (result.error || !result.data) {
    return { ok: false, message: result.error || "Derleme başarısız." };
  }

  revalidatePath("/admin");
  return {
    ok: true,
    message: `Bu haftanın Radar’ı hazır · ${result.data.items.length} madde.`,
  };
}
