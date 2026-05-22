"use client";

import { useState } from "react";
import Link from "next/link";
import {
    listarPagamentosPorAssinatura,
    marcarAssinaturaComoPaga,
    marcarPagamentoComoAusente,
    reverterPagamentoAusenteParaPendente,
    PagamentoHistorico,
} from "@/lib/api/admin-alunos-client";

export type AlunoAdmin = {
    assinaturaId: number;
    alunoId: number;
    nome: string;
    email: string;
    telefone: string;
    plano: string;
    status: string;
    statusPagamento: string;
    dataVencimento: string;
    dataCancelamento: string | null;
};

type AlunosAdminTableProps = {
    alunosIniciais: AlunoAdmin[];
};

function normalizarStatus(status: string | null | undefined) {
    return status?.toUpperCase() ?? "";
}

function getStatusClass(status: string) {
    const statusNormalizado = normalizarStatus(status);

    if (statusNormalizado.includes("ATRASADO")) {
        return "bg-[#ffe3dc] text-[#b33127] border-[#ffc8bd]";
    }

    if (statusNormalizado.includes("PENDENTE")) {
        return "bg-[#fff1d6] text-[#9a5b00] border-[#ffd98c]";
    }

    if (statusNormalizado.includes("AUSENTE")) {
        return "bg-[#eef1f1] text-[#5f6f72] border-[#d8dddd]";
    }

    if (
        statusNormalizado.includes("ATIVA") ||
        statusNormalizado.includes("PAGO")
    ) {
        return "bg-[#dff4f2] text-[#0d6666] border-[#b8e5df]";
    }

    if (
        statusNormalizado.includes("CANCELADA") ||
        statusNormalizado.includes("CANCELADO")
    ) {
        return "bg-[#eef1f1] text-[#5f6f72] border-[#d8dddd]";
    }

    return "bg-[#eef7f6] text-[#255252] border-[#cfe7e4]";
}

function podeMarcarComoPago(statusPagamento: string, statusAssinatura: string) {
    const statusPagamentoNormalizado = normalizarStatus(statusPagamento);
    const statusAssinaturaNormalizado = normalizarStatus(statusAssinatura);

    if (statusAssinaturaNormalizado === "CANCELADA") {
        return false;
    }

    return (
        statusPagamentoNormalizado === "PENDENTE" ||
        statusPagamentoNormalizado === "ATRASADO"
    );
}

function podeMarcarPagamentoComoAusente(statusPagamento: string) {
    const statusPagamentoNormalizado = normalizarStatus(statusPagamento);

    return (
        statusPagamentoNormalizado === "PENDENTE" ||
        statusPagamentoNormalizado === "ATRASADO"
    );
}

function podeReverterPagamentoAusente(statusPagamento: string) {
    return normalizarStatus(statusPagamento) === "AUSENTE";
}

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

function calcularProximoVencimento(dataVencimento: string, plano: string) {
    const data = new Date(`${dataVencimento}T00:00:00`);
    const planoNormalizado = normalizarStatus(plano);

    if (planoNormalizado.includes("MENSAL")) {
        data.setMonth(data.getMonth() + 1);
    } else if (planoNormalizado.includes("SEMESTRAL")) {
        data.setMonth(data.getMonth() + 6);
    } else if (planoNormalizado.includes("ANUAL")) {
        data.setFullYear(data.getFullYear() + 1);
    }

    return data.toISOString().split("T")[0];
}

function ordenarPagamentosPorVencimentoDesc(pagamentos: PagamentoHistorico[]) {
    return [...pagamentos].sort((a, b) => {
        return b.dataVencimento.localeCompare(a.dataVencimento);
    });
}

function somarPorStatus(pagamentos: PagamentoHistorico[], status: string) {
    return pagamentos
        .filter((pagamento) => normalizarStatus(pagamento.status) === status)
        .reduce((total, pagamento) => total + pagamento.valor, 0);
}

function isPagamentoAtual(
    pagamento: PagamentoHistorico,
    aluno: AlunoAdmin | null
) {
    if (!aluno) {
        return false;
    }

    const statusPagamento = normalizarStatus(pagamento.status);
    const statusAssinatura = normalizarStatus(aluno.status);

    if (
        statusPagamento === "CANCELADO" ||
        statusPagamento === "AUSENTE" ||
        statusAssinatura === "CANCELADA"
    ) {
        return false;
    }

    return (
        pagamento.dataVencimento === aluno.dataVencimento &&
        statusPagamento === normalizarStatus(aluno.statusPagamento)
    );
}

