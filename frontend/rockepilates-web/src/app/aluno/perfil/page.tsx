import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
    buscarPagamentosAluno,
    buscarPerfilAluno,
} from "@/lib/api/aluno-perfil";

function formatarData(data: string | null) {
    if (!data) {
        return "-";
    }

    return data.split("-").reverse().join("/");
}

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
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

export default async function PerfilAlunoPage() {
    const cookieStore = await cookies();

    const alunoToken = cookieStore.get("aluno_token");

    if (!alunoToken) {
        redirect("/login");
    }

    const [aluno, pagamentos] = await Promise.all([
        buscarPerfilAluno(),
        buscarPagamentosAluno(),
    ]);

    const pagamentosPagos = pagamentos.filter(
        (pagamento: any) => pagamento.status === "PAGO"
    );

    const pagamentosPendentes = pagamentos.filter(
        (pagamento: any) =>
            pagamento.status === "PENDENTE" ||
            pagamento.status === "ATRASADO"
    );

    return (
        <main className="min-h-screen bg-[#f6fbfa] px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <a
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b8e5df] bg-white px-5 py-2 text-sm font-bold text-[#0d6666] transition hover:bg-[#eaf7f5]"
                >
                    ← Voltar ao site
                </a>

                <div className="rounded-[32px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] p-8 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                        Área do aluno
                    </p>

                    <h1 className="mt-3 text-4xl font-black text-[#10263d]">
                        Olá, {aluno.nome}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm text-[#607579]">
                        Aqui você pode acompanhar sua assinatura, vencimentos e
                        informações do seu plano.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <span
                            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                aluno.status
                            )}`}
                        >
                            Assinatura {aluno.status}
                        </span>

                        <span
                            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${getStatusClass(
                                aluno.statusPagamento
                            )}`}
                        >
                            Financeiro {aluno.statusPagamento}
                        </span>

                        <span className="rounded-full border border-[#b8e5df] bg-[#dff4f2] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#0d6666]">
                            Plano {aluno.plano}
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] border border-[#dce8e5] bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Pagamentos realizados
                        </p>

                        <p className="mt-3 text-3xl font-black text-[#10263d]">
                            {pagamentosPagos.length}
                        </p>
                    </div>

                    <div className="rounded-[24px] border border-[#dce8e5] bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Pendências em aberto
                        </p>

                        <p className="mt-3 text-3xl font-black text-[#10263d]">
                            {pagamentosPendentes.length}
                        </p>
                    </div>

                    <div className="rounded-[24px] border border-[#dce8e5] bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#607579]">
                            Próximo vencimento
                        </p>

                        <p className="mt-3 text-3xl font-black text-[#10263d]">
                            {formatarData(aluno.dataVencimento)}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <section className="rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-black text-[#10263d]">
                            Meus dados
                        </h2>

                        <div className="mt-6 space-y-5 text-sm">
                            <div>
                                <p className="font-bold text-[#10263d]">
                                    Nome
                                </p>

                                <p className="mt-1 text-[#607579]">
                                    {aluno.nome}
                                </p>
                            </div>

                            <div>
                                <p className="font-bold text-[#10263d]">
                                    E-mail
                                </p>

                                <p className="mt-1 text-[#607579]">
                                    {aluno.email}
                                </p>
                            </div>

                            <div>
                                <p className="font-bold text-[#10263d]">
                                    Telefone
                                </p>

                                <p className="mt-1 text-[#607579]">
                                    {aluno.telefone}
                                </p>
                            </div>

                            <div>
                                <p className="font-bold text-[#10263d]">
                                    Data de nascimento
                                </p>

                                <p className="mt-1 text-[#607579]">
                                    {formatarData(aluno.dataNascimento)}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-black text-[#10263d]">
                            Minha assinatura
                        </h2>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                                    Próximo vencimento
                                </p>

                                <p className="mt-2 text-lg font-black text-[#10263d]">
                                    {formatarData(aluno.dataVencimento)}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-[#f3faf8] p-4">
                                <p className="text-xs font-bold uppercase text-[#607579]">
                                    Objetivo
                                </p>

                                <p className="mt-2 text-sm text-[#607579]">
                                    {aluno.objetivo || "-"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-[#f3faf8] p-4">
                                <p className="text-xs font-bold uppercase text-[#607579]">
                                    Observações de saúde
                                </p>

                                <p className="mt-2 text-sm text-[#607579]">
                                    {aluno.observacoesSaude || "-"}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="mt-6 rounded-[28px] border border-[#dce8e5] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-[#10263d]">
                                Histórico financeiro
                            </h2>

                            <p className="mt-2 text-sm text-[#607579]">
                                Seus pagamentos e vencimentos registrados no
                                sistema.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#b8e5df] bg-[#f3faf8] px-4 py-3 text-xs text-[#4b6666]">
                            Pagamentos realizados diretamente para a professora
                            podem levar um tempo até serem confirmados no
                            sistema.
                        </div>
                    </div>

                    {pagamentos.length === 0 ? (
                        <div className="mt-6 rounded-3xl border border-dashed border-[#d7e5e2] bg-[#f8fcfb] px-6 py-14 text-center">
                            <p className="text-lg font-bold text-[#10263d]">
                                Nenhum registro financeiro encontrado
                            </p>

                            <p className="mt-2 text-sm text-[#607579]">
                                Seus pagamentos aparecerão aqui conforme forem
                                registrados pela administração.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 space-y-4">
                            {pagamentos.map((pagamento: any) => (
                                <div
                                    key={pagamento.id}
                                    className="rounded-[24px] border border-[#e2ece9] bg-[#fcfefe] p-5"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span
                                                    className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${getStatusClass(
                                                        pagamento.status
                                                    )}`}
                                                >
                                                    {pagamento.status}
                                                </span>

                                                <span className="text-xs font-bold uppercase tracking-wide text-[#607579]">
                                                    Vencimento{" "}
                                                    {formatarData(
                                                        pagamento.dataVencimento
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-4 text-2xl font-black text-[#10263d]">
                                                {formatarMoeda(
                                                    pagamento.valor
                                                )}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-5 text-sm text-[#607579]">
                                                <div>
                                                    <span className="font-bold text-[#10263d]">
                                                        Data de vencimento:
                                                    </span>{" "}
                                                    {formatarData(
                                                        pagamento.dataVencimento
                                                    )}
                                                </div>

                                                <div>
                                                    <span className="font-bold text-[#10263d]">
                                                        Confirmação:
                                                    </span>{" "}
                                                    {formatarData(
                                                        pagamento.dataPagamento
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}