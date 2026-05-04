import { Container } from "@/components/layout/Container";

const menuItems = [
    { label: "Benefícios", href: "#beneficios" },
    { label: "Aulas & Planos", href: "#aulas" },
    { label: "Evelyn Pinheiro", href: "#evelyn-pinheiro" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Login", href: "/admin/login" },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-headerGradient backdrop-blur-md">
            <Container className="flex items-center justify-between py-4">

                {/* Logo */}
                <a href="#top" className="flex items-center">
                    <span className="text-lg font-semibold tracking-tight !text-white">
                        Rocker Pilates
                    </span>
                </a>

                {/* Menu */}
                <nav className="hidden lg:flex items-center gap-8">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium !text-white transition-colors duration-200 hover:!text-brand-red"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* CTA */}
                <a
                    href="#cta"
                    className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold !text-white transition-all duration-200 hover:bg-brand-redDark hover:scale-[1.03]"
                >
                    Agendar Aula
                </a>
            </Container>
        </header>
    );
}