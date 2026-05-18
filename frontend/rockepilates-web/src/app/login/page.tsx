"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAluno } from "@/lib/api/aluno-auth";

export default function LoginAlunoPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        setLoading(true);
        setErro(null);

        try {
            await loginAluno(email, senha);
            router.push("/aluno/perfil");
        } catch (error) {
            console.error("Erro no login do aluno:", error);
            setErro("E-mail ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff4f2,transparent_35%),linear-gradient(135deg,#f6fbfa,#ffffff)] px-6 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center">
                <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="flex flex-col justify-center">
                        <Link
                            href="/"
                            className="mb-8 inline-flex w-fit rounded-full border border-[#b8e5df] bg-white px-4 py-2 text-sm font-bold text-[#0d6666] transition hover:bg-[#eaf7f5]"
                        >
                            ← Voltar ao site
                        </Link>

                        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#0d6666]">
                            RockerPilates
                        </p>

                        <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight text-[#10263d] md:text-5xl">
                            Seu espaço para acompanhar sua jornada no pilates.
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-7 text-[#607579]">
                            Acesse seu perfil para consultar plano, vencimentos,
                            histórico financeiro e informações cadastradas.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl border border-[#dce8e5] bg-white/80 p-4 shadow-sm">
                                <p className="text-sm font-black text-[#10263d]">
                                    Plano
                                </p>
                                <p className="mt-1 text-xs text-[#607579]">
                                    Veja sua assinatura atual.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-[#dce8e5] bg-white/80 p-4 shadow-sm">
                                <p className="text-sm font-black text-[#10263d]">
                                    Financeiro
                                </p>
                                <p className="mt-1 text-xs text-[#607579]">
                                    Acompanhe vencimentos.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-[#dce8e5] bg-white/80 p-4 shadow-sm">
                                <p className="text-sm font-black text-[#10263d]">
                                    Histórico
                                </p>
                                <p className="mt-1 text-xs text-[#607579]">
                                    Consulte seus pagamentos.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[36px] border border-[#dce8e5] bg-white p-6 shadow-2xl shadow-[#0d6666]/10 md:p-8">
                        <div className="rounded-[28px] bg-gradient-to-br from-[#0d6666] to-[#10263d] p-6 text-white">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#b8e5df]">
                                Área do aluno
                            </p>

                            <h2 className="mt-3 text-3xl font-black">
                                Entrar no perfil
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/75">
                                Use o e-mail e senha cadastrados para acessar sua
                                área pessoal.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-[#607579]">
                                    E-mail
                                </label>

                                <input
                                    type="email"
                                    placeholder="seuemail@exemplo.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                    className="mt-2 w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] p-4 text-[#10263d] outline-none transition focus:border-[#0d6666] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-[#607579]">
                                    Senha
                                </label>

                                <input
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(event) =>
                                        setSenha(event.target.value)
                                    }
                                    required
                                    className="mt-2 w-full rounded-2xl border border-[#dce8e5] bg-[#f8fcfb] p-4 text-[#10263d] outline-none transition focus:border-[#0d6666] focus:bg-white"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 rounded-2xl bg-[#ef4b3f] py-4 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-[#ef4b3f]/25 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Entrando..." : "Entrar"}
                            </button>

                            {erro && (
                                <div className="rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-4 py-3 text-sm font-bold text-[#b33127]">
                                    {erro}
                                </div>
                            )}
                        </form>

                        <div className="mt-6 rounded-3xl border border-[#dce8e5] bg-[#f8fcfb] p-5">
                            <h3 className="text-lg font-black text-[#10263d]">
                                Ainda não é aluno?
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#607579]">
                                Faça seu cadastro para criar sua assinatura e
                                liberar o acesso ao perfil.
                            </p>

                            <Link
                                href="/cadastro-aluno"
                                className="mt-4 inline-flex rounded-2xl border border-[#b8e5df] bg-white px-5 py-3 text-sm font-bold text-[#0d6666] transition hover:-translate-y-[1px] hover:bg-[#eaf7f5]"
                            >
                                Criar cadastro
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}