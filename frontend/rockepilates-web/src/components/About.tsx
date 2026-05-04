import { Container } from "@/components/layout/Container";

type AboutProps = {
    text?: string;
};

export function About({ text }: AboutProps) {
    return (
        <section id="about" className="py-20">
            <Container className="max-w-3xl text-center">
                <p className="text-lg text-gray-600">
                    {text || "Texto institucional temporário"}
                </p>
            </Container>
        </section>
    );
}