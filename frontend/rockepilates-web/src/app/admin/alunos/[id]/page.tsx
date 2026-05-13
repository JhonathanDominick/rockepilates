import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    buscarAlunoAdminPorId,
    listarPagamentosPorAssinaturaAdmin,
} from "@/lib/api/admin-alunos";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

function formatarData(data: string | null) {
    if (!data) return "-";

    return data.split("-").reverse().join("/");
}

function getStatusClass(status: string) {
    const statusNormalizado = status?.toUpperCase();

    if (statusNormalizado.includes("ATRASADO")) {
        return "bg-[#ffe3dc] text-[#b33127] border-[#ffc8bd]";
    }

    if (
        statusNormalizado.includes("ATIVA") ||
        statusNormalizado.includes("PAGO")
    ) {
        return "bg-[#dff4f2] text-[#0d6666] border-[#b8e5df]";
    }

    if (statusNormalizado.includes("PENDENTE")) {
        return "bg-[#fff1d6] text-[#9a5b00] border-[#ffd98c]";
    }

    if (statusNormalizado.includes("CANCELADA")) {
        return "bg-[#eef1f1] text-[#5f6f72] border-[#d8dddd]";
    }

    return "bg-[#eef7f6] text-[#255252] border-[#cfe7e4]";
}

export default async function AdminAlunoDetalhePage({ params }: PageProps) {
    const { id } = await params;

    const alunoId = Number(id);

    if (Number.isNaN(alunoId)) {
        notFound();
    }

    const aluno = await buscarAlunoAdminPorId(alunoId);

    if (!aluno) {
        notFound();
    }

    const pagamentos = await listarPagamentosPorAssinaturaAdmin(
        aluno.assinaturaId
    );

    return (
        <AdminLayout
            title={aluno.nome}
            description="Perfil administrativo do aluno, assinatura e histórico financeiro."
        >
            <div className="mb-6">
                <Link
                    href="/admin/alunos"
                    className="text-sm font-bold text-[#0d6666] transition hover:text-[#ef4b3f]"
                >
                    ← Voltar para alunos
                </Link>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
                <section className="rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                        Dados do aluno
                    </p>

                    <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                        {aluno.nome}
                    </h2>

                    <div className="mt-6 space-y-4 text-sm">
                        <div>
                            <p className="font-bold text-[#10263d]">E-mail</p>
                            <p className="mt-1 text-[#607579]">{aluno.email}</p>
                        </div>

                        <div>
                            <p className="font-bold text-[#10263d]">Telefone</p>
                            <p className="mt-1 text-[#607579]">
                                {aluno.telefone}
                            </p>
                        </div>

                        <div>
                            <p className="font-bold text-[#10263d]">
                                ID do aluno
                            </p>
                            <p className="mt-1 text-[#607579]">
                                #{aluno.alunoId}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                        Assinatura
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-[#f3faf8] p-4">
                            <p className="text-xs font-bold uppercase text-[#607579]">
                                Plano
                            </p>

                            <p className="mt-2 text-lg font-black text-[#10263d]">
                                {aluno.plano}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#f3faf8] p-4">
                            <p className="text-xs font-bold uppercase text-[#607579]">
                                Vencimento atual
                            </p>

                            <p className="mt-2 text-lg font-black text-[#10263d]">
                                {formatarData(aluno.dataVencimento)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#f3faf8] p-4">
                            <p className="text-xs font-bold uppercase text-[#607579]">
                                Status da assinatura
                            </p>

                            <span
                                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                    aluno.status
                                )}`}
                            >
                                {aluno.status}
                            </span>
                        </div>

                        <div className="rounded-2xl bg-[#f3faf8] p-4">
                            <p className="text-xs font-bold uppercase text-[#607579]">
                                Status financeiro
                            </p>

                            <span
                                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                    aluno.statusPagamento
                                )}`}
                            >
                                {aluno.statusPagamento}
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            <section className="mt-6 rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                    Histórico financeiro
                </p>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-[#eaf7f5] text-xs uppercase tracking-wide text-[#255252]">
                        <tr>
                            <th className="px-4 py-3">Pagamento</th>
                            <th className="px-4 py-3">Valor</th>
                            <th className="px-4 py-3">Vencimento</th>
                            <th className="px-4 py-3">Pago em</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[#e1ece9]">
                        {pagamentos.map((pagamento: any) => (
                            <tr key={pagamento.id}>
                                <td className="px-4 py-4 font-bold text-[#10263d]">
                                    #{pagamento.id}
                                </td>

                                <td className="px-4 py-4 font-medium text-[#50666a]">
                                    {formatarMoeda(pagamento.valor)}
                                </td>

                                <td className="px-4 py-4 text-[#50666a]">
                                    {formatarData(
                                        pagamento.dataVencimento
                                    )}
                                </td>

                                <td className="px-4 py-4 text-[#50666a]">
                                    {formatarData(
                                        pagamento.dataPagamento
                                    )}
                                </td>

                                <td className="px-4 py-4">
                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                                pagamento.status
                                            )}`}
                                        >
                                            {pagamento.status}
                                        </span>
                                </td>
                            </tr>
                        ))}

                        {pagamentos.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-[#607579]"
                                >
                                    Nenhum pagamento encontrado.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-6 rounded-[28px] border border-dashed border-[#b8e5df] bg-[#f3faf8] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                    Próxima evolução
                </p>

                <h3 className="mt-3 text-xl font-black text-[#10263d]">
                    Observações internas da professora
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#607579]">
                    Este espaço será evoluído para permitir que a admin registre
                    observações internas sobre o aluno, saúde, objetivo,
                    evolução e mensagens futuras para a área do aluno.
                </p>
            </section>
        </AdminLayout>
    );
}