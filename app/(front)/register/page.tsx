"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api/endpoints";

export default function RegisterPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!username || !email || !password || !confirmPassword) {
            setErr("Preencha todos os campos");
            return;
        }

        if (password !== confirmPassword) {
            setErr("As senhas não coincidem");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erro ao criar conta");
            }

            // Sucesso! Redireciona para o login
            router.push("/login?registered=true");
        } catch (error: any) {
            setErr(error?.message || "Erro ao registar utilizador");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
                    Criar Conta
                </h1>
                <p className="text-slate-500 text-center mb-6 text-sm">Registe-se para gerir as suas reservas.</p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nome de Utilizador (Username)
                        </label>
                        <input
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Senha
                        </label>
                        <input
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Confirmar Senha
                        </label>
                        <input
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                            placeholder="••••••••"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {err && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                            {err}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-yellow-400 text-slate-900 font-bold rounded-lg px-4 py-3 hover:bg-yellow-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? "A Registar..." : "Registar"}
                    </button>

                    <div className="text-center text-sm text-slate-600 mt-4">
                        Já tem conta? <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-semibold">Faça Login</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
