import { cookies } from "next/headers";

async function extrairErro(res: Response, fallback: string) {
    try {
        const data = await res.json();
        return data?.message || data?.error || fallback;
    } catch {
        return fallback;
    }
}

async function extrairData(res: Response) {
    const data = await res.json();
    return data?.data ?? data;
}

export async function listarAlunosAdmin() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/alunos/admin`,
        {
            headers: {
                Cookie: cookieHeader,
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(await extrairErro(res, "Erro ao listar alunos"));
    }

    return extrairData(res);
}