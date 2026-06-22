import { AdminLayout } from "@/components/admin/AdminLayout";
import { getDashboardFinanceiro } from "@/lib/api/dashboard-financeiro";
import { FaturamentoMensalChart } from "@/components/admin/FaturamentoMensalChart";

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

function formatarData(data: string | null) {
    if (!data) {
        return "-";
    }

    return data.split("-").reverse().join("/");
}

function getStatusClass(status: string) {
    const statusNormalizado = status?.toUpperCase() ?? "";

    if (statusNormalizado === "PAGO") {
        return "bg-[#dff4ef] text-[#0d6666]";
    }

    if (statusNormalizado === "ATRASADO") {
        return "bg-[#ffe2de] text-[#b42318]";
    }

    if (statusNormalizado === "AUSENTE") {
        return "bg-[#eef1f1] text-[#5f6f72]";
    }

    if (statusNormalizado === "CANCELADO") {
        return "bg-[#eef1f1] text-[#5f6f72]";
    }

    return "bg-[#fff4d6] text-[#9a6700]";
}

export default async function DashboardFinanceiroPage() {
    const dashboard = await getDashboardFinanceiro();

    const cards = [
        ["Alunos ativos", dashboard.totalAlunosAtivos],
        ["Pendentes em aberto", dashboard.pagamentosPendentes],
        ["Atrasados em aberto", dashboard.pagamentosAtrasados],
        ["Recebido no mês", formatarMoeda(dashboard.faturamentoRecebidoMes)],
        ["Total em aberto", formatarMoeda(dashboard.faturamentoPrevistoAberto)],
    ];

    return (
        <AdminLayout
            title="Dashboard financeiro"
            description="Visão geral financeira da operação da RockerPilates."
        >
            <div className="space-y-8">
                <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                    {cards.map(([titulo, valor]) => (
                        <div
                            key={titulo}
                            className="rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] p-5 shadow-sm sm:p-6"
                        >
                            <p className="text-sm font-bold uppercase tracking-wide text-[#607579]">
                                {titulo}
                            </p>

                            <p className="mt-4 text-[clamp(1.75rem,2.4vw,2.5rem)] font-black leading-tight text-[#10263d]">
                                {valor}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="rounded-[32px] border border-[#dce8e5] bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-6">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0d6666]">
                            Faturamento
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-[#10263d]">
                            Faturamento mensal
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[700px]">
                            <FaturamentoMensalChart
                                data={dashboard.faturamentoMensal}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-[32px] border border-[#dce8e5] bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-6">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0d6666]">
                            Financeiro
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-[#10263d]">
                            Últimos registros financeiros
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                            <tr className="border-b border-[#e7efec] text-left">
                                <th className="pb-4 text-xs font-bold uppercase tracking-wide text-[#607579]">
                                    Aluno
                                </th>
                                <th className="pb-4 text-xs font-bold uppercase tracking-wide text-[#607579]">
                                    Valor
                                </th>
                                <th className="pb-4 text-xs font-bold uppercase tracking-wide text-[#607579]">
                                    Status
                                </th>
                                <th className="pb-4 text-xs font-bold uppercase tracking-wide text-[#607579]">
                                    Pagamento
                                </th>
                                <th className="pb-4 text-xs font-bold uppercase tracking-wide text-[#607579]">
                                    Vencimento
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {dashboard.ultimosPagamentos.map((pagamento) => (
                                <tr
                                    key={pagamento.id}
                                    className="border-b border-[#eef3f1]"
                                >
                                    <td className="py-5 font-bold text-[#10263d]">
                                        {pagamento.aluno}
                                    </td>

                                    <td className="py-5 font-semibold text-[#10263d]">
                                        {formatarMoeda(pagamento.valor)}
                                    </td>

                                    <td className="py-5">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusClass(
                                                    pagamento.status
                                                )}`}
                                            >
                                                {pagamento.status}
                                            </span>
                                    </td>

                                    <td className="py-5 text-[#607579]">
                                        {formatarData(pagamento.dataPagamento)}
                                    </td>

                                    <td className="py-5 text-[#607579]">
                                        {formatarData(pagamento.dataVencimento)}
                                    </td>
                                </tr>
                            ))}

                            {dashboard.ultimosPagamentos.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-10 text-center text-sm font-semibold text-[#607579]"
                                    >
                                        Nenhum registro financeiro encontrado.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}