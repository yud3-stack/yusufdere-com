import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

const missingEnvMessage =
  "Supabase ortam değişkenleri tanımlı değil. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY gerekli.";

export function createPublicSupabaseClient(tags: string[] = ["posts"]) {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(missingEnvMessage);
  }

  return createClient(env.url, env.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          next: { tags, revalidate: 3600 },
        }),
    },
  });
}
