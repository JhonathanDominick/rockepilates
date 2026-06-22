import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    AlunosAdminTable,
    type AlunoAdmin,
} from "@/components/admin/AlunosAdminTable";
import { listarAlunosAdminPaginado } from "@/lib/api/admin-alunos";

type AdminAlunosPageProps = {
    searchParams?: Promise<{
        busca?: string;
        plano?: string;
        statusAssinatura?: string;
        statusFinanceiro?: string;
        page?: string;
        size?: string;
    }>;
};

function normalizarNumeroPagina(valor: string | undefined) {
    const numero = Number(valor);

    if (Number.isNaN(numero) || numero < 0) {
        return 0;
    }

    return numero;
}

function normalizarTamanhoPagina(valor: string | undefined) {
    const numero = Number(valor);

    if (Number.isNaN(numero) || numero < 1) {
        return 10;
    }

    return Math.min(numero, 50);
}

export default async function AdminAlunosPage({
                                                  searchParams,
                                              }: AdminAlunosPageProps) {
    const params = await searchParams;

    const busca = params?.busca ?? "";
    const plano = params?.plano ?? "TODOS";
    const statusAssinatura = params?.statusAssinatura ?? "TODOS";
    const statusFinanceiro = params?.statusFinanceiro ?? "TODOS";
    const page = normalizarNumeroPagina(params?.page);
    const size = normalizarTamanhoPagina(params?.size);

    let alunos: AlunoAdmin[] = [];
    let totalElements = 0;
    let totalPages = 0;
    let currentPage = page;
    let first = true;
    let last = true;

    try {
        const data = await listarAlunosAdminPaginado<AlunoAdmin>({
            busca,
            plano,
            statusAssinatura,
            statusFinanceiro,
            page,
            size,
        });

        alunos = data.content;
        totalElements = data.totalElements;
        totalPages = data.totalPages;
        currentPage = data.number;
        first = data.first;
        last = data.last;
    } catch (error) {
        console.error("Erro ao listar alunos paginados:", error);
    }

    return (
        <AdminLayout
            title="Alunos e Assinaturas"
            description="Controle dos alunos cadastrados e situação dos planos."
        >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                    href="/admin/alunos/importar"
                    className="rounded-2xl border border-[#dce8e5] bg-white px-5 py-3 text-center text-sm font-bold text-[#0d6666] transition hover:-translate-y-[1px] hover:bg-[#eaf7f5]"
                >
                    Importar aluno existente
                </Link>

                <Link
                    href="/admin/alunos/novo"
                    className="rounded-2xl bg-[#ef4b3f] px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-[#ef4b3f]/20 transition hover:-translate-y-[1px] hover:bg-[#dc3f34]"
                >
                    Novo aluno
                </Link>
            </div>

            <AlunosAdminTable
                alunosIniciais={alunos}
                filtros={{
                    busca,
                    plano,
                    statusAssinatura,
                    statusFinanceiro,
                    size,
                }}
                paginacao={{
                    totalElements,
                    totalPages,
                    currentPage,
                    size,
                    first,
                    last,
                }}
            />
        </AdminLayout>
    );
}