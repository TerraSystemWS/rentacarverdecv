"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useLocale, useTranslations } from "next-intl";

export default function LoginPage() {
	const { login, isLoading, isAuthenticated, user } = useAuth();
	const router = useRouter();
	const t = useTranslations("auth");
	const locale = useLocale();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [turnstileToken, setTurnstileToken] = useState<string>("");
	const turnstileRef = useRef<TurnstileInstance>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get("registered") === "true") {
				setSuccessMsg(t("registered"));
			}
		}
	}, []);

	const roles: string[] =
		(user as any)?.roles ??
		(user as any)?.authorities?.map((a: any) => a.authority) ??
		[];
	const isAdmin =
		roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");

	// Se já logado: admin → dashboard, não-admin → profile
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.replace(isAdmin ? "/dashboard" : "/profile");
		}
	}, [isLoading, isAuthenticated, isAdmin, router]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setErr(null);

		if (!email || !password) {
			setErr(t("fillAll"));
			return;
		}

		if (!turnstileToken) {
			setErr(t("captcha"));
			return;
		}

		try {
			await login(email, password, turnstileToken);
			// O useEffect acima cuidará do redirecionamento assim que o estado mudar
		} catch (error: any) {
			setErr(error?.message || t("invalidLogin"));
			// Token do Turnstile é de uso único — sem isto, uma tentativa
			// falhada obrigava a recarregar a página para tentar de novo.
			turnstileRef.current?.reset();
			setTurnstileToken("");
		}
	}

	return (
		/* Resoldendo alinhamento usando mx-auto para garantir centralização independente do container pai */
		<div className="min-h-[80vh] w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
			<div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border border-slate-200">
				<h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
					{t("loginTitle")}
				</h1>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">
							{t("email")}
						</label>
						<input
							id="login-email"
							type="email"
							className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
							placeholder={t("emailPlaceholder")}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
						/>
					</div>

					<div>
						<label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1">
							{t("password")}
						</label>
						<input
							id="login-password"
							className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
							placeholder="••••••••"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
						/>
					</div>

					{err && (
						<div role="alert" className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
							{err}
						</div>
					)}

					{successMsg && (
						<div className="bg-green-50 text-green-700 text-sm p-3 rounded-md border border-green-200">
							{successMsg}
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
						{isLoading ? t("signingIn") : t("signIn")}
					</button>

					<div className="text-center text-sm text-slate-600 mt-4">
						{t("noAccount")}{" "}
						<Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
							{t("createAccount")}
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
