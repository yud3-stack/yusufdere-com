import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminContent } from "@/components/admin/content";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

async function hasAdminSession() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return isAdminEmail(user?.email) ? user?.email : null;
  } catch {
    return null;
  }
}

export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const email = await hasAdminSession();
  if (!email) {
    redirect("/admin/login");
  }

  const { posts, projects } = await getAdminContent();
  const items = [
    ...(posts.data ?? []).map(post => ({ title: post.title, href: `/admin/posts/${post.id}/edit`, kind: "Yazı" })),
    ...(projects.data ?? []).map(project => ({ title: project.title, href: `/admin/projects/${project.id}/edit`, kind: "Proje" })),
  ];
  return <AdminShell email={email} items={items}>{children}</AdminShell>;
}
