"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    alterarSenhaAluno,
    logoutAluno,
} from "@/lib/api/aluno-perfil-client";

export function AlterarSenhaForm() {
    const router = useRouter();

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            setLoading(true);
            setErro(null);
            setSucesso(null);

            if (novaSenha.length < 6) {
                setErro("A nova senha deve ter pelo menos 6 caracteres.");
                return;
            }

            if (novaSenha !== confirmarSenha) {
                setErro("As senhas não coincidem.");
                return;
            }

            await alterarSenhaAluno({
                senhaAtual,
                novaSenha,
            });

            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");

            setSucesso(
                "Senha alterada com sucesso. Você será redirecionado para fazer login novamente."
            );

            await logoutAluno();

            router.replace("/login");
            router.refresh();
        } catch (error) {
            console.error("Erro ao alterar senha:", error);

            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível alterar a senha."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="mt-6 rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                    Segurança
                </p>

                <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                    Alterar senha
                </h2>

                <p className="mt-2 text-sm text-[#607579]">
                    Use sua senha atual para definir uma nova senha de acesso ao
                    portal. Após a alteração, será necessário fazer login
                    novamente.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-4 md:grid-cols-3"
            >
                <div>
                    <label className="mb-2 block text-sm font-bold text-[#10263d]">
                        Senha atual
                    </label>

                    <input
                        type="password"
                        value={senhaAtual}
                        onChange={(event) => setSenhaAtual(event.target.value)}
                        required
                        disabled={loading}
                        className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20 disabled:cursor-not-allowed disabled:opacity-70"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-[#10263d]">
                        Nova senha
                    </label>

                    <input
                        type="password"
                        value={novaSenha}
                        onChange={(event) => setNovaSenha(event.target.value)}
                        required
                        minLength={6}
                        disabled={loading}
                        className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20 disabled:cursor-not-allowed disabled:opacity-70"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-[#10263d]">
                        Confirmar nova senha
                    </label>

                    <input
                        type="password"
                        value={confirmarSenha}
                        onChange={(event) =>
                            setConfirmarSenha(event.target.value)
                        }
                        required
                        minLength={6}
                        disabled={loading}
                        className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20 disabled:cursor-not-allowed disabled:opacity-70"
                    />
                </div>

                {erro && (
                    <p className="rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-4 py-3 text-sm font-bold text-[#b33127] md:col-span-3">
                        {erro}
                    </p>
                )}

                {sucesso && (
                    <p className="rounded-2xl border border-[#b8e5df] bg-[#dff4f2] px-4 py-3 text-sm font-bold text-[#0d6666] md:col-span-3">
                        {sucesso}
                    </p>
                )}

                <div className="md:col-span-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Alterando senha..."
                            : "Alterar senha e sair"}
                    </button>
                </div>
            </form>
        </section>
    );
}