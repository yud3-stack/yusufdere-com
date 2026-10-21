import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function createServerSupabaseClient() {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(
      "Supabase ortam değişkenleri tanımlı değil. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY gerekli.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. proxy.ts refreshes the session.
        }
      },
    },
  });
}
