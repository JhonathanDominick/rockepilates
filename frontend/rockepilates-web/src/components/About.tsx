type AboutProps = {
    text?: string;
};

export function About({ text }: AboutProps) {
    const safeText = text?.trim();

    if (!safeText) {
        return null;
    }

    return (
        <section id="about" className="py-20">
            <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                <p className="text-lg text-gray-600">{safeText}</p>
            </div>
        </section>
    );
}