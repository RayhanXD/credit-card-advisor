import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/privacy",
  "/terms",
  "/cookies",
  "/refund-policy",
]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/auth/")) return true;
  return false;
}

function copySession(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) to.headers.set(header, value);
  }
  return to;
}

function redirectWithSession(url: URL, supabaseResponse: NextResponse) {
  return copySession(supabaseResponse, NextResponse.redirect(url));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub as string | undefined;
  const pathname = request.nextUrl.pathname;

  if (!userId) {
    if (isPublicPath(pathname)) return supabaseResponse;
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.searchParams.set("next", pathname);
    return redirectWithSession(login, supabaseResponse);
  }

  const { data: profile } = await supabase.from("profiles").select("onboarding_complete").eq("id", userId).maybeSingle();
  const onboardingComplete = Boolean(profile?.onboarding_complete);

  if (pathname === "/login" || pathname === "/signup") {
    const dest = request.nextUrl.clone();
    dest.search = "";
    dest.pathname = onboardingComplete ? "/dashboard" : "/onboarding";
    return redirectWithSession(dest, supabaseResponse);
  }

  if (pathname === "/onboarding" && onboardingComplete) {
    const dest = request.nextUrl.clone();
    dest.search = "";
    dest.pathname = "/dashboard";
    return redirectWithSession(dest, supabaseResponse);
  }

  const recoveryAllowed = pathname === "/reset-password" || pathname === "/forgot-password";
  if (!onboardingComplete && !isPublicPath(pathname) && pathname !== "/onboarding" && !recoveryAllowed) {
    const dest = request.nextUrl.clone();
    dest.search = "";
    dest.pathname = "/onboarding";
    return redirectWithSession(dest, supabaseResponse);
  }

  return supabaseResponse;
}
