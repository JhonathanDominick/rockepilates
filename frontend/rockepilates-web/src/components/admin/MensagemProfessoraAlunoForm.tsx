"use client";

import { useState, useTransition } from "react";
import { salvarMensagemProfessoraAction } from "@/app/admin/alunos/[id]/actions";

type MensagemProfessoraAlunoFormProps = {
    alunoId: number;
    valorInicial: string;
};

export function MensagemProfessoraAlunoForm({
                                                alunoId,
                                                valorInicial,
                                            }: MensagemProfessoraAlunoFormProps) {
    const [mensagem, setMensagem] = useState(valorInicial);

    const [sucesso, setSucesso] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleSalvar() {
        setErro(null);
        setSucesso(null);

        startTransition(async () => {
            try {
                await salvarMensagemProfessoraAction(
                    alunoId,
                    mensagem
                );

                setSucesso(
                    "Mensagem da professora salva com sucesso."
                );
            } catch (error) {
                console.error(error);

                setErro(
                    "Não foi possível salvar a mensagem da professora."
                );
            }
        });
    }

    return (
        <section className="mt-6 rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                Mensagem para o aluno
            </p>

            <h3 className="mt-3 text-xl font-black text-[#10263d]">
                Recado visível no perfil do aluno
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#607579]">
                Esta mensagem aparece para o aluno dentro da área dele.
                Use para orientações, lembretes, avisos ou acompanhamentos.
                Não use este campo para observações internas privadas.
            </p>

            <textarea
                value={mensagem}
                onChange={(event) =>
                    setMensagem(event.target.value)
                }
                placeholder="Digite uma mensagem que o aluno poderá visualizar..."
                className="mt-5 min-h-[180px] w-full rounded-3xl border border-[#dce8e5] bg-[#f8fcfb] px-5 py-4 text-sm text-[#10263d] outline-none transition placeholder:text-[#8ca0a3] focus:border-[#0d6666]"
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
                    className="rounded-2xl bg-[#0d6666] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#0d6666]/20 transition hover:-translate-y-[1px] hover:bg-[#095454] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending
                        ? "Salvando..."
                        : "Salvar mensagem"}
                </button>
            </div>
        </section>
    );
}