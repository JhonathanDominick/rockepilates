import { AdminLayout } from "@/components/admin/AdminLayout";
import { listarAlunosAdmin } from "@/lib/api/admin-alunos";

type AlunoAdmin = {
    assinaturaId: number;
    alunoId: number;
    nome: string;
    email: string;
    telefone: string;
    plano: string;
    status: string;
    dataVencimento: string;
};

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
            <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-3">Aluno</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Telefone</th>
                        <th className="px-4 py-3">Plano</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Vencimento</th>
                    </tr>
                    </thead>

                    <tbody>
                    {alunos.map((aluno) => (
                        <tr key={aluno.assinaturaId} className="border-t">
                            <td className="px-4 py-3 font-medium text-gray-950">
                                {aluno.nome}
                            </td>

                            <td className="px-4 py-3 text-gray-700">
                                {aluno.email}
                            </td>

                            <td className="px-4 py-3 text-gray-700">
                                {aluno.telefone}
                            </td>

                            <td className="px-4 py-3 text-gray-700">
                                {aluno.plano}
                            </td>

                            <td className="px-4 py-3">
                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                                        {aluno.status}
                                    </span>
                            </td>

                            <td className="px-4 py-3 text-gray-700">
                                {aluno.dataVencimento}
                            </td>
                        </tr>
                    ))}

                    {alunos.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-4 py-8 text-center text-gray-500"
                            >
                                Nenhum aluno encontrado.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}