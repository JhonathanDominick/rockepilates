"use client";

import { useState, useTransition } from "react";
import { cancelarAssinaturaAction } from "@/app/admin/alunos/[id]/actions";

type CancelarAssinaturaButtonProps = {
    alunoId: number;
    assinaturaId: number;
    status: string;
};

export function CancelarAssinaturaButton({
                                             alunoId,
                                             assinaturaId,
                                             status,
                                         }: CancelarAssinaturaButtonProps) {
    const [modalAberto, setModalAberto] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const assinaturaCancelada = status === "CANCELADA";

    function confirmarCancelamento() {
        setErro(null);

        startTransition(async () => {
            try {
                await cancelarAssinaturaAction(alunoId, assinaturaId);
                setModalAberto(false);
            } catch (error) {
                console.error(error);
                setErro("Não foi possível cancelar a assinatura.");
            }
        });
    }

    if (assinaturaCancelada) {
        return (
            <p className="mt-5 rounded-2xl border border-[#d8dddd] bg-[#eef1f1] px-4 py-3 text-sm font-bold text-[#5f6f72]">
                Assinatura cancelada.
            </p>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="mt-5 rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-5 py-3 text-sm font-bold text-[#b33127] transition hover:bg-[#ffd4ca]"
            >
                Cancelar assinatura
            </button>

            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b33127]">
                            Confirmação
                        </p>

                        <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                            Cancelar assinatura?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#607579]">
                            Esta ação marcará a assinatura como cancelada e
                            cancelará cobranças pendentes abertas. O histórico
                            financeiro pago continuará preservado.
                        </p>

                        {erro && (
                            <p className="mt-4 text-sm font-bold text-[#b33127]">
                                {erro}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                disabled={isPending}
                                className="rounded-xl border border-[#dce8e5] px-4 py-2 text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5] disabled:opacity-60"
                            >
                                Voltar
                            </button>

                            <button
                                type="button"
                                onClick={confirmarCancelamento}
                                disabled={isPending}
                                className="rounded-xl bg-[#ef4b3f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isPending
                                    ? "Cancelando..."
                                    : "Confirmar cancelamento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}