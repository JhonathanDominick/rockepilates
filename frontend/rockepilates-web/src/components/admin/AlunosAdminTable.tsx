"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    listarPagamentosPorAssinatura,
    marcarPagamentoComoAusente,
    reverterPagamentoAusenteParaPendente,
    marcarPagamentoComoPago,
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
    pagamentoAtualId: number | null;
    statusPagamentoAtual: string;
    dataVencimento: string;
    dataCancelamento: string | null;
};

type AlunosAdminTableProps = {
    alunosIniciais: AlunoAdmin[];
    filtros: {
        busca: string;
        plano: string;
        statusAssinatura: string;
        statusFinanceiro: string;
        size: number;
    };
    paginacao: {
        totalElements: number;
        totalPages: number;
        currentPage: number;
        size: number;
        first: boolean;
        last: boolean;
    };
};

type ConfirmacaoPagamento = {
    tipo: "principal" | "historico";
    aluno?: AlunoAdmin;
    pagamentoId?: number;
    nomeAluno: string;
    dataVencimento: string;
    valor?: number;
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
        statusNormalizado.includes("PAGO") ||
        statusNormalizado.includes("EM_DIA") ||
        statusNormalizado.includes("EM DIA")
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

function podeMarcarComoPago(aluno: AlunoAdmin) {
    const statusPagamentoNormalizado = normalizarStatus(aluno.statusPagamento);
    const statusPagamentoAtualNormalizado = normalizarStatus(
        aluno.statusPagamentoAtual
    );
    const statusAssinaturaNormalizado = normalizarStatus(aluno.status);

    if (statusAssinaturaNormalizado === "CANCELADA") {
        return false;
    }

    if (!aluno.pagamentoAtualId) {
        return false;
    }

    const statusGeralPermite =
        statusPagamentoNormalizado === "PENDENTE" ||
        statusPagamentoNormalizado === "ATRASADO";

    const pagamentoAtualPermite =
        statusPagamentoAtualNormalizado === "PENDENTE" ||
        statusPagamentoAtualNormalizado === "ATRASADO";

    return statusGeralPermite && pagamentoAtualPermite;
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
        statusAssinatura === "CANCELADA"
    ) {
        return false;
    }

    return pagamento.dataVencimento === aluno.dataVencimento;
}

function isPagamentoVencido(dataVencimento: string) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento = new Date(`${dataVencimento}T00:00:00`);

    return vencimento < hoje;
}

function isPagamentoNoMesAtual(dataVencimento: string) {
    const hoje = new Date();
    const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const vencimento = new Date(`${dataVencimento}T00:00:00`);

    return vencimento >= inicioMesAtual && vencimento <= fimMesAtual;
}

function resolverStatusFinanceiroLocal(
    pagamentos: PagamentoHistorico[],
    statusAssinatura: string
) {
    if (normalizarStatus(statusAssinatura) === "CANCELADA") {
        return "CANCELADO";
    }

    if (pagamentos.length === 0) {
        return "SEM_PAGAMENTO";
    }

    const possuiAtrasado = pagamentos.some((pagamento) => {
        const status = normalizarStatus(pagamento.status);

        return (
            status === "ATRASADO" ||
            (status === "PENDENTE" &&
                isPagamentoVencido(pagamento.dataVencimento))
        );
    });

    if (possuiAtrasado) {
        return "ATRASADO";
    }

    const possuiPendenteMesAtual = pagamentos.some((pagamento) => {
        return (
            normalizarStatus(pagamento.status) === "PENDENTE" &&
            isPagamentoNoMesAtual(pagamento.dataVencimento)
        );
    });

    if (possuiPendenteMesAtual) {
        return "PENDENTE";
    }

    const pagamentosOrdenados =
        ordenarPagamentosPorVencimentoDesc(pagamentos);

    const ultimoPagamento = pagamentosOrdenados[0];

    if (normalizarStatus(ultimoPagamento.status) === "AUSENTE") {
        return "AUSENTE";
    }

    if (normalizarStatus(ultimoPagamento.status) === "CANCELADO") {
        return "CANCELADO";
    }

    return "EM_DIA";
}

function resolverVencimentoAtualLocal(pagamentos: PagamentoHistorico[]) {
    const pagamentosOrdenados =
        ordenarPagamentosPorVencimentoDesc(pagamentos);

    return pagamentosOrdenados[0]?.dataVencimento ?? "";
}

function resolverPagamentoAtualLocal(pagamentos: PagamentoHistorico[]) {
    const pagamentosOrdenados =
        ordenarPagamentosPorVencimentoDesc(pagamentos);

    return pagamentosOrdenados[0] ?? null;
}

