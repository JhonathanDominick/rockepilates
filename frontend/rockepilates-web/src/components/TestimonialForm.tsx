"use client";

import { useState } from "react";
import { criarDepoimento } from "@/lib/api/depoimentos";

const NOME_MIN = 2;
const NOME_MAX = 80;
const MENSAGEM_MIN = 10;
const MENSAGEM_MAX = 500;

export function TestimonialForm() {
    const [nome, setNome] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const nomeLimpo = nome.trim();
    const mensagemLimpa = mensagem.trim();

    const formularioInvalido =
        nomeLimpo.length < NOME_MIN ||
        nomeLimpo.length > NOME_MAX ||
        mensagemLimpa.length < MENSAGEM_MIN ||
        mensagemLimpa.length > MENSAGEM_MAX ||
        loading;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setSuccess(false);
        setError(null);

        if (nomeLimpo.length < NOME_MIN) {
            setError("Informe um nome com pelo menos 2 caracteres.");
            return;
        }

        if (nomeLimpo.length > NOME_MAX) {
            setError(`O nome deve ter no máximo ${NOME_MAX} caracteres.`);
            return;
        }

        if (mensagemLimpa.length < MENSAGEM_MIN) {
            setError("Escreva uma mensagem com pelo menos 10 caracteres.");
            return;
        }

        if (mensagemLimpa.length > MENSAGEM_MAX) {
            setError(`A mensagem deve ter no máximo ${MENSAGEM_MAX} caracteres.`);
            return;
        }

        setLoading(true);

        try {
            await criarDepoimento({
                nome: nomeLimpo,
                mensagem: mensagemLimpa,
            });

            setSuccess(true);
            setNome("");
            setMensagem("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro inesperado");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="bg-white px-6 py-20">
            <div className="mx-auto max-w-xl">
                <div className="mb-8 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-brand-red">
                        Avaliações
                    </p>

                    <h2 className="text-3xl font-semibold text-brand-ink">
                        Deixe sua avaliação
                    </h2>

                    <p className="mt-3 text-sm text-brand-text">
                        Sua mensagem será analisada antes de aparecer no site.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-brand-ink">
                            Nome
                        </label>

                        <input
                            value={nome}
                            onChange={(e) => {
                                setNome(e.target.value.slice(0, NOME_MAX));
                                setSuccess(false);
                                setError(null);
                            }}
                            placeholder="Seu nome"
                            required
                            minLength={NOME_MIN}
                            maxLength={NOME_MAX}
                            disabled={loading}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-brand-ink outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-4">
                            <label className="block text-sm font-medium text-brand-ink">
                                Mensagem
                            </label>

                            <span className="text-xs text-brand-text">
                                {mensagem.length}/{MENSAGEM_MAX}
                            </span>
                        </div>

                        <textarea
                            value={mensagem}
                            onChange={(e) => {
                                setMensagem(e.target.value.slice(0, MENSAGEM_MAX));
                                setSuccess(false);
                                setError(null);
                            }}
                            placeholder="Conte como foi sua experiência"
                            required
                            minLength={MENSAGEM_MIN}
                            maxLength={MENSAGEM_MAX}
                            disabled={loading}
                            rows={5}
                            className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-brand-ink outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={formularioInvalido}
                        className="rounded-2xl bg-brand-red px-6 py-3 font-semibold text-white transition hover:bg-brand-redDark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Enviando..." : "Enviar avaliação"}
                    </button>

                    {success && (
                        <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                            Avaliação enviada! Aguarde aprovação.
                        </p>
                    )}

                    {error && (
                        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}