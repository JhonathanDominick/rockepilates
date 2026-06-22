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

export async function listarDepoimentosAdmin() {
    const res = await fetch("/api/admin/depoimentos", {
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(await extrairErro(res, "Erro ao listar depoimentos"));
    }

    return extrairData(res);
}

export async function aprovarDepoimento(id: number) {
    const res = await fetch(`/api/admin/depoimentos/${id}/aprovar`, {
        method: "PATCH",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(await extrairErro(res, "Erro ao aprovar"));
    }

    return extrairData(res);
}

export async function desaprovarDepoimento(id: number) {
    const res = await fetch(`/api/admin/depoimentos/${id}/desaprovar`, {
        method: "PATCH",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(await extrairErro(res, "Erro ao desaprovar"));
    }

    return extrairData(res);
}