"use client";

import { useState } from "react";

type FormState = {
    chave: string;
    valor: string;
};

export default function AdminPage() {
    const [form, setForm] = useState<FormState>({
        chave: "",
        valor: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BFF_URL}/bff/configs`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    `Erro ao salvar configuração. Status: ${response.status}. Body: ${errorText}`
                );
            }

            setMessage("Configuração salva com sucesso!");
            setForm({ chave: "", valor: "" });
        } catch (error) {
            console.error("Erro ao salvar configuração:", error);
            setMessage("Erro ao salvar configuração");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-950">
                    Administração do site
                </h1>

                <p className="mt-2 text-gray-600">
                    Edite os textos dinâmicos exibidos na página inicial.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                    <input
                        name="chave"
                        placeholder="Ex: home.title"
                        value={form.chave}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        required
                    />

                    <textarea
                        name="valor"
                        placeholder="Digite o valor"
                        value={form.valor}
                        onChange={handleChange}
                        className="border p-3 rounded min-h-[120px]"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white py-3 rounded disabled:opacity-60"
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </form>

                {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
            </div>
        </main>
    );
}