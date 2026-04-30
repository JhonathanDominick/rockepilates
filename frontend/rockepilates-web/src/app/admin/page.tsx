"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllConfigs, SiteConfig } from "@/lib/api/config";

export default function AdminPage() {
    const router = useRouter();

    const [configs, setConfigs] = useState<SiteConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        carregarConfigs();
    }, [router]);

    async function carregarConfigs() {
        try {
            setLoading(true);
            setMessage(null);

            const data = await getAllConfigs();
            setConfigs(data);
        } catch (error) {
            console.error("Erro ao carregar configurações:", error);
            setMessage("Erro ao carregar configurações do site.");
        } finally {
            setLoading(false);
        }
    }

    function alterarValor(chave: string, valor: string) {
        setConfigs((configsAtuais) =>
            configsAtuais.map((config) =>
                config.chave === chave ? { ...config, valor } : config
            )
        );
    }

    async function salvarConfig(config: SiteConfig) {
        try {
            setSavingKey(config.chave);
            setMessage(null);

            const token = localStorage.getItem("admin_token");

            if (!token) {
                router.push("/admin/login");
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BFF_URL}/bff/configs`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        chave: config.chave,
                        valor: config.valor,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    `Erro ao salvar configuração. Status: ${response.status}. Body: ${errorText}`
                );
            }

            setMessage(`Configuração "${config.chave}" salva com sucesso.`);
        } catch (error) {
            console.error("Erro ao salvar configuração:", error);
            setMessage(
                error instanceof Error ? error.message : "Erro ao salvar configuração."
            );
        } finally {
            setSavingKey(null);
        }
    }

    return (
        <main className="min-h-screen px-6 py-10 bg-gray-50">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-950">
                    Administração do site
                </h1>

                <p className="mt-2 text-gray-600">
                    Edite os textos dinâmicos exibidos na página inicial.
                </p>

                {loading && (
                    <p className="mt-8 text-gray-700">Carregando configurações...</p>
                )}

                {!loading && configs.length === 0 && (
                    <p className="mt-8 text-gray-700">
                        Nenhuma configuração cadastrada.
                    </p>
                )}

                {!loading && configs.length > 0 && (
                    <div className="mt-8 flex flex-col gap-5">
                        {configs.map((config) => (
                            <div
                                key={config.id}
                                className="rounded-xl border bg-white p-5 shadow-sm"
                            >
                                <label className="block text-sm font-semibold text-gray-900">
                                    {config.chave}
                                </label>

                                <textarea
                                    value={config.valor}
                                    onChange={(e) =>
                                        alterarValor(config.chave, e.target.value)
                                    }
                                    className="mt-3 min-h-[120px] w-full rounded border p-3 text-gray-900"
                                />

                                <button
                                    type="button"
                                    onClick={() => salvarConfig(config)}
                                    disabled={savingKey === config.chave}
                                    className="mt-3 rounded bg-black px-5 py-2 text-white disabled:opacity-60"
                                >
                                    {savingKey === config.chave
                                        ? "Salvando..."
                                        : "Salvar alteração"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {message && (
                    <p className="mt-5 text-sm text-gray-700">
                        {message}
                    </p>
                )}
            </div>
        </main>
    );
}