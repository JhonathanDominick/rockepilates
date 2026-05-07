"use client";

import { useState } from "react";
import { cadastrarAluno } from "@/lib/api/alunos";

export default function CadastroAlunoPage() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        dataNascimento: "",
        objetivo: "",
        observacoesSaude: "",
        tipoPlano: "MENSAL",
        aceiteTermos: false
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: any) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    async function handleSubmit(e: any) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await cadastrarAluno(form);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-20 px-6">
            <h1 className="text-3xl font-bold mb-6">
                Cadastro de Aluno
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <input name="nome" placeholder="Nome" onChange={handleChange} required className="border p-3 rounded" />
                <input name="email" placeholder="Email" onChange={handleChange} required className="border p-3 rounded" />
                <input name="telefone" placeholder="Telefone" onChange={handleChange} required className="border p-3 rounded" />
                <input type="date" name="dataNascimento" onChange={handleChange} required className="border p-3 rounded" />

                <textarea name="objetivo" placeholder="Objetivo" onChange={handleChange} className="border p-3 rounded" />
                <textarea name="observacoesSaude" placeholder="Observações de saúde" onChange={handleChange} className="border p-3 rounded" />

                <select name="tipoPlano" onChange={handleChange} className="border p-3 rounded">
                    <option value="MENSAL">Mensal</option>
                    <option value="SEMESTRAL">Semestral</option>
                    <option value="ANUAL">Anual</option>
                </select>

                <label className="flex items-center gap-2">
                    <input type="checkbox" name="aceiteTermos" onChange={handleChange} />
                    Aceito os termos
                </label>

                <button
                    disabled={loading}
                    className="bg-brand-red text-white py-3 rounded"
                >
                    {loading ? "Enviando..." : "Cadastrar"}
                </button>

                {success && <p className="text-green-600">Cadastro realizado!</p>}
                {error && <p className="text-red-600">{error}</p>}
            </form>
        </div>
    );
}