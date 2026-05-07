"use client";
import { Container } from "@/components/layout/Container";
import { useRouter } from "next/navigation";

type Plan = {
    title: string;
    price: string;
    description: string;
};

const fallbackPlans: Plan[] = [
    {
        title: "Plano Iniciante",
        price: "R$ 99/mês",
        description: "Acesso às aulas básicas e acompanhamento inicial.",
    },
    {
        title: "Plano Intermediário",
        price: "R$ 149/mês",
        description: "Aulas completas + acompanhamento contínuo.",
    },
    {
        title: "Plano Avançado",
        price: "R$ 199/mês",
        description: "Treinos personalizados e suporte completo.",
    },
];

export function Plans({ plans = fallbackPlans }: { plans?: Plan[] }) {
    const router = useRouter();

    return (
        <section id="aulas" className="bg-white py-24">
            <Container>
                <div className="text-center">
                    <span className="inline-flex rounded-full bg-brand-red px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                        Aulas & Planos
                    </span>

                    <h2 className="mt-6 text-3xl font-semibold text-brand-navy md:text-4xl">
                        Escolha o plano ideal para você
                    </h2>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.title}
                            className="flex flex-col rounded-3xl border border-gray-200 p-8 shadow-sm transition hover:shadow-md"
                        >
                            <h3 className="text-xl font-semibold text-brand-navy">
                                {plan.title}
                            </h3>

                            <p className="mt-4 text-3xl font-bold text-brand-red">
                                {plan.price}
                            </p>

                            <p className="mt-4 text-gray-600">
                                {plan.description}
                            </p>

                            <button
                                onClick={() => router.push("/cadastro-aluno")}
                                className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-redDark"
                            >
                                Começar agora
                            </button>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}