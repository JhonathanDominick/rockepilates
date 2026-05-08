import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("admin_token")?.value;
    const pathname = request.nextUrl.pathname;

    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginRoute = pathname === "/admin/login";

    if (isLoginRoute && token) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAdminRoute && !isLoginRoute && !token) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};