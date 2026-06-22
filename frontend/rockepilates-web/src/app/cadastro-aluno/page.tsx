"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cadastrarAluno } from "@/lib/api/alunos";
import { loginAluno } from "@/lib/api/aluno-auth";

export default function CadastroAlunoPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        dataNascimento: "",
        objetivo: "",
        observacoesSaude: "",
        tipoPlano: "MENSAL",
        senha: "",
        confirmarSenha: "",
        aceiteTermos: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        const nextValue = e.target instanceof HTMLInputElement && e.target.type === "checkbox"
            ? e.target.checked
            : value;

        setForm((prev) => ({
            ...prev,
            [name]: nextValue,
        }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        if (form.senha !== form.confirmarSenha) {
            setError("As senhas não conferem.");
            setLoading(false);
            return;
        }

        if (form.senha.length < 8 || !/[A-Za-z]/.test(form.senha) || !/\d/.test(form.senha)) {
            setError("A senha deve ter ao menos 8 caracteres, uma letra e um número.");
            setLoading(false);
            return;
        }

        try {
            await cadastrarAluno({
                nome: form.nome,
                email: form.email,
                telefone: form.telefone,
                dataNascimento: form.dataNascimento,
                objetivo: form.objetivo,
                observacoesSaude: form.observacoesSaude,
                tipoPlano: form.tipoPlano,
                senha: form.senha,
                aceiteTermos: form.aceiteTermos,
            });

            await loginAluno(form.email, form.senha);

            router.push("/aluno/perfil");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erro ao cadastrar aluno.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f6fbfa] px-6 py-16">
            <div className="mx-auto max-w-3xl rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm md:p-8">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="mb-8 inline-flex w-fit rounded-full border border-[#b8e5df] bg-white px-4 py-2 text-sm font-bold text-[#0d6666] transition hover:bg-[#eaf7f5]"
                    >
                        ← Voltar ao site
                    </Link>

                    <h1 className="mt-3 text-3xl font-black text-[#10263d]">
                        Cadastro de aluno
                    </h1>

                    <p className="mt-2 text-sm text-[#607579]">
                        Crie seu acesso para acompanhar seu plano, assinatura e
                        histórico financeiro.
                    </p>

                    <p className="mt-3 text-sm text-[#607579]">
                        Já tem cadastro?{" "}
                        <Link
                            href="/login"
                            className="font-bold text-[#0d6666] transition hover:text-[#ef4b3f]"
                        >
                            Entrar no perfil
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <input
                        name="nome"
                        placeholder="Nome completo"
                        value={form.nome}
                        onChange={handleChange}
                        required
                        className="rounded-2xl border border-[#dce8e5] p-3 outline-none transition focus:border-[#0d6666]"
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="rounded-2xl border border-[#dce8e5] p-3 outline-none transition focus:border-[#0d6666]"
                        />

                        <input
                            name="telefone"
                            placeholder="Telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            required
                            className="rounded-2xl border border-[#dce8e5] p-3 outline-none transition focus:border-[#0d6666]"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="date"
                            name="dataNascimento"
                            value={form.dataNascimento}
                            onChange={handleChange}
                            required
                            className="rounded-2xl border border-[#dce8e5] p-3 outline-none transition focus:border-[#0d6666]"
                        />

                        <select
                            name="tipoPlano"
                            value={form.tipoPlano}
                            onChange={handleChange}
                            className="rounded-2xl border border-[#dce8e5] p-3 outline-none transition focus:border-[#0d6666]"
                        >
                            <option value="MENSAL">Pagamento mensal</option>
                            <option value="SEMESTRAL">
                                Pagamento semestral
                            </option>
                            <option value="ANUAL">Pagamento anual</option>
                        </select>
                    </div>

                    <textarea
                        name="objetivo"
                        placeholder="Objetivo com o pilates"
                        value={form.objetivo}
                        onChange={handleChange}
                        className="min-h-24 rounded-2xl border border-[#dce8e5] p-3 outline-none transition focus:border-[#0d6666]"
                    />

                    <textarea
                        name="observacoesSaude"
                        placeholder="Observações de saúde"
                        value={form.observacoesSaude}
                        onChange={handleChange}
                        className="min-h-24 rounded-2xl border border-[#dce8e5] p-3 outline-none transition focus:border-[#0d6666]"
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="password"
                            name="senha"
                            placeholder="Senha"
                            value={form.senha}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="rounded-2xl border border-[#dce8e5] p-3 outline-none transition focus:border-[#0d6666]"
                        />

                        <input
                            type="password"
                            name="confirmarSenha"
                            placeholder="Confirmar senha"
                            value={form.confirmarSenha}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="rounded-2xl border border-[#dce8e5] p-3 outline-none transition focus:border-[#0d6666]"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-[#607579]">
                        <input
                            type="checkbox"
                            name="aceiteTermos"
                            checked={form.aceiteTermos}
                            onChange={handleChange}
                            required
                        />
                        Aceito os termos
                    </label>

                    <button
                        disabled={loading}
                        className="rounded-2xl bg-[#ef4b3f] py-3 font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Criando acesso..." : "Cadastrar"}
                    </button>

                    {error && (
                        <div className="rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-4 py-3 text-sm font-bold text-[#b33127]">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
}
