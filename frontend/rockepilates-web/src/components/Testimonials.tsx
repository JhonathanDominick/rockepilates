import { Container } from "@/components/layout/Container";

type TestimonialsProps = {
    title?: string;
    items: string[];
};

export function Testimonials({ title, items }: TestimonialsProps) {
    return (
        <section id="depoimentos" className="bg-brand-cream px-6 py-20 text-brand-ink lg:px-8">
            <Container>
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-semibold md:text-4xl">
                        {title?.trim() || "Depoimentos"}
                    </h2>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-2xl bg-white p-6 shadow-soft border border-black/5"
                        >
                            <p className="text-lg leading-relaxed">
                                “{item}”
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}