import { NextRequest, NextResponse } from "next/server";

function getBffUrl() {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

export async function GET(request: NextRequest) {
    try {
        const cookieHeader = request.headers.get("cookie") ?? "";

        const response = await fetch(`${getBffUrl()}/bff/depoimentos/admin`, {
            method: "GET",
            headers: {
                Cookie: cookieHeader,
            },
            cache: "no-store",
        });

        const responseText = await response.text();

        if (!response.ok) {
            return new NextResponse(responseText, {
                status: response.status,
            });
        }

        try {
            return NextResponse.json(JSON.parse(responseText));
        } catch {
            return new NextResponse(responseText, {
                status: response.status,
            });
        }
    } catch (error) {
        console.error("Erro ao listar depoimentos admin:", error);

        return NextResponse.json(
            {
                message: "Erro ao listar depoimentos",
            },
            {
                status: 500,
            }
        );
    }
}