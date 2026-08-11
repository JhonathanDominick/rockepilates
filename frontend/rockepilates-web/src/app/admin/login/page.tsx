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
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, senha }),
            });

            if (!response.ok) {
                throw new Error("Login inválido");
            }

            router.replace("/admin/site");
            router.refresh();
        } catch (error) {
            console.error("Erro no login:", error);
            setMessage("E-mail ou senha inválidos");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-headerGradient px-5 py-8 sm:px-8 lg:px-10">
            <div
                aria-hidden="true"
                className="absolute -left-28 -top-24 h-80 w-80 rounded-full bg-brand-sky/20 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-brand-red/20 blur-3xl"
            />

            <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/15 bg-white/10 shadow-soft backdrop-blur-sm lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative hidden min-h-[610px] overflow-hidden lg:flex lg:items-center lg:justify-center">
                        <div
                            aria-hidden="true"
                            className="absolute left-10 top-12 h-24 w-24 rounded-full border border-white/15"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute bottom-12 right-10 h-40 w-40 rounded-full border border-white/10"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute bottom-24 left-12 h-px w-36 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />

                        <img
                            src="/img/logo-branca-crop.png"
                            alt="Rocker Pilates"
                            className="relative z-10 w-full max-w-[270px] object-contain"
                        />
                    </div>

                    <div className="flex items-center justify-center bg-brand-cream px-6 py-12 sm:px-10 lg:px-14">
                        <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-md rounded-[28px] border border-white bg-white p-7 shadow-[0_20px_60px_rgba(16,24,39,0.12)] sm:p-9"
                        >
                            <div className="mb-8 lg:hidden">
                                <div className="inline-flex rounded-2xl bg-headerGradient px-5 py-3">
                                    <img
                                        src="/img/logo-branca-crop.png"
                                        alt="Rocker Pilates"
                                        className="h-10 w-auto object-contain"
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="mb-4 h-1 w-12 rounded-full bg-brand-red" />
                                <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
                                    Login administrativo
                                </h1>
                            </div>

                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                                className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 w-full rounded-full bg-brand-red px-6 py-3.5 font-semibold text-white shadow-[0_10px_25px_rgba(216,74,58,0.22)] transition hover:bg-brand-redDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Entrando..." : "Entrar"}
                            </button>

                            {message && (
                                <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}