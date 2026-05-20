"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    cadastrarAlunoAdmin,
    CadastroAlunoAdminRequest,
} from "@/lib/api/admin-alunos-client";

export default function NovoAlunoAdminPage() {
    const router = useRouter();

    const [form, setForm] = useState<CadastroAlunoAdminRequest>({
        nome: "",
        email: "",
        telefone: "",
        dataNascimento: "",
        objetivo: "",
        observacoesSaude: "",
        tipoPlano: "MENSAL",
        dataVencimento: "",
        pago: false,
        senha: "",
        confirmarSenha: "",
    });

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    function handleChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value, type } = event.target;

        if (type === "checkbox") {
            const checked = (event.target as HTMLInputElement).checked;

            setForm((prev) => ({
                ...prev,
                [name]: checked,
            }));

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            setLoading(true);
            setErro(null);

            if (form.senha && form.senha !== form.confirmarSenha) {
                setErro("As senhas não coincidem.");
                setLoading(false);
                return;
            }

            const payload = { ...form };
            delete payload.confirmarSenha;

            await cadastrarAlunoAdmin(payload);

            router.push("/admin/alunos");
            router.refresh();
        } catch (error) {
            console.error("Erro ao cadastrar aluno pelo admin:", error);
            setErro("Não foi possível cadastrar o aluno.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminLayout
            title="Novo aluno"
            description="Cadastre alunos antigos, presenciais ou vindos por canais externos."
        >
            <div className="mb-6">
                <Link
                    href="/admin/alunos"
                    className="text-sm font-bold text-[#0d6666] transition hover:text-[#ef4b3f]"
                >
                    ← Voltar para alunos
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] p-6 shadow-sm"
            >
                {erro && (
                    <p className="mb-5 rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-4 py-3 text-sm font-bold text-[#b33127]">
                        {erro}
                    </p>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Nome
                        </label>
                        <input
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Telefone
                        </label>
                        <input
                            name="telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Data de nascimento
                        </label>
                        <input
                            type="date"
                            name="dataNascimento"
                            value={form.dataNascimento}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Plano
                        </label>
                        <select
                            name="tipoPlano"
                            value={form.tipoPlano}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        >
                            <option value="MENSAL">Mensal</option>
                            <option value="SEMESTRAL">Semestral</option>
                            <option value="ANUAL">Anual</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Vencimento atual
                        </label>
                        <input
                            type="date"
                            name="dataVencimento"
                            value={form.dataVencimento}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Senha de acesso
                        </label>
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange}
                            placeholder="Opcional"
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                        <p className="mt-2 text-xs text-[#607579]">
                            Se preencher, o aluno já poderá acessar o portal.
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Confirmar senha
                        </label>
                        <input
                            type="password"
                            name="confirmarSenha"
                            value={form.confirmarSenha}
                            onChange={handleChange}
                            placeholder="Repita a senha"
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Objetivo com Pilates
                        </label>
                        <textarea
                            name="objetivo"
                            value={form.objetivo}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Observações de saúde
                        </label>
                        <textarea
                            name="observacoesSaude"
                            value={form.observacoesSaude}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-[#dce8e5] bg-white px-4 py-3 text-sm font-bold text-[#10263d]">
                        <input
                            type="checkbox"
                            name="pago"
                            checked={form.pago}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        Este aluno já pagou o período atual
                    </label>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Link
                        href="/admin/alunos"
                        className="rounded-2xl border border-[#dce8e5] bg-white px-5 py-3 text-center text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5]"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Cadastrando..." : "Cadastrar aluno"}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}