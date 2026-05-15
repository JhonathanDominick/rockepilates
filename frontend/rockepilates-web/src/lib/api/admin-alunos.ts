import { cookies } from "next/headers";

function getBffUrl() {
    return process.env.BFF_INTERNAL_URL || process.env.NEXT_PUBLIC_BFF_URL;
}

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

    const res = await fetch(`${getBffUrl()}/bff/alunos/admin`, {
        headers: {
            Cookie: cookieHeader,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(await extrairErro(res, "Erro ao listar alunos"));
    }

    return extrairData(res);
}

export async function buscarAlunoAdminPorId(alunoId: number) {
    const alunos = await listarAlunosAdmin();

    return alunos.find((aluno: any) => aluno.alunoId === alunoId) ?? null;
}

export async function listarPagamentosPorAssinaturaAdmin(assinaturaId: number) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(
        `${getBffUrl()}/bff/alunos/assinaturas/${assinaturaId}/pagamentos`,
        {
            headers: {
                Cookie: cookieHeader,
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(
            await extrairErro(res, "Erro ao listar pagamentos da assinatura")
        );
    }

    return extrairData(res);
}

export async function atualizarObservacoesInternasAdmin(
    alunoId: number,
    observacoesInternas: string
) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(
        `${getBffUrl()}/bff/alunos/admin/${alunoId}/observacoes-internas`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            body: JSON.stringify({
                observacoesInternas,
            }),
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(
            await extrairErro(res, "Erro ao atualizar observações internas")
        );
    }
}

export type AtualizarAlunoAdminPayload = {
    nome: string;
    telefone: string;
    dataNascimento: string;
    objetivo: string;
    observacoesSaude: string;
};

export async function atualizarAlunoAdmin(
    alunoId: number,
    payload: AtualizarAlunoAdminPayload
) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(
        `${getBffUrl()}/bff/alunos/admin/${alunoId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(
            await extrairErro(res, "Erro ao atualizar aluno")
        );
    }
}

export async function cancelarAssinaturaAdmin(
    assinaturaId: number
) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(
        `${getBffUrl()}/bff/alunos/assinaturas/${assinaturaId}/cancelar`,
        {
            method: "PATCH",
            headers: {
                Cookie: cookieHeader,
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(
            await extrairErro(res, "Erro ao cancelar assinatura")
        );
    }
}