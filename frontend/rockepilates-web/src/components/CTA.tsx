type CTAProps = {
    title?: string;
    button?: string;
    backgroundImage?: string;
};

export function CTA({ title, button, backgroundImage }: CTAProps) {
    const hasImage = !!backgroundImage?.trim();

    const safeTitle = title?.trim() || "Comece hoje";
    const safeButton = button?.trim() || "Saiba mais";

    return (
        <section
            className="relative flex items-center justify-center min-h-[320px] px-6 py-20 text-center overflow-hidden"
            style={
                hasImage
                    ? {
                        backgroundImage: `url(${process.env.NEXT_PUBLIC_BFF_URL}${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }
                    : undefined
            }
        >
            {/* overlay com gradiente (melhor que cor sólida) */}
            {hasImage && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
            )}

            <div className="relative z-10 max-w-2xl">
                <h2
                    className={`text-3xl md:text-4xl font-semibold tracking-tight ${
                        hasImage ? "text-white" : "text-gray-950"
                    }`}
                >
                    {safeTitle}
                </h2>

                <button
                    className="mt-8 inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                    {safeButton}
                </button>
            </div>
        </section>
    );
}