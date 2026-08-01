import { Container } from "@/components/layout/Container";

type Plan = {
    title: string;
    price: string;
    description: string;
};

type PlansProps = {
    plans?: Plan[];
    agendaUrl: string;
};

const fallbackPlans: Plan[] = [
    {
        title: "Sessoes em grupo",
        price: "Agende online",
        description:
            "Aulas com atencao proxima, ritmo seguro e foco nas necessidades de cada aluno.",
    },
    {
        title: "Sessoes individuais",
        price: "Horarios pelo app",
        description:
            "Atendimento personalizado para quem precisa de acompanhamento exclusivo.",
    },
    {
        title: "Pilates clinico",
        price: "Consulte disponibilidade",
        description:
            "Pratica orientada para reabilitacao, mobilidade e melhora da qualidade de vida.",
    },
];

export function Plans({ plans, agendaUrl }: PlansProps) {
    const visiblePlans = plans && plans.length > 0 ? plans : fallbackPlans;

    return (
        <section id="aulas" className="bg-white py-24">
            <Container>
                <div className="text-center">
                    <span className="inline-flex rounded-full bg-brand-red px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                        Aulas & Planos
                    </span>

                    <h2 className="mt-6 text-3xl font-semibold text-brand-navy md:text-4xl">
                        Escolha como quer praticar Pilates
                    </h2>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {visiblePlans.map((plan) => (
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

                            <a
                                href={agendaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-redDark"
                            >
                                Agendar aula
                            </a>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
