import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    AlunosAdminTable,
    type AlunoAdmin,
} from "@/components/admin/AlunosAdminTable";
import { listarAlunosAdmin } from "@/lib/api/admin-alunos";

export default async function AdminAlunosPage() {
    let alunos: AlunoAdmin[] = [];

    try {
        alunos = await listarAlunosAdmin();
    } catch (error) {
        console.error("Erro ao listar alunos:", error);
    }

    return (
        <AdminLayout
            title="Alunos e Assinaturas"
            description="Controle dos alunos cadastrados e situação dos planos."
        >
            <div className="mb-6 flex justify-end">
                <Link
                    href="/admin/alunos/novo"
                    className="rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34]"
                >
                    Novo aluno
                </Link>
            </div>

            <AlunosAdminTable alunosIniciais={alunos} />
        </AdminLayout>
    );
}