import { Container } from "@/components/layout/Container";

type BenefitsProps = {
    title?: string;
    items: string[];
};

export function Benefits({ title, items }: BenefitsProps) {
    const safeTitle = title?.trim() || "Ao praticar Pilates na Rocker, você...";

    const safeItems =
        items.length > 0
            ? items
            : [
                "Melhore sua postura e alivie dores nas costas com exercícios supervisionados.",
                "Ganhe mais flexibilidade e força sem impacto nas articulações.",
                "Aumente sua consciência corporal e previna lesões no dia a dia.",
            ];

    return (
        <section id="beneficios" className="bg-brand-cream px-6 py-20 lg:px-8">
            <Container className="text-center">
                <span className="inline-flex rounded-full bg-brand-red px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                    Benefícios
                </span>

                <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-semibold leading-tight text-brand-navy md:text-4xl">
                    {safeTitle}
                </h2>

                <ul className="mx-auto mt-10 max-w-3xl space-y-4 text-left">
                    {safeItems.map((item) => (
                        <li
                            key={item}
                            className="relative pl-8 text-lg leading-8 text-slate-700"
                        >
                            <span className="absolute left-0 top-[10px] h-3 w-3 rounded-full bg-brand-red" />
                            {item}
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}