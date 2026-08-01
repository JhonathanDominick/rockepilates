import { NextRequest, NextResponse } from "next/server";

function getBffUrl() {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();

        const response = await fetch(`${getBffUrl()}/bff/usuarios/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
            cache: "no-store",
        });

        const responseBody = await response.text();
        const nextResponse = new NextResponse(responseBody, {
            status: response.status,
        });

        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader) {
            nextResponse.headers.set("set-cookie", setCookieHeader);
        }

        return nextResponse;
    } catch (error) {
        console.error("Erro ao fazer proxy do login admin:", error);

        return NextResponse.json(
            { message: "Erro ao fazer login administrativo" },
            { status: 500 }
        );
    }
}
