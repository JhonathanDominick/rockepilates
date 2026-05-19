import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { buscarPagamentosAlunoPaginado } from "@/lib/api/aluno-perfil";
import { FinanceiroAlunoClient } from "./FinanceiroAlunoClient";

type PageProps = {
    searchParams: Promise<{
        status?: string;
        inicio?: string;
        fim?: string;
        page?: string;
    }>;
};

function formatarData(data: string | null) {
    return data ? data.split("-").reverse().join("/") : "-";
}

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

function getStatusClass(status: string) {
    const s = status?.toUpperCase();

    if (s.includes("ATRASADO")) {
        return "bg-[#ffe3dc] text-[#b33127] border-[#ffc8bd]";
    }

    if (s.includes("PAGO")) {
        return "bg-[#dff4f2] text-[#0d6666] border-[#b8e5df]";
    }

    if (s.includes("PENDENTE")) {
        return "bg-[#fff1d6] text-[#9a5b00] border-[#ffd98c]";
    }

    if (s.includes("CANCELADO")) {
        return "bg-[#eef1f1] text-[#5f6f72] border-[#d8dddd]";
    }

    return "bg-[#eef7f6] text-[#255252] border-[#cfe7e4]";
}

export default async function FinanceiroAlunoPage({
                                                      searchParams,
                                                  }: PageProps) {
    const cookieStore = await cookies();

    const alunoToken = cookieStore.get("aluno_token");

    if (!alunoToken) {
        redirect("/login");
    }

    const params = await searchParams;

    const status = params.status ?? "TODOS";

    const inicio =
        params.inicio?.trim() || undefined;

    const fim =
        params.fim?.trim() || undefined;

    const page = Number(params.page ?? "0");

    const historico =
        await buscarPagamentosAlunoPaginado({
            status,
            inicio,
            fim,
            page,
            size: 6,
        });

    const pagamentos = historico.content ?? [];

    return (
        <main className="min-h-screen bg-[#f6fbfa] px-4 py-6 md:px-6 md:py-10">
            <div className="mx-auto max-w-6xl">

                <a
                    href="/aluno/perfil"
                    className="inline-flex items-center gap-2 rounded-full border border-[#b8e5df] bg-white px-4 py-2 text-sm font-bold text-[#0d6666] transition hover:bg-[#eaf7f5]"
                >
                    ← Voltar ao perfil
                </a>

                <section className="mt-5 rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] p-5 shadow-sm md:p-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                        Financeiro
                    </p>

                    <h1 className="mt-3 text-3xl font-black leading-tight text-[#10263d] md:text-5xl">
                        Histórico financeiro completo
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#607579]">
                        Os pagamentos são registrados manualmente pela professora.
                    </p>
                </section>

                <FinanceiroAlunoClient
                    status={status}
                    inicio={inicio}
                    fim={fim}
                    page={page}
                >

                    <section className="mt-5 rounded-[28px] border border-[#dce8e5] bg-white p-4 shadow-sm md:p-6">

                        {pagamentos.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-[#d7e5e2] bg-[#f8fcfb] px-6 py-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7f6] text-2xl">
                                    📄
                                </div>

                                <p className="mt-5 text-xl font-black text-[#10263d]">
                                    Nenhum pagamento encontrado
                                </p>

                                <p className="mt-2 text-sm leading-6 text-[#607579]">
                                    Ajuste os filtros ou acompanhe novos registros futuramente.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 md:space-y-6">

                                {pagamentos.map((pagamento: any) => (
                                    <div
                                        key={pagamento.id}
                                        className="relative pl-0 md:pl-8"
                                    >

                                        <div className="absolute left-2 top-2 hidden h-full w-px bg-[#dce8e5] md:block" />

                                        <div className="absolute left-0 top-2 hidden h-4 w-4 rounded-full border-4 border-white bg-[#0d6666] shadow md:block" />

                                        <div className="rounded-[24px] border border-[#e2ece9] bg-[#fcfefe] p-4 md:p-5">

                                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

                                                <span
                                                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-bold uppercase ${getStatusClass(
                                                        pagamento.status
                                                    )}`}
                                                >
                                                    {pagamento.status}
                                                </span>

                                                <h3 className="text-2xl font-black text-[#10263d] md:text-3xl">
                                                    {formatarMoeda(pagamento.valor)}
                                                </h3>
                                            </div>

                                            <div className="mt-4 grid gap-2 text-sm text-[#607579] md:grid-cols-2">

                                                <div>
                                                    <span className="font-semibold text-[#10263d]">
                                                        Vencimento:
                                                    </span>{" "}
                                                    {formatarData(
                                                        pagamento.dataVencimento
                                                    )}
                                                </div>

                                                <div>
                                                    <span className="font-semibold text-[#10263d]">
                                                        Confirmação:
                                                    </span>{" "}
                                                    {pagamento.dataPagamento
                                                        ? formatarData(
                                                            pagamento.dataPagamento
                                                        )
                                                        : "Aguardando confirmação"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-8 flex flex-col gap-4 border-t border-[#edf3f1] pt-5 md:flex-row md:items-center md:justify-between">

                            <p className="text-sm text-[#607579]">
                                Página{" "}
                                <strong className="text-[#10263d]">
                                    {historico.page + 1}
                                </strong>{" "}
                                de{" "}
                                <strong className="text-[#10263d]">
                                    {Math.max(historico.totalPages, 1)}
                                </strong>
                            </p>

                            <div className="flex flex-wrap gap-3">

                                {!historico.first && (
                                    <a
                                        href={`?status=${status}&inicio=${inicio ?? ""}&fim=${fim ?? ""}&page=${page - 1}`}
                                        className="rounded-2xl border border-[#b8e5df] px-5 py-3 text-sm font-bold text-[#0d6666] transition hover:bg-[#eef7f6]"
                                    >
                                        ← Anterior
                                    </a>
                                )}

                                {!historico.last && (
                                    <a
                                        href={`?status=${status}&inicio=${inicio ?? ""}&fim=${fim ?? ""}&page=${page + 1}`}
                                        className="rounded-2xl bg-[#0d6666] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                                    >
                                        Próxima →
                                    </a>
                                )}
                            </div>
                        </div>
                    </section>
                </FinanceiroAlunoClient>
            </div>
        </main>
    );
}