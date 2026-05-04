import { Container } from "@/components/layout/Container";

type EvelynSectionProps = {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    ctaText?: string;
    ctaButton?: string;
};

export function EvelynSection({
                                  title,
                                  subtitle,
                                  description,
                                  image,
                                  ctaText,
                                  ctaButton,
                              }: EvelynSectionProps) {
    const imageUrl = image?.trim()
        ? `${process.env.NEXT_PUBLIC_BFF_URL}${image}`
        : null;

    return (
        <section id="evelyn-pinheiro" className="bg-brand-red px-6 py-20 text-white lg:px-8">
            <Container>
                <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1fr]">
                    <div className="overflow-hidden rounded-[30px] border border-white/20 bg-white/10 p-3 shadow-soft">
                        <div className="overflow-hidden rounded-[24px] border border-white/10">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={title?.trim() || "Evelyn Pinheiro"}
                                    className="aspect-[4/5] w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[4/5] items-center justify-center bg-white/10 text-white/70">
                                    Imagem da Evelyn
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <span className="inline-flex rounded-full border border-white/30 px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                            Evelyn Pinheiro
                        </span>

                        <h2 className="mt-6 text-3xl font-semibold md:text-4xl">
                            {title?.trim() || "Prazer, Evelyn Pinheiro"}
                        </h2>

                        <p className="mt-3 text-lg font-medium text-white/85">
                            {subtitle?.trim() || "Especialista em Pilates e movimento consciente"}
                        </p>

                        <p className="mt-6 whitespace-pre-line text-lg leading-8 text-white/90">
                            {description?.trim() ||
                                "Minha missão é ajudar você a construir um corpo forte, consciente e livre de dores através do pilates."}
                        </p>

                        {(ctaText?.trim() || ctaButton?.trim()) && (
                            <div className="mt-8">
                                {ctaText?.trim() && (
                                    <p className="text-lg font-medium text-white/90">
                                        {ctaText}
                                    </p>
                                )}

                                {ctaButton?.trim() && (
                                    <a
                                        href="#contato"
                                        className="mt-4 inline-flex rounded-full bg-white px-7 py-3 text-base font-semibold !text-brand-red transition hover:bg-white/90"
                                    >
                                        {ctaButton}
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}