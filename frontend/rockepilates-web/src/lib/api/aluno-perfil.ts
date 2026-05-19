import { cookies } from "next/headers";

function getBffUrl() {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

async function extrairErro(response: Response, fallback: string) {
    try {
        const data = await response.json();
        return data?.message || fallback;
    } catch {
        return fallback;
    }
}

async function getCookieHeader() {
    const cookieStore = await cookies();

    return cookieStore.toString();
}

export async function buscarPerfilAluno() {
    const cookieHeader = await getCookieHeader();

    const response = await fetch(`${getBffUrl()}/bff/alunos/me`, {
        headers: {
            Cookie: cookieHeader,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            await extrairErro(response, "Erro ao carregar perfil do aluno")
        );
    }

    const data = await response.json();

    return data?.data ?? data;
}

export async function buscarPagamentosAluno() {
    const cookieHeader = await getCookieHeader();

    const response = await fetch(
        `${getBffUrl()}/bff/alunos/me/pagamentos`,
        {
            headers: {
                Cookie: cookieHeader,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            await extrairErro(
                response,
                "Erro ao carregar histórico financeiro"
            )
        );
    }

    const data = await response.json();

    return data?.data ?? [];
}