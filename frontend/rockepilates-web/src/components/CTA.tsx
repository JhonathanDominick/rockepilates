type CTAProps = {
    title?: string;
    button?: string;
    backgroundImage?: string;
    mediaType?: string;
};

export function CTA({ title, button, backgroundImage, mediaType }: CTAProps) {
    const mediaUrl = backgroundImage?.trim()
        ? `${process.env.NEXT_PUBLIC_BFF_URL}${backgroundImage}`
        : null;

    const isVideo = mediaType?.toUpperCase() === "VIDEO";

    const safeTitle = title?.trim() || "Comece hoje";
    const safeButton = button?.trim() || "Saiba mais";

    return (
        <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden px-6 py-20 text-center">
            {mediaUrl && isVideo && (
                <video
                    src={mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}

            {mediaUrl && !isVideo && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${mediaUrl})`,
                    }}
                />
            )}

            {mediaUrl && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
            )}

            <div className="relative z-10 max-w-2xl">
                <h2
                    className={`text-3xl font-semibold tracking-tight md:text-4xl ${
                        mediaUrl ? "text-white" : "text-gray-950"
                    }`}
                >
                    {safeTitle}
                </h2>

                <button className="mt-8 inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                    {safeButton}
                </button>
            </div>
        </section>
    );
}