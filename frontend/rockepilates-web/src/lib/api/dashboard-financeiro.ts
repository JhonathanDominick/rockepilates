import { cookies } from "next/headers";

export type PagamentoResumo = {
    id: number;
    aluno: string;
    valor: number;
    status: string;
    dataPagamento: string | null;
    dataVencimento: string;
};

export type FaturamentoMensal = {
    mes: string;
    valor: number;
};

export type DashboardFinanceiro = {
    totalAlunosAtivos: number;
    pagamentosPendentes: number;
    pagamentosAtrasados: number;
    faturamentoRecebidoMes: number;
    faturamentoPrevistoAberto: number;
    ultimosPagamentos: PagamentoResumo[];
    faturamentoMensal: FaturamentoMensal[];
};

function getBaseUrl(): string {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

export async function getDashboardFinanceiro(): Promise<DashboardFinanceiro> {
    const cookieStore = await cookies();

    const response = await fetch(
        `${getBaseUrl()}/bff/dashboard/financeiro`,
        {
            cache: "no-store",
            headers: {
                Cookie: cookieStore.toString(),
            },
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar dashboard financeiro");
    }

    const json = await response.json();

    return json.data;
}