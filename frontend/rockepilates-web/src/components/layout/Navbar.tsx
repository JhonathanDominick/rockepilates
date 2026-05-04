export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <span className="font-semibold text-lg">
                    Rocker Pilates
                </span>

                <nav className="flex gap-6 text-sm text-gray-600">
                    <a href="#home">Início</a>
                    <a href="#about">Sobre</a>
                    <a href="#cta">Começar</a>
                </nav>
            </div>
        </header>
    );
}