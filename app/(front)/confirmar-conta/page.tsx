"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";

// Links de conta enviados por email (AccountVerificationService na API).
// Esta página serve /confirmar-conta e /repor-palavra-passe:
//  - VERIFY (registo no site): confirma logo ao abrir.
//  - SETUP (cliente criado pela equipa): pede a palavra-passe e confirma.
//  - RESET (pedido pela equipa): pede a palavra-passe nova e a confirmação.
type Purpose = "VERIFY" | "SETUP" | "RESET";
type State =
	| { kind: "loading" }
	| { kind: "password"; email: string; reset: boolean }
	| { kind: "done"; purpose: Purpose }
	| { kind: "error"; message: string };

async function readMessage(res: Response, fallback: string) {
	const body = await res.json().catch(() => null);
	return (body && (body.message || body.error)) || fallback;
}

export default function ConfirmAccountPage() {
	const t = useTranslations("accountConfirm");
	const [state, setState] = useState<State>({ kind: "loading" });
	const [token, setToken] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [show, setShow] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const confirm = async (tk: string, pw?: string) => {
		const res = await authFetch(endpoints.auth.verifyEmail, {
			method: "POST",
			auth: false,
			body: JSON.stringify({ token: tk, password: pw ?? null }),
		});
		if (!res.ok) throw new Error(await readMessage(res, t("error")));
	};

	useEffect(() => {
		const tk = new URLSearchParams(window.location.search).get("token") || "";
		setToken(tk);
		if (!tk) {
			setState({ kind: "error", message: t("missing") });
			return;
		}
		(async () => {
			try {
				const res = await authFetch(endpoints.auth.verifyEmailInfo(tk), { auth: false });
				if (!res.ok) throw new Error(await readMessage(res, t("error")));
				const info = (await res.json()) as { purpose: Purpose; email: string };
				if (info.purpose === "SETUP" || info.purpose === "RESET") {
					setState({ kind: "password", email: info.email, reset: info.purpose === "RESET" });
					return;
				}
				await confirm(tk);
				setState({ kind: "done", purpose: "VERIFY" });
			} catch (e: any) {
				setState({ kind: "error", message: e?.message || t("error") });
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		if (password.length < 8) return setFormError(t("passwordTooShort"));
		if (password !== password2) return setFormError(t("passwordsDontMatch"));
		const reset = state.kind === "password" && state.reset;
		setSaving(true);
		try {
			await confirm(token, password);
			setState({ kind: "done", purpose: reset ? "RESET" : "SETUP" });
		} catch (err: any) {
			setFormError(err?.message || t("error"));
		} finally {
			setSaving(false);
		}
	};

	const inputClass =
		"w-full rounded-lg border border-slate-300 p-2.5 pr-11 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all";

	return (
		<div className="min-h-[70vh] w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
			<div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border border-slate-200">
				{state.kind === "loading" && (
					<div className="flex flex-col items-center gap-3 py-6 text-slate-500">
						<Loader2 className="h-8 w-8 animate-spin text-green-600" aria-hidden="true" />
						<p className="m-0 text-sm">{t("checking")}</p>
					</div>
				)}

				{state.kind === "error" && (
					<div className="text-center">
						<XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" aria-hidden="true" />
						<h1 className="text-xl font-bold text-slate-800 mb-2">{t("errorTitle")}</h1>
						<p role="alert" className="text-slate-600 text-sm mb-2">{state.message}</p>
						<p className="text-slate-500 text-xs mb-6">{t("errorHelp")}</p>
						<Link href="/profile" className="btn-racv inline-block">{t("goProfile")}</Link>
					</div>
				)}

				{state.kind === "done" && (
					<div className="text-center">
						<CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" aria-hidden="true" />
						<h1 className="text-xl font-bold text-slate-800 mb-2">{state.purpose === "RESET" ? t("resetDoneTitle") : t("doneTitle")}</h1>
						<p className="text-slate-600 text-sm mb-6">
							{state.purpose === "RESET" ? t("resetDone") : state.purpose === "SETUP" ? t("doneSetup") : t("doneVerify")}
						</p>
						<Link href={state.purpose === "VERIFY" ? "/cars" : "/login"} className="btn-racv inline-block">
							{state.purpose === "VERIFY" ? t("goCars") : t("goLogin")}
						</Link>
					</div>
				)}

				{state.kind === "password" && (
					<>
						<h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">{state.reset ? t("resetTitle") : t("setupTitle")}</h1>
						<p className="text-slate-500 text-center mb-6 text-sm">
							{state.reset ? t("resetSubtitle", { email: state.email }) : t("setupSubtitle", { email: state.email })}
						</p>
						<form onSubmit={onSubmit} className="space-y-4">
							<div>
								<label htmlFor="cc-password" className="block text-sm font-medium text-slate-700 mb-1">{state.reset ? t("newPassword") : t("password")}</label>
								<div className="relative">
									<input
										id="cc-password"
										type={show ? "text" : "password"}
										autoComplete="new-password"
										className={inputClass}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<button
										type="button"
										onClick={() => setShow((v) => !v)}
										className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700"
										aria-label={show ? t("hidePassword") : t("showPassword")}
									>
										{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</button>
								</div>
								<p className="text-xs text-slate-400 mt-1">{t("passwordHint")}</p>
							</div>
							<div>
								<label htmlFor="cc-password2" className="block text-sm font-medium text-slate-700 mb-1">{t("confirmPassword")}</label>
								<input
									id="cc-password2"
									type={show ? "text" : "password"}
									autoComplete="new-password"
									className={inputClass}
									value={password2}
									onChange={(e) => setPassword2(e.target.value)}
									required
								/>
							</div>
							{formError && (
								<div role="alert" className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">{formError}</div>
							)}
							<button type="submit" disabled={saving} className="w-full btn-racv mt-2">
								{saving ? t("saving") : state.reset ? t("resetSubmit") : t("submit")}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}
