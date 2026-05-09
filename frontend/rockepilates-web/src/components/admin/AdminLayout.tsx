import type { ReactNode } from "react";
import Link from "next/link";

type AdminLayoutProps = {
    title: string;
    description: string;
    children: ReactNode;
};

export function AdminLayout({ title, description, children }: AdminLayoutProps) {
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
                <aside className="hidden w-64 shrink-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:block">
                    <h2 className="text-lg font-bold text-gray-950">
                        RockerPilates
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Painel administrativo
                    </p>

                    <nav className="mt-8 flex flex-col gap-2">
                        <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">
                            CMS do site
                        </Link>

                        <Link href="/admin/alunos" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">
                            Alunos
                        </Link>
                    </nav>
                </aside>

                <section className="min-w-0 flex-1">
                    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h1 className="text-3xl font-bold text-gray-950">
                            {title}
                        </h1>

                        <p className="mt-2 text-gray-600">
                            {description}
                        </p>
                    </div>

                    {children}
                </section>
            </div>
        </main>
    );
}