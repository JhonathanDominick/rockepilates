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

const BFF_URL =
    process.env.BFF_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BFF_URL;

export async function listarDepoimentosAdmin() {
    const res = await fetch(
        `${BFF_URL}/bff/depoimentos/admin`,
        {
            credentials: "include",
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(await extrairErro(res, "Erro ao listar depoimentos"));
    }

    return extrairData(res);
}

export async function aprovarDepoimento(id: number) {
    const res = await fetch(
        `${BFF_URL}/bff/depoimentos/${id}/aprovar`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error(await extrairErro(res, "Erro ao aprovar"));
    }

    return extrairData(res);
}

export async function desaprovarDepoimento(id: number) {
    const res = await fetch(
        `${BFF_URL}/bff/depoimentos/${id}/desaprovar`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error(await extrairErro(res, "Erro ao desaprovar"));
    }

    return extrairData(res);
}