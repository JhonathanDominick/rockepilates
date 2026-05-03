"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllConfigs } from "@/lib/api/config";
import { uploadMedia } from "@/lib/api/media";

type ConfigTipo = "TEXT" | "IMAGE" | "VIDEO";

export type SiteConfig = {
    id: number;
    chave: string;
    valor: string;
    tipo: ConfigTipo;
};

function normalizarTipo(tipo: string): ConfigTipo {
    const tipoNormalizado = tipo?.toUpperCase();

    if (tipoNormalizado === "IMAGE") return "IMAGE";
    if (tipoNormalizado === "VIDEO") return "VIDEO";

    return "TEXT";
}

function agruparConfigs(configs: SiteConfig[]) {
    const ordemSecoes = ["home", "about", "cta"];
    const grupos: Record<string, SiteConfig[]> = {};

    configs.forEach((config) => {
        const partes = config.chave.split(".");
        const secao = partes.length >= 3 ? partes[1] : partes[0];

        if (!grupos[secao]) {
            grupos[secao] = [];
        }

        grupos[secao].push(config);
    });

    Object.keys(grupos).forEach((secao) => {
        grupos[secao].sort((a, b) => a.chave.localeCompare(b.chave));
    });

    return Object.fromEntries(
        Object.entries(grupos).sort(([a], [b]) => {
            const indexA = ordemSecoes.indexOf(a);
            const indexB = ordemSecoes.indexOf(b);

            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;

            return indexA - indexB;
        })
    );
}

const labelsConfigs: Record<string, string> = {
    "home.title": "Título principal",
    "home.subtitle": "Subtítulo da página inicial",
    "home.about.text": "Texto da seção Sobre",
    "home.cta.title": "Título da chamada para ação",
    "home.cta.button": "Texto do botão da chamada para ação",
};

export default function AdminPage() {
    const router = useRouter();

    const [configs, setConfigs] = useState<SiteConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [successKey, setSuccessKey] = useState<string | null>(null);

    const grupos = agruparConfigs(configs);

    useEffect(() => {
        carregarConfigs();
    }, []);

    async function carregarConfigs() {
        try {
            setLoading(true);
            setMessage(null);

            const data = await getAllConfigs();

            const configsNormalizadas = data.map((config: SiteConfig) => ({
                ...config,
                tipo: normalizarTipo(config.tipo),
            }));

            setConfigs(configsNormalizadas);
        } catch (error) {
            console.error("Erro ao carregar configurações:", error);
            setMessage("Erro ao carregar configurações.");
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

        if (successKey === chave) {
            setSuccessKey(null);
        }
    }

    async function salvarConfig(config: SiteConfig) {
        try {
            setSavingKey(config.chave);
            setSuccessKey(null);
            setMessage(null);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BFF_URL}/bff/configs`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        chave: config.chave,
                        valor: config.valor,
                        tipo: normalizarTipo(config.tipo),
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Erro ao salvar configuração. Status: ${response.status}. Body: ${errorText}`
                );
            }

            await carregarConfigs();

            setSuccessKey(config.chave);
            setMessage("Salvo com sucesso.");
        } catch (error) {
            console.error("Erro ao salvar configuração:", error);
            setMessage("Erro ao salvar configuração.");
        } finally {
            setSavingKey(null);
        }
    }

    async function handleUpload(
        event: React.ChangeEvent<HTMLInputElement>,
        config: SiteConfig
    ) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingKey(config.chave);
            setSuccessKey(null);
            setMessage(null);

            const url = await uploadMedia(file);

            await salvarConfig({
                ...config,
                valor: url,
                tipo: normalizarTipo(config.tipo),
            });
        } catch (error) {
            console.error("Erro no upload:", error);
            setMessage("Erro no upload.");
        } finally {
            setUploadingKey(null);
            event.target.value = "";
        }
    }

    async function handleLogout() {
        await fetch(`${process.env.NEXT_PUBLIC_BFF_URL}/bff/usuarios/logout`, {
            method: "POST",
            credentials: "include",
        });

        router.push("/admin/login");
    }

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-950">
                            Administração do site
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Edite os conteúdos dinâmicos exibidos no site.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                    >
                        Sair
                    </button>
                </div>

                {loading && (
                    <p className="mt-8 text-gray-700">Carregando configurações...</p>
                )}

                {!loading && configs.length === 0 && (
                    <p className="mt-8 text-gray-700">
                        Nenhuma configuração cadastrada.
                    </p>
                )}

                {!loading && configs.length > 0 && (
                    <div className="mt-8 flex flex-col gap-8">
                        {Object.entries(grupos).map(([secao, configsDaSecao]) => (
                            <section key={secao}>
                                <h2 className="mb-4 text-xl font-bold uppercase text-gray-900">
                                    {secao}
                                </h2>

                                <div className="flex flex-col gap-5">
                                    {configsDaSecao.map((config) => {
                                        const tipo = normalizarTipo(config.tipo);

                                        return (
                                            <div
                                                key={config.id}
                                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-900">
                                                            {labelsConfigs[config.chave] ?? config.chave}
                                                        </label>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {config.chave} · {tipo}
                                                        </p>
                                                    </div>

                                                    {successKey === config.chave && (
                                                        <span className="text-sm font-medium text-green-700">
                                                            Salvo
                                                        </span>
                                                    )}
                                                </div>

                                                {tipo === "TEXT" && (
                                                    <>
                                                        <textarea
                                                            value={config.valor}
                                                            onChange={(event) =>
                                                                alterarValor(
                                                                    config.chave,
                                                                    event.target.value
                                                                )
                                                            }
                                                            className="mt-3 min-h-[120px] w-full rounded border border-gray-300 p-3 text-gray-900 outline-none focus:border-black"
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
                                                    </>
                                                )}

                                                {tipo === "IMAGE" && (
                                                    <div className="mt-3">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(event) =>
                                                                handleUpload(event, config)
                                                            }
                                                            className="block text-sm text-gray-700"
                                                        />

                                                        {uploadingKey === config.chave && (
                                                            <p className="mt-2 text-sm text-gray-500">
                                                                Enviando imagem...
                                                            </p>
                                                        )}

                                                        {config.valor && (
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_BFF_URL}${config.valor}`}
                                                                alt={labelsConfigs[config.chave] ?? config.chave}
                                                                className="mt-4 max-w-md rounded border border-gray-200"
                                                            />
                                                        )}
                                                    </div>
                                                )}

                                                {tipo === "VIDEO" && (
                                                    <div className="mt-3">
                                                        <input
                                                            type="file"
                                                            accept="video/*"
                                                            onChange={(event) =>
                                                                handleUpload(event, config)
                                                            }
                                                            className="block text-sm text-gray-700"
                                                        />

                                                        {uploadingKey === config.chave && (
                                                            <p className="mt-2 text-sm text-gray-500">
                                                                Enviando vídeo...
                                                            </p>
                                                        )}

                                                        {config.valor && (
                                                            <video
                                                                src={`${process.env.NEXT_PUBLIC_BFF_URL}${config.valor}`}
                                                                controls
                                                                className="mt-4 max-w-md rounded border border-gray-200"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {message && (
                    <p className="mt-6 text-sm text-red-600">{message}</p>
                )}
            </div>
        </main>
    );
}