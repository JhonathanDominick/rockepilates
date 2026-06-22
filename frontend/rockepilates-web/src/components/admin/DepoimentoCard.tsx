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
    const isPendente = tipo === "pendente";

    return (
        <div className="group relative overflow-hidden rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] p-6 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-[#8bcac4] hover:shadow-xl">
            <div
                className={`absolute inset-x-0 top-0 h-1 ${
                    isPendente
                        ? "bg-gradient-to-r from-[#ef4b3f] to-[#ff826f]"
                        : "bg-gradient-to-r from-[#0d6666] to-[#7fd8d4]"
                }`}
            />

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold tracking-tight text-[#10263d]">
                            {depoimento.nome}
                        </h3>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                                isPendente
                                    ? "bg-[#ffe3dc] text-[#b33127]"
                                    : "bg-[#dff4f2] text-[#0d6666]"
                            }`}
                        >
                            {isPendente ? "Pendente" : "Aprovado"}
                        </span>
                    </div>

                    <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#50666a]">
                        {depoimento.mensagem}
                    </p>
                </div>

                <div className="shrink-0">
                    {isPendente ? (
                        <button
                            type="button"
                            onClick={() => onAprovar(depoimento.id)}
                            disabled={alterando}
                            className="rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#dc3f34] hover:shadow-[#ef4b3f]/30 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {alterando ? "Aprovando..." : "Aprovar"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onDesaprovar(depoimento.id)}
                            disabled={alterando}
                            className="rounded-2xl border border-[#b8cfcc] bg-white px-5 py-3 text-sm font-bold text-[#0d6666] shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-[#0d6666] hover:bg-[#dff4f2] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {alterando ? "Desaprovando..." : "Desaprovar"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}