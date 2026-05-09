type AdminHeaderProps = {
    onLogout: () => void;
};

export function AdminHeader({ onLogout }: AdminHeaderProps) {
    return (
        <div className="mb-6 flex justify-end">
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