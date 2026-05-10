"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    Menu,
    MessageSquareText,
    UsersRound,
    X,
} from "lucide-react";

type AdminLayoutProps = {
    title: string;
    description: string;
    children: ReactNode;
};

const menuItems = [
    { href: "/admin", label: "CMS do site", icon: FileText },
    { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareText },
    { href: "/admin/alunos", label: "Alunos", icon: UsersRound },
];

function AdminSidebar() {
    const pathname = usePathname();

    return (
        <>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#12324b] to-[#0b6a6b] p-5 text-white shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7fd8d4]">
                    Admin
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                    RockerPilates
                </h2>

                <p className="mt-2 text-sm text-white/75">
                    Painel administrativo
                </p>
            </div>

            <nav className="mt-5 flex flex-col gap-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                isActive
                                    ? "bg-[#ef4b3f] text-white shadow-lg shadow-[#ef4b3f]/25"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}

export function AdminLayout({
                                title,
                                description,
                                children,
                            }: AdminLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#10263d] via-[#0f4650] to-[#075b5c] text-white">
            <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[#7fd8d4]/20 blur-3xl" />

            <div className="pointer-events-none absolute right-[-140px] top-40 h-96 w-96 rounded-full bg-[#ef4b3f]/20 blur-3xl" />

            <div className="pointer-events-none absolute bottom-[-160px] left-1/3 h-96 w-96 rounded-full bg-[#7fd8d4]/10 blur-3xl" />

            <div className="relative z-10 mx-auto flex w-full max-w-[1760px] items-start gap-6 px-4 py-5 md:px-8 md:py-8 2xl:px-10">
                <aside className="sticky top-8 hidden h-fit w-72 shrink-0 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur lg:block">
                    <AdminSidebar />
                </aside>

                <section className="min-w-0 flex-1">
                    <div className="sticky top-3 z-30 mb-4 flex items-center justify-between rounded-3xl border border-white/10 bg-[#10263d]/90 px-4 py-3 shadow-xl backdrop-blur lg:hidden">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7fd8d4]">
                                Admin
                            </p>

                            <p className="text-base font-bold text-white">
                                RockerPilates
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen((current) => !current)
                            }
                            className="rounded-2xl bg-[#ef4b3f] p-3 text-white shadow-lg shadow-[#ef4b3f]/25"
                            aria-label={
                                mobileMenuOpen
                                    ? "Fechar menu"
                                    : "Abrir menu"
                            }
                        >
                            {mobileMenuOpen ? (
                                <X size={18} />
                            ) : (
                                <Menu size={18} />
                            )}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div className="fixed inset-0 z-40 bg-[#071f2f]/75 backdrop-blur-sm lg:hidden">
                            <div className="absolute left-4 right-4 top-4 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#10263d] to-[#075b5c] p-5 shadow-2xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7fd8d4]">
                                            Menu
                                        </p>

                                        <p className="text-base font-bold text-white">
                                            Painel RockerPilates
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="rounded-2xl bg-[#ef4b3f] p-3 text-white shadow-lg shadow-[#ef4b3f]/25"
                                        aria-label="Fechar menu"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <AdminSidebar />
                            </div>
                        </div>
                    )}

                    <header className="mb-6 rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7fd8d4]">
                            Painel administrativo
                        </p>

                        <h1 className="mt-3 text-3xl font-bold text-white">
                            {title}
                        </h1>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">
                            {description}
                        </p>
                    </header>

                    <div className="rounded-[28px] border border-white/10 bg-[#fffaf3] p-5 text-[#10263d] shadow-2xl">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}