import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
    buscarPagamentosAlunoPaginado,
    buscarResumoFinanceiroAluno,
    type PagamentoAluno,
} from "@/lib/api/aluno-perfil";
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

function formatarStatusFinanceiro(status: string) {
    if (status === "EM_DIA") {
        return "EM DIA";
    }

    return status.replaceAll("_", " ");
}

function formatarStatusPagamento(status: string) {
    return status.replaceAll("_", " ");
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

    if (s.includes("AUSENTE")) {
        return "bg-[#eef1f1] text-[#5f6f72] border-[#d8dddd]";
    }

    if (s.includes("CANCELADO")) {
        return "bg-[#eef1f1] text-[#5f6f72] border-[#d8dddd]";
    }

    return "bg-[#eef7f6] text-[#255252] border-[#cfe7e4]";
}

function getCardClass(tipo: string) {
    if (tipo === "danger") {
        return "border-[#ffd2cb] bg-[#fff4f1]";
    }

    if (tipo === "warning") {
        return "border-[#ffe0a6] bg-[#fff8eb]";
    }

    if (tipo === "success") {
        return "border-[#b8e5df] bg-[#effaf8]";
    }

    return "border-[#dce8e5] bg-white";
}

function montarUrlPagina(params: {
    status: string;
    inicio?: string;
    fim?: string;
    page: number;
}) {
    const search = new URLSearchParams();

    if (params.status && params.status !== "TODOS") {
        search.set("status", params.status);
    }

    if (params.inicio) {
        search.set("inicio", params.inicio);
    }

    if (params.fim) {
        search.set("fim", params.fim);
    }

    if (params.page > 0) {
        search.set("page", String(params.page));
    }

    const query = search.toString();

    return query ? `/aluno/financeiro?${query}` : "/aluno/financeiro";
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
    const inicio = params.inicio?.trim() || undefined;
    const fim = params.fim?.trim() || undefined;
    const pageParam = Number(params.page ?? "0");
    const page = Number.isNaN(pageParam) || pageParam < 0 ? 0 : pageParam;

    const [historico, resumo] = await Promise.all([
        buscarPagamentosAlunoPaginado({
            status,
            inicio,
            fim,
            page,
            size: 6,
        }),
        buscarResumoFinanceiroAluno(),
    ]);

    const pagamentos = historico.content ?? [];

    const possuiFiltroAtivo =
        status !== "TODOS" || Boolean(inicio) || Boolean(fim);

    return (
        <main className="min-h-screen bg-[#f6fbfa] px-4 py-6 md:px-6 md:py-10">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/aluno/perfil"
                    className="inline-flex items-center gap-2 rounded-full border border-[#b8e5df] bg-white px-4 py-2 text-sm font-bold text-[#0d6666] transition hover:bg-[#eaf7f5]"
                >
                    ← Voltar ao perfil
                </Link>

                <section className="mt-5 rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] p-5 shadow-sm md:p-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0d6666]">
                        Financeiro
                    </p>

                    <h1 className="mt-3 text-3xl font-black leading-tight text-[#10263d] md:text-5xl">
                        Histórico financeiro completo
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#607579]">
                        Os pagamentos são registrados manualmente pela
                        professora. Acompanhe aqui vencimentos, confirmações e
                        status dos ciclos financeiros.
                    </p>
                </section>

                <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div
                        className={`rounded-[24px] border p-5 shadow-sm ${getCardClass(
                            resumo.pagamentosAtrasados > 0
                                ? "danger"
                                : "success"
                        )}`}
                    >
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Status financeiro
                        </p>

                        <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                            {formatarStatusFinanceiro(resumo.statusFinanceiro)}
                        </h2>
                    </div>

                    <div
                        className={`rounded-[24px] border p-5 shadow-sm ${getCardClass(
                            resumo.pagamentosPendentes > 0
                                ? "warning"
                                : "success"
                        )}`}
                    >
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Pagamentos pendentes
                        </p>

                        <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                            {resumo.pagamentosPendentes}
                        </h2>
                    </div>

                    <div
                        className={`rounded-[24px] border p-5 shadow-sm ${getCardClass(
                            resumo.pagamentosAtrasados > 0
                                ? "danger"
                                : "success"
                        )}`}
                    >
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Pagamentos atrasados
                        </p>

                        <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                            {resumo.pagamentosAtrasados}
                        </h2>
                    </div>

                    <div className="rounded-[24px] border border-[#dce8e5] bg-white p-5 shadow-sm">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Próximo vencimento
                        </p>

                        <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                            {formatarData(resumo.proximoVencimento)}
                        </h2>
                    </div>
                </section>

                <section className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-[#dce8e5] bg-white p-5 shadow-sm">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Última confirmação
                        </p>

                        <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                            {resumo.ultimoPagamentoConfirmado
                                ? formatarData(
                                    resumo.ultimoPagamentoConfirmado
                                )
                                : "Sem confirmação"}
                        </h2>
                    </div>

                    <div className="rounded-[24px] border border-[#dce8e5] bg-white p-5 shadow-sm">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#607579]">
                            Assinatura
                        </p>

                        <h2 className="mt-3 text-2xl font-black text-[#10263d]">
                            {formatarStatusFinanceiro(
                                resumo.statusAssinatura
                            )}
                        </h2>
                    </div>
                </section>

                <FinanceiroAlunoClient
                    status={status}
                    inicio={inicio}
                    fim={fim}
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
                                    {possuiFiltroAtivo
                                        ? "Nenhum registro corresponde aos filtros aplicados. Ajuste os filtros para consultar outros pagamentos."
                                        : "Quando houver registros financeiros, eles aparecerão aqui."}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 md:space-y-6">
                                {pagamentos.map(
                                    (pagamento: PagamentoAluno) => (
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
                                                        {formatarStatusPagamento(
                                                            pagamento.status
                                                        )}
                                                    </span>

                                                    <h3 className="text-2xl font-black text-[#10263d] md:text-3xl">
                                                        {formatarMoeda(
                                                            pagamento.valor
                                                        )}
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
                                    )
                                )}
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
                                    <Link
                                        href={montarUrlPagina({
                                            status,
                                            inicio,
                                            fim,
                                            page: page - 1,
                                        })}
                                        className="rounded-2xl border border-[#b8e5df] px-5 py-3 text-sm font-bold text-[#0d6666] transition hover:bg-[#eef7f6]"
                                    >
                                        ← Anterior
                                    </Link>
                                )}

                                {!historico.last && (
                                    <Link
                                        href={montarUrlPagina({
                                            status,
                                            inicio,
                                            fim,
                                            page: page + 1,
                                        })}
                                        className="rounded-2xl bg-[#0d6666] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                                    >
                                        Próxima →
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>
                </FinanceiroAlunoClient>
            </div>
        </main>
    );
}