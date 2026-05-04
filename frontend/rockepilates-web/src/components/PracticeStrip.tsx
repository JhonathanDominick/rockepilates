import { Container } from "@/components/layout/Container";

const items = [
    "Pilates",
    "Bem-estar",
    "Mobilidade",
    "Postura",
    "Movimento",
];

export function PracticeStrip() {
    return (
        <section className="bg-brand-sky px-6 py-8 lg:px-8">
            <Container className="text-center">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-navy/80">
                    O que você desenvolve na prática
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                    {items.map((item) => (
                        <span
                            key={item}
                            className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-navy/65"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </Container>
        </section>
    );
}