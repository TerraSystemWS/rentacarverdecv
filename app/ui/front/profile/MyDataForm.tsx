"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import { CustomerProfile } from "@/lib/api/types";
import { COUNTRIES, DEFAULT_COUNTRY_CODE, countryName } from "@/lib/countries";
import { CheckCircle2, AlertTriangle, Loader2, IdCard, Trash2 } from "lucide-react";

type FormState = {
	fullName: string;
	phone: string;
	address: string;
	zipCode: string;
	city: string;
	countryCode: string;
	country: string;
	nationality: string;
	birthDate: string;
	placeOfBirth: string;
	idNumber: string;
	idIssuedBy: string;
	idIssuedAt: string;
	idExpiresAt: string;
	licenseNumber: string;
	licenseIssuedBy: string;
	licenseIssuedAt: string;
	licenseExpiresAt: string;
};

const emptyForm: FormState = {
	fullName: "", phone: "", address: "", zipCode: "", city: "", countryCode: DEFAULT_COUNTRY_CODE, country: countryName(DEFAULT_COUNTRY_CODE), nationality: "",
	birthDate: "", placeOfBirth: "", idNumber: "", idIssuedBy: "", idIssuedAt: "", idExpiresAt: "",
	licenseNumber: "", licenseIssuedBy: "", licenseIssuedAt: "", licenseExpiresAt: "",
};

function toDateInput(value: string | null): string {
	return value ? value.substring(0, 10) : "";
}

