import { isAdminEmail } from "@/lib/auth/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const denied = "Bu işlem için yetkin yok.";

export async function requireAdmin() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email)) {
      return { ok: false as const, error: denied };
    }

    return { ok: true as const, supabase };
  } catch {
    return { ok: false as const, error: denied };
  }
}
