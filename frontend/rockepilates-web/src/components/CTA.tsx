import { CalendarCheck, MapPin } from "lucide-react";
import { getYoutubeEmbedUrl, resolveMediaUrl } from "@/lib/site-media";

type CTAProps = {
    title?: string;
    button?: string;
    backgroundImage?: string;
    mediaType?: string;
    agendaUrl: string;
    mapsUrl: string;
};

export function CTA({
    title,
    button,
    backgroundImage,
    mediaType,
    agendaUrl,
    mapsUrl,
}: CTAProps) {
    const isConfiguredVideo = mediaType?.toUpperCase() === "VIDEO";
    const mediaUrl = resolveMediaUrl(backgroundImage);
    const youtubeEmbedUrl = getYoutubeEmbedUrl(backgroundImage, { autoplay: true });
    const isVideo = isConfiguredVideo || Boolean(youtubeEmbedUrl);
    const hasMedia = Boolean(mediaUrl || youtubeEmbedUrl);

    const safeTitle = title?.trim() || "Agende sua aula na Rocker Pilates";
    const safeButton = button?.trim() || "Agendar aula";
    const googleMapEmbedUrl =
        "https://www.google.com/maps?q=Rocker%20Pilates%20Natal%20RN&output=embed";

    return (
        <section id="localizacao" className="bg-[#f6faf9] px-6 py-16 lg:px-8">
            <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[8px] bg-white shadow-sm ring-1 ring-[#dce8e5] lg:min-h-[420px] lg:grid-cols-2">
                <div className="relative min-h-[340px] bg-[#dce8e5]">
                    <iframe
                        src={googleMapEmbedUrl}
                        title="Localizacao da Rocker Pilates no Google Maps"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="pointer-events-none absolute inset-0 h-full w-full border-0 grayscale-[15%]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />

                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Abrir localizacao da Rocker Pilates no Google Maps"
                        className="absolute inset-0 z-10"
                    />

                    <div className="pointer-events-none absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="inline-flex rounded-full bg-white/90 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-navy">
                                Localizacao
                            </span>
                            <h2 className="mt-4 text-3xl font-semibold leading-tight">
                                Rocker Pilates Studio
                            </h2>
                            <p className="mt-2 max-w-md text-sm font-medium text-white/90">
                                Toque no mapa para abrir a rota no Google Maps.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/20">
                            <MapPin size={18} aria-hidden="true" />
                            Localizacao
                        </span>
                    </div>
                </div>

                <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-brand-navy px-6 py-16 text-center">
                    {youtubeEmbedUrl && (
                        <iframe
                            src={youtubeEmbedUrl}
                            title="Rocker Pilates"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="pointer-events-none absolute inset-0 h-full w-full scale-125"
                        />
                    )}

                    {mediaUrl && isVideo && youtubeEmbedUrl === null && (
                        <video
                            src={mediaUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    )}

                    {mediaUrl && isVideo === false && (
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${mediaUrl})`,
                            }}
                        />
                    )}

                    {hasMedia && (
                        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/65" />
                    )}

                    {hasMedia === false && (
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#10263d_0%,#0d6666_100%)]" />
                    )}

                    <div className="relative z-10 max-w-xl">
                        <span className="inline-flex rounded-full bg-brand-sky px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-navy">
                            Aula experimental
                        </span>

                        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                            {safeTitle}
                        </h2>

                        <a
                            href={agendaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:scale-[1.02] hover:bg-brand-redDark focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
                        >
                            <CalendarCheck size={18} aria-hidden="true" />
                            {safeButton}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}