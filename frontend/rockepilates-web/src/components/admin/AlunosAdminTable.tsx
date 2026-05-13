"use client";

import { useState } from "react";
import Link from "next/link";
import {
    listarPagamentosPorAssinatura,
    marcarAssinaturaComoPaga,
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
};

type AlunosAdminTableProps = {
    alunosIniciais: AlunoAdmin[];
};

function getStatusClass(status: string) {
    const statusNormalizado = status?.toUpperCase();

    if (statusNormalizado.includes("PENDENTE")) {
        return "bg-[#ffe3dc] text-[#b33127] border-[#ffc8bd]";
    }

    if (
        statusNormalizado.includes("ATIVA") ||
        statusNormalizado.includes("PAGO")
    ) {
        return "bg-[#dff4f2] text-[#0d6666] border-[#b8e5df]";
    }

    if (statusNormalizado.includes("VENCIDA")) {
        return "bg-[#fff1d6] text-[#9a5b00] border-[#ffd98c]";
    }

    if (statusNormalizado.includes("CANCELADA")) {
        return "bg-[#eef1f1] text-[#5f6f72] border-[#d8dddd]";
    }

    return "bg-[#eef7f6] text-[#255252] border-[#cfe7e4]";
}

function podeMarcarComoPago(statusPagamento: string) {
    const statusNormalizado =
        statusPagamento?.toUpperCase();

    return (
        statusNormalizado === "PENDENTE" ||
        statusNormalizado === "ATRASADO"
    );
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

function calcularProximoVencimento(
    dataVencimento: string,
    plano: string
) {
    const data = new Date(`${dataVencimento}T00:00:00`);

    const planoNormalizado = plano?.toUpperCase();

    if (planoNormalizado.includes("MENSAL")) {
        data.setMonth(data.getMonth() + 1);
    } else if (planoNormalizado.includes("SEMESTRAL")) {
        data.setMonth(data.getMonth() + 6);
    } else if (planoNormalizado.includes("ANUAL")) {
        data.setFullYear(data.getFullYear() + 1);
    }

    return data.toISOString().split("T")[0];
}

export function AlunosAdminTable({
                                     alunosIniciais,
                                 }: AlunosAdminTableProps) {
    const [alunos, setAlunos] = useState(alunosIniciais);

    const [assinaturaProcessando, setAssinaturaProcessando] =
        useState<number | null>(null);

    const [erro, setErro] = useState<string | null>(null);

    const [modalAberto, setModalAberto] = useState(false);

    const [alunoSelecionado, setAlunoSelecionado] =
        useState<AlunoAdmin | null>(null);

    const [pagamentos, setPagamentos] = useState<
        PagamentoHistorico[]
    >([]);

    const [carregandoHistorico, setCarregandoHistorico] =
        useState(false);

    const [erroHistorico, setErroHistorico] =
        useState<string | null>(null);

    async function handleMarcarComoPago(
        assinaturaId: number
    ) {
        try {
            setErro(null);

            setAssinaturaProcessando(assinaturaId);

            await marcarAssinaturaComoPaga(assinaturaId);

            setAlunos((alunosAtuais) =>
                alunosAtuais.map((aluno) => {
                    if (
                        aluno.assinaturaId !== assinaturaId
                    ) {
                        return aluno;
                    }

                    const novaDataVencimento =
                        calcularProximoVencimento(
                            aluno.dataVencimento,
                            aluno.plano
                        );

                    return {
                        ...aluno,
                        status: "ATIVA",
                        statusPagamento: "PENDENTE",
                        dataVencimento:
                        novaDataVencimento,
                    };
                })
            );
        } catch (error) {
            console.error(
                "Erro ao marcar assinatura como paga:",
                error
            );

            setErro(
                "Não foi possível marcar a assinatura como paga."
            );
        } finally {
            setAssinaturaProcessando(null);
        }
    }

    async function handleAbrirHistorico(
        aluno: AlunoAdmin
    ) {
        try {
            setErroHistorico(null);

            setAlunoSelecionado(aluno);

            setModalAberto(true);

            setCarregandoHistorico(true);

            setPagamentos([]);

            const data =
                await listarPagamentosPorAssinatura(
                    aluno.assinaturaId
                );

            setPagamentos(data);
        } catch (error) {
            console.error(
                "Erro ao carregar histórico:",
                error
            );

            setErroHistorico(
                "Não foi possível carregar o histórico de pagamentos."
            );
        } finally {
            setCarregandoHistorico(false);
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
                            {alunos.length} aluno(s)
                            encontrado(s)
                        </p>
                    </div>

                    {erro && (
                        <p className="rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-4 py-2 text-sm font-bold text-[#b33127]">
                            {erro}
                        </p>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] text-left text-sm">
                        <thead className="bg-[#eaf7f5] text-xs uppercase tracking-wide text-[#255252]">
                        <tr>
                            <th className="px-5 py-4">
                                Aluno
                            </th>

                            <th className="px-5 py-4">
                                Email
                            </th>

                            <th className="px-5 py-4">
                                Telefone
                            </th>

                            <th className="px-5 py-4">
                                Plano
                            </th>

                            <th className="px-5 py-4">
                                Assinatura
                            </th>

                            <th className="px-5 py-4">
                                Financeiro
                            </th>

                            <th className="px-5 py-4">
                                Vencimento
                            </th>

                            <th className="px-5 py-4 text-right">
                                Ações
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[#e1ece9]">
                        {alunos.map((aluno) => {
                            const processando =
                                assinaturaProcessando ===
                                aluno.assinaturaId;

                            return (
                                <tr
                                    key={
                                        aluno.assinaturaId
                                    }
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
                                                ID aluno:{" "}
                                                {
                                                    aluno.alunoId
                                                }
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-5 text-[#50666a]">
                                        {aluno.email}
                                    </td>

                                    <td className="px-5 py-5 text-[#50666a]">
                                        {
                                            aluno.telefone
                                        }
                                    </td>

                                    <td className="px-5 py-5">
                                            <span className="rounded-full border border-[#b8e5df] bg-[#dff4f2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                                                {
                                                    aluno.plano
                                                }
                                            </span>
                                    </td>

                                    <td className="px-5 py-5">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                                    aluno.status
                                                )}`}
                                            >
                                                {
                                                    aluno.status
                                                }
                                            </span>
                                    </td>

                                    <td className="px-5 py-5">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                                    aluno.statusPagamento
                                                )}`}
                                            >
                                                {
                                                    aluno.statusPagamento
                                                }
                                            </span>
                                    </td>

                                    <td className="px-5 py-5 font-medium text-[#50666a]">
                                        {formatarData(
                                            aluno.dataVencimento
                                        )}
                                    </td>

                                    <td className="px-5 py-5 text-right">
                                        <div className="flex justify-end gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAbrirHistorico(
                                                        aluno
                                                    )
                                                }
                                                className="rounded-2xl border border-[#b8e5df] bg-white px-4 py-2 text-xs font-bold text-[#0d6666] transition hover:-translate-y-[1px] hover:bg-[#eaf7f5]"
                                            >
                                                Histórico
                                            </button>

                                            {podeMarcarComoPago(
                                                aluno.statusPagamento
                                            ) ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleMarcarComoPago(
                                                            aluno.assinaturaId
                                                        )
                                                    }
                                                    disabled={
                                                        processando
                                                    }
                                                    className="rounded-2xl bg-[#ef4b3f] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {processando
                                                        ? "Salvando..."
                                                        : "Marcar como paga"}
                                                </button>
                                            ) : (
                                                <span className="rounded-2xl px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#7b8d91]">
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

            {modalAberto &&
                alunoSelecionado && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-3xl rounded-[28px] border border-[#dce8e5] bg-white shadow-2xl">
                            <div className="flex items-start justify-between gap-4 border-b border-[#dce8e5] px-6 py-5">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                                        Histórico financeiro
                                    </p>

                                    <h3 className="mt-2 text-2xl font-bold text-[#10263d]">
                                        {
                                            alunoSelecionado.nome
                                        }
                                    </h3>

                                    <p className="mt-1 text-sm text-[#607579]">
                                        Assinatura #
                                        {
                                            alunoSelecionado.assinaturaId
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleFecharModal
                                    }
                                    className="rounded-full border border-[#dce8e5] px-4 py-2 text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5]"
                                >
                                    Fechar
                                </button>
                            </div>

                            <div className="px-6 py-5">
                                {carregandoHistorico && (
                                    <p className="text-sm font-medium text-[#607579]">
                                        Carregando histórico...
                                    </p>
                                )}

                                {erroHistorico && (
                                    <p className="rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-4 py-3 text-sm font-bold text-[#b33127]">
                                        {
                                            erroHistorico
                                        }
                                    </p>
                                )}

                                {!carregandoHistorico &&
                                    !erroHistorico && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[650px] text-left text-sm">
                                                <thead className="bg-[#eaf7f5] text-xs uppercase tracking-wide text-[#255252]">
                                                <tr>
                                                    <th className="px-4 py-3">
                                                        Pagamento
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
                                                </tr>
                                                </thead>

                                                <tbody className="divide-y divide-[#e1ece9]">
                                                {pagamentos.map(
                                                    (
                                                        pagamento
                                                    ) => (
                                                        <tr
                                                            key={
                                                                pagamento.id
                                                            }
                                                        >
                                                            <td className="px-4 py-4 font-bold text-[#10263d]">
                                                                #
                                                                {
                                                                    pagamento.id
                                                                }
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
                                                        </tr>
                                                    )
                                                )}

                                                {pagamentos.length ===
                                                    0 && (
                                                        <tr>
                                                            <td
                                                                colSpan={
                                                                    5
                                                                }
                                                                className="px-4 py-8 text-center text-[#607579]"
                                                            >
                                                                Nenhum pagamento encontrado.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}