type AboutProps = {
    text?: string;
};

export function About({ text }: AboutProps) {
    return (
        <section className="py-20 max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600">
                {text || "Texto institucional temporário"}
            </p>
        </section>
    );
}