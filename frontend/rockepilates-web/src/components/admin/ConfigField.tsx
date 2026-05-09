import type { ChangeEvent } from "react";
import type { CampoAdmin, ConfigTipo, SiteConfig } from "./admin-types";
import {
    MAX_IMAGE_SIZE_MB,
    MAX_VIDEO_SIZE_MB,
} from "./admin-config";

type ConfigFieldProps = {
    campo: CampoAdmin;
    config: SiteConfig;
    successKey: string | null;
    savingKey: string | null;
    uploadingKey: string | null;
    onChangeValue: (chave: string, valor: string) => void;
    onChangeType: (chave: string, tipo: ConfigTipo) => void;
    onSave: (config: SiteConfig) => void;
    onUpload: (
        event: ChangeEvent<HTMLInputElement>,
        config: SiteConfig
    ) => void;
};

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

function campoPermiteMidia(chave: string) {
    return (
        chave.includes(".image") ||
        chave.includes(".media") ||
        chave.includes(".video")
    );
}

export function ConfigField({
                                campo,
                                config,
                                successKey,
                                savingKey,
                                uploadingKey,
                                onChangeValue,
                                onChangeType,
                                onSave,
                                onUpload,
                            }: ConfigFieldProps) {
    const tipo = normalizarTipo(config.tipo);
    const podeSerMidia = campoPermiteMidia(config.chave);
    const salvando = savingKey === config.chave;
    const enviando = uploadingKey === config.chave;
    const previewUrl = config.valor?.trim()
        ? `${process.env.NEXT_PUBLIC_BFF_URL}${config.valor}`
        : null;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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
                            onChangeType(config.chave, event.target.value as ConfigTipo)
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
                            onChangeValue(config.chave, event.target.value)
                        }
                        className="mt-4 min-h-[120px] w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-black"
                    />

                    <button
                        type="button"
                        onClick={() => onSave(config)}
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
                            Aceita imagens em alta resolução. Tamanho máximo:{" "}
                            {MAX_IMAGE_SIZE_MB}MB.
                        </p>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => onUpload(event, config)}
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
                        onClick={() => onSave(config)}
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
                            Aceita arquivos de vídeo. Tamanho máximo:{" "}
                            {MAX_VIDEO_SIZE_MB}MB.
                        </p>

                        <input
                            type="file"
                            accept="video/*"
                            onChange={(event) => onUpload(event, config)}
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
                        onClick={() => onSave(config)}
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