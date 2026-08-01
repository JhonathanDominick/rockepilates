import { NextResponse } from "next/server";

function getBffUrl() {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

export async function POST() {
    try {
        const response = await fetch(`${getBffUrl()}/bff/usuarios/logout`, {
            method: "POST",
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
        console.error("Erro ao fazer proxy do logout admin:", error);

        return NextResponse.json(
            { message: "Erro ao sair do painel administrativo" },
            { status: 500 }
        );
    }
}
