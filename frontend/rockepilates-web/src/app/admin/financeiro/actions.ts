"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

function getBaseUrl(): string {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

export async function marcarPagamentoComoPago(
    assinaturaId: number
) {
    const cookieStore = await cookies();

    const response = await fetch(
        `${getBaseUrl()}/bff/alunos/assinaturas/${assinaturaId}/pagar`,
        {
            method: "PATCH",
            headers: {
                Cookie: cookieStore.toString(),
            },
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao marcar pagamento como pago");
    }

    revalidatePath("/admin/financeiro");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/alunos");
}