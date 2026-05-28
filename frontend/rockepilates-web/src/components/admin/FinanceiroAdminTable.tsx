"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PagamentoAdmin } from "@/lib/api/admin-financeiro";
import { marcarPagamentoComoPago } from "@/lib/api/admin-alunos-client";

type FinanceiroAdminTableProps = {
    pagamentos: PagamentoAdmin[];
};

type StatusFiltro =
    | "TODOS"
    | "PENDENTE"
    | "ATRASADO"
    | "PAGO"
    | "AUSENTE"
    | "CANCELADO";

type PeriodoFiltro =
    | "TODOS"
    | "VENCE_HOJE"
    | "VENCIDOS"
    | "PROXIMOS_7_DIAS"
    | "ESTE_MES";

type PagamentoComIdentificador = PagamentoAdmin & {
    alunoId?: number | string | null;
    assinaturaId?: number | string | null;
};

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

function formatarData(data: string | null) {
    if (!data) return "-";

    const dataLocal = converterParaDataLocal(data);

    if (!dataLocal) return "-";

    return dataLocal.toLocaleDateString("pt-BR");
}

function hojeIso() {
    return new Date().toISOString().split("T")[0];
}

function normalizarData(data: Date) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function converterParaDataLocal(data: string | null) {
    if (!data) return null;

    const [ano, mes, dia] = data.split("-").map(Number);

    if (!ano || !mes || !dia) return null;

    return new Date(ano, mes - 1, dia);
}

function getStatusStyle(status: string) {
    switch (status) {
        case "PAGO":
            return "bg-[#dff4ef] text-[#0d6666]";
        case "ATRASADO":
            return "bg-[#ffe2de] text-[#b42318]";
        case "AUSENTE":
            return "bg-[#eef1f1] text-[#5f6f72]";
        case "CANCELADO":
            return "bg-[#eef1f1] text-[#5f6f72]";
        default:
            return "bg-[#fff4d6] text-[#9a6700]";
    }
}

function podeMarcarComoPago(status: string) {
    return status === "PENDENTE" || status === "ATRASADO";
}

function filtrarPorPeriodo(
    dataVencimento: string | null,
    periodoSelecionado: PeriodoFiltro
) {
    if (periodoSelecionado === "TODOS") return true;

    const vencimento = converterParaDataLocal(dataVencimento);
    if (!vencimento) return false;

    const hoje = normalizarData(new Date());
    const dataNormalizada = normalizarData(vencimento);

    const proximos7Dias = new Date(hoje);
    proximos7Dias.setDate(hoje.getDate() + 7);

    switch (periodoSelecionado) {
        case "VENCE_HOJE":
            return dataNormalizada.getTime() === hoje.getTime();
        case "VENCIDOS":
            return dataNormalizada < hoje;
        case "PROXIMOS_7_DIAS":
            return dataNormalizada >= hoje && dataNormalizada <= proximos7Dias;
        case "ESTE_MES":
            return (
                dataNormalizada.getMonth() === hoje.getMonth() &&
                dataNormalizada.getFullYear() === hoje.getFullYear()
            );
        default:
            return true;
    }
}

function compararPorVencimentoDesc(
    primeiro: PagamentoAdmin,
    segundo: PagamentoAdmin
) {
    const dataPrimeiro =
        converterParaDataLocal(primeiro.dataVencimento)?.getTime() ?? 0;

    const dataSegundo =
        converterParaDataLocal(segundo.dataVencimento)?.getTime() ?? 0;

    if (dataPrimeiro !== dataSegundo) {
        return dataSegundo - dataPrimeiro;
    }

    return segundo.id - primeiro.id;
}

function getChaveAgrupamentoPagamento(pagamento: PagamentoAdmin) {
    const pagamentoComIdentificador =
        pagamento as PagamentoComIdentificador;

    if (pagamentoComIdentificador.assinaturaId) {
        return `assinatura-${pagamentoComIdentificador.assinaturaId}`;
    }

    if (pagamentoComIdentificador.alunoId) {
        return `aluno-${pagamentoComIdentificador.alunoId}-${pagamento.plano}`;
    }

    return `${pagamento.aluno.toLowerCase().trim()}-${pagamento.plano}`;
}

function manterSomentePagamentoMaisRecentePorAluno(
    pagamentos: PagamentoAdmin[]
) {
    const agrupados = new Map<string, PagamentoAdmin>();

    pagamentos.forEach((pagamento) => {
        const chave = getChaveAgrupamentoPagamento(pagamento);
        const pagamentoAtual = agrupados.get(chave);

        if (!pagamentoAtual) {
            agrupados.set(chave, pagamento);
            return;
        }

        const pagamentoMaisRecente =
            compararPorVencimentoDesc(pagamento, pagamentoAtual) < 0
                ? pagamento
                : pagamentoAtual;

        agrupados.set(chave, pagamentoMaisRecente);
    });

    return Array.from(agrupados.values()).sort(compararPorVencimentoDesc);
}

