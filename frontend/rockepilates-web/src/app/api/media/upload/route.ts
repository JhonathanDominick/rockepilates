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
        const cookieHeader = request.headers.get("cookie") ?? "";
        const formData = await request.formData();

        const response = await fetch(`${getBffUrl()}/bff/media/upload`, {
            method: "POST",
            headers: {
                Cookie: cookieHeader,
            },
            body: formData,
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
        console.error("Erro ao fazer proxy do upload de mídia:", error);

        return NextResponse.json(
            {
                message: "Erro ao fazer upload de mídia",
            },
            {
                status: 500,
            }
        );
    }
}