"use client";

import { useState } from "react";
import { criarDepoimento } from "@/lib/api/depoimentos";

export function TestimonialForm() {
    const [nome, setNome] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await criarDepoimento({ nome, mensagem });
            setSuccess(true);
            setNome("");
            setMensagem("");
        } catch {
            alert("Erro ao enviar depoimento");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="bg-white px-6 py-20">
            <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">
                    Deixe sua avaliação
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Seu nome"
                        required
                        className="border p-3 rounded"
                    />

                    <textarea
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        placeholder="Sua mensagem"
                        required
                        className="border p-3 rounded"
                    />

                    <button
                        disabled={loading}
                        className="bg-brand-red text-white py-3 rounded font-semibold"
                    >
                        {loading ? "Enviando..." : "Enviar avaliação"}
                    </button>

                    {success && (
                        <p className="text-green-600">
                            Avaliação enviada! Aguarde aprovação.
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}