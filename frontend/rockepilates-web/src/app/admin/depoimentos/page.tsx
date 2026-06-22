"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { DepoimentoCard } from "@/components/admin/DepoimentoCard";
import type { Depoimento } from "@/components/admin/admin-types";

import {
    listarDepoimentosAdmin,
    aprovarDepoimento,
    desaprovarDepoimento,
} from "@/lib/api/admin-depoimentos";

export default function AdminDepoimentosPage() {
    const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
    const [loading, setLoading] = useState(true);

    const [changingDepoimentoId, setChangingDepoimentoId] = useState<number | null>(null);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error">("success");

    const depoimentosPendentes = depoimentos.filter(
        (depoimento) => !depoimento.aprovado
    );

    const depoimentosAprovados = depoimentos.filter(
        (depoimento) => depoimento.aprovado
    );

    function mostrarMensagem(
        texto: string,
        tipo: "success" | "error" = "success"
    ) {
        setMessage(texto);
        setMessageType(tipo);
    }

    useEffect(() => {
        carregarDepoimentos();
    }, []);

    async function carregarDepoimentos() {
        try {
            setLoading(true);

            const data = await listarDepoimentosAdmin();
            setDepoimentos(data);
        } catch (error) {
            console.error("Erro ao carregar depoimentos:", error);

            mostrarMensagem(
                "Erro ao carregar depoimentos.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleAprovarDepoimento(id: number) {
        try {
            setChangingDepoimentoId(id);

            await aprovarDepoimento(id);
            await carregarDepoimentos();

            mostrarMensagem(
                "Depoimento aprovado com sucesso.",
                "success"
            );
        } catch (error) {
            console.error("Erro ao aprovar depoimento:", error);

            mostrarMensagem(
                "Erro ao aprovar depoimento.",
                "error"
            );
        } finally {
            setChangingDepoimentoId(null);
        }
    }

    async function handleDesaprovarDepoimento(id: number) {
        try {
            setChangingDepoimentoId(id);

            await desaprovarDepoimento(id);
            await carregarDepoimentos();

            mostrarMensagem(
                "Depoimento desaprovado com sucesso.",
                "success"
            );
        } catch (error) {
            console.error("Erro ao desaprovar depoimento:", error);

            mostrarMensagem(
                "Erro ao desaprovar depoimento.",
                "error"
            );
        } finally {
            setChangingDepoimentoId(null);
        }
    }

    return (
        <AdminLayout
            title="Depoimentos"
            description="Gerencie os depoimentos exibidos na home do site."
        >
            {message && (
                <AdminMessage
                    message={message}
                    type={messageType}
                />
            )}

            {loading && (
                <p className="text-gray-600">
                    Carregando depoimentos...
                </p>
            )}

            {!loading && depoimentos.length === 0 && (
                <p className="text-gray-500">
                    Nenhum depoimento encontrado.
                </p>
            )}

            {!loading && depoimentos.length > 0 && (
                <div className="flex flex-col gap-10">
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Pendentes ({depoimentosPendentes.length})
                        </h2>

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
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Aprovados ({depoimentosAprovados.length})
                        </h2>

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
        </AdminLayout>
    );
}