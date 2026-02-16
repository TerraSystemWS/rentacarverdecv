"use client";

import { useState } from "react";
import { Advertisement } from "@/lib/api/types";
import { Upload } from "lucide-react";
import { API_BASE_URL } from "@/lib/api/endpoints";

interface AdFormProps {
    initialData?: Partial<Advertisement>;
    onSubmit: (data: Advertisement, image?: File) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function AdForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: AdFormProps) {
    const [formData, setFormData] = useState<Advertisement>({
        id: initialData?.id,
        title: initialData?.title || "",
        imageUrl: initialData?.imageUrl || "",
        linkUrl: initialData?.linkUrl || "",
        placement: initialData?.placement || "BANNER",
        active: initialData?.active ?? true,
        priority: initialData?.priority || 0,
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : val,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, selectedImage || undefined);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Título / Nome do Anúncio</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ex: Promoção de Verão"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Link URL (opcional)</label>
                        <input
                            name="linkUrl"
                            value={formData.linkUrl}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="https://example.com/promo"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Posicionamento</label>
                            <select
                                name="placement"
                                value={formData.placement}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="BANNER">Banner Principal</option>
                                <option value="SIDEBAR">Barra Lateral</option>
                                <option value="POPUP">Janela Pop-up</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Prioridade</label>
                            <input
                                type="number"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="active" className="text-sm font-medium text-gray-700">Ativo / Visível</label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Imagem do Anúncio</label>
                    <div className="flex flex-col gap-4">
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            {preview ? (
                                <img src={getImageSrc(preview)} alt="Ad preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="text-gray-300 w-12 h-12" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => document.getElementById('ad-image-upload')?.click()}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {preview ? "Alterar Imagem" : "Selecionar Imagem"}
                        </button>
                        <input id="ad-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <p className="text-[10px] text-gray-400 mt-1">
                            Recomendado: 1920x600px para Banners, 300x250px para Lateral.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-200 disabled:opacity-50 transition-all">
                    {isSubmitting ? "A guardar..." : "Guardar Anúncio"}
                </button>
            </div>
        </form>
    );
}
