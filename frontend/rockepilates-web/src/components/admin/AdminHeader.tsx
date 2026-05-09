type AdminHeaderProps = {
    onLogout: () => void;
};

export function AdminHeader({ onLogout }: AdminHeaderProps) {
    return (
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-950">
                    Administração do site
                </h1>

                <p className="mt-2 text-gray-600">
                    Edite textos, imagens, vídeos e depoimentos exibidos no site.
                </p>
            </div>

            <button
                type="button"
                onClick={onLogout}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
                Sair
            </button>
        </div>
    );
}