"use server";

import { revalidatePath } from "next/cache";
import {
    atualizarAlunoAdmin,
    atualizarObservacoesInternasAdmin,
    type AtualizarAlunoAdminPayload,
} from "@/lib/api/admin-alunos";

export async function salvarObservacoesInternasAction(
    alunoId: number,
    observacoesInternas: string
) {
    await atualizarObservacoesInternasAdmin(
        alunoId,
        observacoesInternas
    );

    revalidatePath(`/admin/alunos/${alunoId}`);
    revalidatePath("/admin/alunos");
}

export async function salvarDadosAlunoAdminAction(
    alunoId: number,
    payload: AtualizarAlunoAdminPayload
) {
    await atualizarAlunoAdmin(alunoId, payload);

    revalidatePath(`/admin/alunos/${alunoId}`);
    revalidatePath("/admin/alunos");
}