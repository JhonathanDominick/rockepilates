import type { ChangeEvent } from "react";
import type { CampoAdmin, ConfigTipo, SiteConfig } from "./admin-types";
import {
    ALLOWED_IMAGE_EXTENSIONS,
    MAX_IMAGE_SIZE_MB,
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
        <div className="group rounded-[26px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f7fbfa] p-5 shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:border-[#9dd8d2] hover:shadow-xl">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                    <label className="block text-base font-bold text-[#10263d]">
                        {campo.label}
                    </label>

                    {campo.ajuda && (
                        <p className="mt-1 text-sm leading-6 text-[#50666a]">
                            {campo.ajuda}
                        </p>
                    )}

                    <p className="mt-2 text-xs font-medium text-[#7b8d91]">
                        Campo técnico: {config.chave} · {formatarTipo(tipo)}
                    </p>
                </div>

                {successKey === config.chave && (
                    <span className="rounded-full bg-[#dff4f2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                        Salvo
                    </span>
                )}
            </div>

            {podeSerMidia && (
                <div className="mt-4 rounded-2xl border border-[#dce8e5] bg-[#f3faf8] p-4">
                    <p className="text-sm font-bold text-[#10263d]">
                        Tipo de conteúdo
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#607579]">
                        Upload local aceita somente imagens. Vídeos por URL serão tratados em etapa futura.
                    </p>

                    <select
                        value="IMAGE"
                        onChange={(event) =>
                            onChangeType(config.chave, event.target.value as ConfigTipo)
                        }
                        className="mt-3 rounded-xl border border-[#b8cfcc] bg-white px-4 py-2 text-sm font-medium text-[#10263d] outline-none transition focus:border-[#0d6666] focus:ring-4 focus:ring-[#0d6666]/10"
                    >
                        <option value="IMAGE">Imagem</option>
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
                        className="mt-4 min-h-[130px] w-full rounded-2xl border border-[#cbd9d7] bg-[#fffdf8] p-4 text-[#10263d] outline-none transition placeholder:text-[#8fa0a2] focus:border-[#0d6666] focus:ring-4 focus:ring-[#0d6666]/10"
                    />

                    <button
                        type="button"
                        onClick={() => onSave(config)}
                        disabled={salvando}
                        className="mt-3 rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] hover:shadow-[#ef4b3f]/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {salvando ? "Salvando..." : "Salvar este campo"}
                    </button>
                </>
            )}

            {podeSerMidia && (tipo === "IMAGE" || tipo === "VIDEO") && (
                <div className="mt-4">
                    <div className="rounded-2xl border border-dashed border-[#8bcac4] bg-[#f3faf8] p-4">
                        <p className="text-sm font-bold text-[#10263d]">
                            Enviar nova imagem
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#607579]">
                            Aceita JPG, PNG ou WEBP. Tamanho máximo: {MAX_IMAGE_SIZE_MB}MB.
                        </p>

                        <input
                            type="file"
                            accept={ALLOWED_IMAGE_EXTENSIONS}
                            onChange={(event) => onUpload(event, config)}
                            disabled={enviando}
                            className="mt-3 block w-full cursor-pointer rounded-xl border border-[#cbd9d7] bg-white text-sm text-[#10263d] file:mr-4 file:border-0 file:bg-[#0d6666] file:px-4 file:py-3 file:text-sm file:font-bold file:text-white hover:file:bg-[#0a5555] disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        {enviando && (
                            <p className="mt-2 text-sm font-medium text-[#0d6666]">
                                Enviando imagem...
                            </p>
                        )}
                    </div>

                    {previewUrl && tipo === "IMAGE" ? (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-bold text-[#10263d]">
                                Prévia atual
                            </p>

                            <img
                                src={previewUrl}
                                alt={campo.label}
                                className="max-h-72 w-full max-w-xl rounded-2xl border border-[#dce8e5] object-cover shadow-sm"
                            />
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-[#607579]">
                            Nenhuma imagem enviada ainda.
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={() => onSave(config)}
                        disabled={salvando}
                        className="mt-3 rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] hover:shadow-[#ef4b3f]/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {salvando ? "Salvando..." : "Salvar tipo selecionado"}
                    </button>
                </div>
            )}
        </div>
    );
}
