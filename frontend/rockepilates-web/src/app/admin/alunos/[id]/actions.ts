"use server";

import { revalidatePath } from "next/cache";

import {
    atualizarAlunoAdmin,
    cancelarAssinaturaAdmin,
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

export async function cancelarAssinaturaAction(
    alunoId: number,
    assinaturaId: number
) {
    await cancelarAssinaturaAdmin(assinaturaId);

    revalidatePath(`/admin/alunos/${alunoId}`);
    revalidatePath("/admin/alunos");
    revalidatePath("/admin/financeiro");
    revalidatePath("/admin/dashboard");
}