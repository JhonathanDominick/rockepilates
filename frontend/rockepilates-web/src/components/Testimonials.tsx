import { Container } from "@/components/layout/Container";
import styles from "./Testimonials.module.css";

type Depoimento = {
    id: number;
    nome: string;
    mensagem: string;
};

type Props = {
    depoimentos: Depoimento[];
    mapsReviewsUrl: string;
};

export function Testimonials({ depoimentos, mapsReviewsUrl }: Props) {
    const depoimentosLoop =
        depoimentos.length > 0 ? [...depoimentos, ...depoimentos] : [];

    return (
        <section id="depoimentos" className="bg-brand-cream px-6 py-20 text-brand-ink lg:px-8">
            <Container>
                <h2 className="text-3xl font-semibold md:text-4xl">
                    O que nossos alunos dizem
                </h2>

                {depoimentos.length === 0 && (
                    <p className="mt-10 max-w-2xl text-gray-600">
                        Em breve novos depoimentos aprovados serao publicados por aqui.
                        Enquanto isso, confira as avaliacoes publicas do studio.
                    </p>
                )}

                {depoimentos.length > 0 && (
                    <div className={`${styles.marquee} mt-12 overflow-hidden py-2`}>
                        <div className={`${styles.track} flex w-max gap-6`}>
                            {depoimentosLoop.map((dep, index) => (
                                <article
                                    key={`${dep.id}-${index}`}
                                    aria-hidden={index >= depoimentos.length}
                                    className="flex w-[min(82vw,360px)] shrink-0 flex-col rounded-2xl border border-black/5 bg-white p-8 shadow-lg transition hover:scale-[1.02] md:w-[380px]"
                                >
                                    <p className="text-lg italic leading-relaxed text-gray-700">
                                        &quot;{dep.mensagem}&quot;
                                    </p>

                                    <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-red">
                                        - {dep.nome}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {mapsReviewsUrl && (
                    <a
                        href={mapsReviewsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-10 inline-flex rounded-full border border-brand-red px-6 py-3 text-sm font-bold text-brand-red transition hover:bg-brand-red hover:text-white"
                    >
                        Ver avaliacoes no Google
                    </a>
                )}
            </Container>
        </section>
    );
}
