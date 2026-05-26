"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
    children: ReactNode;
    status: string;
    inicio?: string;
    fim?: string;
};

export function FinanceiroAlunoClient({
                                          children,
                                          status,
                                          inicio,
                                          fim,
                                      }: Props) {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const [statusAtual, setStatusAtual] = useState(status);
    const [inicioAtual, setInicioAtual] = useState(inicio ?? "");
    const [fimAtual, setFimAtual] = useState(fim ?? "");

    useEffect(() => {
        setStatusAtual(status);
        setInicioAtual(inicio ?? "");
        setFimAtual(fim ?? "");
    }, [status, inicio, fim]);

    function montarUrl(params: {
        status?: string;
        inicio?: string;
        fim?: string;
        page?: number;
    }) {
        const search = new URLSearchParams();

        if (params.status && params.status !== "TODOS") {
            search.set("status", params.status);
        }

        if (params.inicio) {
            search.set("inicio", params.inicio);
        }

        if (params.fim) {
            search.set("fim", params.fim);
        }

        if (params.page && params.page > 0) {
            search.set("page", String(params.page));
        }

        const query = search.toString();

        return query
            ? `/aluno/financeiro?${query}`
            : "/aluno/financeiro";
    }

    function aplicarFiltros(params: {
        status?: string;
        inicio?: string;
        fim?: string;
    }) {
        startTransition(() => {
            router.push(
                montarUrl({
                    status: params.status ?? statusAtual,
                    inicio: params.inicio ?? inicioAtual,
                    fim: params.fim ?? fimAtual,
                    page: 0,
                })
            );
        });
    }

    function alterarStatus(novoStatus: string) {
        setStatusAtual(novoStatus);

        aplicarFiltros({
            status: novoStatus,
            inicio: inicioAtual,
            fim: fimAtual,
        });
    }

    function alterarInicio(novoInicio: string) {
        setInicioAtual(novoInicio);

        aplicarFiltros({
            status: statusAtual,
            inicio: novoInicio,
            fim: fimAtual,
        });
    }

    function alterarFim(novoFim: string) {
        setFimAtual(novoFim);

        aplicarFiltros({
            status: statusAtual,
            inicio: inicioAtual,
            fim: novoFim,
        });
    }

    return (
        <div className="relative">
            {isPending && (
                <div className="pointer-events-none absolute inset-0 z-20 rounded-[28px] bg-white/60 backdrop-blur-[2px]" />
            )}

            <section className="mt-5 rounded-[28px] border border-[#dce8e5] bg-white p-4 shadow-sm md:p-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Status
                        </label>

                        <select
                            name="status"
                            value={statusAtual}
                            onChange={(event) =>
                                alterarStatus(event.target.value)
                            }
                            disabled={isPending}
                            className="mt-2 h-12 w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <option value="TODOS">Todos</option>
                            <option value="PAGO">Pago</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="ATRASADO">Atrasado</option>
                            <option value="AUSENTE">Ausente</option>
                            <option value="CANCELADO">Cancelado</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Data inicial
                        </label>

                        <input
                            name="inicio"
                            type="date"
                            value={inicioAtual}
                            onChange={(event) =>
                                alterarInicio(event.target.value)
                            }
                            disabled={isPending}
                            className="mt-2 h-12 w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666] disabled:cursor-not-allowed disabled:opacity-70"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Data final
                        </label>

                        <input
                            name="fim"
                            type="date"
                            value={fimAtual}
                            onChange={(event) =>
                                alterarFim(event.target.value)
                            }
                            disabled={isPending}
                            className="mt-2 h-12 w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666] disabled:cursor-not-allowed disabled:opacity-70"
                        />
                    </div>
                </div>

                <p className="mt-4 text-xs font-semibold text-[#607579]">
                    {isPending
                        ? "Atualizando histórico..."
                        : "Os filtros são aplicados automaticamente."}
                </p>
            </section>

            <div className={isPending ? "opacity-60 transition" : "transition"}>
                {children}
            </div>
        </div>
    );
}