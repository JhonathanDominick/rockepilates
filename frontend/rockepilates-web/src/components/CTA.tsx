type CTAProps = {
    title?: string;
    button?: string;
};

export function CTA({ title, button }: CTAProps) {
    return (
        <section className="py-20 text-center">
            <h2 className="text-3xl font-bold">
                {title || "Comece hoje"}
            </h2>

            <button className="mt-6 px-6 py-3 bg-black text-white rounded-lg">
                {button || "Saiba mais"}
            </button>
        </section>
    );
}