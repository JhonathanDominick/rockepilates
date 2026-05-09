"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllConfigs, salvarConfigSite } from "@/lib/api/config";
import { uploadMedia } from "@/lib/api/media";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { ConfigField } from "@/components/admin/ConfigField";
import { DepoimentoCard } from "@/components/admin/DepoimentoCard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSection } from "@/components/admin/AdminSection";
import {
    MAX_IMAGE_SIZE_MB,
    MAX_VIDEO_SIZE_MB,
    secoesAdmin,
} from "@/components/admin/admin-config";
import type {
    CampoAdmin,
    ConfigTipo,
    Depoimento,
    SiteConfig,
} from "@/components/admin/admin-types";
import {
    listarDepoimentosAdmin,
    aprovarDepoimento,
    desaprovarDepoimento,
} from "@/lib/api/admin-depoimentos";

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

        if (!config) return null;

        return (
            <ConfigField
                key={config.id}
                campo={campo}
                config={config}
                successKey={successKey}
                savingKey={savingKey}
                uploadingKey={uploadingKey}
                onChangeValue={alterarValor}
                onChangeType={alterarTipo}
                onSave={salvarConfig}
                onUpload={handleUpload}
            />
        );
    }



    return (
        <AdminLayout
            title="CMS do site"
            description="Edite textos, imagens, vídeos e depoimentos exibidos no site."
        >
            <AdminHeader onLogout={handleLogout} />

                {message && <AdminMessage message={message} type={messageType} />}

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
                            <AdminSection
                                key={secao.titulo}
                                title={secao.titulo}
                                description={secao.descricao}
                            >
                                {secao.campos.map((campo) => renderCampo(campo))}
                            </AdminSection>
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
                                        {depoimentosPendentes.map((depoimento) => (
                                            <DepoimentoCard
                                                key={depoimento.id}
                                                depoimento={depoimento}
                                                tipo="pendente"
                                                changingDepoimentoId={changingDepoimentoId}
                                                onAprovar={handleAprovarDepoimento}
                                                onDesaprovar={handleDesaprovarDepoimento}
                                            />
                                        ))}
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
                                        {depoimentosAprovados.map((depoimento) => (
                                            <DepoimentoCard
                                                key={depoimento.id}
                                                depoimento={depoimento}
                                                tipo="aprovado"
                                                changingDepoimentoId={changingDepoimentoId}
                                                onAprovar={handleAprovarDepoimento}
                                                onDesaprovar={handleDesaprovarDepoimento}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>

       </AdminLayout>
    );
}