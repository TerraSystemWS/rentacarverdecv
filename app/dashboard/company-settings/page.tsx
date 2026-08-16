"use client";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import { apiFetch } from "@/lib/api/client";
import { authFetch } from "@/app/auth/api";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { CompanyProfile } from "@/lib/api/types";

const empty: CompanyProfile = {
	name: "", legalName: "", nif: "", address: "", email: "", logoUrl: null,
	ivaRate: "15.00", facebookUrl: "", instagramUrl: "", twitterUrl: "", whatsappUrl: "",
};

export default function CompanySettingsPage() {
	const [profile, setProfile] = useState<CompanyProfile>(empty);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploadingLogo, setUploadingLogo] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	async function load() {
		setLoading(true);
		try {
			setProfile(await apiFetch<CompanyProfile>(endpoints.companyProfile.get));
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao carregar dados da empresa.", confirmButtonColor: "#3085d6" });
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	async function handleSave() {
		if (!profile.name.trim() || !profile.nif.trim()) {
			Swal.fire("Erro", "Nome e NIF são obrigatórios.", "error");
			return;
		}
		setSaving(true);
		try {
			const updated = await apiFetch<CompanyProfile>(endpoints.companyProfile.update, {
				method: "PUT",
				body: JSON.stringify({
					...profile,
					ivaRate: profile.ivaRate ? Number(profile.ivaRate) : undefined,
				}),
			});
			setProfile(updated);
			Swal.fire("Sucesso", "Dados da empresa atualizados — as próximas faturas já usam estes dados.", "success");
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao guardar.", confirmButtonColor: "#3085d6" });
		} finally {
			setSaving(false);
		}
	}

	async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingLogo(true);
		try {
			const form = new FormData();
			form.append("file", file);
			const res = await authFetch(endpoints.companyProfile.logo, { method: "POST", body: form });
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(body?.message || "Erro ao enviar logótipo.");
			}
			setProfile(await res.json());
			Swal.fire("Sucesso", "Logótipo atualizado.", "success");
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message, confirmButtonColor: "#3085d6" });
		} finally {
			setUploadingLogo(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}

	if (loading) {
		return (
			<div>
				<TopNav title="Contas" subtitle="Configuração dos dados fiscais" />
				<PageShell>
					<div className="flex h-[60vh] items-center justify-center text-zinc-400 text-sm">A carregar...</div>
				</PageShell>
			</div>
		);
	}

	const logoSrc = profile.logoUrl ? (profile.logoUrl.startsWith("/uploads") ? `${API_BASE_URL}${profile.logoUrl}` : profile.logoUrl) : null;

	return (
		<div>
			<TopNav title="Contas" subtitle="Dados fiscais e logótipo impressos no cabeçalho de todas as faturas" />
			<PageShell>
				<div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">
					<div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
						<h2 className="text-lg font-black">Dados da Empresa</h2>
						<div>
							<label className="text-xs font-bold uppercase text-zinc-500">Nome</label>
							<input
								className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
								value={profile.name}
								onChange={(e) => setProfile({ ...profile, name: e.target.value })}
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-zinc-500">Nome Fiscal / Razão Social (opcional)</label>
							<input
								className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
								value={profile.legalName ?? ""}
								onChange={(e) => setProfile({ ...profile, legalName: e.target.value })}
								placeholder="Só se for diferente do nome acima"
							/>
						</div>
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label className="text-xs font-bold uppercase text-zinc-500">NIF</label>
								<input
									className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
									value={profile.nif}
									onChange={(e) => setProfile({ ...profile, nif: e.target.value })}
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-zinc-500">Email</label>
								<input
									className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
									value={profile.email ?? ""}
									onChange={(e) => setProfile({ ...profile, email: e.target.value })}
								/>
							</div>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-zinc-500">Morada</label>
							<input
								className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
								value={profile.address ?? ""}
								onChange={(e) => setProfile({ ...profile, address: e.target.value })}
							/>
						</div>
						<div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
							<div>
								<label className="text-xs font-bold uppercase text-zinc-500">Taxa de IVA (%)</label>
								<input
									type="number"
									step="0.01"
									min="0"
									className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2"
									value={profile.ivaRate ?? "15.00"}
									onChange={(e) => setProfile({ ...profile, ivaRate: e.target.value })}
								/>
								<p className="text-[10px] text-zinc-400 mt-1">Padrão em Cabo Verde: 15%. Usado no cálculo do IVA nas faturas emitidas a partir de agora.</p>
							</div>
						</div>
						<button
							onClick={handleSave}
							disabled={saving}
							className="rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all"
						>
							{saving ? "A guardar..." : "Guardar Dados"}
						</button>
					</div>

					<div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
						<h2 className="text-lg font-black mb-4">Logótipo</h2>
						<div className="h-32 mb-4 rounded-lg border border-dashed border-zinc-200 flex items-center justify-center bg-zinc-50">
							{logoSrc ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={logoSrc} alt="Logótipo" className="max-h-28 max-w-full object-contain" />
							) : (
								<span className="text-xs text-zinc-400">Sem logótipo</span>
							)}
						</div>
						<input ref={fileInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoChange} />
						<button
							onClick={() => fileInputRef.current?.click()}
							disabled={uploadingLogo}
							className="w-full rounded-lg bg-zinc-800 px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-zinc-700 transition-all"
						>
							{uploadingLogo ? "A enviar..." : "Enviar Logótipo (PNG/JPEG)"}
						</button>
					</div>

					<div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
						<h2 className="text-lg font-black mb-2">Autenticidade das Faturas</h2>
						<p className="text-sm text-zinc-500">
							Cada fatura é assinada digitalmente no momento da emissão, com uma chave que só existe no servidor — nem
							um admin com acesso ao painel consegue forjar uma fatura válida. O PDF mostra um código de verificação e
							um QR code no rodapé; qualquer pessoa pode confirmar a autenticidade em{" "}
							<span className="font-mono">rentacarverde.cv/faturas/verificar</span>, sem sessão iniciada.
						</p>
					</div>
				</div>
			</PageShell>
		</div>
	);
}
