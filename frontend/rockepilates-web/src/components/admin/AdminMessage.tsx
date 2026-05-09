type AdminMessageProps = {
    message: string;
    type: "success" | "error";
};

export function AdminMessage({ message, type }: AdminMessageProps) {
    return (
        <p
            className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
                type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
            }`}
        >
            {message}
        </p>
    );
}