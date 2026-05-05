export async function listarDepoimentosAdmin() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/depoimentos/admin`,
        {
            credentials: "include",
            cache: "no-store",
        }
    );

    if (!res.ok) throw new Error("Erro ao listar depoimentos");

    return res.json();
}

export async function aprovarDepoimento(id: number) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/depoimentos/${id}/aprovar`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    if (!res.ok) throw new Error("Erro ao aprovar");

    return res.json();
}

export async function desaprovarDepoimento(id: number) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/depoimentos/${id}/desaprovar`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    if (!res.ok) throw new Error("Erro ao desaprovar");

    return res.json();
}