"use client";

import { useState, useTransition } from "react";
import { salvarDadosAlunoAdminAction } from "@/app/admin/alunos/[id]/actions";

type EditarAlunoAdminFormProps = {
    alunoId: number;
    nome: string;
    telefone: string;
    dataNascimento: string;
    objetivo: string;
    observacoesSaude: string;
};

export function EditarAlunoAdminForm({
                                         alunoId,
                                         nome,
                                         telefone,
                                         dataNascimento,
                                         objetivo,
                                         observacoesSaude,
                                     }: EditarAlunoAdminFormProps) {
    const [form, setForm] = useState({
        nome,
        telefone,
        dataNascimento,
        objetivo,
        observacoesSaude,
    });

    const [sucesso, setSucesso] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function atualizarCampo(campo: keyof typeof form, valor: string) {
        setForm((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    }

    function handleSalvar() {
        setErro(null);
        setSucesso(null);

        startTransition(async () => {
            try {
                await salvarDadosAlunoAdminAction(alunoId, form);

                setSucesso("Dados do aluno atualizados com sucesso.");
            } catch (error) {
                console.error(error);

                setErro("Não foi possível atualizar os dados do aluno.");
            }
        });
    }

    return (
        <section className="mt-6 rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                Edição administrativa
            </p>

            <h3 className="mt-3 text-xl font-black text-[#10263d]">
                Dados cadastrais do aluno
            </h3>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                        Nome
                    </label>

                    <input
                        value={form.nome}
                        onChange={(event) =>
                            atualizarCampo("nome", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                        Telefone
                    </label>

                    <input
                        value={form.telefone}
                        onChange={(event) =>
                            atualizarCampo("telefone", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                        Data de nascimento
                    </label>

                    <input
                        type="date"
                        value={form.dataNascimento}
                        onChange={(event) =>
                            atualizarCampo("dataNascimento", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                    />
                </div>
            </div>

            <div className="mt-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                    Objetivo
                </label>

                <textarea
                    value={form.objetivo}
                    onChange={(event) =>
                        atualizarCampo("objetivo", event.target.value)
                    }
                    className="min-h-[130px] w-full rounded-3xl border border-[#dce8e5] bg-[#f8fcfb] px-5 py-4 text-sm text-[#10263d] outline-none transition focus:border-[#0d6666]"
                />
            </div>

            <div className="mt-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                    Observações de saúde
                </label>

                <textarea
                    value={form.observacoesSaude}
                    onChange={(event) =>
                        atualizarCampo("observacoesSaude", event.target.value)
                    }
                    className="min-h-[130px] w-full rounded-3xl border border-[#dce8e5] bg-[#f8fcfb] px-5 py-4 text-sm text-[#10263d] outline-none transition focus:border-[#0d6666]"
                />
            </div>

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
                    {isPending ? "Salvando..." : "Salvar dados"}
                </button>
            </div>
        </section>
    );
}