// Dados mínimos exigidos pelo contrato de aluguer físico (ver
// contrato_de_Aluguer.jpeg) — sem isto preenchido o cliente não consegue
// reservar (bloqueado no backend, ver UserEntity.isProfileComplete()).
export default function MyDataForm() {
	const [form, setForm] = useState<FormState>(emptyForm);
	const [complete, setComplete] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);

	// Foto da carta de condução — upload próprio, separado do resto do
	// formulário (a própria seleção do ficheiro já envia, ver
	// handleLicensePhotoSelect). "preview" é sempre um blob: URL local porque
	// o endpoint que serve a foto exige o header Authorization, que uma tag
	// <img src> normal não consegue enviar.
	const [hasLicensePhoto, setHasLicensePhoto] = useState(false);
	const [licensePhotoPreview, setLicensePhotoPreview] = useState<string | null>(null);
	const [licensePhotoBusy, setLicensePhotoBusy] = useState(false);
	const [licensePhotoError, setLicensePhotoError] = useState<string | null>(null);

	useEffect(() => {
		authFetch(endpoints.auth.profile)
			.then((res) => (res.ok ? res.json() : null))
			.then((data: CustomerProfile | null) => {
				if (!data) return;
				// Perfis antigos só têm o país em texto livre — tenta reconhecê-lo.
				const legacyCode = COUNTRIES.find((c) => c.name.toLowerCase() === (data.country || "").trim().toLowerCase())?.code;
				const code = data.countryCode || legacyCode || DEFAULT_COUNTRY_CODE;
				setForm({
					fullName: data.fullName || "",
					phone: data.phone || "",
					address: data.address || "",
					zipCode: data.zipCode || "",
					city: data.city || "",
					countryCode: code,
					country: countryName(code),
					nationality: data.nationality || "",
					birthDate: toDateInput(data.birthDate),
					placeOfBirth: data.placeOfBirth || "",
					idNumber: data.idNumber || "",
					idIssuedBy: data.idIssuedBy || "",
					idIssuedAt: toDateInput(data.idIssuedAt),
					idExpiresAt: toDateInput(data.idExpiresAt),
					licenseNumber: data.licenseNumber || "",
					licenseIssuedBy: data.licenseIssuedBy || "",
					licenseIssuedAt: toDateInput(data.licenseIssuedAt),
					licenseExpiresAt: toDateInput(data.licenseExpiresAt),
				});
				setComplete(data.profileComplete);
				setHasLicensePhoto(data.hasLicensePhoto);
				if (data.hasLicensePhoto) {
					loadLicensePhotoPreview();
				}
			})
			.finally(() => setLoading(false));
	}, []);

	async function loadLicensePhotoPreview() {
		try {
			const res = await authFetch(endpoints.auth.licensePhoto);
			if (!res.ok) return;
			const blob = await res.blob();
			setLicensePhotoPreview(URL.createObjectURL(blob));
		} catch {
			// falha silenciosa — o utilizador só fica sem a pré-visualização
		}
	}

	async function handleLicensePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		setLicensePhotoError(null);
		setLicensePhotoBusy(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			const res = await authFetch(endpoints.auth.licensePhoto, { method: "POST", body: formData });
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(body?.message || "Falha ao enviar a foto");
			}
			setLicensePhotoPreview(URL.createObjectURL(file));
			setHasLicensePhoto(true);
		} catch (err: any) {
			setLicensePhotoError(err.message || "Falha ao enviar a foto");
		} finally {
			setLicensePhotoBusy(false);
		}
	}

	async function handleRemoveLicensePhoto() {
		setLicensePhotoBusy(true);
		setLicensePhotoError(null);
		try {
			const res = await authFetch(endpoints.auth.licensePhoto, { method: "DELETE" });
			if (!res.ok) throw new Error();
			setLicensePhotoPreview(null);
			setHasLicensePhoto(false);
		} catch {
			setLicensePhotoError("Falha ao remover a foto");
		} finally {
			setLicensePhotoBusy(false);
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		setSaved(false);
	}

	// O país guarda-se como código numérico ISO 3166-1 (exigido pelo
	// pagamento vinti4) e também pelo nome, usado no contrato e na fatura.
	function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const code = e.target.value;
		setForm((prev) => ({ ...prev, countryCode: code, country: countryName(code) }));
		setSaved(false);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		try {
			// Datas vazias têm de ir como null (não ""), senão o backend falha a
			// desserializar "" como LocalDate.
			const dateFields: (keyof FormState)[] = ["birthDate", "idIssuedAt", "idExpiresAt", "licenseIssuedAt", "licenseExpiresAt"];
			const payload: Record<string, string | null> = { ...form };
			dateFields.forEach((f) => {
				if (!payload[f]) payload[f] = null;
			});
			const res = await authFetch(endpoints.auth.profile, {
				method: "PUT",
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error();
			const data: CustomerProfile = await res.json();
			setComplete(data.profileComplete);
			setSaved(true);
		} catch {
			// falha silenciosa aceitável aqui — o utilizador pode tentar de novo
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center py-16">
				<Loader2 className="w-8 h-8 animate-spin text-green-500" />
			</div>
		);
	}

	const field = (label: string, name: keyof FormState, type: string = "text", required = false) => (
		<div>
			<label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">{label}</label>
			<input
				type={type}
				name={name}
				value={form[name]}
				onChange={handleChange}
				required={required}
				className="w-full px-3 py-2.5 text-sm text-slate-900 outline-none transition-shadow"
			/>
		</div>
	);

	const sectionTitle = (title: string) => (
		<h3 className="text-sm font-black uppercase tracking-wide text-slate-800 mb-4 pb-2 border-b-2 border-green-400 inline-block">
			{title}
		</h3>
	);

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
			{complete ? (
				<div className="flex items-center gap-2 mb-6 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm font-semibold">
					<CheckCircle2 className="w-5 h-5 shrink-0" />
					Os seus dados estão completos — já pode reservar viaturas.
				</div>
			) : (
				<div className="flex items-center gap-2 mb-6 text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm font-semibold">
					<AlertTriangle className="w-5 h-5 shrink-0" />
					Complete os campos obrigatórios (*) para poder reservar uma viatura — são os dados exigidos no contrato de aluguer.
				</div>
			)}

			<form onSubmit={handleSubmit} className="styled-form space-y-6">
				<div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
					{sectionTitle("Contacto e Morada")}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{field("Nome completo *", "fullName", "text", true)}
						{field("Telefone *", "phone", "tel", true)}
						{field("Morada *", "address", "text", true)}
						{field("Cidade *", "city", "text", true)}
						<div>
							{field("Código postal", "zipCode")}
							<p className="text-[11px] text-slate-500 mt-1">Se não tiver, deixe em branco.</p>
						</div>
						<div>
							<label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">País *</label>
							<select
								name="countryCode"
								value={form.countryCode}
								onChange={handleCountryChange}
								required
								className="w-full px-3 py-2.5 text-sm text-slate-900 outline-none transition-shadow"
							>
								{COUNTRIES.map((c) => (
									<option key={c.code} value={c.code}>{c.name}</option>
								))}
							</select>
						</div>
						{field("Nacionalidade", "nationality")}
					</div>
				</div>

				<div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
					{sectionTitle("Nascimento")}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{field("Data de nascimento *", "birthDate", "date", true)}
						{field("Natural de", "placeOfBirth")}
					</div>
				</div>

				<div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
					{sectionTitle("BI / Passaporte")}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{field("Nº do documento *", "idNumber", "text", true)}
						{field("Emitido por", "idIssuedBy")}
						{field("Data de emissão", "idIssuedAt", "date")}
						{field("Válido até *", "idExpiresAt", "date", true)}
					</div>
				</div>

				<div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
					{sectionTitle("Carta de Condução")}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{field("Nº da carta *", "licenseNumber", "text", true)}
						{field("Emitida por", "licenseIssuedBy")}
						{field("Data de emissão", "licenseIssuedAt", "date")}
						{field("Válida até *", "licenseExpiresAt", "date", true)}
					</div>

					<div className="mt-5 pt-5 border-t border-slate-200">
						<label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">Foto da carta</label>
						<div className="flex items-center gap-4">
							<div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 bg-white flex items-center justify-center shrink-0">
								{licensePhotoPreview ? (
									<img src={licensePhotoPreview} alt="Foto da carta de condução" className="w-full h-full object-cover" />
								) : (
									<IdCard className="w-8 h-8 text-slate-300" />
								)}
							</div>
							<div className="flex flex-col gap-2">
								<div className="license-photo-actions flex gap-2">
									<button
										type="button"
										disabled={licensePhotoBusy}
										onClick={() => document.getElementById("license-photo-upload")?.click()}
										className="h-9 px-4 transition-colors font-semibold disabled:opacity-50"
									>
										{licensePhotoBusy ? "A enviar..." : hasLicensePhoto ? "Substituir foto" : "Enviar foto"}
									</button>
									{hasLicensePhoto && (
										<button
											type="button"
											disabled={licensePhotoBusy}
											onClick={handleRemoveLicensePhoto}
											className="text-red-600 flex items-center gap-1.5 h-9 px-3 transition-colors font-semibold disabled:opacity-50"
										>
											<Trash2 className="w-3.5 h-3.5" />
											Remover
										</button>
									)}
								</div>
								<p className="text-[11px] text-slate-500">JPEG ou PNG, até 5MB.</p>
								{licensePhotoError && <p className="text-[11px] text-red-600 font-semibold">{licensePhotoError}</p>}
							</div>
							<input id="license-photo-upload" type="file" accept="image/jpeg,image/png" onChange={handleLicensePhotoSelect} className="hidden" />
						</div>
					</div>
				</div>

				<div className="flex items-center gap-4 pt-2">
					<button type="submit" disabled={saving} className="btn-racv px-8">
						{saving ? "A guardar..." : "Guardar Dados"}
					</button>
					{saved && <span className="text-emerald-700 text-sm font-semibold">Guardado com sucesso!</span>}
				</div>
			</form>
		</div>
	);
}
