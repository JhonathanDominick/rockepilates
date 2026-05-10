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

function getStatusClass(status: string) {
    const statusNormalizado = status?.toUpperCase();

    if (statusNormalizado.includes("PENDENTE")) {
        return "bg-[#ffe3dc] text-[#b33127] border-[#ffc8bd]";
    }

    if (statusNormalizado.includes("ATIVA") || statusNormalizado.includes("PAGO")) {
        return "bg-[#dff4f2] text-[#0d6666] border-[#b8e5df]";
    }

    if (statusNormalizado.includes("VENCIDA")) {
        return "bg-[#fff1d6] text-[#9a5b00] border-[#ffd98c]";
    }

    if (statusNormalizado.includes("CANCELADA")) {
        return "bg-[#eef1f1] text-[#5f6f72] border-[#d8dddd]";
    }

    return "bg-[#eef7f6] text-[#255252] border-[#cfe7e4]";
}

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
            <div className="overflow-hidden rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] shadow-sm">
                <div className="flex flex-col gap-2 border-b border-[#dce8e5] px-5 py-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-[#10263d]">
                            Lista de alunos
                        </h2>

                        <p className="mt-1 text-sm text-[#607579]">
                            {alunos.length} aluno(s) encontrado(s)
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[960px] text-left text-sm">
                        <thead className="bg-[#eaf7f5] text-xs uppercase tracking-wide text-[#255252]">
                        <tr>
                            <th className="px-5 py-4">Aluno</th>
                            <th className="px-5 py-4">Email</th>
                            <th className="px-5 py-4">Telefone</th>
                            <th className="px-5 py-4">Plano</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Vencimento</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[#e1ece9]">
                        {alunos.map((aluno) => (
                            <tr
                                key={aluno.assinaturaId}
                                className="transition hover:bg-[#f0faf8]"
                            >
                                <td className="px-5 py-5">
                                    <div>
                                        <p className="font-bold text-[#10263d]">
                                            {aluno.nome}
                                        </p>

                                        <p className="mt-1 text-xs text-[#7b8d91]">
                                            ID aluno: {aluno.alunoId}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-5 py-5 text-[#50666a]">
                                    {aluno.email}
                                </td>

                                <td className="px-5 py-5 text-[#50666a]">
                                    {aluno.telefone}
                                </td>

                                <td className="px-5 py-5">
                                        <span className="rounded-full border border-[#b8e5df] bg-[#dff4f2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                                            {aluno.plano}
                                        </span>
                                </td>

                                <td className="px-5 py-5">
                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                                aluno.status
                                            )}`}
                                        >
                                            {aluno.status}
                                        </span>
                                </td>

                                <td className="px-5 py-5 font-medium text-[#50666a]">
                                    {aluno.dataVencimento}
                                </td>
                            </tr>
                        ))}

                        {alunos.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-10 text-center text-[#607579]"
                                >
                                    Nenhum aluno encontrado.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}