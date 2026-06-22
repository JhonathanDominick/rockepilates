"use client";

import { useState, useTransition } from "react";
import { redefinirSenhaAlunoAdmin } from "@/lib/api/admin-alunos-client";

type RedefinirSenhaAlunoAdminFormProps = {
    alunoId: number;
};

export function RedefinirSenhaAlunoAdminForm({
                                                 alunoId,
                                             }: RedefinirSenhaAlunoAdminFormProps) {
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErro(null);
        setSucesso(null);

        if (novaSenha.length < 6) {
            setErro("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não conferem.");
            return;
        }

        startTransition(async () => {
            try {
                await redefinirSenhaAlunoAdmin(alunoId, {
                    novaSenha,
                    confirmarSenha,
                });

                setNovaSenha("");
                setConfirmarSenha("");
                setSucesso("Senha do aluno redefinida com sucesso.");
            } catch (error) {
                console.error(error);

                setErro(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível redefinir a senha do aluno."
                );
            }
        });
    }

    return (
        <section className="mt-6 rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                Acesso do aluno
            </p>

            <h3 className="mt-3 text-xl font-black text-[#10263d]">
                Redefinir senha do aluno
            </h3>

            <p className="mt-2 text-sm text-[#607579]">
                Use esta opção apenas quando o aluno esquecer a senha ou precisar
                de uma nova senha inicial. A senha atual não será exibida.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Nova senha
                        </label>

                        <input
                            type="password"
                            value={novaSenha}
                            onChange={(event) =>
                                setNovaSenha(event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Confirmar nova senha
                        </label>

                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(event) =>
                                setConfirmarSenha(event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] px-4 py-3 text-sm font-semibold text-[#10263d] outline-none transition focus:border-[#0d6666]"
                            placeholder="Repita a nova senha"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                        type="submit"
                        disabled={isPending}
                        className="rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending ? "Redefinindo..." : "Redefinir senha"}
                    </button>
                </div>
            </form>
        </section>
    );
}