export function FinanceiroAdminTable({
                                         pagamentos,
                                     }: FinanceiroAdminTableProps) {
    const router = useRouter();

    const [pagamentosAtuais, setPagamentosAtuais] = useState(pagamentos);
    const [pagamentoSelecionado, setPagamentoSelecionado] =
        useState<PagamentoAdmin | null>(null);
    const [processandoId, setProcessandoId] = useState<number | null>(null);
    const [statusSelecionado, setStatusSelecionado] =
        useState<StatusFiltro>("TODOS");
    const [buscaAluno, setBuscaAluno] = useState("");
    const [planoSelecionado, setPlanoSelecionado] = useState("TODOS");
    const [periodoSelecionado, setPeriodoSelecionado] =
        useState<PeriodoFiltro>("TODOS");

    useEffect(() => {
        setPagamentosAtuais(pagamentos);
    }, [pagamentos]);

    const pagamentosFiltrados = useMemo(() => {
        const pagamentosBase =
            statusSelecionado === "TODOS"
                ? manterSomentePagamentoMaisRecentePorAluno(pagamentosAtuais)
                : pagamentosAtuais;

        return pagamentosBase
            .filter((pagamento) => {
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

                const filtroPeriodo = filtrarPorPeriodo(
                    pagamento.dataVencimento,
                    periodoSelecionado
                );

                return (
                    filtroStatus &&
                    filtroAluno &&
                    filtroPlano &&
                    filtroPeriodo
                );
            })
            .sort(compararPorVencimentoDesc);
    }, [
        pagamentosAtuais,
        statusSelecionado,
        buscaAluno,
        planoSelecionado,
        periodoSelecionado,
    ]);

    async function confirmarPagamento() {
        if (!pagamentoSelecionado) return;

        try {
            setProcessandoId(pagamentoSelecionado.id);

            await marcarPagamentoComoPago(pagamentoSelecionado.id);

            setPagamentosAtuais((atuais) =>
                atuais.map((pagamento) => {
                    if (pagamento.id !== pagamentoSelecionado.id) {
                        return pagamento;
                    }

                    return {
                        ...pagamento,
                        status: "PAGO",
                        dataPagamento: hojeIso(),
                    };
                })
            );

            setPagamentoSelecionado(null);
            router.refresh();
        } finally {
            setProcessandoId(null);
        }
    }

    return (
        <>
            <div className="rounded-[28px] border border-[#e7efec] bg-white p-5">
                <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                            <option value="TODOS">
                                Todos — ciclo atual por aluno
                            </option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="ATRASADO">Atrasado</option>
                            <option value="AUSENTE">Ausente</option>
                            <option value="CANCELADO">Cancelado</option>
                            <option value="PAGO">Pago</option>
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
                                setPlanoSelecionado(event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-white px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                        >
                            <option value="TODOS">Todos</option>
                            <option value="MENSAL">Mensal</option>
                            <option value="SEMESTRAL">Semestral</option>
                            <option value="ANUAL">Anual</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Período
                        </label>

                        <select
                            value={periodoSelecionado}
                            onChange={(event) =>
                                setPeriodoSelecionado(
                                    event.target.value as PeriodoFiltro
                                )
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-white px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                        >
                            <option value="TODOS">Todos períodos</option>
                            <option value="VENCE_HOJE">Vence hoje</option>
                            <option value="VENCIDOS">Vencidos</option>
                            <option value="PROXIMOS_7_DIAS">
                                Próximos 7 dias
                            </option>
                            <option value="ESTE_MES">Este mês</option>
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
                                    Nenhum pagamento encontrado com os
                                    filtros selecionados.
                                </td>
                            </tr>
                        ) : (
                            pagamentosFiltrados.map((pagamento) => (
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
                                        {formatarMoeda(pagamento.valor)}
                                    </td>

                                    <td className="py-5">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusStyle(
                                                    pagamento.status
                                                )}`}
                                            >
                                                {pagamento.status}
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
                                                Marcar como pago
                                            </button>
                                        ) : (
                                            <span className="text-xs font-bold uppercase tracking-wide text-[#7b8d91]">
                                                    Sem ação
                                                </span>
                                        )}
                                    </td>
                                </tr>
                            ))
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
                            <strong>{pagamentoSelecionado.aluno}</strong>{" "}
                            como pago. Se este for o ciclo mais recente da
                            assinatura, o sistema poderá gerar a próxima
                            cobrança automaticamente.
                        </p>

                        <div className="mt-5 rounded-2xl bg-[#f3faf8] p-4 text-sm text-[#10263d]">
                            <p>
                                <strong>Valor:</strong>{" "}
                                {formatarMoeda(pagamentoSelecionado.valor)}
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
                                onClick={() => setPagamentoSelecionado(null)}
                                disabled={processandoId !== null}
                                className="rounded-xl border border-[#dce8e5] px-4 py-2 text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5] disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={confirmarPagamento}
                                disabled={processandoId !== null}
                                className="rounded-xl bg-[#ef4b3f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processandoId === pagamentoSelecionado.id
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