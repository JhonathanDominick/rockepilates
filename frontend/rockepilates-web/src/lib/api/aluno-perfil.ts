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

export async function buscarPerfilAluno() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

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