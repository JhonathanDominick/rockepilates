import { Container } from "@/components/layout/Container";

type Depoimento = {
    id: number;
    nome: string;
    mensagem: string;
};

type Props = {
    depoimentos: Depoimento[];
};

export function Testimonials({ depoimentos }: Props) {
    return (
        <section id="depoimentos" className="bg-brand-cream px-6 py-20 text-brand-ink lg:px-8">
            <Container>
                <h2 className="text-3xl font-semibold md:text-4xl">
                    O que nossos alunos dizem
                </h2>

                {depoimentos.length === 0 && (
                    <p className="mt-10 text-gray-500">
                        Ainda não há avaliações. Seja o primeiro a avaliar!
                    </p>
                )}

                {depoimentos.length > 0 && (
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {depoimentos.map((dep) => (
                            <div
                                key={dep.id}
                                className="rounded-2xl border border-black/5 bg-white p-8 shadow-lg transition hover:scale-[1.02]"
                            >
                                <p className="text-lg leading-relaxed text-gray-700 italic">
                                    “{dep.mensagem}”
                                </p>

                                <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-red">
                                    — {dep.nome}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </section>
    );
}