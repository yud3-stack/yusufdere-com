import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginView } from "@/components/admin/LoginView";
import { isAdminEmail } from "@/lib/auth/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Giriş",
  robots: { index: false, follow: false },
};

async function hasAdminSession() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return isAdminEmail(user?.email);
  } catch {
    return false;
  }
}

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin");
  }

  return <LoginView />;
}
