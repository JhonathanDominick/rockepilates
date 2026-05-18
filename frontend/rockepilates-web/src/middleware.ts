import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const adminToken = request.cookies.get("admin_token")?.value;
    const alunoId = request.cookies.get("aluno_id")?.value;

    const pathname = request.nextUrl.pathname;

    const isAdminRoute = pathname.startsWith("/admin");
    const isAdminLoginRoute = pathname === "/admin/login";

    const isAlunoRoute = pathname.startsWith("/aluno");
    const isAlunoLoginRoute = pathname === "/login";

    if (isAdminLoginRoute && adminToken) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAdminRoute && !isAdminLoginRoute && !adminToken) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (isAlunoLoginRoute && alunoId) {
        return NextResponse.redirect(new URL("/aluno/perfil", request.url));
    }

    if (isAlunoRoute && !alunoId) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/aluno/:path*", "/login"],
};