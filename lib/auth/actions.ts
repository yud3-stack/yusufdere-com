"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const invalidCredentials = "E-posta veya şifre hatalı.";

export async function login(_previous: { error: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: invalidCredentials };
  }

  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch {
    return { error: "Giriş şu an kullanılamıyor." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: invalidCredentials };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    await supabase.auth.signOut();
    return { error: invalidCredentials };
  }

  redirect("/admin");
}

export async function logout() {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    // The login page is still the safe destination when auth is unavailable.
  }

  redirect("/admin/login");
}
