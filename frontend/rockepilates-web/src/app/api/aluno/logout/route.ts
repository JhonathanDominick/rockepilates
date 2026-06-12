import { NextRequest, NextResponse } from "next/server";

function getRequestProtocol(request: NextRequest) {
    return (
        request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
        request.nextUrl.protocol.replace(":", "")
    );
}

function getRequestOrigin(request: NextRequest) {
    const host =
        request.headers.get("x-forwarded-host") ||
        request.headers.get("host") ||
        request.nextUrl.host;

    return `${getRequestProtocol(request)}://${host}`;
}

function limparCookieAluno(response: NextResponse, request: NextRequest) {
    response.cookies.set("aluno_token", "", {
        httpOnly: true,
        secure: getRequestProtocol(request) === "https",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}

export async function GET(request: NextRequest) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/login";
    const response = NextResponse.redirect(
        new URL(redirectTo, getRequestOrigin(request))
    );

    limparCookieAluno(response, request);

    return response;
}

export async function POST(request: NextRequest) {
    const response = NextResponse.json({
        message: "Logout realizado com sucesso.",
    });

    limparCookieAluno(response, request);

    return response;
}
