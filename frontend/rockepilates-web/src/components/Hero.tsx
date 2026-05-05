import { Container } from "@/components/layout/Container";

type HeroProps = {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    mediaType?: string;
};

export function Hero({
                         title,
                         subtitle,
                         backgroundImage,
                         mediaType,
                     }: HeroProps) {
    const safeTitle = title?.trim() || "Pilates para transformar sua rotina";
    const safeSubtitle =
        subtitle?.trim() ||
        "Aulas, conteúdo e acompanhamento para evoluir com consciência corporal.";

    const mediaUrl = backgroundImage?.trim()
        ? `${process.env.NEXT_PUBLIC_BFF_URL}${backgroundImage}`
        : null;

    const isVideo = mediaType?.toUpperCase() === "VIDEO";

    const mediaClassName = "h-full w-full object-cover";

    return (
        <section id="home" className="bg-headerGradient pt-28 pb-20">
            <Container>
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    <div className="text-white">
                        <span className="inline-block rounded-full border border-white/40 px-4 py-2 text-sm">
                            Rocker Pilates
                        </span>

                        <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                            {safeTitle}
                        </h1>

                        <p className="mt-6 text-lg text-white/90">
                            {safeSubtitle}
                        </p>

                        <div className="mt-8 flex gap-4">
                            <a
                                href="#cta"
                                className="rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-redDark"
                            >
                                Começar agora
                            </a>

                            <a
                                href="#beneficios"
                                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Saiba mais
                            </a>
                        </div>
                    </div>

                    <div className="relative flex justify-center">
                        <div className="h-[520px] md:h-[700px] lg:h-[720px] w-full max-w-[420px] overflow-hidden rounded-3xl shadow-soft">
                            {mediaUrl ? (
                                isVideo ? (
                                    <video
                                        src={mediaUrl}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        controls
                                        className={mediaClassName}
                                    />
                                ) : (
                                    <img
                                        src={mediaUrl}
                                        alt="Pilates"
                                        className={mediaClassName}
                                    />
                                )
                            ) : (
                                <div className="flex h-full items-center justify-center bg-white/10 text-white/60">
                                    Mídia do CMS
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}