import type { Depoimento } from "./admin-types";

type DepoimentoCardProps = {
    depoimento: Depoimento;
    tipo: "pendente" | "aprovado";
    changingDepoimentoId: number | null;
    onAprovar: (id: number) => void;
    onDesaprovar: (id: number) => void;
};

export function DepoimentoCard({
                                   depoimento,
                                   tipo,
                                   changingDepoimentoId,
                                   onAprovar,
                                   onDesaprovar,
                               }: DepoimentoCardProps) {
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
        <div className={cardClass}>
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
                        onClick={() => onAprovar(depoimento.id)}
                        disabled={alterando}
                        className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {alterando ? "Aprovando..." : "Aprovar"}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onDesaprovar(depoimento.id)}
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