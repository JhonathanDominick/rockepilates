"use server";

import { revalidatePath } from "next/cache";
import { atualizarObservacoesInternasAdmin } from "@/lib/api/admin-alunos";

export async function salvarObservacoesInternasAction(
    alunoId: number,
    observacoesInternas: string
) {
    await atualizarObservacoesInternasAdmin(
        alunoId,
        observacoesInternas
    );

    revalidatePath(`/admin/alunos/${alunoId}`);
}