export function AlunosAdminTable({ alunosIniciais }: AlunosAdminTableProps) {
    const [alunos, setAlunos] = useState(alunosIniciais);
    const [processandoId, setProcessandoId] = useState<number | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] =
        useState<AlunoAdmin | null>(null);
    const [pagamentos, setPagamentos] = useState<PagamentoHistorico[]>([]);
    const [carregandoHistorico, setCarregandoHistorico] = useState(false);
    const [erroHistorico, setErroHistorico] = useState<string | null>(null);

    const pagamentosOrdenados = ordenarPagamentosPorVencimentoDesc(pagamentos);

    const totalPago = somarPorStatus(pagamentos, "PAGO");
    const totalPendente = somarPorStatus(pagamentos, "PENDENTE");
    const totalAtrasado = somarPorStatus(pagamentos, "ATRASADO");
    const totalAusente = somarPorStatus(pagamentos, "AUSENTE");
    const totalCancelado = somarPorStatus(pagamentos, "CANCELADO");

    async function handleMarcarComoPago(assinaturaId: number) {
        try {
            setErro(null);
            setProcessandoId(assinaturaId);

            await marcarAssinaturaComoPaga(assinaturaId);

            setAlunos((alunosAtuais) =>
                alunosAtuais.map((aluno) => {
                    if (aluno.assinaturaId !== assinaturaId) {
                        return aluno;
                    }

                    const novaDataVencimento = calcularProximoVencimento(
                        aluno.dataVencimento,
                        aluno.plano
                    );

                    return {
                        ...aluno,
                        status: "ATIVA",
                        statusPagamento: "PENDENTE",
                        dataVencimento: novaDataVencimento,
                        dataCancelamento: null,
                    };
                })
            );
        } catch (error) {
            console.error("Erro ao marcar assinatura como paga:", error);
            setErro("Não foi possível marcar a assinatura como paga.");
        } finally {
            setProcessandoId(null);
        }
    }

    async function handleAbrirHistorico(aluno: AlunoAdmin) {
        try {
            setErroHistorico(null);
            setAlunoSelecionado(aluno);
            setModalAberto(true);
            setCarregandoHistorico(true);
            setPagamentos([]);

            const data = await listarPagamentosPorAssinatura(aluno.assinaturaId);

            setPagamentos(data);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
            setErroHistorico(
                "Não foi possível carregar o histórico de pagamentos."
            );
        } finally {
            setCarregandoHistorico(false);
        }
    }

    async function handleMarcarPagamentoComoAusente(pagamentoId: number) {
        try {
            setErroHistorico(null);
            setProcessandoId(pagamentoId);

            await marcarPagamentoComoAusente(pagamentoId);

            setPagamentos((pagamentosAtuais) =>
                pagamentosAtuais.map((pagamento) => {
                    if (pagamento.id !== pagamentoId) {
                        return pagamento;
                    }

                    return {
                        ...pagamento,
                        status: "AUSENTE",
                        dataPagamento: null,
                    };
                })
            );

            setAlunos((alunosAtuais) =>
                alunosAtuais.map((aluno) => {
                    if (aluno.assinaturaId !== alunoSelecionado?.assinaturaId) {
                        return aluno;
                    }

                    return {
                        ...aluno,
                        statusPagamento: "AUSENTE",
                    };
                })
            );
        } catch (error) {
            console.error("Erro ao marcar pagamento como ausente:", error);
            setErroHistorico("Não foi possível marcar o pagamento como ausente.");
        } finally {
            setProcessandoId(null);
        }
    }

    async function handleReverterPagamentoAusenteParaPendente(pagamentoId: number) {
        try {
            setErroHistorico(null);
            setProcessandoId(pagamentoId);

            await reverterPagamentoAusenteParaPendente(pagamentoId);

            setPagamentos((pagamentosAtuais) =>
                pagamentosAtuais.map((pagamento) => {
                    if (pagamento.id !== pagamentoId) {
                        return pagamento;
                    }

                    return {
                        ...pagamento,
                        status: "PENDENTE",
                        dataPagamento: null,
                    };
                })
            );

            setAlunos((alunosAtuais) =>
                alunosAtuais.map((aluno) => {
                    if (aluno.assinaturaId !== alunoSelecionado?.assinaturaId) {
                        return aluno;
                    }

                    return {
                        ...aluno,
                        statusPagamento: "PENDENTE",
                    };
                })
            );
        } catch (error) {
            console.error("Erro ao reverter pagamento ausente:", error);
            setErroHistorico(
                "Não foi possível reverter o pagamento para pendente."
            );
        } finally {
            setProcessandoId(null);
        }
    }

    function handleFecharModal() {
        setModalAberto(false);
        setAlunoSelecionado(null);
        setPagamentos([]);
        setErroHistorico(null);
        setCarregandoHistorico(false);
    }

    return (
        <>
            <div className="overflow-hidden rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] shadow-sm">
                <div className="flex flex-col gap-2 border-b border-[#dce8e5] px-5 py-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-[#10263d]">
                            Lista de alunos
                        </h2>

                        <p className="mt-1 text-sm text-[#607579]">
                            {alunos.length} aluno(s) encontrado(s)
                        </p>
                    </div>

                    {erro && (
                        <p className="rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-4 py-2 text-sm font-bold text-[#b33127]">
                            {erro}
                        </p>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left text-sm">
                        <thead className="bg-[#eaf7f5] text-xs uppercase tracking-wide text-[#255252]">
                        <tr>
                            <th className="px-5 py-4">Aluno</th>
                            <th className="px-4 py-4">Contato</th>
                            <th className="px-5 py-4">Plano</th>
                            <th className="px-5 py-4">Assinatura</th>
                            <th className="px-5 py-4">Financeiro</th>
                            <th className="px-5 py-4">Vencimento</th>
                            <th className="px-5 py-4">Cancelamento</th>
                            <th className="px-4 py-4 text-right">Ações</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[#e1ece9]">
                        {alunos.map((aluno) => {
                            const processando =
                                processandoId === aluno.assinaturaId;

                            return (
                                <tr
                                    key={aluno.assinaturaId}
                                    className="transition hover:bg-[#f0faf8]"
                                >
                                    <td className="px-5 py-5">
                                        <div>
                                            <Link
                                                href={`/admin/alunos/${aluno.alunoId}`}
                                                className="font-bold text-[#10263d] transition hover:text-[#ef4b3f]"
                                            >
                                                {aluno.nome}
                                            </Link>

                                            <p className="mt-1 text-xs text-[#7b8d91]">
                                                ID aluno: {aluno.alunoId}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-4 py-5">
                                        <div className="max-w-[220px] space-y-1">
                                            <p className="truncate text-[#50666a]">
                                                {aluno.email}
                                            </p>

                                            <p className="text-xs text-[#7b8d91]">
                                                {aluno.telefone}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-5">
                                            <span className="rounded-full border border-[#b8e5df] bg-[#dff4f2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                                                {aluno.plano}
                                            </span>
                                    </td>

                                    <td className="px-5 py-5">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                                    aluno.status
                                                )}`}
                                            >
                                                {aluno.status}
                                            </span>
                                    </td>

                                    <td className="px-5 py-5">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                                    aluno.statusPagamento
                                                )}`}
                                            >
                                                {aluno.statusPagamento}
                                            </span>
                                    </td>

                                    <td className="px-5 py-5 font-medium text-[#50666a]">
                                        {formatarData(aluno.dataVencimento)}
                                    </td>

                                    <td className="px-5 py-5 font-medium text-[#50666a]">
                                        {normalizarStatus(aluno.status) ===
                                        "CANCELADA"
                                            ? formatarData(
                                                aluno.dataCancelamento
                                            )
                                            : "-"}
                                    </td>

                                    <td className="px-4 py-5 text-right">
                                        <div className="flex flex-col items-end gap-2 xl:flex-row xl:justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAbrirHistorico(
                                                        aluno
                                                    )
                                                }
                                                className="min-w-[110px] rounded-2xl border border-[#b8e5df] bg-white px-4 py-2 text-xs font-bold text-[#0d6666] transition hover:-translate-y-[1px] hover:bg-[#eaf7f5]"
                                            >
                                                Histórico
                                            </button>

                                            {podeMarcarComoPago(
                                                aluno.statusPagamento,
                                                aluno.status
                                            ) ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleMarcarComoPago(
                                                            aluno.assinaturaId
                                                        )
                                                    }
                                                    disabled={processando}
                                                    className="min-w-[120px] rounded-2xl bg-[#ef4b3f] px-3 py-2 text-xs font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {processando
                                                        ? "Salvando..."
                                                        : "Marcar como paga"}
                                                </button>
                                            ) : (
                                                <span className="min-w-[110px] rounded-2xl px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-[#7b8d91]">
                                                        Sem ação
                                                    </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {alunos.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-5 py-10 text-center text-[#607579]"
                                >
                                    Nenhum aluno encontrado.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalAberto && alunoSelecionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#dce8e5] bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] px-6 py-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                                    Histórico financeiro
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-[#10263d]">
                                    {alunoSelecionado.nome}
                                </h3>

                                <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                                    <span className="rounded-full border border-[#b8e5df] bg-[#dff4f2] px-3 py-1 text-[#0d6666]">
                                        Plano {alunoSelecionado.plano}
                                    </span>

                                    <span
                                        className={`rounded-full border px-3 py-1 ${getStatusClass(
                                            alunoSelecionado.status
                                        )}`}
                                    >
                                        Assinatura {alunoSelecionado.status}
                                    </span>

                                    <span
                                        className={`rounded-full border px-3 py-1 ${getStatusClass(
                                            alunoSelecionado.statusPagamento
                                        )}`}
                                    >
                                        Financeiro{" "}
                                        {alunoSelecionado.statusPagamento}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-[#607579]">
                                    Assinatura #{alunoSelecionado.assinaturaId} ·
                                    Vencimento atual{" "}
                                    {formatarData(
                                        alunoSelecionado.dataVencimento
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleFecharModal}
                                className="rounded-full border border-[#dce8e5] px-4 py-2 text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5]"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                            {carregandoHistorico && (
                                <p className="text-sm font-medium text-[#607579]">
                                    Carregando histórico...
                                </p>
                            )}

                            {erroHistorico && (
                                <p className="rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-4 py-3 text-sm font-bold text-[#b33127]">
                                    {erroHistorico}
                                </p>
                            )}

                            {!carregandoHistorico && !erroHistorico && (
                                <>
                                    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                        <div className="rounded-3xl border border-[#b8e5df] bg-[#dff4f2] p-4">
                                            <p className="text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                                                Pago
                                            </p>
                                            <p className="mt-2 text-lg font-black text-[#10263d]">
                                                {formatarMoeda(totalPago)}
                                            </p>
                                        </div>

                                        <div className="rounded-3xl border border-[#ffd98c] bg-[#fff1d6] p-4">
                                            <p className="text-xs font-bold uppercase tracking-wide text-[#9a5b00]">
                                                Pendente
                                            </p>
                                            <p className="mt-2 text-lg font-black text-[#10263d]">
                                                {formatarMoeda(totalPendente)}
                                            </p>
                                        </div>

                                        <div className="rounded-3xl border border-[#ffc8bd] bg-[#ffe3dc] p-4">
                                            <p className="text-xs font-bold uppercase tracking-wide text-[#b33127]">
                                                Atrasado
                                            </p>
                                            <p className="mt-2 text-lg font-black text-[#10263d]">
                                                {formatarMoeda(totalAtrasado)}
                                            </p>
                                        </div>

                                        <div className="rounded-3xl border border-[#d8dddd] bg-[#f5f6f6] p-4">
                                            <p className="text-xs font-bold uppercase tracking-wide text-[#5f6f72]">
                                                Ausente
                                            </p>
                                            <p className="mt-2 text-lg font-black text-[#10263d]">
                                                {formatarMoeda(totalAusente)}
                                            </p>
                                        </div>

                                        <div className="rounded-3xl border border-[#d8dddd] bg-[#eef1f1] p-4">
                                            <p className="text-xs font-bold uppercase tracking-wide text-[#5f6f72]">
                                                Cancelado
                                            </p>
                                            <p className="mt-2 text-lg font-black text-[#10263d]">
                                                {formatarMoeda(totalCancelado)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto rounded-3xl border border-[#dce8e5]">
                                        <table className="w-full min-w-[860px] text-left text-sm">
                                            <thead className="bg-[#eaf7f5] text-xs uppercase tracking-wide text-[#255252]">
                                            <tr>
                                                <th className="px-4 py-3">
                                                    Pagamento
                                                </th>
                                                <th className="px-4 py-3">
                                                    Plano
                                                </th>
                                                <th className="px-4 py-3">
                                                    Valor
                                                </th>
                                                <th className="px-4 py-3">
                                                    Vencimento
                                                </th>
                                                <th className="px-4 py-3">
                                                    Pago em
                                                </th>
                                                <th className="px-4 py-3">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3">
                                                    Ações
                                                </th>
                                            </tr>
                                            </thead>

                                            <tbody className="divide-y divide-[#e1ece9]">
                                            {pagamentosOrdenados.map(
                                                (pagamento) => {
                                                    const pagamentoAtual =
                                                        isPagamentoAtual(
                                                            pagamento,
                                                            alunoSelecionado
                                                        );

                                                    const podeMarcarAusente =
                                                        podeMarcarPagamentoComoAusente(
                                                            pagamento.status
                                                        );

                                                    const podeReverterAusente =
                                                        podeReverterPagamentoAusente(
                                                            pagamento.status
                                                        );

                                                    return (
                                                        <tr
                                                            key={
                                                                pagamento.id
                                                            }
                                                            className={
                                                                pagamentoAtual
                                                                    ? "bg-[#f0faf8]"
                                                                    : "bg-white"
                                                            }
                                                        >
                                                            <td className="px-4 py-4">
                                                                <div className="font-bold text-[#10263d]">
                                                                    #
                                                                    {
                                                                        pagamento.id
                                                                    }
                                                                </div>

                                                                {pagamentoAtual && (
                                                                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#ef4b3f]">
                                                                        Pagamento
                                                                        atual
                                                                    </p>
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-4">
                                                                    <span className="rounded-full border border-[#b8e5df] bg-[#dff4f2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                                                                        {
                                                                            alunoSelecionado.plano
                                                                        }
                                                                    </span>
                                                            </td>

                                                            <td className="px-4 py-4 font-medium text-[#50666a]">
                                                                {formatarMoeda(
                                                                    pagamento.valor
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-4 text-[#50666a]">
                                                                {formatarData(
                                                                    pagamento.dataVencimento
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-4 text-[#50666a]">
                                                                {formatarData(
                                                                    pagamento.dataPagamento
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-4">
                                                                    <span
                                                                        className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                                                            pagamento.status
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            pagamento.status
                                                                        }
                                                                    </span>
                                                            </td>

                                                            <td className="px-4 py-4">
                                                                {podeMarcarAusente ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleMarcarPagamentoComoAusente(
                                                                                pagamento.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processandoId ===
                                                                            pagamento.id
                                                                        }
                                                                        className="rounded-xl border border-[#d8dddd] bg-[#eef1f1] px-3 py-2 text-xs font-bold text-[#5f6f72] transition hover:bg-[#e1e6e6] disabled:cursor-not-allowed disabled:opacity-60"
                                                                    >
                                                                        {processandoId === pagamento.id
                                                                            ? "Salvando..."
                                                                            : "Marcar ausente"}
                                                                    </button>
                                                                ) : podeReverterAusente ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleReverterPagamentoAusenteParaPendente(
                                                                                pagamento.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processandoId ===
                                                                            pagamento.id
                                                                        }
                                                                        className="rounded-xl border border-[#ffd98c] bg-[#fff1d6] px-3 py-2 text-xs font-bold text-[#9a5b00] transition hover:bg-[#ffe7b3] disabled:cursor-not-allowed disabled:opacity-60"
                                                                    >
                                                                        {processandoId === pagamento.id
                                                                            ? "Salvando..."
                                                                            : "Reverter para pendente"}
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-xs font-bold uppercase tracking-wide text-[#7b8d91]">
                                                                          Sem ação
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}

                                            {pagamentosOrdenados.length ===
                                                0 && (
                                                    <tr>
                                                        <td
                                                            colSpan={7}
                                                            className="px-4 py-10 text-center"
                                                        >
                                                            <p className="font-bold text-[#10263d]">
                                                                Nenhum pagamento
                                                                encontrado.
                                                            </p>
                                                            <p className="mt-1 text-sm text-[#607579]">
                                                                Quando houver
                                                                cobranças
                                                                geradas para
                                                                esta assinatura,
                                                                elas aparecerão
                                                                aqui.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}