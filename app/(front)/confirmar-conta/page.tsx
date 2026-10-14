"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";

// Link do email de confirmação de conta (AccountVerificationService na API).
//  - VERIFY (registo no site): confirma logo ao abrir.
//  - SETUP (cliente criado pela equipa): pede a palavra-passe e confirma.
type State =
	| { kind: "loading" }
	| { kind: "setup"; email: string }
	| { kind: "done"; setup: boolean }
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
				const info = (await res.json()) as { purpose: string; email: string };
				if (info.purpose === "SETUP") {
					setState({ kind: "setup", email: info.email });
					return;
				}
				await confirm(tk);
				setState({ kind: "done", setup: false });
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
		setSaving(true);
		try {
			await confirm(token, password);
			setState({ kind: "done", setup: true });
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
						<p role="alert" className="text-slate-600 text-sm mb-6">{state.message}</p>
						<Link href="/profile" className="btn-racv inline-block">{t("goProfile")}</Link>
					</div>
				)}

				{state.kind === "done" && (
					<div className="text-center">
						<CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" aria-hidden="true" />
						<h1 className="text-xl font-bold text-slate-800 mb-2">{t("doneTitle")}</h1>
						<p className="text-slate-600 text-sm mb-6">{state.setup ? t("doneSetup") : t("doneVerify")}</p>
						<Link href={state.setup ? "/login" : "/cars"} className="btn-racv inline-block">
							{state.setup ? t("goLogin") : t("goCars")}
						</Link>
					</div>
				)}

				{state.kind === "setup" && (
					<>
						<h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">{t("setupTitle")}</h1>
						<p className="text-slate-500 text-center mb-6 text-sm">{t("setupSubtitle", { email: state.email })}</p>
						<form onSubmit={onSubmit} className="space-y-4">
							<div>
								<label htmlFor="cc-password" className="block text-sm font-medium text-slate-700 mb-1">{t("password")}</label>
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
								{saving ? t("saving") : t("submit")}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}
