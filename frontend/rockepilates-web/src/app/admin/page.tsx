"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllConfigs, salvarConfigSite } from "@/lib/api/config";
import { uploadMedia } from "@/lib/api/media";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { ConfigField } from "@/components/admin/ConfigField";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSection } from "@/components/admin/AdminSection";
import {
    ALLOWED_IMAGE_EXTENSIONS,
    MAX_IMAGE_SIZE_MB,
    secoesAdmin,
} from "@/components/admin/admin-config";
import type {
    CampoAdmin,
    ConfigTipo,
    SiteConfig,
} from "@/components/admin/admin-types";

function normalizarTipo(tipo: string): ConfigTipo {
    const tipoNormalizado = tipo?.toUpperCase();

    if (tipoNormalizado === "IMAGE") return "IMAGE";
    if (tipoNormalizado === "VIDEO") return "VIDEO";

    return "TEXT";
}

function validarArquivo(file: File, tipo: ConfigTipo): string | null {
    const tamanhoMb = file.size / 1024 / 1024;

    if (tipo === "IMAGE") {
        const indiceExtensao = file.name.lastIndexOf(".");
        const extensao = indiceExtensao >= 0
            ? file.name.slice(indiceExtensao).toLowerCase()
            : "";
        const extensoesPermitidas = ALLOWED_IMAGE_EXTENSIONS.split(",");

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            return "Selecione uma imagem JPG, PNG ou WEBP.";
        }

        if (!extensoesPermitidas.includes(extensao)) {
            return "A imagem deve ter extensão .jpg, .jpeg, .png ou .webp.";
        }

        if (tamanhoMb > MAX_IMAGE_SIZE_MB) {
            return `A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`;
        }
    }

    if (tipo === "VIDEO") {
        return "Upload local de vídeo foi desativado. Use imagem neste campo por enquanto.";
    }

    return null;
}

export default function AdminPage() {
    const router = useRouter();

    const [configs, setConfigs] = useState<SiteConfig[]>([]);
    const [loading, setLoading] = useState(true);

    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error">("success");
    const [successKey, setSuccessKey] = useState<string | null>(null);

    const configsPorChave = useMemo(() => {
        return configs.reduce<Record<string, SiteConfig>>((acc, config) => {
            acc[config.chave] = config;
            return acc;
        }, {});
    }, [configs]);

    useEffect(() => {
        carregarConfigs();
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

        const tipoOriginal = normalizarTipo(config.tipo);
        const tipo = tipoOriginal === "VIDEO"
            ? "IMAGE"
            : tipoOriginal;
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
            description="Edite textos, imagens e vídeos exibidos no site."
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
        </AdminLayout>
    );
}
