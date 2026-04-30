type HeroProps = {
    title?: string;
    subtitle?: string;
};

export function Hero({ title, subtitle }: HeroProps) {
    const safeTitle = title?.trim() || "Pilates para transformar sua rotina";
    const safeSubtitle =
        subtitle?.trim() ||
        "Conteúdo temporário enquanto as configurações do site não foram carregadas.";

    return (
        <section className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-3xl text-center">
        <span className="mb-4 inline-block rounded-full border px-4 py-2 text-sm text-gray-600">
          Rocker Pilates
        </span>

                <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-6xl">
                    {safeTitle}
                </h1>

                <p className="mt-6 text-lg leading-8 text-gray-600 md:text-xl">
                    {safeSubtitle}
                </p>
            </div>
        </section>
    );
}