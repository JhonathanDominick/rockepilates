function getPublicBffUrl() {
    return process.env.NEXT_PUBLIC_BFF_URL;
}

async function extrairErro(res: Response, fallback: string) {
    try {
        const data = await res.json();
        return data?.message || data?.error || fallback;
    } catch {
        return fallback;
    }
}

export async function marcarAssinaturaComoPaga(
    assinaturaId: number
) {
    const res = await fetch(
        `${getPublicBffUrl()}/bff/alunos/assinaturas/${assinaturaId}/pagar`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error(
            await extrairErro(
                res,
                "Erro ao marcar assinatura como paga"
            )
        );
    }
}