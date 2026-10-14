"use client";

import { useMemo, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY_CODE, countryName } from "@/lib/countries";

// Novo cliente criado pela equipa (balcão, telefone…): os mesmos dados que o
// cliente preenche em "Os Meus Dados" no site, porque são os do contrato de
// aluguer. A API cria a conta e envia um email para o cliente confirmar e
// escolher a palavra-passe; só depois se pode reservar em nome dele.

type FormState = {
    email: string;
    locale: string;
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

const EMPTY: FormState = {
    email: "", locale: "pt", fullName: "", phone: "", address: "", zipCode: "", city: "",
    countryCode: DEFAULT_COUNTRY_CODE, country: countryName(DEFAULT_COUNTRY_CODE), nationality: "",
    birthDate: "", placeOfBirth: "", idNumber: "", idIssuedBy: "", idIssuedAt: "", idExpiresAt: "",
    licenseNumber: "", licenseIssuedBy: "", licenseIssuedAt: "", licenseExpiresAt: "",
};

const DATE_FIELDS: (keyof FormState)[] = ["birthDate", "idIssuedAt", "idExpiresAt", "licenseIssuedAt", "licenseExpiresAt"];

interface ClientFormProps {
    onSubmit: (data: Record<string, string | null>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export default function ClientForm({ onSubmit, onCancel, isSubmitting }: ClientFormProps) {
    const [form, setForm] = useState<FormState>(EMPTY);
    const [error, setError] = useState<string | null>(null);
    const countries = useMemo(() => [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name, "pt")), []);

    const set = (name: keyof FormState, value: string) => setForm((prev) => ({ ...prev, [name]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        // Datas vazias vão como null (a API não aceita "" como data).
        const payload: Record<string, string | null> = { ...form };
        DATE_FIELDS.forEach((f) => { if (!payload[f]) payload[f] = null; });
        try {
            await onSubmit(payload);
        } catch (err: any) {
            setError(err?.message || "Não foi possível criar o cliente.");
        }
    };

    const inputClass = "w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all";
    const field = (label: string, name: keyof FormState, type = "text", required = false) => (
        <div className="space-y-1.5">
            <label htmlFor={`client-${name}`} className="text-xs font-bold uppercase tracking-tight text-gray-400">
                {label}{required && <span className="text-red-500"> *</span>}
            </label>
            <input
                id={`client-${name}`}
                type={type}
                required={required}
                className={inputClass}
                value={form[name]}
                onChange={(e) => set(name, e.target.value)}
            />
        </div>
    );
    const section = (title: string) => (
        <h3 className="col-span-full text-sm font-extrabold text-gray-700 border-b border-gray-100 pb-1 mt-2">{title}</h3>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div role="alert" className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg font-medium">{error}</div>
            )}

            <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3 m-0">
                O cliente recebe um email para confirmar a conta e escolher a palavra-passe. A reserva em nome dele fica possível depois de confirmar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section("Conta")}
                {field("Email", "email", "email", true)}
                <div className="space-y-1.5">
                    <label htmlFor="client-locale" className="text-xs font-bold uppercase tracking-tight text-gray-400">Língua dos emails</label>
                    <select id="client-locale" className={inputClass} value={form.locale} onChange={(e) => set("locale", e.target.value)}>
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                    </select>
                </div>

                {section("Contacto e morada")}
                {field("Nome completo", "fullName", "text", true)}
                {field("Telefone", "phone", "tel", true)}
                {field("Morada", "address", "text", true)}
                {field("Cidade", "city", "text", true)}
                {field("Código postal", "zipCode")}
                <div className="space-y-1.5">
                    <label htmlFor="client-countryCode" className="text-xs font-bold uppercase tracking-tight text-gray-400">
                        País<span className="text-red-500"> *</span>
                    </label>
                    <select
                        id="client-countryCode"
                        required
                        className={inputClass}
                        value={form.countryCode}
                        onChange={(e) => setForm((prev) => ({ ...prev, countryCode: e.target.value, country: countryName(e.target.value) }))}
                    >
                        {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                </div>
                {field("Nacionalidade", "nationality")}

                {section("Nascimento")}
                {field("Data de nascimento", "birthDate", "date", true)}
                {field("Local de nascimento", "placeOfBirth")}

                {section("Documento de identificação")}
                {field("Número", "idNumber", "text", true)}
                {field("Emitido por", "idIssuedBy")}
                {field("Data de emissão", "idIssuedAt", "date")}
                {field("Validade", "idExpiresAt", "date", true)}

                {section("Carta de condução")}
                {field("Número", "licenseNumber", "text", true)}
                {field("Emitida por", "licenseIssuedBy")}
                {field("Data de emissão", "licenseIssuedAt", "date")}
                {field("Validade", "licenseExpiresAt", "date", true)}
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="btn-outline">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? "A criar…" : "Criar cliente e enviar email"}
                </button>
            </div>
        </form>
    );
}
