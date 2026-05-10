type AdminHeaderProps = {
    onLogout: () => void;
};

export function AdminHeader({ onLogout }: AdminHeaderProps) {
    return (
        <div className="mb-6 flex justify-end">
            <button
                type="button"
                onClick={onLogout}
                className="
                    group flex items-center gap-2 rounded-2xl
                    border border-[#ffd0c8]
                    bg-gradient-to-r from-[#ef4b3f] to-[#ff6b5e]
                    px-5 py-3 text-sm font-bold text-white
                    shadow-lg shadow-[#ef4b3f]/20
                    transition-all duration-200
                    hover:-translate-y-[1px]
                    hover:shadow-xl hover:shadow-[#ef4b3f]/30
                "
            >
                <span className="transition-transform duration-200 group-hover:translate-x-[1px]">
                    Sair
                </span>
            </button>
        </div>
    );
}