import { Smartphone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import {
    DEFAULT_APP_IMAGE_URL,
    getYoutubeEmbedUrl,
    resolveMediaUrl,
} from "@/lib/site-media";

type ClientAppSectionProps = {
    agendaUrl: string;
    appAndroidUrl?: string;
    appIosUrl?: string;
    mapsReviewsUrl?: string;
    whatsappUrl?: string;
    title?: string;
    description?: string;
    image?: string;
    mediaType?: string;
};

function StoreBadge({
    href,
    src,
    alt,
}: {
    href?: string;
    src: string;
    alt: string;
}) {
    if (!href) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={alt}
            className="inline-flex h-12 items-center transition duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
        >
            <img src={src} alt={alt} className="h-full w-auto object-contain" />
        </a>
    );
}

export function ClientAppSection({
    appAndroidUrl,
    appIosUrl,
    title,
    description,
    image,
    mediaType,
}: ClientAppSectionProps) {
    const safeTitle = title?.trim() || "Agende e acompanhe suas aulas pelo app";
    const safeDescription =
        description?.trim() ||
        "Marque horários, acompanhe sua rotina e solicite o QR Code de acesso diretamente no studio.";
    const mediaValue = image?.trim() || DEFAULT_APP_IMAGE_URL;
    const isConfiguredVideo = mediaType?.toUpperCase() === "VIDEO";
    const embedUrl = getYoutubeEmbedUrl(mediaValue);
    const isVideo = isConfiguredVideo || Boolean(embedUrl);
    const mediaUrl = resolveMediaUrl(mediaValue);

    return (
        <section id="app-clientes" className="bg-white px-6 py-20 lg:px-8">
            <Container>
                <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1fr]">
                    <div className="mx-auto flex w-full max-w-[560px] justify-center">
                        {embedUrl ? (
                            <div className="w-full max-w-[430px] overflow-hidden rounded-[30px] border border-[#dce8e5] bg-[#f7fbfa] shadow-sm">
                                <iframe
                                    src={embedUrl}
                                    title="App para clientes"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="aspect-[4/5] w-full"
                                />
                            </div>
                        ) : mediaUrl && isVideo ? (
                            <div className="w-full max-w-[430px] overflow-hidden rounded-[30px] border border-[#dce8e5] bg-[#f7fbfa] shadow-sm">
                                <video
                                    src={mediaUrl}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    controls
                                    className="aspect-[4/5] w-full object-contain"
                                />
                            </div>
                        ) : mediaUrl ? (
                            <img
                                src={mediaUrl}
                                alt="App para clientes Rocker Pilates"
                                className="h-auto max-h-[620px] w-full max-w-full object-contain"
                            />
                        ) : (
                            <div className="flex aspect-[4/5] w-full max-w-[430px] items-center justify-center rounded-[30px] border border-[#dce8e5] bg-[#f7fbfa] text-[#0d6666] shadow-sm">
                                <Smartphone size={42} aria-hidden="true" />
                            </div>
                        )}
                    </div>

                    <div>
                        <span className="inline-flex rounded-full bg-brand-sky px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-brand-navy">
                            Agenda e app
                        </span>

                        <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-tight text-brand-navy md:text-4xl">
                            {safeTitle}
                        </h2>

                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
                            {safeDescription}
                        </p>

                        {(appAndroidUrl || appIosUrl) && (
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <StoreBadge
                                    href={appAndroidUrl}
                                    src="/img/playstore.png"
                                    alt="Disponível no Google Play"
                                />

                                <StoreBadge
                                    href={appIosUrl}
                                    src="/img/appstore.png"
                                    alt="Disponível na App Store"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}