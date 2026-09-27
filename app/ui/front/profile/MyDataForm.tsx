"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import { CustomerProfile } from "@/lib/api/types";
import { COUNTRIES, DEFAULT_COUNTRY_CODE, countryName } from "@/lib/countries";
import { CheckCircle2, AlertTriangle, Loader2, IdCard, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
	const [saveError, setSaveError] = useState(false);
	const t = useTranslations("myData");
	const locale = useLocale();

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
				throw new Error(body?.message || t("photo.uploadError"));
			}
			setLicensePhotoPreview(URL.createObjectURL(file));
			setHasLicensePhoto(true);
		} catch (err: any) {
			setLicensePhotoError(err.message || t("photo.uploadError"));
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
			setLicensePhotoError(t("photo.removeError"));
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
		setSaveError(false);
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
			setSaveError(true);
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

	// Nomes dos países na língua do visitante (o valor gravado continua o
	// código ISO + nome em PT, usado no contrato e na fatura).
	const regionNames = (() => {
		try { return new Intl.DisplayNames([locale], { type: "region" }); } catch { return null; }
	})();
	const countries = COUNTRIES
		.map((c) => ({ ...c, label: (locale !== "pt" && regionNames?.of(c.alpha2)) || c.name }))
		.sort((a, b) => a.label.localeCompare(b.label, locale));

	const field = (label: string, name: keyof FormState, type: string = "text", required = false) => (
		<div>
			<label htmlFor={`mydata-${name}`} className="block text-sm font-semibold text-slate-600 mb-1.5">{label}</label>
			<input
				id={`mydata-${name}`}
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
		<h3 className="v2-card__title">
			{title}
		</h3>
	);

	return (
		<div className="v2-card">
			{complete ? (
				<div className="flex items-center gap-2 mb-6 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm font-semibold">
					<CheckCircle2 className="w-5 h-5 shrink-0" />
					{t("complete")}
				</div>
			) : (
				<div className="flex items-center gap-2 mb-6 text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm font-semibold">
					<AlertTriangle className="w-5 h-5 shrink-0" />
					{t("incomplete")}
				</div>
			)}

			<form onSubmit={handleSubmit} className="styled-form space-y-6">
				<div className="v2-card__section">
					{sectionTitle(t("sections.contact"))}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{field(t("fields.fullName"), "fullName", "text", true)}
						{field(t("fields.phone"), "phone", "tel", true)}
						{field(t("fields.address"), "address", "text", true)}
						{field(t("fields.city"), "city", "text", true)}
						<div>
							{field(t("fields.zipCode"), "zipCode")}
							<p className="text-[11px] text-slate-500 mt-1">{t("fields.zipHint")}</p>
						</div>
						<div>
							<label htmlFor="mydata-countryCode" className="block text-sm font-semibold text-slate-600 mb-1.5">{t("fields.country")}</label>
							<select
								id="mydata-countryCode"
								name="countryCode"
								value={form.countryCode}
								onChange={handleCountryChange}
								required
								className="w-full px-3 py-2.5 text-sm text-slate-900 outline-none transition-shadow"
							>
								{countries.map((c) => (
									<option key={c.code} value={c.code}>{c.label}</option>
								))}
							</select>
						</div>
						{field(t("fields.nationality"), "nationality")}
					</div>
				</div>

				<div className="v2-card__section">
					{sectionTitle(t("sections.birth"))}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{field(t("fields.birthDate"), "birthDate", "date", true)}
						{field(t("fields.placeOfBirth"), "placeOfBirth")}
					</div>
				</div>

				<div className="v2-card__section">
					{sectionTitle(t("sections.id"))}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{field(t("fields.idNumber"), "idNumber", "text", true)}
						{field(t("fields.idIssuedBy"), "idIssuedBy")}
						{field(t("fields.idIssuedAt"), "idIssuedAt", "date")}
						{field(t("fields.idExpiresAt"), "idExpiresAt", "date", true)}
					</div>
				</div>

				<div className="v2-card__section">
					{sectionTitle(t("sections.license"))}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{field(t("fields.licenseNumber"), "licenseNumber", "text", true)}
						{field(t("fields.licenseIssuedBy"), "licenseIssuedBy")}
						{field(t("fields.licenseIssuedAt"), "licenseIssuedAt", "date")}
						{field(t("fields.licenseExpiresAt"), "licenseExpiresAt", "date", true)}
					</div>

					<div className="mt-5 pt-5 border-t border-slate-200">
						<label className="block text-sm font-semibold text-slate-600 mb-2">{t("photo.label")}</label>
						<div className="flex items-center gap-4">
							<div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 bg-white flex items-center justify-center shrink-0">
								{licensePhotoPreview ? (
									<img src={licensePhotoPreview} alt={t("photo.alt")} className="w-full h-full object-cover" />
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
										{licensePhotoBusy ? t("photo.uploading") : hasLicensePhoto ? t("photo.replace") : t("photo.upload")}
									</button>
									{hasLicensePhoto && (
										<button
											type="button"
											disabled={licensePhotoBusy}
											onClick={handleRemoveLicensePhoto}
											className="text-red-600 flex items-center gap-1.5 h-9 px-3 transition-colors font-semibold disabled:opacity-50"
										>
											<Trash2 className="w-3.5 h-3.5" />
											{t("photo.remove")}
										</button>
									)}
								</div>
								<p className="text-[11px] text-slate-500">{t("photo.hint")}</p>
								{licensePhotoError && <p className="text-[11px] text-red-600 font-semibold">{licensePhotoError}</p>}
							</div>
							<input id="license-photo-upload" type="file" accept="image/jpeg,image/png" onChange={handleLicensePhotoSelect} className="hidden" />
						</div>
					</div>
				</div>

				<div className="flex items-center gap-4 pt-2">
					<button type="submit" disabled={saving} className="btn-racv px-8">
						{saving ? t("saving") : t("save")}
					</button>
					{saved && <span role="status" className="text-emerald-700 text-sm font-semibold">{t("saved")}</span>}
					{saveError && <span role="alert" className="text-red-600 text-sm font-semibold">{t("saveError")}</span>}
				</div>
			</form>
		</div>
	);
}
