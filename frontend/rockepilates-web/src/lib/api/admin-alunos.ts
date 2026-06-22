import { cookies } from "next/headers";
import type { AlunoAdmin } from "@/components/admin/AlunosAdminTable";
import type { PagamentoHistorico } from "@/lib/api/admin-alunos-client";

function getBffUrl() {
    return process.env.BFF_INTERNAL_URL || process.env.NEXT_PUBLIC_BFF_URL;
}
export type ListarAlunosAdminParams = {
    busca?: string;
    plano?: string;
    statusAssinatura?: string;
    statusFinanceiro?: string;
    page?: number;
    size?: number;
};

export type AlunosAdminPaginadoResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
};

async function extrairErro(res: Response, fallback: string) {
    try {
        const data = await res.json();
        return data?.message || data?.error || fallback;
    } catch {
        return fallback;
    }
}

async function extrairData<T>(res: Response): Promise<T> {
    const data = await res.json();
    return (data?.data ?? data) as T;
}

export async function listarAlunosAdmin(): Promise<AlunoAdmin[]> {
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

    return extrairData<AlunoAdmin[]>(res);
}

export async function buscarAlunoAdminPorId(alunoId: number): Promise<AlunoAdmin | null> {
    const alunos = await listarAlunosAdmin();

    return alunos.find((aluno) => aluno.alunoId === alunoId) ?? null;
}

export async function listarPagamentosPorAssinaturaAdmin(
    assinaturaId: number
): Promise<PagamentoHistorico[]> {
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

    return extrairData<PagamentoHistorico[]>(res);
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

export async function atualizarMensagemProfessoraAdmin(
    alunoId: number,
    mensagemProfessora: string
) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(
        `${getBffUrl()}/bff/alunos/admin/${alunoId}/mensagem-professora`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            body: JSON.stringify({
                mensagemProfessora,
            }),
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(
            await extrairErro(res, "Erro ao atualizar mensagem da professora")
        );
    }
}

export async function listarAlunosAdminPaginado<T = AlunoAdmin>(
    params: ListarAlunosAdminParams
): Promise<AlunosAdminPaginadoResponse<T>> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const searchParams = new URLSearchParams();

    if (params.busca) {
        searchParams.set("busca", params.busca);
    }

    if (params.plano && params.plano !== "TODOS") {
        searchParams.set("plano", params.plano);
    }

    if (
        params.statusAssinatura &&
        params.statusAssinatura !== "TODOS"
    ) {
        searchParams.set("statusAssinatura", params.statusAssinatura);
    }

    if (
        params.statusFinanceiro &&
        params.statusFinanceiro !== "TODOS"
    ) {
        searchParams.set("statusFinanceiro", params.statusFinanceiro);
    }

    searchParams.set("page", String(params.page ?? 0));
    searchParams.set("size", String(params.size ?? 10));

    const res = await fetch(
        `${getBffUrl()}/bff/alunos/admin/paginado?${searchParams.toString()}`,
        {
            headers: {
                Cookie: cookieHeader,
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(
            await extrairErro(
                res,
                "Erro ao listar alunos paginados"
            )
        );
    }

    return extrairData<AlunosAdminPaginadoResponse<T>>(res);
}
