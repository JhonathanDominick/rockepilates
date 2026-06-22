import { NextRequest, NextResponse } from "next/server";

function getBffUrl() {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const cookieHeader = request.headers.get("cookie") ?? "";

        const response = await fetch(
            `${getBffUrl()}/bff/depoimentos/${id}/desaprovar`,
            {
                method: "PATCH",
                headers: {
                    Cookie: cookieHeader,
                },
                cache: "no-store",
            }
        );

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
        console.error("Erro ao desaprovar depoimento:", error);

        return NextResponse.json(
            {
                message: "Erro ao desaprovar depoimento",
            },
            {
                status: 500,
            }
        );
    }
}