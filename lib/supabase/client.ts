import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

type BrowserClient = ReturnType<typeof createBrowserClient>;

let browserClient: BrowserClient | undefined;

export function createBrowserSupabaseClient() {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(
      "Supabase ortam değişkenleri tanımlı değil. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY gerekli.",
    );
  }

  browserClient ??= createBrowserClient(env.url, env.key);

  return browserClient;
}
