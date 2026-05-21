function getPublicBffUrl() {
    return process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";
}

async function extrairErro(res: Response, fallback: string) {
    try {
        const data = await res.json();
        return data?.message || data?.error || fallback;
    } catch {
        return fallback;
    }
}

export type PagamentoHistorico = {
    id: number;
    valor: number;
    dataVencimento: string;
    dataPagamento: string | null;
    status: string;
};

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

export async function listarPagamentosPorAssinatura(
    assinaturaId: number
): Promise<PagamentoHistorico[]> {
    const res = await fetch(
        `${getPublicBffUrl()}/bff/alunos/assinaturas/${assinaturaId}/pagamentos`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error(
            await extrairErro(
                res,
                "Erro ao carregar histórico de pagamentos"
            )
        );
    }

    const response = await res.json();

    return response?.data ?? [];
}

export type CadastroAlunoAdminRequest = {
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    objetivo: string;
    observacoesSaude: string;
    tipoPlano: "MENSAL" | "SEMESTRAL" | "ANUAL";
    dataInicioAssinatura: string;
    pago: boolean;
    senha: string;
    confirmarSenha?: string;
};

export async function cadastrarAlunoAdmin(data: CadastroAlunoAdminRequest) {
    const res = await fetch(`${getPublicBffUrl()}/bff/alunos/admin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(
            await extrairErro(
                res,
                "Erro ao cadastrar aluno pelo admin"
            )
        );
    }
}