import { NextRequest, NextResponse } from "next/server";

function isV1Mode() {
    return (
        process.env.NEXT_PUBLIC_APP_MODE ||
        process.env.APP_MODE ||
        "v1"
    ).toLowerCase() === "v1";
}

function isAllowedAdminV1Path(pathname: string) {
    return pathname === "/admin" ||
        pathname === "/admin/login" ||
        pathname === "/admin/site" ||
        pathname === "/admin/depoimentos";
}

export function middleware(request: NextRequest) {
    const adminToken = request.cookies.get("admin_token")?.value;
    const alunoToken = request.cookies.get("aluno_token")?.value;

    const pathname = request.nextUrl.pathname;

    const isAdminRoute = pathname.startsWith("/admin");
    const isAdminLoginRoute = pathname === "/admin/login";

    const isAlunoRoute = pathname.startsWith("/aluno");
    const isAlunoLoginRoute = pathname === "/login";
    const isAlunoCadastroRoute = pathname === "/cadastro-aluno";

    if (isV1Mode() && (isAlunoRoute || isAlunoLoginRoute || isAlunoCadastroRoute)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAdminLoginRoute && adminToken) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAdminRoute && !isAdminLoginRoute && !adminToken) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (
        isV1Mode() &&
        isAdminRoute &&
        adminToken &&
        !isAllowedAdminV1Path(pathname)
    ) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAlunoLoginRoute && alunoToken) {
        return NextResponse.redirect(new URL("/aluno/perfil", request.url));
    }

    if (isAlunoRoute && !alunoToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/aluno/:path*",
        "/login",
        "/cadastro-aluno",
    ],
};
