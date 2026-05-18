import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { buscarPerfilAluno } from "@/lib/api/aluno-perfil";

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

export default async function PerfilAlunoPage() {
    const cookieStore = await cookies();

    const alunoId = cookieStore.get("aluno_id");

    if (!alunoId) {
        redirect("/login");
    }

    const aluno = await buscarPerfilAluno();

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
            </div>
        </main>
    );
}