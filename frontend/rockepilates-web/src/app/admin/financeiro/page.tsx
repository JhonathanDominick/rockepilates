import { AdminLayout } from "@/components/admin/AdminLayout";
import { FinanceiroAdminTable } from "@/components/admin/FinanceiroAdminTable";
import {
    listarPagamentosAdmin,
    type PagamentoAdmin,
} from "@/lib/api/admin-financeiro";

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

export default async function FinanceiroPage() {
    let pagamentos: PagamentoAdmin[] = [];

    let resumoFinanceiro = {
        recebidoMes: 0,
        pendenteMes: 0,
        atrasadoMes: 0,
    };

    try {
        const financeiro = await listarPagamentosAdmin();

        pagamentos = financeiro.pagamentos;
        resumoFinanceiro = financeiro.resumo;
    } catch (error) {
        console.error("Erro ao listar pagamentos:", error);
    }

    const resumo = [
        ["Recebido no mês", resumoFinanceiro.recebidoMes],
        ["Pendente no mês", resumoFinanceiro.pendenteMes],
        ["Atrasado em aberto", resumoFinanceiro.atrasadoMes],
    ];

    return (
        <AdminLayout
            title="Financeiro"
            description="Gestão financeira e pagamentos da RockerPilates."
        >
            <div className="space-y-6">
                <div className="grid gap-5 xl:grid-cols-3">
                    {resumo.map(([titulo, valor]) => (
                        <div
                            key={titulo}
                            className="rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] p-6 shadow-sm"
                        >
                            <p className="text-sm font-bold uppercase tracking-wide text-[#607579]">
                                {titulo}
                            </p>

                            <p className="mt-4 text-[clamp(1.75rem,2.4vw,2.5rem)] font-black leading-tight text-[#10263d]">
                                {formatarMoeda(Number(valor))}
                            </p>
                        </div>
                    ))}
                </div>

                <FinanceiroAdminTable pagamentos={pagamentos} />
            </div>
        </AdminLayout>
    );
}