"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllConfigs, salvarConfigSite } from "@/lib/api/config";
import { uploadMedia } from "@/lib/api/media";
import {
    listarDepoimentosAdmin,
    aprovarDepoimento,
    desaprovarDepoimento,
} from "@/lib/api/admin-depoimentos";

type ConfigTipo = "TEXT" | "IMAGE" | "VIDEO";

export type SiteConfig = {
    id: number;
    chave: string;
    valor: string;
    tipo: ConfigTipo;
};

type Depoimento = {
    id: number;
    nome: string;
    mensagem: string;
    aprovado: boolean;
    criadoEm?: string;
};

type CampoAdmin = {
    chave: string;
    label: string;
    ajuda?: string;
};

type SecaoAdmin = {
    titulo: string;
    descricao: string;
    campos: CampoAdmin[];
};

const MAX_IMAGE_SIZE_MB = 100;
const MAX_VIDEO_SIZE_MB = 200;

const secoesAdmin: SecaoAdmin[] = [
    {
        titulo: "Topo da página",
        descricao: "Conteúdo principal que aparece assim que o visitante entra no site.",
        campos: [
            {
                chave: "home.title",
                label: "Título principal",
                ajuda: "Frase grande de destaque da página inicial.",
            },
            {
                chave: "home.subtitle",
                label: "Subtítulo",
                ajuda: "Texto curto que complementa o título principal.",
            },
            {
                chave: "home.hero.image",
                label: "Mídia principal",
                ajuda: "Imagem ou vídeo exibido no topo da página.",
            },
        ],
    },
    {
        titulo: "Benefícios",
        descricao: "Textos da seção que mostra os principais benefícios do pilates.",
        campos: [
            { chave: "home.benefits.title", label: "Título da seção" },
            { chave: "home.benefits.item.1", label: "Benefício 1" },
            { chave: "home.benefits.item.2", label: "Benefício 2" },
            { chave: "home.benefits.item.3", label: "Benefício 3" },
            { chave: "home.benefits.item.4", label: "Benefício 4" },
            { chave: "home.benefits.item.5", label: "Benefício 5" },
        ],
    },
    {
        titulo: "Planos",
        descricao: "Textos dos planos exibidos na página inicial.",
        campos: [
            { chave: "home.plans.1.title", label: "Plano 1 — título" },
            { chave: "home.plans.1.price", label: "Plano 1 — preço" },
            { chave: "home.plans.1.description", label: "Plano 1 — descrição" },
            { chave: "home.plans.2.title", label: "Plano 2 — título" },
            { chave: "home.plans.2.price", label: "Plano 2 — preço" },
            { chave: "home.plans.2.description", label: "Plano 2 — descrição" },
            { chave: "home.plans.3.title", label: "Plano 3 — título" },
            { chave: "home.plans.3.price", label: "Plano 3 — preço" },
            { chave: "home.plans.3.description", label: "Plano 3 — descrição" },
        ],
    },
    {
        titulo: "Evelyn Pinheiro",
        descricao: "Seção de apresentação profissional da Evelyn.",
        campos: [
            { chave: "home.evelyn.title", label: "Título" },
            { chave: "home.evelyn.subtitle", label: "Subtítulo" },
            { chave: "home.evelyn.description", label: "Descrição" },
            { chave: "home.evelyn.image", label: "Mídia da Evelyn" },
            { chave: "home.evelyn.cta.text", label: "Texto antes do botão" },
            { chave: "home.evelyn.cta.button", label: "Texto do botão" },
        ],
    },
    {
        titulo: "Chamada final",
        descricao: "Última chamada de ação antes do fim da página.",
        campos: [
            { chave: "home.cta.title", label: "Título da chamada" },
            { chave: "home.cta.button", label: "Texto do botão" },
            { chave: "home.cta.image", label: "Mídia de fundo" },
        ],
    },
    {
        titulo: "Sobre",
        descricao: "Texto institucional da seção sobre.",
        campos: [{ chave: "home.about.text", label: "Texto sobre" }],
    },
];

function normalizarTipo(tipo: string): ConfigTipo {
    const tipoNormalizado = tipo?.toUpperCase();

    if (tipoNormalizado === "IMAGE") return "IMAGE";
    if (tipoNormalizado === "VIDEO") return "VIDEO";

    return "TEXT";
}

function formatarTipo(tipo: ConfigTipo) {
    if (tipo === "IMAGE") return "Imagem";
    if (tipo === "VIDEO") return "Vídeo";
    return "Texto";
}