export function AlunosAdminTable({
                                     alunosIniciais,
                                     filtros,
                                     paginacao,
                                 }: AlunosAdminTableProps) {
    const [alunos, setAlunos] = useState(alunosIniciais);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [busca, setBusca] = useState(filtros.busca);
    const [plano, setPlano] = useState(filtros.plano);
    const [statusAssinatura, setStatusAssinatura] = useState(
        filtros.statusAssinatura
    );
    const [statusFinanceiro, setStatusFinanceiro] = useState(
        filtros.statusFinanceiro
    );
    const [size, setSize] = useState(String(filtros.size));
    const [processandoId, setProcessandoId] = useState<number | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] =
        useState<AlunoAdmin | null>(null);
    const [pagamentos, setPagamentos] = useState<PagamentoHistorico[]>([]);
    const [carregandoHistorico, setCarregandoHistorico] = useState(false);
    const [erroHistorico, setErroHistorico] = useState<string | null>(null);
    const [confirmacaoPagamento, setConfirmacaoPagamento] =
        useState<ConfirmacaoPagamento | null>(null);

    useEffect(() => {
        setAlunos(alunosIniciais);
    }, [alunosIniciais]);

    const pagamentosOrdenados = ordenarPagamentosPorVencimentoDesc(pagamentos);

    const totalPago = somarPorStatus(pagamentos, "PAGO");
    const totalPendente = somarPorStatus(pagamentos, "PENDENTE");
    const totalAtrasado = somarPorStatus(pagamentos, "ATRASADO");
    const totalAusente = somarPorStatus(pagamentos, "AUSENTE");
    const totalCancelado = somarPorStatus(pagamentos, "CANCELADO");

    function montarQueryParams(
        overrides: Record<string, string | number | null>
    ) {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(overrides).forEach(([key, value]) => {
            if (
                value === null ||
                value === "" ||
                value === "TODOS"
            ) {
                params.delete(key);
                return;
            }

            params.set(key, String(value));
        });

        return params.toString();
    }

    function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const query = montarQueryParams({
            busca: busca.trim(),
            plano,
            statusAssinatura,
            statusFinanceiro,
            size,
            page: 0,
        });

        router.push(`/admin/alunos${query ? `?${query}` : ""}`);
    }

    function limparFiltros() {
        setBusca("");
        setPlano("TODOS");
        setStatusAssinatura("TODOS");
        setStatusFinanceiro("TODOS");
        setSize("10");

        router.push("/admin/alunos");
    }

    function irParaPagina(page: number) {
        const query = montarQueryParams({
            page: Math.max(page, 0),
            size,
        });

        router.push(`/admin/alunos${query ? `?${query}` : ""}`);
    }

    async function handleMarcarComoPago(aluno: AlunoAdmin) {
        if (!aluno.pagamentoAtualId) {
            setErro("Pagamento atual não encontrado para este aluno.");
            return;
        }

        try {
            setErro(null);
            setProcessandoId(aluno.pagamentoAtualId);

            await marcarPagamentoComoPago(aluno.pagamentoAtualId);

            const pagamentosAtualizados =
                await listarPagamentosPorAssinatura(aluno.assinaturaId);

            const novoStatus = resolverStatusFinanceiroLocal(
                pagamentosAtualizados,
                aluno.status
            );

            const novoVencimento =
                resolverVencimentoAtualLocal(pagamentosAtualizados);

            const pagamentoAtual =
                resolverPagamentoAtualLocal(pagamentosAtualizados);

            setAlunos((alunosAtuais) =>
                alunosAtuais.map((alunoAtual) => {
                    if (alunoAtual.assinaturaId !== aluno.assinaturaId) {
                        return alunoAtual;
                    }

                    return {
                        ...alunoAtual,
                        status: "ATIVA",
                        statusPagamento: novoStatus,
                        pagamentoAtualId: pagamentoAtual?.id ?? null,
                        statusPagamentoAtual:
                            pagamentoAtual?.status ?? "SEM_PAGAMENTO",
                        dataVencimento:
                            novoVencimento || alunoAtual.dataVencimento,
                        dataCancelamento: null,
                    };
                })
            );
        } catch (error) {
            console.error("Erro ao marcar pagamento atual como pago:", error);
            setErro("Não foi possível marcar o pagamento atual como pago.");
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

    async function handleMarcarPagamentoComoPago(pagamentoId: number) {
        try {
            setErroHistorico(null);
            setProcessandoId(pagamentoId);

            await marcarPagamentoComoPago(pagamentoId);

            if (!alunoSelecionado) {
                return;
            }

            const pagamentosAtualizados =
                await listarPagamentosPorAssinatura(
                    alunoSelecionado.assinaturaId
                );

            const novoStatus = resolverStatusFinanceiroLocal(
                pagamentosAtualizados,
                alunoSelecionado.status
            );

            const novoVencimento =
                resolverVencimentoAtualLocal(pagamentosAtualizados);

            const pagamentoAtual =
                resolverPagamentoAtualLocal(pagamentosAtualizados);

            setPagamentos(pagamentosAtualizados);

            setAlunos((alunosAtuais) =>
                alunosAtuais.map((aluno) => {
                    if (aluno.assinaturaId !== alunoSelecionado.assinaturaId) {
                        return aluno;
                    }

                    return {
                        ...aluno,
                        statusPagamento: novoStatus,
                        pagamentoAtualId: pagamentoAtual?.id ?? null,
                        statusPagamentoAtual:
                            pagamentoAtual?.status ?? "SEM_PAGAMENTO",
                        dataVencimento: novoVencimento || aluno.dataVencimento,
                    };
                })
            );

            setAlunoSelecionado((atual) => {
                if (!atual) {
                    return atual;
                }

                return {
                    ...atual,
                    statusPagamento: novoStatus,
                    pagamentoAtualId: pagamentoAtual?.id ?? null,
                    statusPagamentoAtual:
                        pagamentoAtual?.status ?? "SEM_PAGAMENTO",
                    dataVencimento: novoVencimento || atual.dataVencimento,
                };
            });
        } catch (error) {
            console.error(
                "Erro ao marcar pagamento como pago:",
                error
            );

            setErroHistorico(
                "Não foi possível marcar o pagamento como pago."
            );
        } finally {
            setProcessandoId(null);
        }
    }

    async function handleMarcarPagamentoComoAusente(pagamentoId: number) {
        try {
            setErroHistorico(null);
            setProcessandoId(pagamentoId);

            await marcarPagamentoComoAusente(pagamentoId);

            if (!alunoSelecionado) {
                return;
            }

            const pagamentosAtualizados =
                await listarPagamentosPorAssinatura(
                    alunoSelecionado.assinaturaId
                );

            const novoStatus = resolverStatusFinanceiroLocal(
                pagamentosAtualizados,
                alunoSelecionado.status
            );

            const novoVencimento =
                resolverVencimentoAtualLocal(pagamentosAtualizados);

            const pagamentoAtual =
                resolverPagamentoAtualLocal(pagamentosAtualizados);

            setPagamentos(pagamentosAtualizados);

            setAlunos((alunosAtuais) =>
                alunosAtuais.map((aluno) => {
                    if (aluno.assinaturaId !== alunoSelecionado.assinaturaId) {
                        return aluno;
                    }

                    return {
                        ...aluno,
                        statusPagamento: novoStatus,
                        pagamentoAtualId: pagamentoAtual?.id ?? null,
                        statusPagamentoAtual:
                            pagamentoAtual?.status ?? "SEM_PAGAMENTO",
                        dataVencimento: novoVencimento || aluno.dataVencimento,
                    };
                })
            );

            setAlunoSelecionado((atual) => {
                if (!atual) {
                    return atual;
                }

                return {
                    ...atual,
                    statusPagamento: novoStatus,
                    pagamentoAtualId: pagamentoAtual?.id ?? null,
                    statusPagamentoAtual:
                        pagamentoAtual?.status ?? "SEM_PAGAMENTO",
                    dataVencimento: novoVencimento || atual.dataVencimento,
                };
            });
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

            if (!alunoSelecionado) {
                return;
            }

            const pagamentosAtualizados =
                await listarPagamentosPorAssinatura(
                    alunoSelecionado.assinaturaId
                );

            const novoStatus = resolverStatusFinanceiroLocal(
                pagamentosAtualizados,
                alunoSelecionado.status
            );

            const novoVencimento =
                resolverVencimentoAtualLocal(pagamentosAtualizados);

            const pagamentoAtual =
                resolverPagamentoAtualLocal(pagamentosAtualizados);

            setPagamentos(pagamentosAtualizados);

            setAlunos((alunosAtuais) =>
                alunosAtuais.map((aluno) => {
                    if (aluno.assinaturaId !== alunoSelecionado.assinaturaId) {
                        return aluno;
                    }

                    return {
                        ...aluno,
                        statusPagamento: novoStatus,
                        pagamentoAtualId: pagamentoAtual?.id ?? null,
                        statusPagamentoAtual:
                            pagamentoAtual?.status ?? "SEM_PAGAMENTO",
                        dataVencimento: novoVencimento || aluno.dataVencimento,
                    };
                })
            );

            setAlunoSelecionado((atual) => {
                if (!atual) {
                    return atual;
                }

                return {
                    ...atual,
                    statusPagamento: novoStatus,
                    pagamentoAtualId: pagamentoAtual?.id ?? null,
                    statusPagamentoAtual:
                        pagamentoAtual?.status ?? "SEM_PAGAMENTO",
                    dataVencimento: novoVencimento || atual.dataVencimento,
                };
            });
        } catch (error) {
            console.error("Erro ao reverter pagamento ausente:", error);
            setErroHistorico(
                "Não foi possível reverter o pagamento para pendente."
            );
        } finally {
            setProcessandoId(null);
        }
    }

    function abrirConfirmacaoPagamentoPrincipal(aluno: AlunoAdmin) {
        setConfirmacaoPagamento({
            tipo: "principal",
            aluno,
            nomeAluno: aluno.nome,
            dataVencimento: aluno.dataVencimento,
        });
    }

    function abrirConfirmacaoPagamentoHistorico(pagamento: PagamentoHistorico) {
        setConfirmacaoPagamento({
            tipo: "historico",
            pagamentoId: pagamento.id,
            nomeAluno: alunoSelecionado?.nome ?? "aluno selecionado",
            dataVencimento: pagamento.dataVencimento,
            valor: pagamento.valor,
        });
    }

    function fecharConfirmacaoPagamento() {
        if (processandoId !== null) {
            return;
        }

        setConfirmacaoPagamento(null);
    }

    async function confirmarPagamento() {
        if (!confirmacaoPagamento) {
            return;
        }

        if (confirmacaoPagamento.tipo === "principal") {
            if (!confirmacaoPagamento.aluno) {
                return;
            }

            await handleMarcarComoPago(confirmacaoPagamento.aluno);
            setConfirmacaoPagamento(null);
            return;
        }

        if (!confirmacaoPagamento.pagamentoId) {
            return;
        }

        await handleMarcarPagamentoComoPago(confirmacaoPagamento.pagamentoId);
        setConfirmacaoPagamento(null);
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
            <form
                onSubmit={aplicarFiltros}
                className="mb-5 rounded-[28px] border border-[#dce8e5] bg-white p-5 shadow-sm"
            >
                <div className="grid gap-4 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Buscar aluno
                        </label>

                        <input
                            type="text"
                            value={busca}
                            onChange={(event) =>
                                setBusca(event.target.value)
                            }
                            placeholder="Nome, e-mail ou telefone"
                            className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Plano
                        </label>

                        <select
                            value={plano}
                            onChange={(event) =>
                                setPlano(event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                        >
                            <option value="TODOS">Todos</option>
                            <option value="MENSAL">Mensal</option>
                            <option value="SEMESTRAL">Semestral</option>
                            <option value="ANUAL">Anual</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Assinatura
                        </label>

                        <select
                            value={statusAssinatura}
                            onChange={(event) =>
                                setStatusAssinatura(event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                        >
                            <option value="TODOS">Todas</option>
                            <option value="ATIVA">Ativa</option>
                            <option value="CANCELADA">Cancelada</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Financeiro
                        </label>

                        <select
                            value={statusFinanceiro}
                            onChange={(event) =>
                                setStatusFinanceiro(event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                        >
                            <option value="TODOS">Todos</option>
                            <option value="EM_DIA">Em dia</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="ATRASADO">Atrasado</option>
                            <option value="AUSENTE">Ausente</option>
                            <option value="CANCELADO">Cancelado</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="w-full sm:max-w-[180px]">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Por página
                        </label>

                        <select
                            value={size}
                            onChange={(event) =>
                                setSize(event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={limparFiltros}
                            className="rounded-2xl border border-[#dce8e5] bg-white px-5 py-3 text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5]"
                        >
                            Limpar filtros
                        </button>

                        <button
                            type="submit"
                            className="rounded-2xl bg-[#0d6666] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#0d6666]/20 transition hover:-translate-y-[1px] hover:bg-[#095252]"
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </div>
            </form>

            <div className="overflow-hidden rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] shadow-sm">
                <div className="flex flex-col gap-2 border-b border-[#dce8e5] px-5 py-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-[#10263d]">
                            Lista de alunos
                        </h2>

                        <p className="mt-1 text-sm text-[#607579]">
                            {paginacao.totalElements} aluno(s) encontrado(s)
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
                                processandoId === aluno.assinaturaId ||
                                processandoId === aluno.pagamentoAtualId;

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

                                            {podeMarcarComoPago(aluno) ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        abrirConfirmacaoPagamentoPrincipal(
                                                            aluno
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

            <div className="mt-4 flex flex-col gap-3 rounded-[24px] border border-[#dce8e5] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-[#607579]">
                    Página{" "}
                    <span className="font-black text-[#10263d]">
                        {paginacao.totalPages === 0
                            ? 0
                            : paginacao.currentPage + 1}
                    </span>{" "}
                    de{" "}
                    <span className="font-black text-[#10263d]">
                        {paginacao.totalPages}
                    </span>
                </p>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            irParaPagina(paginacao.currentPage - 1)
                        }
                        disabled={paginacao.first}
                        className="rounded-2xl border border-[#dce8e5] bg-white px-4 py-2 text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            irParaPagina(paginacao.currentPage + 1)
                        }
                        disabled={paginacao.last}
                        className="rounded-2xl border border-[#dce8e5] bg-white px-4 py-2 text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Próxima
                    </button>
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
                                                                <div className="flex flex-wrap gap-2">
                                                                    {podeMarcarAusente && (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    abrirConfirmacaoPagamentoHistorico(
                                                                                        pagamento
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    processandoId === pagamento.id
                                                                                }
                                                                                className="rounded-xl bg-[#ef4b3f] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                                                                            >
                                                                                {processandoId === pagamento.id
                                                                                    ? "Salvando..."
                                                                                    : "Marcar pago"}
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleMarcarPagamentoComoAusente(
                                                                                        pagamento.id
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    processandoId === pagamento.id
                                                                                }
                                                                                className="rounded-xl border border-[#d8dddd] bg-[#eef1f1] px-3 py-2 text-xs font-bold text-[#5f6f72] transition hover:bg-[#e1e6e6] disabled:cursor-not-allowed disabled:opacity-60"
                                                                            >
                                                                                Marcar ausente
                                                                            </button>
                                                                        </>
                                                                    )}

                                                                    {podeReverterAusente && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleReverterPagamentoAusenteParaPendente(
                                                                                    pagamento.id
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                processandoId === pagamento.id
                                                                            }
                                                                            className="rounded-xl border border-[#ffd98c] bg-[#fff1d6] px-3 py-2 text-xs font-bold text-[#9a5b00] transition hover:bg-[#ffe7b3] disabled:cursor-not-allowed disabled:opacity-60"
                                                                        >
                                                                            {processandoId === pagamento.id
                                                                                ? "Salvando..."
                                                                                : "Reverter para pendente"}
                                                                        </button>
                                                                    )}

                                                                    {!podeMarcarAusente &&
                                                                        !podeReverterAusente && (
                                                                            <span className="text-xs font-bold uppercase tracking-wide text-[#7b8d91]">
                                                                                    Sem ação
                                                                                </span>
                                                                        )}
                                                                </div>
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

            {confirmacaoPagamento && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-lg rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-2xl">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef4b3f]">
                                Confirmar pagamento
                            </p>

                            <h3 className="mt-2 text-2xl font-black text-[#10263d]">
                                Deseja realmente marcar este pagamento como pago?
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-[#607579]">
                                Essa ação vai registrar o pagamento do aluno(a){" "}
                                <strong className="text-[#10263d]">
                                    {confirmacaoPagamento.nomeAluno}
                                </strong>{" "}
                                com vencimento em{" "}
                                <strong className="text-[#10263d]">
                                    {formatarData(
                                        confirmacaoPagamento.dataVencimento
                                    )}
                                </strong>
                                .
                            </p>

                            {confirmacaoPagamento.valor !== undefined && (
                                <p className="mt-2 text-sm leading-6 text-[#607579]">
                                    Valor do ciclo:{" "}
                                    <strong className="text-[#10263d]">
                                        {formatarMoeda(
                                            confirmacaoPagamento.valor
                                        )}
                                    </strong>
                                </p>
                            )}

                            <p className="mt-4 rounded-2xl border border-[#ffd98c] bg-[#fff1d6] px-4 py-3 text-sm font-bold text-[#9a5b00]">
                                Atenção: atualmente não existe botão para
                                desfazer esta ação. Confirme apenas se o
                                pagamento realmente foi recebido.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={fecharConfirmacaoPagamento}
                                disabled={processandoId !== null}
                                className="rounded-2xl border border-[#dce8e5] bg-white px-5 py-3 text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Fechar
                            </button>

                            <button
                                type="button"
                                onClick={confirmarPagamento}
                                disabled={processandoId !== null}
                                className="rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processandoId !== null
                                    ? "Confirmando..."
                                    : "Confirmar pagamento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}