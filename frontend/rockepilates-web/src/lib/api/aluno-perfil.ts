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

export type PagamentoAluno = {
    id: number;
    valor: number;
    status: string;
    dataVencimento: string | null;
    dataPagamento: string | null;
};

export type HistoricoPagamentosAlunoPaginado = {
    content: PagamentoAluno[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

export type ResumoFinanceiroAluno = {
    statusFinanceiro: string;
    pagamentosPendentes: number;
    pagamentosAtrasados: number;
    proximoVencimento: string | null;
    ultimoPagamentoConfirmado: string | null;
    statusAssinatura: string;
};

export type BuscarPagamentosPaginadoParams = {
    status?: string;
    inicio?: string;
    fim?: string;
    page?: number;
    size?: number;
};

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

export async function buscarPagamentosAluno(): Promise<PagamentoAluno[]> {
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

export async function buscarPagamentosAlunoPaginado({
                                                        status,
                                                        inicio,
                                                        fim,
                                                        page = 0,
                                                        size = 6,
                                                    }: BuscarPagamentosPaginadoParams = {}): Promise<HistoricoPagamentosAlunoPaginado> {
    const cookieHeader = await getCookieHeader();

    const params = new URLSearchParams();

    if (status && status !== "TODOS") {
        params.set("status", status);
    }

    if (inicio && inicio.trim() !== "") {
        params.set("inicio", inicio);
    }

    if (fim && fim.trim() !== "") {
        params.set("fim", fim);
    }

    params.set("page", String(page));
    params.set("size", String(size));

    const response = await fetch(
        `${getBffUrl()}/bff/alunos/me/pagamentos/paginado?${params.toString()}`,
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
                "Erro ao carregar histórico financeiro paginado"
            )
        );
    }

    const data = await response.json();

    return data?.data ?? data;
}

export async function buscarResumoFinanceiroAluno(): Promise<ResumoFinanceiroAluno> {
    const cookieHeader = await getCookieHeader();

    const response = await fetch(
        `${getBffUrl()}/bff/alunos/me/financeiro/resumo`,
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
                "Erro ao carregar resumo financeiro"
            )
        );
    }

    const data = await response.json();

    return data?.data ?? data;
}