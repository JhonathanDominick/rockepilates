"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
    children: React.ReactNode;
    status: string;
    inicio?: string;
    fim?: string;
    page: number;
};

export function FinanceiroAlunoClient({
                                          children,
                                          status,
                                          inicio,
                                          fim,
                                          page,
                                      }: Props) {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

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

    function handleSubmit(formData: FormData) {
        const novoStatus = String(formData.get("status") || "TODOS");

        const novoInicio = String(formData.get("inicio") || "");

        const novoFim = String(formData.get("fim") || "");

        startTransition(() => {
            router.push(
                montarUrl({
                    status: novoStatus,
                    inicio: novoInicio,
                    fim: novoFim,
                    page: 0,
                })
            );
        });
    }

    function irParaPagina(novaPagina: number) {
        startTransition(() => {
            router.push(
                montarUrl({
                    status,
                    inicio,
                    fim,
                    page: novaPagina,
                })
            );
        });
    }

    return (
        <div className="relative">

            {isPending && (
                <div className="pointer-events-none absolute inset-0 z-20 rounded-[28px] bg-white/60 backdrop-blur-[2px]" />
            )}

            <form
                action={handleSubmit}
                className="mt-5 rounded-[28px] border border-[#dce8e5] bg-white p-4 shadow-sm md:p-6"
            >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <div>
                        <label className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Status
                        </label>

                        <select
                            name="status"
                            defaultValue={status}
                            className="mt-2 h-12 w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 text-sm outline-none"
                        >
                            <option value="TODOS">Todos</option>
                            <option value="PAGO">Pago</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="ATRASADO">Atrasado</option>
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
                            defaultValue={inicio}
                            className="mt-2 h-12 w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Data final
                        </label>

                        <input
                            name="fim"
                            type="date"
                            defaultValue={fim}
                            className="mt-2 h-12 w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 text-sm outline-none"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="h-12 w-full rounded-2xl bg-[#ef4b3f] text-sm font-bold text-white transition hover:bg-[#dc3f34] disabled:opacity-60"
                        >
                            {isPending
                                ? "Filtrando..."
                                : "Filtrar histórico"}
                        </button>
                    </div>
                </div>
            </form>

            <div className={isPending ? "opacity-60 transition" : "transition"}>
                {children}
            </div>
        </div>
    );
}