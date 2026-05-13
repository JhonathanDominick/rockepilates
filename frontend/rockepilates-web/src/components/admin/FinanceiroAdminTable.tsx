"use client";

import { useMemo, useState } from "react";
import type { PagamentoAdmin } from "@/lib/api/admin-financeiro";
import { marcarPagamentoComoPago } from "@/app/admin/financeiro/actions";

type FinanceiroAdminTableProps = {
    pagamentos: PagamentoAdmin[];
};

type StatusFiltro =
    | "TODOS"
    | "PENDENTE"
    | "ATRASADO"
    | "PAGO";

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

function formatarData(data: string | null) {
    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-BR");
}

function getStatusStyle(status: string) {
    switch (status) {
        case "PAGO":
            return "bg-[#dff4ef] text-[#0d6666]";

        case "ATRASADO":
            return "bg-[#ffe2de] text-[#b42318]";

        default:
            return "bg-[#fff4d6] text-[#9a6700]";
    }
}

function podeMarcarComoPago(status: string) {
    return status === "PENDENTE" || status === "ATRASADO";
}

export function FinanceiroAdminTable({
                                         pagamentos,
                                     }: FinanceiroAdminTableProps) {
    const [pagamentoSelecionado, setPagamentoSelecionado] =
        useState<PagamentoAdmin | null>(null);

    const [processandoId, setProcessandoId] =
        useState<number | null>(null);

    const [statusSelecionado, setStatusSelecionado] =
        useState<StatusFiltro>("TODOS");

    const [buscaAluno, setBuscaAluno] = useState("");

    const [planoSelecionado, setPlanoSelecionado] =
        useState("TODOS");

    const pagamentosFiltrados = useMemo(() => {
        return pagamentos.filter((pagamento) => {
            const filtroStatus =
                statusSelecionado === "TODOS"
                    ? true
                    : pagamento.status === statusSelecionado;

            const filtroAluno = pagamento.aluno
                .toLowerCase()
                .includes(buscaAluno.toLowerCase());

            const filtroPlano =
                planoSelecionado === "TODOS"
                    ? true
                    : pagamento.plano === planoSelecionado;

            return (
                filtroStatus &&
                filtroAluno &&
                filtroPlano
            );
        });
    }, [
        pagamentos,
        statusSelecionado,
        buscaAluno,
        planoSelecionado,
    ]);

    async function confirmarPagamento() {
        if (!pagamentoSelecionado) return;

        try {
            setProcessandoId(pagamentoSelecionado.id);

            await marcarPagamentoComoPago(
                pagamentoSelecionado.assinaturaId
            );

            setPagamentoSelecionado(null);
        } finally {
            setProcessandoId(null);
        }
    }

    return (
        <>
            <div className="rounded-[28px] border border-[#e7efec] bg-white p-5">
                <div className="mb-6 grid gap-4 lg:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Status
                        </label>

                        <select
                            value={statusSelecionado}
                            onChange={(event) =>
                                setStatusSelecionado(
                                    event.target.value as StatusFiltro
                                )
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-white px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                        >
                            <option value="TODOS">Todos</option>
                            <option value="PENDENTE">
                                Pendente
                            </option>
                            <option value="ATRASADO">
                                Atrasado
                            </option>
                            <option value="PAGO">
                                Pago
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Buscar aluno
                        </label>

                        <input
                            type="text"
                            placeholder="Digite o nome do aluno"
                            value={buscaAluno}
                            onChange={(event) =>
                                setBuscaAluno(event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-white px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition placeholder:text-[#8ca0a3] focus:border-[#0d6666]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Plano
                        </label>

                        <select
                            value={planoSelecionado}
                            onChange={(event) =>
                                setPlanoSelecionado(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-white px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                        >
                            <option value="TODOS">Todos</option>
                            <option value="MENSAL">
                                Mensal
                            </option>
                            <option value="SEMESTRAL">
                                Semestral
                            </option>
                            <option value="ANUAL">
                                Anual
                            </option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1150px]">
                        <thead>
                        <tr className="border-b border-[#e7efec] text-left">
                            <th className="pb-4 text-xs font-bold uppercase tracking-wide text-[#607579]">
                                Aluno
                            </th>

                            <th className="pb-4 text-xs font-bold uppercase tracking-wide text-[#607579]">
                                Plano
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

                            <th className="pb-4 text-xs font-bold uppercase tracking-wide text-[#607579]">
                                Ações
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {pagamentosFiltrados.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-10 text-center text-sm font-semibold text-[#607579]"
                                >
                                    Nenhum pagamento encontrado
                                    com os filtros selecionados.
                                </td>
                            </tr>
                        ) : (
                            pagamentosFiltrados.map(
                                (pagamento) => (
                                    <tr
                                        key={pagamento.id}
                                        className="border-b border-[#eef3f1]"
                                    >
                                        <td className="py-5 font-bold text-[#10263d]">
                                            {pagamento.aluno}
                                        </td>

                                        <td className="py-5 font-semibold text-[#607579]">
                                            {pagamento.plano}
                                        </td>

                                        <td className="py-5 font-bold text-[#10263d]">
                                            {formatarMoeda(
                                                pagamento.valor
                                            )}
                                        </td>

                                        <td className="py-5">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusStyle(
                                                        pagamento.status
                                                    )}`}
                                                >
                                                    {
                                                        pagamento.status
                                                    }
                                                </span>
                                        </td>

                                        <td className="py-5 text-[#607579]">
                                            {formatarData(
                                                pagamento.dataPagamento
                                            )}
                                        </td>

                                        <td className="py-5 text-[#607579]">
                                            {formatarData(
                                                pagamento.dataVencimento
                                            )}
                                        </td>

                                        <td className="py-5">
                                            {podeMarcarComoPago(
                                                pagamento.status
                                            ) ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPagamentoSelecionado(
                                                            pagamento
                                                        )
                                                    }
                                                    className="rounded-xl bg-[#ef4b3f] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#dc3f34]"
                                                >
                                                    Marcar como
                                                    pago
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold uppercase tracking-wide text-[#7b8d91]">
                                                        Sem ação
                                                    </span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagamentoSelecionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                            Confirmação
                        </p>

                        <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                            Marcar pagamento como pago?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#607579]">
                            Esta ação marcará o pagamento de{" "}
                            <strong>
                                {pagamentoSelecionado.aluno}
                            </strong>{" "}
                            como pago e gerará a próxima
                            cobrança da assinatura.
                        </p>

                        <div className="mt-5 rounded-2xl bg-[#f3faf8] p-4 text-sm text-[#10263d]">
                            <p>
                                <strong>Valor:</strong>{" "}
                                {formatarMoeda(
                                    pagamentoSelecionado.valor
                                )}
                            </p>

                            <p className="mt-2">
                                <strong>Vencimento:</strong>{" "}
                                {formatarData(
                                    pagamentoSelecionado.dataVencimento
                                )}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setPagamentoSelecionado(null)
                                }
                                disabled={
                                    processandoId !== null
                                }
                                className="rounded-xl border border-[#dce8e5] px-4 py-2 text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5] disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={confirmarPagamento}
                                disabled={
                                    processandoId !== null
                                }
                                className="rounded-xl bg-[#ef4b3f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processandoId ===
                                pagamentoSelecionado.id
                                    ? "Processando..."
                                    : "Confirmar pagamento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}