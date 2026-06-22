"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { logoutAluno } from "@/lib/api/aluno-auth";

type AlunoLogado = {
    nome: string;
};

function getBffUrl() {
    return process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";
}

const menuItems = [
    { label: "Benefícios", href: "/#beneficios" },
    { label: "Aulas & Planos", href: "/#aulas" },
    { label: "Evelyn Pinheiro", href: "/#evelyn-pinheiro" },
    { label: "Depoimentos", href: "/#depoimentos" },
];

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [aluno, setAluno] = useState<AlunoLogado | null>(null);
    const [menuAberto, setMenuAberto] = useState(false);

    const isAdminRoute = pathname.startsWith("/admin");
    const isAuthAlunoRoute =
        pathname === "/login" || pathname === "/cadastro-aluno";

    useEffect(() => {
        async function carregarAluno() {
            if (isAdminRoute || isAuthAlunoRoute) {
                setAluno(null);
                return;
            }

            try {
                const response = await fetch(`${getBffUrl()}/bff/alunos/me`, {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!response.ok) {
                    setAluno(null);
                    return;
                }

                const data = await response.json();
                setAluno(data?.data ?? null);
            } catch {
                setAluno(null);
            }
        }

        carregarAluno();
    }, [pathname, isAdminRoute, isAuthAlunoRoute]);

    async function handleLogout() {
        await logoutAluno();
        setAluno(null);
        setMenuAberto(false);
        router.push("/");
        router.refresh();
    }

    if (isAdminRoute) {
        return null;
    }

    const primeiroNome = aluno?.nome?.split(" ")[0];

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-headerGradient backdrop-blur-md">
            <Container className="flex items-center justify-between py-4">
                <Link href="/" className="flex items-center">
                    <span className="text-lg font-semibold tracking-tight !text-white">
                        Rocker Pilates
                    </span>
                </Link>

                <nav className="hidden lg:flex items-center gap-8">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium !text-white transition-colors duration-200 hover:!text-brand-red"
                        >
                            {item.label}
                        </a>
                    ))}

                    {!aluno && (
                        <Link
                            href="/login"
                            className="text-sm font-medium !text-white transition-colors duration-200 hover:!text-brand-red"
                        >
                            Login
                        </Link>
                    )}
                </nav>

                {!aluno ? (
                    <Link
                        href="/cadastro-aluno"
                        className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold !text-white transition-all duration-200 hover:bg-brand-redDark hover:scale-[1.03]"
                    >
                        Agendar Aula
                    </Link>
                ) : (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuAberto((atual) => !atual)}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold !text-white transition-all duration-200 hover:bg-brand-redDark hover:scale-[1.03]"
                        >
                            {primeiroNome}
                            <span className="text-xs">▼</span>
                        </button>

                        {menuAberto && (
                            <div className="absolute right-0 mt-3 w-40 rounded-2xl border border-[#dce8e5] bg-white p-2 shadow-xl">
                                <Link
                                    href="/aluno/perfil"
                                    className="block rounded-xl px-4 py-2 text-sm font-bold text-[#10263d] hover:bg-[#eaf7f5]"
                                >
                                    Meu perfil
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full rounded-xl px-4 py-2 text-left text-sm font-bold text-[#b33127] hover:bg-[#ffe3dc]"
                                >
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </header>
    );
}
