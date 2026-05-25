"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    importarAlunoRetroativo,
    ImportarAlunoRetroativoRequest,
    StatusPagamentoRetroativo,
} from "@/lib/api/admin-alunos-client";

type PagamentoForm = {
    dataVencimento: string;
    dataPagamento: string;
    status: StatusPagamentoRetroativo;
};

type TipoPlano = ImportarAlunoRetroativoRequest["tipoPlano"];

function getDuracaoPlanoMeses(tipoPlano: TipoPlano) {
    if (tipoPlano === "SEMESTRAL") {
        return 6;
    }

    if (tipoPlano === "ANUAL") {
        return 12;
    }

    return 1;
}

function formatarDataInput(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function parseDataLocal(data: string) {
    return new Date(`${data}T00:00:00`);
}

function addMeses(data: Date, meses: number) {
    const novaData = new Date(data);
    novaData.setMonth(novaData.getMonth() + meses);
    return novaData;
}

function isCicloAtual(dataVencimento: string) {
    if (!dataVencimento) {
        return false;
    }

    const hoje = new Date();
    const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const vencimento = parseDataLocal(dataVencimento);

    return vencimento >= inicioMesAtual && vencimento <= fimMesAtual;
}

function isDataFutura(data: string) {
    if (!data) {
        return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataInformada = parseDataLocal(data);

    return dataInformada > hoje;
}

function isDataVencida(data: string) {
    if (!data) {
        return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataInformada = parseDataLocal(data);

    return dataInformada < hoje;
}

function statusPadraoParaCiclo(dataVencimento: string): StatusPagamentoRetroativo {
    if (isDataVencida(dataVencimento)) {
        return "ATRASADO";
    }

    return "PENDENTE";
}

function gerarCiclosFinanceiros(
    dataInicioAssinatura: string,
    tipoPlano: TipoPlano,
    pagamentosAtuais: PagamentoForm[]
): PagamentoForm[] {
    if (!dataInicioAssinatura) {
        return [
            {
                dataVencimento: "",
                dataPagamento: "",
                status: "PAGO",
            },
        ];
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const fimMesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const duracaoMeses = getDuracaoPlanoMeses(tipoPlano);
    const dataInicio = parseDataLocal(dataInicioAssinatura);

    const ciclos: PagamentoForm[] = [];
    let vencimento = dataInicio;
    let index = 0;

    while (vencimento <= fimMesAtual) {
        const dataVencimento = formatarDataInput(vencimento);
        const pagamentoExistente = pagamentosAtuais.find(
            (pagamento) => pagamento.dataVencimento === dataVencimento
        );

        if (index === 0) {
            ciclos.push({
                dataVencimento,
                dataPagamento: pagamentoExistente?.dataPagamento ?? "",
                status: "PAGO",
            });
        } else {
            ciclos.push({
                dataVencimento,
                dataPagamento: pagamentoExistente?.dataPagamento ?? "",
                status:
                    pagamentoExistente?.status ??
                    statusPadraoParaCiclo(dataVencimento),
            });
        }

        vencimento = addMeses(vencimento, duracaoMeses);
        index++;
    }

    return ciclos;
}

function getStatusPermitidos(
    pagamento: PagamentoForm,
    primeiroCiclo: boolean
): StatusPagamentoRetroativo[] {
    if (primeiroCiclo) {
        return ["PAGO"];
    }

    if (isDataVencida(pagamento.dataVencimento)) {
        return ["PAGO", "ATRASADO", "AUSENTE"];
    }

    if (isCicloAtual(pagamento.dataVencimento)) {
        return ["PAGO", "PENDENTE", "AUSENTE"];
    }

    return ["PAGO", "PENDENTE", "AUSENTE"];
}

function labelStatus(status: StatusPagamentoRetroativo) {
    if (status === "PAGO") {
        return "Pago";
    }

    if (status === "ATRASADO") {
        return "Atrasado";
    }

    if (status === "AUSENTE") {
        return "Ausente";
    }

    return "Pendente";
}

export default function ImportarAlunoRetroativoPage() {
    const router = useRouter();

    const [form, setForm] = useState<
        Omit<ImportarAlunoRetroativoRequest, "pagamentos"> & {
        confirmarSenha: string;
    }
    >({
        nome: "",
        email: "",
        telefone: "",
        dataNascimento: "",
        objetivo: "",
        observacoesSaude: "",
        senha: "",
        confirmarSenha: "",
        tipoPlano: "MENSAL",
        dataInicioAssinatura: "",
    });

    const [pagamentos, setPagamentos] = useState<PagamentoForm[]>([
        {
            dataVencimento: "",
            dataPagamento: "",
            status: "PAGO",
        },
    ]);

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    function handleChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = event.target;

        setForm((prev) => {
            const formAtualizado = {
                ...prev,
                [name]: value,
            };

            if (
                name === "dataInicioAssinatura" ||
                name === "tipoPlano"
            ) {
                setPagamentos((atuais) =>
                    gerarCiclosFinanceiros(
                        formAtualizado.dataInicioAssinatura,
                        formAtualizado.tipoPlano,
                        atuais
                    )
                );
            }

            return formAtualizado;
        });
    }

    function atualizarPagamento(
        index: number,
        campo: keyof PagamentoForm,
        valor: string
    ) {
        setPagamentos((atuais) =>
            atuais.map((pagamento, i) => {
                if (i !== index) {
                    return pagamento;
                }

                if (index === 0) {
                    return {
                        ...pagamento,
                        status: "PAGO",
                        dataPagamento:
                            campo === "dataPagamento"
                                ? valor
                                : pagamento.dataPagamento,
                    };
                }

                const atualizado: PagamentoForm = {
                    ...pagamento,
                };

                if (campo === "dataPagamento") {
                    atualizado.dataPagamento = valor;
                }

                if (campo === "status") {
                    const novoStatus = valor as StatusPagamentoRetroativo;
                    const statusPermitidos = getStatusPermitidos(
                        pagamento,
                        false
                    );

                    if (!statusPermitidos.includes(novoStatus)) {
                        return pagamento;
                    }

                    atualizado.status = novoStatus;

                    if (novoStatus !== "PAGO") {
                        atualizado.dataPagamento = "";
                    }
                }

                return atualizado;
            })
        );
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            setLoading(true);
            setErro(null);

            if (form.senha !== form.confirmarSenha) {
                setErro("As senhas não coincidem.");
                return;
            }

            if (!form.dataInicioAssinatura) {
                setErro("Informe a data de início da assinatura.");
                return;
            }

            const hoje = new Date();
            const primeiroDiaMesAtual = new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                1
            );

            if (
                parseDataLocal(form.dataInicioAssinatura) >=
                primeiroDiaMesAtual
            ) {
                setErro(
                    "A importação de aluno existente deve ser usada apenas para alunos com início anterior ao mês atual."
                );
                return;
            }

            if (isDataFutura(form.dataInicioAssinatura)) {
                setErro("A data de início da assinatura não pode ser futura.");
                return;
            }

            const ciclosEsperados = gerarCiclosFinanceiros(
                form.dataInicioAssinatura,
                form.tipoPlano,
                pagamentos
            );

            if (pagamentos.length !== ciclosEsperados.length) {
                setErro(
                    "O histórico financeiro precisa conter todos os ciclos até o mês atual."
                );
                return;
            }

            const existeCicloDiferenteDoEsperado = ciclosEsperados.some(
                (cicloEsperado, index) =>
                    pagamentos[index]?.dataVencimento !==
                    cicloEsperado.dataVencimento
            );

            if (existeCicloDiferenteDoEsperado) {
                setErro(
                    "O histórico financeiro possui ciclos inconsistentes. Gere novamente os ciclos alterando a data de início ou o plano."
                );
                return;
            }

            const primeiroPagamento = pagamentos[0];

            if (!primeiroPagamento) {
                setErro("O primeiro ciclo financeiro é obrigatório.");
                return;
            }

            if (
                primeiroPagamento.dataVencimento !== form.dataInicioAssinatura
            ) {
                setErro(
                    "O vencimento do primeiro ciclo precisa ser igual à data de início da assinatura."
                );
                return;
            }

            if (primeiroPagamento.status !== "PAGO") {
                setErro("O primeiro ciclo financeiro deve estar como PAGO.");
                return;
            }

            if (!primeiroPagamento.dataPagamento) {
                setErro(
                    "Informe a data de pagamento do primeiro ciclo financeiro."
                );
                return;
            }

            if (isDataFutura(primeiroPagamento.dataPagamento)) {
                setErro(
                    "A data de pagamento do primeiro ciclo não pode ser futura."
                );
                return;
            }

            const pagamentoPagoSemData = pagamentos.some(
                (pagamento) =>
                    pagamento.status === "PAGO" && !pagamento.dataPagamento
            );

            if (pagamentoPagoSemData) {
                setErro(
                    "Todo ciclo com status PAGO precisa ter data de pagamento."
                );
                return;
            }

            const pagamentoPagoComDataFutura = pagamentos.some(
                (pagamento) =>
                    pagamento.status === "PAGO" &&
                    isDataFutura(pagamento.dataPagamento)
            );

            if (pagamentoPagoComDataFutura) {
                setErro(
                    "Ciclo com status PAGO não pode ter data de pagamento futura."
                );
                return;
            }

            const pendenteVencido = pagamentos.some(
                (pagamento) =>
                    pagamento.status === "PENDENTE" &&
                    isDataVencida(pagamento.dataVencimento)
            );

            if (pendenteVencido) {
                setErro(
                    "Pagamento vencido não pode ser importado como PENDENTE."
                );
                return;
            }

            const atrasadoNaoVencido = pagamentos.some(
                (pagamento) =>
                    pagamento.status === "ATRASADO" &&
                    !isDataVencida(pagamento.dataVencimento)
            );

            if (atrasadoNaoVencido) {
                setErro(
                    "Pagamento ainda não vencido não pode ser importado como ATRASADO."
                );
                return;
            }

            const pagamentosNormalizados = pagamentos.map((pagamento, index) => {
                if (index === 0) {
                    return {
                        dataVencimento: form.dataInicioAssinatura,
                        dataPagamento: pagamento.dataPagamento,
                        status: "PAGO" as StatusPagamentoRetroativo,
                    };
                }

                return {
                    dataVencimento: pagamento.dataVencimento,
                    dataPagamento:
                        pagamento.status === "PAGO"
                            ? pagamento.dataPagamento
                            : null,
                    status: pagamento.status,
                };
            });

            const payload: ImportarAlunoRetroativoRequest = {
                nome: form.nome,
                email: form.email,
                telefone: form.telefone,
                dataNascimento: form.dataNascimento,
                objetivo: form.objetivo,
                observacoesSaude: form.observacoesSaude,
                senha: form.senha,
                tipoPlano: form.tipoPlano,
                dataInicioAssinatura: form.dataInicioAssinatura,
                pagamentos: pagamentosNormalizados,
            };

            await importarAlunoRetroativo(payload);

            router.push("/admin/alunos");
            router.refresh();
        } catch (error) {
            console.error("Erro ao importar aluno retroativo:", error);
            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível importar o aluno retroativo."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminLayout
            title="Importar aluno existente"
            description="Cadastre alunos antigos e registre o histórico financeiro retroativo."
        >
            <div className="mb-6">
                <Link
                    href="/admin/alunos"
                    className="text-sm font-bold text-[#0d6666] transition hover:text-[#ef4b3f]"
                >
                    ← Voltar para alunos
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-[28px] border border-[#dce8e5] bg-gradient-to-br from-white to-[#f3faf8] p-6 shadow-sm"
            >
                {erro && (
                    <p className="mb-5 rounded-2xl border border-[#ffc8bd] bg-[#ffe3dc] px-4 py-3 text-sm font-bold text-[#b33127]">
                        {erro}
                    </p>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Nome
                        </label>
                        <input
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Telefone
                        </label>
                        <input
                            name="telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Data de nascimento
                        </label>
                        <input
                            type="date"
                            name="dataNascimento"
                            value={form.dataNascimento}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Plano
                        </label>
                        <select
                            name="tipoPlano"
                            value={form.tipoPlano}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        >
                            <option value="MENSAL">Mensal</option>
                            <option value="SEMESTRAL">Semestral</option>
                            <option value="ANUAL">Anual</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Data de início da assinatura
                        </label>
                        <input
                            type="date"
                            name="dataInicioAssinatura"
                            value={form.dataInicioAssinatura}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                        <p className="mt-2 text-xs text-[#607579]">
                            Ao informar a data, o sistema gera automaticamente todos os ciclos até o mês atual.
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Senha inicial
                        </label>
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Confirmar senha
                        </label>
                        <input
                            type="password"
                            name="confirmarSenha"
                            value={form.confirmarSenha}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Objetivo com Pilates
                        </label>
                        <textarea
                            name="objetivo"
                            value={form.objetivo}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-bold text-[#10263d]">
                            Observações de saúde
                        </label>
                        <textarea
                            name="observacoesSaude"
                            value={form.observacoesSaude}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                        />
                    </div>
                </div>

                <div className="mt-10">
                    <div className="mb-4">
                        <h2 className="text-lg font-black text-[#10263d]">
                            Histórico financeiro
                        </h2>
                        <p className="text-sm text-[#607579]">
                            Os ciclos são gerados automaticamente conforme o plano. O primeiro ciclo é sempre pago e o ciclo atual é obrigatório.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {pagamentos.map((pagamento, index) => {
                            const primeiroCiclo = index === 0;
                            const statusPermitidos = getStatusPermitidos(
                                pagamento,
                                primeiroCiclo
                            );

                            return (
                                <div
                                    key={pagamento.dataVencimento || index}
                                    className="rounded-3xl border border-[#dce8e5] bg-white p-5"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-sm font-black uppercase tracking-wide text-[#10263d]">
                                            Ciclo #{index + 1}
                                        </h3>

                                        {primeiroCiclo && (
                                            <p className="mt-1 text-xs font-bold text-[#0d6666]">
                                                Primeiro ciclo obrigatório: vencimento igual ao início da assinatura e status fixo como pago.
                                            </p>
                                        )}

                                        {!primeiroCiclo &&
                                            isCicloAtual(
                                                pagamento.dataVencimento
                                            ) && (
                                                <p className="mt-1 text-xs font-bold text-[#0d6666]">
                                                    Ciclo atual obrigatório.
                                                </p>
                                            )}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-[#10263d]">
                                                Vencimento
                                            </label>
                                            <input
                                                type="date"
                                                value={pagamento.dataVencimento}
                                                required
                                                disabled
                                                className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-[#f2f4f4] focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-[#10263d]">
                                                Status
                                            </label>
                                            <select
                                                value={
                                                    primeiroCiclo
                                                        ? "PAGO"
                                                        : pagamento.status
                                                }
                                                onChange={(event) =>
                                                    atualizarPagamento(
                                                        index,
                                                        "status",
                                                        event.target.value
                                                    )
                                                }
                                                disabled={primeiroCiclo}
                                                className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-[#f2f4f4] focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                                            >
                                                {statusPermitidos.map(
                                                    (status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {labelStatus(
                                                                status
                                                            )}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-[#10263d]">
                                                Data pagamento
                                            </label>
                                            <input
                                                type="date"
                                                value={pagamento.dataPagamento}
                                                onChange={(event) =>
                                                    atualizarPagamento(
                                                        index,
                                                        "dataPagamento",
                                                        event.target.value
                                                    )
                                                }
                                                required={
                                                    primeiroCiclo ||
                                                    pagamento.status === "PAGO"
                                                }
                                                disabled={
                                                    !primeiroCiclo &&
                                                    pagamento.status !== "PAGO"
                                                }
                                                className="w-full rounded-2xl border border-[#dce8e5] px-4 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-[#f2f4f4] focus:border-[#0d6666] focus:ring-2 focus:ring-[#0d6666]/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-2xl bg-[#f4f8f8] px-4 py-3 text-xs text-[#607579]">
                                        {primeiroCiclo &&
                                            "Este é o primeiro período do aluno. Pela regra do negócio, ele só pode iniciar se esse primeiro ciclo estiver pago."}

                                        {!primeiroCiclo &&
                                            pagamento.status === "PAGO" &&
                                            "Pagamento recebido normalmente."}

                                        {!primeiroCiclo &&
                                            pagamento.status === "ATRASADO" &&
                                            "Pagamento vencido e não quitado."}

                                        {!primeiroCiclo &&
                                            pagamento.status === "AUSENTE" &&
                                            "Aluno não frequentou neste período."}

                                        {!primeiroCiclo &&
                                            pagamento.status === "PENDENTE" &&
                                            "Pagamento aberto dentro do ciclo atual e ainda não vencido."}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Link
                        href="/admin/alunos"
                        className="rounded-2xl border border-[#dce8e5] bg-white px-5 py-3 text-center text-sm font-bold text-[#255252] transition hover:bg-[#eaf7f5]"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl bg-[#ef4b3f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Importando..."
                            : "Importar aluno retroativo"}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}