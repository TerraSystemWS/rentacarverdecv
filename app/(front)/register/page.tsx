"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useLocale, useTranslations } from "next-intl";

export default function RegisterPage() {
    const router = useRouter();
    const t = useTranslations("auth");
    const locale = useLocale();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // Newsletter só com consentimento explícito (lei de proteção de dados de
    // Cabo Verde) — por isso a caixa começa desmarcada.
    const [newsletter, setNewsletter] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>("");
    const turnstileRef = useRef<TurnstileInstance>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!username || !email || !password || !confirmPassword) {
            setErr(t("fillAll"));
            return;
        }

        if (password.length < 8) {
            setErr(t("passwordTooShort"));
            return;
        }

        if (!turnstileToken) {
            setErr(t("captcha"));
            return;
        }

        if (password !== confirmPassword) {
            setErr(t("passwordsDontMatch"));
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, turnstileToken, newsletter })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || t("registerError"));
            }

            // Sucesso! Redireciona para o login
            router.push("/login?registered=true");
        } catch (error: any) {
            setErr(error?.message || t("registerError"));
            // Token do Turnstile é de uso único — sem isto, uma tentativa
            // falhada obrigava a recarregar a página para tentar de novo.
            turnstileRef.current?.reset();
            setTurnstileToken("");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-[80vh] w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
            <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
                    {t("registerTitle")}
                </h1>
                <p className="text-slate-500 text-center mb-6 text-sm">{t("registerSubtitle")}</p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reg-username" className="block text-sm font-medium text-slate-700 mb-1">
                            {t("username")}
                        </label>
                        <input
                            id="reg-username"
                            autoComplete="username"
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            placeholder={t("usernamePlaceholder")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1">
                            {t("email")}
                        </label>
                        <input
                            id="reg-email"
                            autoComplete="email"
                            type="email"
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            placeholder={t("emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1">
                            {t("password")}
                        </label>
                        <input
                            id="reg-password"
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p className="text-xs text-slate-400 mt-1">{t("passwordHint")}</p>
                    </div>

                    <div>
                        <label htmlFor="reg-password2" className="block text-sm font-medium text-slate-700 mb-1">
                            {t("confirmPassword")}
                        </label>
                        <input
                            id="reg-password2"
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            placeholder="••••••••"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={newsletter}
                            onChange={(e) => setNewsletter(e.target.checked)}
                            className="mt-1"
                        />
                        <span>{t("newsletter")}</span>
                    </label>

                    {err && (
                        <div role="alert" className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                            {err}
                        </div>
                    )}

                    <div className="flex justify-center mt-2">
                        <Turnstile
                            ref={turnstileRef}
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onSuccess={(token) => setTurnstileToken(token)}
                            options={{ theme: "light", language: locale }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-racv mt-4"
                    >
                        {isLoading ? t("registering") : t("register")}
                    </button>

                    <div className="text-center text-sm text-slate-600 mt-4">
                        {t("hasAccount")} <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">{t("goLogin")}</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
