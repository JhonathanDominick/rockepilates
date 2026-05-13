import { cookies } from "next/headers";

export type PagamentoAdmin = {
    id: number;
    assinaturaId: number;
    aluno: string;
    plano: string;
    valor: number;
    status: string;
    dataPagamento: string | null;
    dataVencimento: string;
};

export type FinanceiroResumo = {
    recebidoMes: number;
    pendenteMes: number;
    atrasadoMes: number;
};

export type FinanceiroAdmin = {
    resumo: FinanceiroResumo;
    pagamentos: PagamentoAdmin[];
};

function getBaseUrl(): string {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

export async function listarPagamentosAdmin(): Promise<FinanceiroAdmin> {
    const cookieStore = await cookies();

    const response = await fetch(
        `${getBaseUrl()}/bff/financeiro/pagamentos`,
        {
            cache: "no-store",
            headers: {
                Cookie: cookieStore.toString(),
            },
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao listar pagamentos");
    }

    const json = await response.json();

    return json.data;
}