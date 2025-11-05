// proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/_next", "/favicon", "/images", "/assets"];

export default async function proxy(req: NextRequest) {

  const { pathname } = req.nextUrl;

  // 🟢 Allow public + static routes
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    /\.(png|jpg|jpeg|svg|gif|ico|txt|webmanifest)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 🧩 Allow localhost bypass (for dev)
  const isLocal = req.headers.get("host")?.includes("localhost");
  if (process.env.NODE_ENV !== "production" && isLocal) {
    return NextResponse.next();
  }

  const authed = req.cookies.get("hah_auth")?.value === "ok";

  if (!authed) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
