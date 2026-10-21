import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

const cacheHeaderNames = ["cache-control", "expires", "pragma"];

function applySession(target: NextResponse, sessionResponse: NextResponse) {
  sessionResponse.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });

  cacheHeaderNames.forEach((name) => {
    const value = sessionResponse.headers.get(name);

    if (value) {
      target.headers.set(name, value);
    }
  });

  return target;
}

export async function refreshAdminSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === "/admin/login";
  const env = getSupabasePublicEnv();

  if (!env) {
    if (isLogin) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let sessionResponse = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        sessionResponse = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          sessionResponse.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([name, value]) => {
          sessionResponse.headers.set(name, value);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin = isAdminEmail(user?.email);

  if (user && !admin) {
    await supabase.auth.signOut();
  }

  if (isLogin) {
    if (!admin) {
      return sessionResponse;
    }

    return applySession(NextResponse.redirect(new URL("/admin", request.url)), sessionResponse);
  }

  if (!admin) {
    return applySession(
      NextResponse.redirect(new URL("/admin/login", request.url)),
      sessionResponse,
    );
  }

  return sessionResponse;
}
