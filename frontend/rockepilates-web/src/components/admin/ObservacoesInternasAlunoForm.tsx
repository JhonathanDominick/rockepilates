"use client";

import { useState, useTransition } from "react";
import { salvarObservacoesInternasAction } from "@/app/admin/alunos/[id]/actions";

type ObservacoesInternasAlunoFormProps = {
    alunoId: number;
    valorInicial: string;
};

export function ObservacoesInternasAlunoForm({
                                                 alunoId,
                                                 valorInicial,
                                             }: ObservacoesInternasAlunoFormProps) {
    const [observacoes, setObservacoes] =
        useState(valorInicial);

    const [sucesso, setSucesso] =
        useState<string | null>(null);

    const [erro, setErro] =
        useState<string | null>(null);

    const [isPending, startTransition] =
        useTransition();

    async function handleSalvar() {
        setErro(null);
        setSucesso(null);

        startTransition(async () => {
            try {
                await salvarObservacoesInternasAction(
                    alunoId,
                    observacoes
                );

                setSucesso(
                    "Observações internas salvas com sucesso."
                );
            } catch (error) {
                console.error(error);

                setErro(
                    "Não foi possível salvar as observações internas."
                );
            }
        });
    }

    return (
        <section className="mt-6 rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                Observações internas
            </p>

            <h3 className="mt-3 text-xl font-black text-[#10263d]">
                Anotações da professora/admin
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#607579]">
                Espaço interno para registrar evolução,
                cuidados, limitações, observações e
                mensagens administrativas do aluno.
            </p>

            <textarea
                value={observacoes}
                onChange={(event) =>
                    setObservacoes(event.target.value)
                }
                placeholder="Digite observações internas sobre o aluno..."
                className="mt-5 min-h-[220px] w-full rounded-3xl border border-[#dce8e5] bg-[#f8fcfb] px-5 py-4 text-sm text-[#10263d] outline-none transition placeholder:text-[#8ca0a3] focus:border-[#0d6666]"
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    {sucesso && (
                        <p className="text-sm font-bold text-[#0d6666]">
                            {sucesso}
                        </p>
                    )}

                    {erro && (
                        <p className="text-sm font-bold text-[#b33127]">
                            {erro}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSalvar}
                    disabled={isPending}
                    className="rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending
                        ? "Salvando..."
                        : "Salvar observações"}
                </button>
            </div>
        </section>
    );
}