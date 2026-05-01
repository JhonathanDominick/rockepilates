import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("admin_token")?.value;
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/admin/login")) {
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin") && !token) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};