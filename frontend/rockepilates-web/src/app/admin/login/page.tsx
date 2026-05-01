"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BFF_URL}/bff/usuarios/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, senha }),
                }
            );

            if (!response.ok) {
                throw new Error("Login inválido");
            }

            router.push("/admin");
        } catch {
            setMessage("E-mail ou senha inválidos");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <form onSubmit={handleSubmit} className="w-full max-w-md border rounded-xl p-6">
                <h1 className="text-2xl font-bold">Login administrativo</h1>

                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-6 w-full border rounded p-3"
                    required
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    className="mt-4 w-full border rounded p-3"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded bg-black py-3 text-white disabled:opacity-60"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
            </form>
        </main>
    );
}