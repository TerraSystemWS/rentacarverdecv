"use client";

import { useState } from "react";
import { Partner } from "@/lib/api/types";
import { Upload, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api/endpoints";

interface PartnerFormProps {
    initialData?: Partial<Partner>;
    onSubmit: (data: Partner, logo?: File) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function PartnerForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: PartnerFormProps) {
    const [formData, setFormData] = useState<Partner>({
        id: initialData?.id as number | undefined,
        name: initialData?.name || "",
        logoUrl: initialData?.logoUrl || "",
        websiteUrl: initialData?.websiteUrl || "",
    });

    const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialData?.logoUrl || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedLogo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, selectedLogo || undefined);
    };

    const getImageSrc = (url: string) => {
        if (!url) return "";
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        if (url.startsWith('/uploads')) {
            return `${API_BASE_URL}${url}`;
        }
        return url;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nome do Parceiro</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Ex: Rental Company X"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Website URL</label>
                    <input
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Logo</label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            {preview ? (
                                <img src={getImageSrc(preview)} alt="Logo preview" className="w-full h-full object-contain p-2" />
                            ) : (
                                <Upload className="text-gray-300 w-8 h-8" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                            className="btn-secondary text-xs h-10 px-4"
                        >
                            Alterar Logo
                        </button>
                        <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-200 disabled:opacity-50 transition-all">
                    {isSubmitting ? "A guardar..." : "Guardar Parceiro"}
                </button>
            </div>
        </form>
    );
}
