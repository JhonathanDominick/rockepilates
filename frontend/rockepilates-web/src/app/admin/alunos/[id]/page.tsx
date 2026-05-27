import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ObservacoesInternasAlunoForm } from "@/components/admin/ObservacoesInternasAlunoForm";
import { EditarAlunoAdminForm } from "@/components/admin/EditarAlunoAdminForm";
import { CancelarAssinaturaButton } from "@/components/admin/CancelarAssinaturaButton";
import { MensagemProfessoraAlunoForm } from "@/components/admin/MensagemProfessoraAlunoForm";
import { RedefinirSenhaAlunoAdminForm } from "@/components/admin/RedefinirSenhaAlunoAdminForm";
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
    if (!data) {
        return "-";
    }

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

    if (
        statusNormalizado.includes("CANCELADA") ||
        statusNormalizado.includes("CANCELADO")
    ) {
        return "bg-[#eef1f1] text-[#5f6f72] border-[#d8dddd]";
    }

    return "bg-[#eef7f6] text-[#255252] border-[#cfe7e4]";
}

function somarPorStatus(pagamentos: any[], status: string) {
    return pagamentos
        .filter((pagamento) => pagamento.status === status)
        .reduce((total, pagamento) => total + pagamento.valor, 0);
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

    const pagamentosOrdenados = [...pagamentos].sort((a: any, b: any) =>
        b.dataVencimento.localeCompare(a.dataVencimento)
    );

    const totalPago = somarPorStatus(pagamentos, "PAGO");
    const totalPendente = somarPorStatus(pagamentos, "PENDENTE");
    const totalAtrasado = somarPorStatus(pagamentos, "ATRASADO");
    const totalCancelado = somarPorStatus(pagamentos, "CANCELADO");

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

                        {aluno.status === "CANCELADA" && (
                            <div className="rounded-2xl bg-[#f3faf8] p-4">
                                <p className="text-xs font-bold uppercase text-[#607579]">
                                    Cancelada em
                                </p>

                                <p className="mt-2 text-lg font-black text-[#10263d]">
                                    {formatarData(aluno.dataCancelamento)}
                                </p>
                            </div>
                        )}
                    </div>

                    <CancelarAssinaturaButton
                        alunoId={aluno.alunoId}
                        assinaturaId={aluno.assinaturaId}
                        status={aluno.status}
                    />
                </section>
            </div>

            <EditarAlunoAdminForm
                alunoId={aluno.alunoId}
                nome={aluno.nome}
                telefone={aluno.telefone}
                dataNascimento={aluno.dataNascimento}
                objetivo={aluno.objetivo ?? ""}
                observacoesSaude={aluno.observacoesSaude ?? ""}
            />

            <RedefinirSenhaAlunoAdminForm alunoId={aluno.alunoId} />

            <ObservacoesInternasAlunoForm
                alunoId={aluno.alunoId}
                valorInicial={aluno.observacoesInternas ?? ""}
            />

            <MensagemProfessoraAlunoForm
                alunoId={aluno.alunoId}
                valorInicial={aluno.mensagemProfessora ?? ""}
            />

            <section className="mt-6 rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-[#e1ece9] pb-5 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                            Histórico financeiro
                        </p>

                        <h3 className="mt-2 text-2xl font-black text-[#10263d]">
                            {aluno.nome}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full border border-[#b8e5df] bg-[#dff4f2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                                Plano {aluno.plano}
                            </span>

                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                    aluno.status
                                )}`}
                            >
                                Assinatura {aluno.status}
                            </span>

                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                    aluno.statusPagamento
                                )}`}
                            >
                                Financeiro {aluno.statusPagamento}
                            </span>
                        </div>

                        <p className="mt-3 text-sm text-[#607579]">
                            Assinatura #{aluno.assinaturaId} · Vencimento atual{" "}
                            {formatarData(aluno.dataVencimento)}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl border border-[#b8e5df] bg-[#dff4f2] p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                            Pago
                        </p>

                        <p className="mt-3 text-2xl font-black text-[#10263d]">
                            {formatarMoeda(totalPago)}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#ffd98c] bg-[#fff1d6] p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#9a5b00]">
                            Pendente
                        </p>

                        <p className="mt-3 text-2xl font-black text-[#10263d]">
                            {formatarMoeda(totalPendente)}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#ffc8bd] bg-[#ffe3dc] p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#b33127]">
                            Atrasado
                        </p>

                        <p className="mt-3 text-2xl font-black text-[#10263d]">
                            {formatarMoeda(totalAtrasado)}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#d8dddd] bg-[#eef1f1] p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#5f6f72]">
                            Cancelado
                        </p>

                        <p className="mt-3 text-2xl font-black text-[#10263d]">
                            {formatarMoeda(totalCancelado)}
                        </p>
                    </div>
                </div>

                <div className="mt-6 overflow-x-auto rounded-[28px] border border-[#dce8e5]">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-[#eaf7f5] text-xs uppercase tracking-wide text-[#255252]">
                        <tr>
                            <th className="px-4 py-4">Pagamento</th>
                            <th className="px-4 py-4">Plano</th>
                            <th className="px-4 py-4">Valor</th>
                            <th className="px-4 py-4">Vencimento</th>
                            <th className="px-4 py-4">Pago em</th>
                            <th className="px-4 py-4">Status</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[#e1ece9]">
                        {pagamentosOrdenados.map((pagamento: any) => {
                            const pagamentoAtual =
                                pagamento.dataVencimento ===
                                aluno.dataVencimento &&
                                pagamento.status !== "CANCELADO" &&
                                aluno.status !== "CANCELADA";

                            return (
                                <tr
                                    key={pagamento.id}
                                    className={
                                        pagamentoAtual
                                            ? "bg-[#f0faf8]"
                                            : "bg-white"
                                    }
                                >
                                    <td className="px-4 py-4">
                                        <div className="font-bold text-[#10263d]">
                                            #{pagamento.id}
                                        </div>

                                        {pagamentoAtual && (
                                            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#ef4b3f]">
                                                Pagamento atual
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className="rounded-full border border-[#b8e5df] bg-[#dff4f2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                                            {aluno.plano}
                                        </span>
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
                                        {formatarData(pagamento.dataPagamento)}
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
                            );
                        })}

                        {pagamentosOrdenados.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center"
                                >
                                    <p className="font-bold text-[#10263d]">
                                        Nenhum pagamento encontrado.
                                    </p>

                                    <p className="mt-2 text-sm text-[#607579]">
                                        Quando houver cobranças geradas para
                                        esta assinatura, elas aparecerão aqui.
                                    </p>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>
        </AdminLayout>
    );
}