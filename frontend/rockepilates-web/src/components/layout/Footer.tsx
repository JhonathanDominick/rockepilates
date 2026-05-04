export function Footer() {
    return (
        <footer className="mt-20 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-10 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Rocker Pilates. Todos os direitos reservados.
            </div>
        </footer>
    );
}