function validarArquivo(file: File, tipo: ConfigTipo): string | null {
    const tamanhoMb = file.size / 1024 / 1024;

    if (tipo === "IMAGE") {
        if (!file.type.startsWith("image/")) {
            return "Selecione um arquivo de imagem válido.";
        }

        if (tamanhoMb > MAX_IMAGE_SIZE_MB) {
            return `A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`;
        }
    }

    if (tipo === "VIDEO") {
        if (!file.type.startsWith("video/")) {
            return "Selecione um arquivo de vídeo válido.";
        }

        if (tamanhoMb > MAX_VIDEO_SIZE_MB) {
            return `O vídeo deve ter no máximo ${MAX_VIDEO_SIZE_MB}MB.`;
        }
    }

    return null;
}

function campoPermiteMidia(chave: string) {
    return (
        chave.includes(".image") ||
        chave.includes(".media") ||
        chave.includes(".video")
    );
}

export default function AdminPage() {
    const router = useRouter();

    const [configs, setConfigs] = useState<SiteConfig[]>([]);
    const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingDepoimentos, setLoadingDepoimentos] = useState(true);

    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);
    const [changingDepoimentoId, setChangingDepoimentoId] = useState<number | null>(null);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error">("success");
    const [successKey, setSuccessKey] = useState<string | null>(null);

    const configsPorChave = useMemo(() => {
        return configs.reduce<Record<string, SiteConfig>>((acc, config) => {
            acc[config.chave] = config;
            return acc;
        }, {});
    }, [configs]);

    const depoimentosPendentes = depoimentos.filter((depoimento) => !depoimento.aprovado);
    const depoimentosAprovados = depoimentos.filter((depoimento) => depoimento.aprovado);

    useEffect(() => {
        carregarConfigs();
        carregarDepoimentos();
    }, []);

    function mostrarMensagem(texto: string, tipo: "success" | "error" = "success") {
        setMessage(texto);
        setMessageType(tipo);
    }

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
            mostrarMensagem("Erro ao carregar configurações.", "error");
        } finally {
            setLoading(false);
        }
    }

    async function carregarDepoimentos() {
        try {
            setLoadingDepoimentos(true);

            const data = await listarDepoimentosAdmin();
            setDepoimentos(data);
        } catch (error) {
            console.error("Erro ao carregar depoimentos:", error);
            mostrarMensagem("Erro ao carregar depoimentos.", "error");
        } finally {
            setLoadingDepoimentos(false);
        }
    }

    function alterarValor(chave: string, valor: string) {
        setConfigs((configsAtuais) =>
            configsAtuais.map((config) =>
                config.chave === chave ? { ...config, valor } : config
            )
        );

        if (successKey === chave) setSuccessKey(null);
    }

    function alterarTipo(chave: string, tipo: ConfigTipo) {
        setConfigs((configsAtuais) =>
            configsAtuais.map((config) =>
                config.chave === chave
                    ? {
                        ...config,
                        tipo,
                        valor: config.tipo === tipo ? config.valor : "",
                    }
                    : config
            )
        );

        setSuccessKey(null);
        mostrarMensagem(
            "Tipo alterado. Envie um novo arquivo ou salve o campo para confirmar.",
            "success"
        );
    }

    async function salvarConfig(config: SiteConfig) {
        try {
            setSavingKey(config.chave);
            setSuccessKey(null);
            setMessage(null);

            await salvarConfigSite({
                chave: config.chave,
                valor: config.valor,
                tipo: normalizarTipo(config.tipo),
            });

            await carregarConfigs();

            setSuccessKey(config.chave);
            mostrarMensagem("Campo salvo com sucesso.", "success");
        } catch (error) {
            console.error("Erro ao salvar configuração:", error);
            mostrarMensagem("Erro ao salvar campo.", "error");
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

        const tipo = normalizarTipo(config.tipo);
        const erroValidacao = validarArquivo(file, tipo);

        if (erroValidacao) {
            mostrarMensagem(erroValidacao, "error");
            event.target.value = "";
            return;
        }

        try {
            setUploadingKey(config.chave);
            setSuccessKey(null);
            setMessage(null);

            const url = await uploadMedia(file);

            await salvarConfig({
                ...config,
                valor: url,
                tipo,
            });

            mostrarMensagem("Arquivo enviado e salvo com sucesso.", "success");
        } catch (error) {
            console.error("Erro no upload:", error);
            mostrarMensagem("Erro no upload do arquivo.", "error");
        } finally {
            setUploadingKey(null);
            event.target.value = "";
        }
    }

    async function handleAprovarDepoimento(id: number) {
        try {
            setChangingDepoimentoId(id);
            setMessage(null);

            await aprovarDepoimento(id);
            await carregarDepoimentos();

            mostrarMensagem("Depoimento aprovado com sucesso.", "success");
        } catch (error) {
            console.error("Erro ao aprovar depoimento:", error);
            mostrarMensagem("Erro ao aprovar depoimento.", "error");
        } finally {
            setChangingDepoimentoId(null);
        }
    }

    async function handleDesaprovarDepoimento(id: number) {
        try {
            setChangingDepoimentoId(id);
            setMessage(null);

            await desaprovarDepoimento(id);
            await carregarDepoimentos();

            mostrarMensagem("Depoimento desaprovado com sucesso.", "success");
        } catch (error) {
            console.error("Erro ao desaprovar depoimento:", error);
            mostrarMensagem("Erro ao desaprovar depoimento.", "error");
        } finally {
            setChangingDepoimentoId(null);
        }
    }

    async function handleLogout() {
        await fetch(`${process.env.NEXT_PUBLIC_BFF_URL}/bff/usuarios/logout`, {
            method: "POST",
            credentials: "include",
        });

        router.push("/admin/login");
    }

    function renderCampo(campo: CampoAdmin) {
        const config = configsPorChave[campo.chave];

        if (!config) {
            return null;
        }

        const tipo = normalizarTipo(config.tipo);
        const podeSerMidia = campoPermiteMidia(config.chave);
        const salvando = savingKey === config.chave;
        const enviando = uploadingKey === config.chave;
        const previewUrl = config.valor?.trim()
            ? `${process.env.NEXT_PUBLIC_BFF_URL}${config.valor}`
            : null;

        return (
            <div
                key={config.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                        <label className="block text-base font-semibold text-gray-950">
                            {campo.label}
                        </label>

                        {campo.ajuda && (
                            <p className="mt-1 text-sm text-gray-600">
                                {campo.ajuda}
                            </p>
                        )}

                        <p className="mt-2 text-xs text-gray-400">
                            Campo técnico: {config.chave} · {formatarTipo(tipo)}
                        </p>
                    </div>

                    {successKey === config.chave && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Salvo
                        </span>
                    )}
                </div>

                {podeSerMidia && (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm font-semibold text-gray-900">
                            Tipo de conteúdo
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Escolha se este campo será usado como imagem ou vídeo.
                        </p>

                        <select
                            value={tipo === "TEXT" ? "IMAGE" : tipo}
                            onChange={(event) =>
                                alterarTipo(config.chave, event.target.value as ConfigTipo)
                            }
                            className="mt-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-black"
                        >
                            <option value="IMAGE">Imagem</option>
                            <option value="VIDEO">Vídeo</option>
                        </select>
                    </div>
                )}

                {!podeSerMidia && tipo === "TEXT" && (
                    <>
                        <textarea
                            value={config.valor}
                            onChange={(event) =>
                                alterarValor(config.chave, event.target.value)
                            }
                            className="mt-4 min-h-[120px] w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-black"
                        />

                        <button
                            type="button"
                            onClick={() => salvarConfig(config)}
                            disabled={salvando}
                            className="mt-3 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
                        >
                            {salvando ? "Salvando..." : "Salvar este campo"}
                        </button>
                    </>
                )}

                {podeSerMidia && tipo === "IMAGE" && (
                    <div className="mt-4">
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-800">
                                Enviar nova imagem
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Aceita imagens em alta resolução. Tamanho máximo: {MAX_IMAGE_SIZE_MB}MB.
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleUpload(event, config)}
                                disabled={enviando}
                                className="mt-3 block text-sm text-gray-700"
                            />

                            {enviando && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Enviando imagem...
                                </p>
                            )}
                        </div>

                        {previewUrl ? (
                            <div className="mt-4">
                                <p className="mb-2 text-sm font-medium text-gray-800">
                                    Prévia atual
                                </p>

                                <img
                                    src={previewUrl}
                                    alt={campo.label}
                                    className="max-h-72 w-full max-w-xl rounded-xl border border-gray-200 object-cover"
                                />
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">
                                Nenhuma imagem enviada ainda.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => salvarConfig(config)}
                            disabled={salvando}
                            className="mt-3 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
                        >
                            {salvando ? "Salvando..." : "Salvar tipo selecionado"}
                        </button>
                    </div>
                )}

                {podeSerMidia && tipo === "VIDEO" && (
                    <div className="mt-4">
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-800">
                                Enviar novo vídeo
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Aceita arquivos de vídeo. Tamanho máximo: {MAX_VIDEO_SIZE_MB}MB.
                            </p>

                            <input
                                type="file"
                                accept="video/*"
                                onChange={(event) => handleUpload(event, config)}
                                disabled={enviando}
                                className="mt-3 block text-sm text-gray-700"
                            />

                            {enviando && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Enviando vídeo...
                                </p>
                            )}
                        </div>

                        {previewUrl ? (
                            <div className="mt-4">
                                <p className="mb-2 text-sm font-medium text-gray-800">
                                    Prévia atual
                                </p>

                                <video
                                    src={previewUrl}
                                    controls
                                    className="max-h-72 w-full max-w-xl rounded-xl border border-gray-200"
                                />
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">
                                Nenhum vídeo enviado ainda.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => salvarConfig(config)}
                            disabled={salvando}
                            className="mt-3 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
                        >
                            {salvando ? "Salvando..." : "Salvar tipo selecionado"}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    function renderDepoimentoCard(depoimento: Depoimento, tipo: "pendente" | "aprovado") {
        const alterando = changingDepoimentoId === depoimento.id;

        const cardClass =
            tipo === "pendente"
                ? "rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm"
                : "rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm";

        const badgeClass =
            tipo === "pendente"
                ? "rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-800"
                : "rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-800";

        return (
            <div key={depoimento.id} className={cardClass}>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="font-semibold text-gray-900">
                                {depoimento.nome}
                            </p>

                            <span className={badgeClass}>
                                {tipo === "pendente" ? "Pendente" : "Aprovado"}
                            </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-gray-700">
                            {depoimento.mensagem}
                        </p>
                    </div>

                    {tipo === "pendente" ? (
                        <button
                            type="button"
                            onClick={() => handleAprovarDepoimento(depoimento.id)}
                            disabled={alterando}
                            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            {alterando ? "Aprovando..." : "Aprovar"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleDesaprovarDepoimento(depoimento.id)}
                            disabled={alterando}
                            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            {alterando ? "Desaprovando..." : "Desaprovar"}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-950">
                            Administração do site
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Edite textos, imagens, vídeos e depoimentos exibidos no site.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                    >
                        Sair
                    </button>
                </div>

                {message && (
                    <p
                        className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
                            messageType === "success"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                        }`}
                    >
                        {message}
                    </p>
                )}

                {loading && (
                    <p className="mt-8 text-gray-700">Carregando configurações...</p>
                )}

                {!loading && configs.length === 0 && (
                    <p className="mt-8 text-gray-700">
                        Nenhuma configuração cadastrada.
                    </p>
                )}

                {!loading && configs.length > 0 && (
                    <div className="mt-8 flex flex-col gap-10">
                        {secoesAdmin.map((secao) => (
                            <section key={secao.titulo}>
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold uppercase text-gray-900">
                                        {secao.titulo}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {secao.descricao}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-5">
                                    {secao.campos.map((campo) => renderCampo(campo))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                <section className="mt-12">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold uppercase text-gray-900">
                                Depoimentos
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Aprove ou retire depoimentos exibidos na home.
                            </p>
                        </div>

                        {!loadingDepoimentos && (
                            <span className="rounded-full bg-gray-200 px-4 py-1 text-sm font-medium text-gray-700">
                                Total: {depoimentos.length}
                            </span>
                        )}
                    </div>

                    {loadingDepoimentos && (
                        <p className="text-gray-600">Carregando depoimentos...</p>
                    )}

                    {!loadingDepoimentos && depoimentos.length === 0 && (
                        <p className="text-gray-500">Nenhum depoimento encontrado.</p>
                    )}

                    {!loadingDepoimentos && depoimentos.length > 0 && (
                        <div className="flex flex-col gap-10">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Pendentes ({depoimentosPendentes.length})
                                </h3>

                                {depoimentosPendentes.length === 0 ? (
                                    <p className="text-sm text-gray-400">
                                        Nenhum depoimento pendente.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {depoimentosPendentes.map((depoimento) =>
                                            renderDepoimentoCard(depoimento, "pendente")
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Aprovados ({depoimentosAprovados.length})
                                </h3>

                                {depoimentosAprovados.length === 0 ? (
                                    <p className="text-sm text-gray-400">
                                        Nenhum depoimento aprovado.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {depoimentosAprovados.map((depoimento) =>
                                            renderDepoimentoCard(depoimento, "aprovado")
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}