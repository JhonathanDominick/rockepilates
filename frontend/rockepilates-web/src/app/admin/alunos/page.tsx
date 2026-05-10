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
            <AlunosAdminTable alunosIniciais={alunos} />
        </AdminLayout>
    );
}