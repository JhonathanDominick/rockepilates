"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { criarUrlBff, normalizarId } from "@/lib/server/bff-url";

export async function marcarPagamentoComoPago(
    assinaturaId: number
) {
    const cookieStore = await cookies();
    const id = normalizarId(assinaturaId);

    const response = await fetch(
        criarUrlBff(`/bff/alunos/assinaturas/${id}/pagar`),
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
