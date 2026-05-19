"use server";

import { revalidatePath } from "next/cache";


import {
    atualizarAlunoAdmin,
    cancelarAssinaturaAdmin,
    atualizarObservacoesInternasAdmin,
    atualizarMensagemProfessoraAdmin,
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

export async function salvarMensagemProfessoraAction(
    alunoId: number,
    mensagemProfessora: string
) {
    await atualizarMensagemProfessoraAdmin(
        alunoId,
        mensagemProfessora
    );

    revalidatePath(`/admin/alunos/${alunoId}`);
    revalidatePath("/admin/alunos");
    revalidatePath("/aluno/perfil");
}